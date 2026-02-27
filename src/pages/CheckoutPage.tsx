import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronDown, Loader2, MapPin, Ticket, Truck, ShieldCheck, CheckSquare, Square, CreditCard, Plus } from 'lucide-react';
import { toast } from 'sonner';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/context/CartContext';
import { orderService, authService, storeService } from '@/services/api';

const formatPrice = (price: number) => `₹${Number(price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const CheckoutPage = () => {
  const { cartItems, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  // --- STATE ---
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [saveAsDefault, setSaveAsDefault] = useState(false);
  
  const [config, setConfig] = useState({
    shipping_fee: 100,
    free_shipping_threshold: 2000,
  });

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  const [address, setAddress] = useState({
    firstName: '', lastName: '', street: '', city: '', pincode: '', phone: '', state: 'Telangana'
  });

  // --- INITIAL DATA LOAD ---
  useEffect(() => {
    const init = async () => {
      try {
        const [addrData, configData] = await Promise.all([
          authService.getSavedAddresses().catch(() => []),
          storeService.getSiteConfig().catch(() => null)
        ]);
        
        const list = Array.isArray(addrData) ? addrData : addrData.results || [];
        setSavedAddresses(list);
        if (configData) setConfig(configData);
        
        const defaultAddr = list.find((a: any) => a.is_default);
        if (defaultAddr) handleSelectAddress(defaultAddr);
      } catch (error) {
        console.error("Initialization error", error);
      } finally {
        setLoadingInitial(false);
      }
    };
    init();
  }, []);

  // --- CALCULATIONS ---
  const totals = useMemo(() => {
    const sub = Number(subtotal) || 0;
    const shipping = sub >= config.free_shipping_threshold || sub === 0 ? 0 : Number(config.shipping_fee);
    const discount = appliedCoupon ? Number(appliedCoupon.discount) : 0;
    const finalTotal = sub + shipping - discount;
    return { shipping, discount, finalTotal };
  }, [subtotal, config, appliedCoupon]);

  // --- HANDLERS ---
  const handleSelectAddress = (addr: any) => {
    setAddress({
      firstName: addr.first_name || '',
      lastName: addr.last_name || '',
      street: addr.address,
      city: addr.city,
      pincode: addr.zip_code,
      phone: addr.phone,
      state: addr.state || 'Telangana'
    });
    setSaveAsDefault(false); 
    toast.success(`Address "${addr.label}" selected`);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setIsValidatingCoupon(true);
    try {
      const res = await storeService.validateCoupon(couponCode, subtotal);
      setAppliedCoupon(res);
      toast.success(res.message || "Coupon applied!");
    } catch (err: any) {
      toast.error(err.error || "Invalid coupon code");
      setAppliedCoupon(null);
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handlePayment = async () => {
    if (!address.firstName || !address.phone || !address.street) {
      toast.error("Please complete your shipping details");
      return;
    }

    setIsProcessing(true);
    const scriptLoaded = await loadRazorpay();
    if (!scriptLoaded) {
      toast.error("Razorpay SDK failed to load.");
      setIsProcessing(false);
      return;
    }

    try {
      // ✅ FIX: Ensure field names match your Django CheckoutView exactly
      const orderData = {
        total_amount: totals.finalTotal,
        shipping_address: address.street,
        firstName: address.firstName,
        lastName: address.lastName,
        city: address.city,
        state: address.state,
        zip_code: address.pincode,
        phone: address.phone,
        coupon_code: appliedCoupon?.code || null,
        save_address: saveAsDefault, 
        items: cartItems.map(item => ({
          id: item.productId || item.id,
          title: item.name || item.title,
          price: item.price,
          quantity: item.quantity,
          size: item.selectedSize,
          color: item.selectedColor?.name || ''
        }))
      };

      const backendOrder = await orderService.createCheckoutSession(orderData);

      const options = {
        // Fallback to env variable if backend doesn't send it
        key: backendOrder.key || import.meta.env.VITE_RAZORPAY_KEY_ID, 
        amount: backendOrder.amount,
        currency: backendOrder.currency || "INR",
        name: "GTD Fashion",
        description: "Secure Checkout",
        order_id: backendOrder.razorpay_order_id,
        handler: async (response: any) => {
          try {
            await orderService.verifyPayment(response);
            toast.success("Order Placed Successfully!");
            clearCart();
            navigate('/profile'); // Redirect to profile to see the new order
          } catch (err) {
            toast.error("Payment verification failed.");
          }
        },
        prefill: {
          name: `${address.firstName} ${address.lastName}`,
          contact: address.phone
        },
        theme: { color: "#000000" }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error.error || "Payment initialization failed");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loadingInitial) return <div className="h-screen flex items-center justify-center bg-[#FFF8F8]"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-32 pb-20 container mx-auto px-4 max-w-6xl">
        <h1 className="text-2xl font-black uppercase mb-10 tracking-tight">Secure Checkout</h1>
        
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 space-y-10">
            
            {/* SAVED ADDRESS SELECTOR */}
            {savedAddresses.length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">Select Registered Address</p>
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {savedAddresses.map(addr => (
                    <button 
                      key={addr.id} 
                      onClick={() => handleSelectAddress(addr)}
                      className={`flex-shrink-0 w-64 text-left p-4 rounded-2xl border-2 transition-all ${address.phone === addr.phone ? 'border-black bg-zinc-50' : 'border-zinc-100 bg-white hover:border-zinc-300'}`}
                    >
                      <p className="font-bold text-sm uppercase">{addr.label}</p>
                      <p className="text-xs text-gray-500 truncate mt-1">{addr.address}</p>
                      <p className="text-[10px] text-zinc-400 mt-2 uppercase">{addr.city}, {addr.zip_code}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ADDRESS FORM */}
            <section className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-3">
                <MapPin size={16} /> 1. Shipping Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="First Name" value={address.firstName} onChange={e => setAddress({...address, firstName: e.target.value})} />
                <Input placeholder="Last Name" value={address.lastName} onChange={e => setAddress({...address, lastName: e.target.value})} />
                <Input className="col-span-2" placeholder="House No. / Street / Landmark" value={address.street} onChange={e => setAddress({...address, street: e.target.value})} />
                <Input placeholder="City" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} />
                <Input placeholder="Pincode" value={address.pincode} onChange={e => setAddress({...address, pincode: e.target.value})} />
                <Input className="col-span-2" placeholder="Contact Number" value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} />
              </div>
              
              <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setSaveAsDefault(!saveAsDefault)}>
                {saveAsDefault ? <CheckSquare size={18} /> : <Square size={18} className="text-zinc-300" />}
                <span className="text-[10px] font-bold uppercase text-zinc-500 group-hover:text-black transition-colors">Set as default address</span>
              </div>
            </section>
          </div>

          {/* TOTALS & PAY NOW */}
          <div className="lg:col-span-5">
            <div className="bg-zinc-50 p-8 rounded-3xl border border-zinc-100 sticky top-32 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-8 text-zinc-400">Order Finalization</h3>
              
              {/* Coupon Input inside the Sidebar */}
              <div className="mb-8 p-4 bg-white border border-zinc-200 rounded-2xl">
                <p className="text-[9px] font-black uppercase text-zinc-400 mb-3 tracking-widest">Apply Promo Code</p>
                <div className="flex gap-2">
                  <Input 
                    placeholder="ENTER CODE" 
                    className="h-10 text-xs font-bold uppercase border-none bg-zinc-50"
                    value={couponCode} 
                    onChange={e => setCouponCode(e.target.value.toUpperCase())} 
                  />
                  <Button onClick={handleApplyCoupon} disabled={isValidatingCoupon} className="bg-black text-white h-10 px-4 text-[9px] font-black uppercase">
                    {isValidatingCoupon ? "..." : "Apply"}
                  </Button>
                </div>
                {appliedCoupon && <p className="mt-2 text-[9px] font-bold text-green-600 flex items-center gap-1 uppercase tracking-tighter"><ShieldCheck size={12}/> {appliedCoupon.message}</p>}
              </div>

              <div className="space-y-4 mb-10 text-xs font-bold uppercase tracking-wider">
                <div className="flex justify-between text-zinc-500">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span className="flex items-center gap-2">Shipping <Truck size={12} /></span>
                  <span>{totals.shipping === 0 ? <span className="text-green-600 font-black tracking-tighter">FREE</span> : formatPrice(totals.shipping)}</span>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-green-600 font-black">
                    <span>Loyalty Discount</span>
                    <span>-{formatPrice(totals.discount)}</span>
                  </div>
                )}
                <div className="border-t border-zinc-200 pt-6 flex justify-between text-lg font-black tracking-tighter">
                  <span>Total Payable</span>
                  <span className="text-black">{formatPrice(totals.finalTotal)}</span>
                </div>
              </div>

              <Button 
                onClick={handlePayment} 
                disabled={isProcessing || cartItems.length === 0} 
                className="w-full bg-black text-white h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl active:scale-95 transition-all"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-3"><Loader2 className="animate-spin" size={16} /> Connecting...</span>
                ) : (
                  <span className="flex items-center gap-3"><CreditCard size={18} /> Pay via Razorpay</span>
                )}
              </Button>
              
              <p className="text-[8px] text-zinc-400 text-center mt-6 uppercase font-bold tracking-[0.1em]">
                Secure Payment processed by Razorpay. All transactions are SSL encrypted.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;