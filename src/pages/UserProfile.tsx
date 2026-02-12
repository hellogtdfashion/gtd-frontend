import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; 
import { Package, MapPin, LogOut, Loader2, ChevronRight, Plus, Pencil, User } from "lucide-react";
import { toast } from "sonner";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { authService, orderService } from "../services/api"; 
import api from "../services/api";

const UserProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses'>('orders');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addressForm, setAddressForm] = useState({ label: 'Home', first_name: '', last_name: '', address: '', city: 'Hyderabad', state: 'Telangana', zip_code: '', phone: '', is_default: false });
  const [submittingAddress, setSubmittingAddress] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [profile, addr, orders] = await Promise.all([
            authService.getProfile(),
            authService.getSavedAddresses(),
            orderService.getUserOrders().catch(() => []) 
        ]);
        setUserProfile(profile);
        setAddresses(Array.isArray(addr) ? addr : addr.results || []);
        setAllOrders(Array.isArray(orders) ? orders : orders.results || []);
      } catch (e: any) {
        console.error("Data Load Error", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    toast.success("Logged out successfully");
    navigate("/login"); 
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingAddress(true);
    try {
      await authService.saveAddress(addressForm);
      toast.success("Address saved");
      setShowAddForm(false);
      const updated = await authService.getSavedAddresses();
      setAddresses(Array.isArray(updated) ? updated : updated.results || []);
    } catch(err: any) { 
      toast.error("Could not save address");
    } finally { 
      setSubmittingAddress(false); 
    }
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center bg-[#FFF8F8]"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;

  if (!localStorage.getItem("userToken")) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <div className="p-12 bg-[#FFF8F8] rounded-[2rem] border border-pink-100 max-w-md">
            <User size={48} className="mx-auto text-primary mb-6 opacity-30" />
            <h2 className="text-2xl font-bold text-black uppercase tracking-tight mb-3">My Account</h2>
            <p className="text-muted-foreground text-sm mb-8 leading-relaxed">Please login to see your orders and saved addresses.</p>
            <Button onClick={() => navigate("/login")} className="w-full bg-black text-white rounded-full h-12 font-bold uppercase text-[10px] tracking-widest">Login / Sign Up</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F8]/40 pt-32 md:pt-40 pb-20">
      <Header />
      <div className="container-luxury mx-auto px-4 md:px-8 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-10">
          
          <aside className="w-full lg:w-72 bg-white rounded-3xl shadow-sm p-8 h-fit border border-pink-100">
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-pink-50">
              <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                {userProfile?.first_name?.[0] || userProfile?.email?.[0]}
              </div>
              <div className="overflow-hidden">
                <p className="text-base font-bold truncate text-black capitalize">
                    {userProfile?.first_name || 'My Account'}
                </p>
                <p className="text-[11px] text-gray-500 truncate lowercase">{userProfile?.email}</p>
              </div>
            </div>
            
            <nav className="space-y-2">
              <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all ${activeTab === 'orders' ? 'bg-primary text-white shadow-md' : 'text-gray-600 hover:bg-pink-50'}`}>
                <div className="flex items-center gap-3"><Package size={16} /> My Orders</div>
                <ChevronRight size={14} className="opacity-40" />
              </button>

              <button onClick={() => setActiveTab('addresses')} className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all ${activeTab === 'addresses' ? 'bg-primary text-white shadow-md' : 'text-gray-600 hover:bg-pink-50'}`}>
                <div className="flex items-center gap-3"><MapPin size={16} /> Saved Addresses</div>
                <ChevronRight size={14} className="opacity-40" />
              </button>

              <div className="pt-6 mt-6 border-t border-pink-50">
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-bold uppercase text-red-500 hover:bg-red-50 transition-colors">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </nav>
          </aside>

          <main className="flex-1 bg-white rounded-[2rem] shadow-sm p-8 border border-pink-100 min-h-[500px]">
            {activeTab === 'orders' ? (
              <div className="space-y-6 animate-in fade-in">
                <h2 className="text-xl font-bold text-black uppercase tracking-tight border-b border-pink-50 pb-4">My Orders</h2>
                <div className="text-center py-24">
                  <Package size={48} className="text-pink-100 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm">Your orders appear here.</p>
                  <Link to="/"><Button className="mt-6 bg-black text-white px-8 rounded-full font-bold uppercase text-[10px] tracking-widest">Go to Shop</Button></Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex justify-between items-center border-b border-pink-50 pb-4">
                  <h2 className="text-xl font-bold text-black uppercase tracking-tight">Saved Addresses</h2>
                  {!showAddForm && (
                    <Button onClick={() => setShowAddForm(true)} className="bg-primary text-white font-bold rounded-full px-5 text-[10px] uppercase h-9 shadow-sm">
                      <Plus size={14} className="mr-1" /> Add New
                    </Button>
                  )}
                </div>

                {showAddForm ? (
                  <form onSubmit={handleSaveAddress} className="grid gap-4 md:grid-cols-2 bg-[#FFF8F8]/30 p-6 rounded-2xl border border-pink-100 animate-in slide-in-from-top-2">
                    <input placeholder="First Name" value={addressForm.first_name} onChange={e=>setAddressForm({...addressForm, first_name:e.target.value})} className="p-3 bg-white border border-pink-100 rounded-xl outline-none focus:ring-1 focus:ring-primary text-sm" required />
                    <input placeholder="Last Name" value={addressForm.last_name} onChange={e=>setAddressForm({...addressForm, last_name:e.target.value})} className="p-3 bg-white border border-pink-100 rounded-xl outline-none focus:ring-1 focus:ring-primary text-sm" />
                    <input placeholder="Phone" value={addressForm.phone} onChange={e=>setAddressForm({...addressForm, phone:e.target.value})} className="p-3 bg-white border border-pink-100 rounded-xl outline-none focus:ring-1 focus:ring-primary text-sm" required />
                    <input placeholder="Zip Code (Pincode)" value={addressForm.zip_code} onChange={e=>setAddressForm({...addressForm, zip_code:e.target.value})} className="p-3 bg-white border border-pink-100 rounded-xl outline-none focus:ring-1 focus:ring-primary text-sm" required />
                    <input placeholder="Full Address" value={addressForm.address} onChange={e=>setAddressForm({...addressForm, address:e.target.value})} className="md:col-span-2 p-3 bg-white border border-pink-100 rounded-xl outline-none focus:ring-1 focus:ring-primary text-sm" required />
                    <div className="flex gap-3 mt-2">
                      <Button disabled={submittingAddress} className="bg-black text-white px-8 rounded-full h-10 uppercase text-[10px] font-bold">Save</Button>
                      <Button type="button" onClick={() => setShowAddForm(false)} variant="ghost" className="h-10 uppercase text-[10px] font-bold">Cancel</Button>
                    </div>
                  </form>
                ) : (
                  <div className="grid gap-4">
                    {addresses.length === 0 ? (
                      <p className="text-gray-400 italic text-center py-10 text-sm">No saved addresses found.</p>
                    ) : (
                      addresses.map((addr) => (
                        <div key={addr.id} className={`p-6 rounded-2xl border flex justify-between items-center transition-all ${addr.is_default ? 'border-primary bg-pink-50/20' : 'border-pink-50'}`}>
                          <div>
                            <p className="font-bold text-black text-xs uppercase tracking-widest mb-1">{addr.label}</p>
                            <p className="text-sm text-gray-700 font-medium">{addr.first_name} {addr.last_name}</p>
                            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{addr.address}, {addr.city} - {addr.zip_code}</p>
                            <p className="text-[10px] text-gray-400 mt-1">Phone: {addr.phone}</p>
                          </div>
                          <button onClick={() => { setShowAddForm(true); setAddressForm(addr as any); }} className="p-2.5 hover:bg-white rounded-full border border-pink-50 text-gray-400 hover:text-primary"><Pencil size={14} /></button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserProfile;