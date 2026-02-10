import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; 
import { Package, MapPin, LogOut, Loader2, ChevronRight, Plus, Pencil, User } from "lucide-react";
import { toast } from "sonner";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { authService, orderService } from "../services/api"; 

const UserProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses'>('orders');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addressForm, setAddressForm] = useState({ label: 'Home', first_name: '', last_name: '', address: '', city: 'Hyderabad', state: 'Telangana', zip_code: '', phone: '', is_default: false });

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // Try fetching profile and addresses
        const [profile, addr, orders] = await Promise.all([
            authService.getProfile(),
            authService.getSavedAddresses(),
            orderService.getUserOrders().catch(() => []) // Fallback for orders if app not ready
        ]);
        setUserProfile(profile);
        setAddresses(Array.isArray(addr) ? addr : addr.results || []);
        setAllOrders(Array.isArray(orders) ? orders : orders.results || []);
      } catch (e: any) {
        console.error("Data Load Error", e);
        // If the token is actually invalid, it will be handled by api.ts interceptor
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

  if (loading) return <div className="min-h-screen flex justify-center items-center bg-[#FFF8F8]"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;

  if (!localStorage.getItem("userToken")) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <div className="p-12 bg-[#FFF8F8] rounded-[2.5rem] border border-pink-100 max-w-md">
            <User size={48} className="mx-auto text-primary mb-6 opacity-30" />
            <h2 className="text-2xl font-bold text-black uppercase tracking-tight mb-3 font-serif italic">GTD Boutique</h2>
            <p className="text-muted-foreground text-sm mb-8 leading-relaxed">Please sign in to access your profile.</p>
            <Button onClick={() => navigate("/login")} className="w-full bg-black text-white rounded-full h-12 font-bold uppercase text-[10px] tracking-widest">Sign In</Button>
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
          {/* Sidebar */}
          <aside className="w-full lg:w-72 bg-white rounded-3xl shadow-sm p-8 h-fit border border-pink-100">
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-pink-50">
              <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-md">
                {userProfile?.first_name?.[0] || userProfile?.email?.[0]}
              </div>
              <div className="overflow-hidden">
                <p className="text-base font-bold truncate text-black capitalize">
                    {userProfile?.first_name || userProfile?.email?.split('@')[0]}
                </p>
                <p className="text-[9px] text-primary font-bold uppercase tracking-tighter bg-pink-50 px-2 py-0.5 rounded mt-1 w-fit">GTD Elite</p>
              </div>
            </div>
            <nav className="space-y-2">
              <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-[0.1em] transition-all ${activeTab === 'orders' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-pink-50'}`}>
                <div className="flex items-center gap-3"><Package size={16} /> My Orders</div>
                <ChevronRight size={14} className="opacity-40" />
              </button>
              <button onClick={() => setActiveTab('addresses')} className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-[0.1em] transition-all ${activeTab === 'addresses' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-pink-50'}`}>
                <div className="flex items-center gap-3"><MapPin size={16} /> Addresses</div>
                <ChevronRight size={14} className="opacity-40" />
              </button>
              <div className="pt-6 mt-6 border-t border-pink-50">
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-bold uppercase text-red-500 hover:bg-red-50 transition-colors"><LogOut size={16} /> Logout</button>
              </div>
            </nav>
          </aside>
          {/* Main */}
          <main className="flex-1 bg-white rounded-[2rem] shadow-sm p-8 border border-pink-100 min-h-[500px]">
             {activeTab === 'orders' ? (
                <div className="text-center py-24 animate-in fade-in">
                   <Package size={48} className="text-pink-100 mx-auto mb-6" />
                   <p className="text-muted-foreground text-sm italic">No boutique orders found yet.</p>
                </div>
             ) : (
                <div className="space-y-6">
                   <h2 className="text-2xl font-serif italic text-black">Saved Destinations</h2>
                   <div className="grid gap-4">
                     {addresses.map((addr) => (
                       <div key={addr.id} className="p-6 rounded-2xl border border-pink-50 bg-[#FFF8F8]/20 flex justify-between items-center">
                         <div>
                           <p className="font-bold text-black text-sm uppercase">{addr.label}</p>
                           <p className="text-sm text-gray-700">{addr.first_name} {addr.last_name}</p>
                           <p className="text-xs text-muted-foreground">{addr.address}, {addr.city}</p>
                         </div>
                       </div>
                     ))}
                   </div>
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