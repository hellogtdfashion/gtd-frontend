import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
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

const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", 
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli", "Daman and Diu", "Delhi", 
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", 
  "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", 
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
  "Uttarakhand", "West Bengal"
];

const CheckoutPage = () => {
  // 1. We keep globalCartItems but we will conditionally ignore them
  const { cartItems: globalCartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // --- BUY NOW LOGIC (DATA ISOLATION) ---
  const { checkoutItems, isDirectBuy } = useMemo(() => {
    const direct = location.state?.directItem;
    if (direct && Array.isArray(direct)) {
      return { checkoutItems: direct, isDirectBuy: true };
    }
    return { checkoutItems: globalCartItems, isDirectBuy: false };
  }, [location.state, globalCartItems]);

  // 2. We calculate subtotal ONLY for the items being checked out
  const checkoutSubtotal = useMemo(() => {
    return checkoutItems.reduce((sum, item) => sum + (Number(item.price) * (item.quantity || 1)), 0);
  }, [checkoutItems]);
  // --------------------------------------

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
    firstName: '', 
    lastName: '', 
    country: 'India',
    state: '',
    city: '', 
    street: '', 
    landmark: '',
    pincode: '', 
    phone: ''
  });

  const [hasAttemptedPay, setHasAttemptedPay] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
  const fetchLocation = async () => {
    if (address.pincode.length !== 6) return;

    // Only allow valid Indian 6-digit format
    if (!/^[1-9][0-9]{5}$/.test(address.pincode)) {
      return;
    }

    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${address.pincode}`);
      const data = await res.json();

      if (data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
        const postOffice = data[0].PostOffice[0];

        const foundState = INDIAN_STATES.find(
          s => s.toLowerCase() === postOffice.State.toLowerCase()
        );

        setAddress(prev => ({
          ...prev,
          city: postOffice.District || '',
          state: foundState || postOffice.State || ''
        }));

        setErrors(prev => ({
          ...prev,
          city: false,
          state: false,
          pincode: false
        }));
      }
    } catch (err) {
      console.error("Pincode lookup error:", err);
    }
  };

  fetchLocation();
}, [address.pincode]);

useEffect(() => {
    const init = async () => {
      try {
        // Check if user is authenticated first
        const token = localStorage.getItem('userToken'); // or your specific token key
        if (!token) {
          toast.error("Login Required", {
            description: "Please login to place your order."
          });
          // Pass the current path in state so Login page can redirect back here
          navigate('/login', { state: { from: location.pathname } });
          return;
        }

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
  }, [navigate, location.pathname]);

  const totals = useMemo(() => {
    const sub = Number(checkoutSubtotal) || 0;
    if (sub === 0) return { shipping: 0, discount: 0, finalTotal: 0 };
    
    const shipping = sub >= config.free_shipping_threshold ? 0 : Number(config.shipping_fee);
    const discount = appliedCoupon ? Number(appliedCoupon.discount) : 0;
    const finalTotal = sub + shipping - discount;
    return { shipping, discount, finalTotal };
  }, [checkoutSubtotal, config, appliedCoupon]);

  const isIndianPincode = useMemo(() => {
    const indiaRegex = /^[1-9][0-9]{5}$/;
    return indiaRegex.test(address.pincode);
  }, [address.pincode]);

  const showPincodeWarning = hasAttemptedPay && (!isIndianPincode || !address.state);

  const validateForm = () => {
    const newErrors: Record<string, boolean> = {};
    const mandatoryFields = ['firstName', 'lastName', 'country', 'state', 'city', 'street', 'pincode', 'phone'];

    mandatoryFields.forEach(field => {
      if (!address[field as keyof typeof address]?.trim()) {
        newErrors[field] = true;
      }
    });

    const phoneRegex = /^[0-9]{10}$/;
    if (address.phone && !phoneRegex.test(address.phone)) {
      newErrors.phone = true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSelectAddress = (addr: any) => {
    setAddress({
      firstName: addr.first_name || '',
      lastName: addr.last_name || '',
      country: addr.country || 'India',
      state: addr.state || '',
      city: addr.city || '',
      street: addr.address || '',
      landmark: addr.landmark || '',
      pincode: addr.zip_code || '',
      phone: addr.phone || ''
    });
    setSaveAsDefault(false); 
    setHasAttemptedPay(false);
    setErrors({});
    toast.success(`Address "${addr.label}" selected`);
  };

  const resetAddressForm = () => {
    setAddress({
      firstName: '', lastName: '', country: 'India', state: '',
      city: '', street: '', landmark: '', pincode: '', phone: ''
    });
    setSaveAsDefault(false);
    setHasAttemptedPay(false);
    setErrors({});
    toast.info("Enter new delivery details");
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setIsValidatingCoupon(true);
    try {
      const res = await storeService.validateCoupon(couponCode, checkoutSubtotal);
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
    setHasAttemptedPay(true);

    if (!/^[1-9][0-9]{5}$/.test(address.pincode)) {
  toast.error("Invalid Shipping Location", {
    description: "Shipping is only available in India. Please use a valid Indian Pincode."
  });

  setErrors(prev => ({ ...prev, pincode: true }));
  return;
}

    // 1. Check for basic mandatory fields first
    const isValid = validateForm();
    if (!isValid) {
      // 2. Check specifically if phone was the reason for failure
      const phoneRegex = /^[0-9]{10}$/;
      if (address.phone && !phoneRegex.test(address.phone)) {
        toast.error("Invalid Phone Number", {
          description: "Please enter a valid 10-digit phone number."
        });
      } else {
        toast.error("Required Fields Missing", {
          description: "Please fill in all mandatory fields highlighted in red."
        });
      }
      
      window.scrollTo({ top: 200, behavior: 'smooth' });
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
      const orderData = {
        total_amount: totals.finalTotal,
        shipping_address: address.street,
        landmark: address.landmark,
        firstName: address.firstName,
        lastName: address.lastName,
        city: address.city,
        state: address.state,
        country: address.country,
        zip_code: address.pincode,
        phone: address.phone,
        coupon_code: appliedCoupon?.code || null,
        save_address: saveAsDefault, 
        items: checkoutItems.map((item: any) => ({
          productId: item.productId || item.id,
          product_type: item.product_type,
          title: item.name || item.title,
          price: item.price,
          quantity: item.quantity,
          size: item.selectedSize || item.size,
          color: item.selectedColor?.name || item.color || ''
        }))
      };

      const backendOrder = await orderService.createCheckoutSession(orderData);

      const options = {
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
            if (!isDirectBuy) clearCart(); 
            navigate('/profile');
          } catch (err) {
            toast.error("Payment verification failed.");
          }
        },
        prefill: {
          name: `${address.firstName} ${address.lastName}`,
          contact: address.phone
        },
        theme: { color: "#ec4899" }
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

  const errorStyle = (field: string) => 
    errors[field] ? "border-red-500 bg-red-50 focus-visible:ring-red-500" : "";

  if (loadingInitial) return <div className="h-screen flex items-center justify-center bg-[#FFF8F8]"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-40 pb-20 container mx-auto px-4 max-w-6xl">
        <h1 className="text-2xl font-black uppercase mb-10 tracking-tight">Checkout</h1>
        
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 space-y-10">
            
            {savedAddresses.length > 0 && (
              <div>
                <div className="flex justify-between items-end mb-4">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Select Delivery Address</p>
                  <button onClick={resetAddressForm} className="flex items-center gap-1 text-[10px] font-black uppercase text-primary border-b border-primary">
                    <Plus size={12} /> New Address
                  </button>
                </div>
                
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {savedAddresses.map(addr => (
                    <button 
                      key={addr.id} 
                      onClick={() => handleSelectAddress(addr)}
                      className={`flex-shrink-0 w-64 text-left p-4 rounded-2xl border-2 transition-all ${address.phone === addr.phone ? 'border-black bg-zinc-50' : 'border-zinc-100 bg-white hover:border-zinc-300'}`}
                    >
                      <p className="font-bold text-sm uppercase">{addr.label}</p>
                      <p className="text-xs text-gray-500 truncate mt-1">{addr.address}</p>
                      <p className="text-[10px] text-zinc-400 mt-2 uppercase">{addr.city}, {addr.state}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <section className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-3">
                <MapPin size={16} className="text-primary" /> Delivery Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  placeholder="First Name *" 
                  className={errorStyle('firstName')}
                  value={address.firstName} 
                  onChange={e => {
                    setAddress({...address, firstName: e.target.value});
                    if (errors.firstName) setErrors({...errors, firstName: false});
                  }} 
                />
                <Input 
                  placeholder="Last Name *" 
                  className={errorStyle('lastName')}
                  value={address.lastName} 
                  onChange={e => {
                    setAddress({...address, lastName: e.target.value});
                    if (errors.lastName) setErrors({...errors, lastName: false});
                  }} 
                />
                <Input 
                  className={`col-span-2 ${errorStyle('phone')}`} 
                  placeholder="Contact Number *" 
                  value={address.phone} 
                  onChange={e => {
                    setAddress({...address, phone: e.target.value});
                    if (errors.phone) setErrors({...errors, phone: false});
                  }} 
                  maxLength={10} 
                />
                <Input 
                  className={`col-span-2 ${errorStyle('country')}`} 
                  placeholder="Country / Region *" 
                  value={address.country} 
                  readOnly
                />
                
                <Input 
                  placeholder="Pincode *" 
                  className={errorStyle('pincode')}
                  value={address.pincode} 
                  onChange={e => {
                    const val = e.target.value.replace(/\D/g, '');
                    setAddress({...address, pincode: val});
                    if (errors.pincode) setErrors({...errors, pincode: false});
                    if (hasAttemptedPay) setHasAttemptedPay(false); 
                  }} 
                  maxLength={6} 
                />

                <Input 
  placeholder="State *" 
  className={errorStyle('state')}
  value={address.state}
  onChange={e => {
    setAddress({ ...address, state: e.target.value });
    if (errors.state) setErrors({ ...errors, state: false });
  }}
/>
                <Input 
  placeholder="City *" 
  className={`col-span-2 ${errorStyle('city')}`}
  value={address.city}
  onChange={e => {
    setAddress({ ...address, city: e.target.value });
    if (errors.city) setErrors({ ...errors, city: false });
  }}
/>
                
                <Input 
                  className={`col-span-2 ${errorStyle('street')}`} 
                  placeholder="Street Address / House No. *" 
                  value={address.street} 
                  onChange={e => {
                    setAddress({...address, street: e.target.value});
                    if (errors.street) setErrors({...errors, street: false});
                  }} 
                />
                <Input 
                  className="col-span-2" 
                  placeholder="Landmark (Optional)" 
                  value={address.landmark} 
                  onChange={e => setAddress({...address, landmark: e.target.value})} 
                />
              </div>
              
              <div className="flex items-center gap-3 cursor-pointer group" onClick={() => {
                const phoneRegex = /^[0-9]{10}$/;
                if (saveAsDefault === false && !phoneRegex.test(address.phone)) {
                  toast.error("Invalid Phone Number", {
                    description: "Please enter exactly 10 digits before saving."
                  });
                  return;
                }
                setSaveAsDefault(!saveAsDefault);
              }}>
                {saveAsDefault ? <CheckSquare size={18} className="text-primary" /> : <Square size={18} className="text-zinc-300" />}
                <span className="text-[10px] font-bold uppercase text-zinc-500 group-hover:text-black transition-colors">Save this as default address</span>
              </div>
            </section>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-zinc-50 p-8 rounded-3xl border border-zinc-100 sticky top-32 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-8 text-zinc-400">Order Summary</h3>
              
              {/* --- ADDED PRODUCT PREVIEW FOR UX --- */}
              <div className="mb-8 space-y-4">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Review Items</p>
                {checkoutItems.map((item: any, idx: number) => (
                    <div key={idx} className="flex gap-4 p-3 bg-white rounded-2xl border border-zinc-100 shadow-sm">
                        <div className="w-16 h-20 bg-zinc-50 rounded-lg overflow-hidden shrink-0 border border-zinc-100">
                            <img src={item.image || item.url} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="flex-1 py-1">
                            <p className="text-[11px] font-black uppercase leading-tight line-clamp-1">{item.name || item.title}</p>
                            <p className="text-[10px] text-zinc-400 font-bold mt-1 uppercase">
                                {item.selectedSize || item.size} | Qty: {item.quantity}
                            </p>
                            <p className="text-xs font-black mt-2">₹{item.price}</p>
                        </div>
                    </div>
                ))}
              </div>

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
                  {/* CRITICAL CHANGE: Use checkoutSubtotal instead of subtotal */}
                  <span>{formatPrice(checkoutSubtotal)}</span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span className="flex items-center gap-2 text-primary">Delivery <Truck size={12} /></span>
                  <span>{totals.shipping === 0 ? <span className="text-green-600 font-black uppercase">Free</span> : formatPrice(totals.shipping)}</span>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-green-600 font-black">
                    <span>Discount</span>
                    <span>-{formatPrice(totals.discount)}</span>
                  </div>
                )}
                <div className="border-t border-zinc-200 pt-6 flex justify-between text-lg font-black tracking-tighter">
                  <span>Grand Total</span>
                  <span className="text-black">{formatPrice(totals.finalTotal)}</span>
                </div>
              </div>

              {showPincodeWarning && (
                <div className="mb-6 p-5 bg-red-600 border-2 border-red-800 rounded-2xl shadow-lg animate-in fade-in zoom-in duration-300">
                  <div className="flex items-start gap-3">
                    <div className="bg-white p-1 rounded-full shrink-0">
                      <ShieldCheck size={20} className="text-red-600" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-[12px] leading-tight text-white font-black uppercase tracking-tight">
                        Shipping Restricted to India
                      </p>
                      <p className="text-[10px] leading-relaxed text-red-50 font-medium">
                        The pincode entered is outside our standard delivery zone. Free shipping is only available within India.
                      </p>
                      <a 
                        href="https://www.instagram.com/glorious_threads_by_divya_new?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block mt-2 bg-white text-red-600 px-4 py-2 rounded-lg text-[9px] font-black uppercase hover:bg-zinc-100 transition-colors"
                      >
                        Message us on Instagram for Global Shipping
                      </a>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 mb-6 p-4 bg-amber-50/50 border border-amber-100 rounded-xl">
                <p className="text-[10px] leading-relaxed text-amber-900/80 font-medium">
                  By clicking Pay Now, you agree to our <Link to="/policies/return-policy" className="underline font-bold">Return Policy</Link>. 
                  <span className="block mt-1 font-bold">⚠️ Note: Mandatory Unboxing Video required for all claims.</span>
                </p>
              </div>

              <Button 
                onClick={handlePayment} 
                disabled={isProcessing || checkoutItems.length === 0} 
                className="w-full bg-black text-white h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl active:scale-95 transition-all"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-3"><Loader2 className="animate-spin" size={16} /> Connecting...</span>
                ) : (
                  <span className="flex items-center gap-3"><CreditCard size={18} /> Pay Now</span>
                )}
              </Button>
              
              <div className="mt-6 pt-4 border-t border-zinc-200 text-center">
                <p className="text-[7px] text-zinc-400 uppercase font-bold tracking-[0.1em]">
                  Secure payment processed by Razorpay. SSL Encrypted.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;