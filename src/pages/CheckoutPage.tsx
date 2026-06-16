import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ChevronDown, Loader2, MapPin, Ticket, Truck, ShieldCheck, CheckSquare, Square, CreditCard, Plus, Mail, LogIn, PackageCheck } from 'lucide-react';
import { toast } from 'sonner';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/context/CartContext';
import { orderService, authService, storeService } from '@/services/api';

const formatPrice = (price: number) =>
  `₹${Number(price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

const loadRazorpay = () =>
  new Promise((resolve) => {
    const script    = document.createElement('script');
    script.src      = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload   = () => resolve(true);
    script.onerror  = () => resolve(false);
    document.body.appendChild(script);
  });

const INDIAN_STATES = [
  "Andaman and Nicobar Islands","Andhra Pradesh","Arunachal Pradesh","Assam","Bihar",
  "Chandigarh","Chhattisgarh","Dadra and Nagar Haveli","Daman and Diu","Delhi",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jammu and Kashmir","Jharkhand",
  "Karnataka","Kerala","Ladakh","Lakshadweep","Madhya Pradesh","Maharashtra",
  "Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Puducherry","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh",
  "Uttarakhand","West Bengal",
];

// ─────────────────────────────────────────────────────────────
// SUCCESS MODAL — shown after payment for guest users
// ─────────────────────────────────────────────────────────────
const GuestSuccessModal = ({ email, onClose }: { email: string; onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-in fade-in duration-300">
    <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl text-center animate-in zoom-in-95 duration-300">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <PackageCheck size={32} className="text-green-600" />
      </div>

      <h2 className="text-xl font-black uppercase tracking-tight mb-3">Order Placed Successfully!</h2>

      <p className="text-sm text-zinc-500 font-medium leading-relaxed mb-2">
        All shipping and tracking updates will be sent to
      </p>
      <p className="text-sm font-black text-black mb-6 break-all">{email}</p>

      <p className="text-[11px] text-zinc-400 uppercase tracking-widest font-bold mb-8">
        Please save this email — it's your only link to track your order.
      </p>

      <Button
        onClick={onClose}
        className="w-full bg-black text-white h-12 rounded-2xl font-black uppercase tracking-[0.15em] text-[10px]"
      >
        Done
      </Button>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
const CheckoutPage = () => {
  const { cartItems: globalCartItems, clearCart } = useCart();
  const navigate  = useNavigate();
  const location  = useLocation();

  // ── BUY NOW LOGIC ──
  const { checkoutItems, isDirectBuy } = useMemo(() => {
    const direct = location.state?.directItem;
    if (direct && Array.isArray(direct)) return { checkoutItems: direct, isDirectBuy: true };
    return { checkoutItems: globalCartItems, isDirectBuy: false };
  }, [location.state, globalCartItems]);

  const checkoutSubtotal = useMemo(
    () => checkoutItems.reduce((sum, item) => sum + (Number(item.price) * (item.quantity || 1)), 0),
    [checkoutItems]
  );

  // ── GUEST CHECKOUT STATE ──
  const isLoggedIn            = !!localStorage.getItem('userToken');
  const [guestEmail, setGuestEmail]       = useState('');
  const [guestEmailError, setGuestEmailError] = useState(false);
  const [showGuestSuccessModal, setShowGuestSuccessModal] = useState(false);

  const [isProcessing,   setIsProcessing]   = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [saveAsDefault,  setSaveAsDefault]  = useState(false);

  const [config, setConfig] = useState({ shipping_fee: 100, free_shipping_threshold: 2000 });

  const [couponCode,          setCouponCode]          = useState('');
  const [appliedCoupon,       setAppliedCoupon]       = useState<any>(null);
  const [isValidatingCoupon,  setIsValidatingCoupon]  = useState(false);

  const [address, setAddress] = useState({
    firstName: '', lastName: '', country: 'India', state: '',
    city: '', street: '', landmark: '', pincode: '', phone: '',
  });

  const [hasAttemptedPay, setHasAttemptedPay] = useState(false);
  const [errors,          setErrors]          = useState<Record<string, boolean>>({});

  // ── AUTO-FILL FROM PINCODE ──
  useEffect(() => {
    const fetchLocation = async () => {
      if (address.pincode.length !== 6) return;
      if (!/^[1-9][0-9]{5}$/.test(address.pincode)) return;

      try {
        const res  = await fetch(`https://api.postalpincode.in/pincode/${address.pincode}`);
        const data = await res.json();

        if (data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
          const po         = data[0].PostOffice[0];
          const foundState = INDIAN_STATES.find(s => s.toLowerCase() === po.State.toLowerCase());
          setAddress(prev => ({ ...prev, city: po.District || '', state: foundState || po.State || '' }));
          setErrors(prev => ({ ...prev, city: false, state: false, pincode: false }));
        }
      } catch { /* silent */ }
    };
    fetchLocation();
  }, [address.pincode]);

  // ── INIT ──
  useEffect(() => {
    const init = async () => {
      try {
        // ── GUEST CHECKOUT ── load config for all users; addresses only for logged-in
        const configData = await storeService.getSiteConfig().catch(() => null);
        if (configData) setConfig(configData);

        if (isLoggedIn) {
          const addrData = await authService.getSavedAddresses().catch(() => []);
          const list     = Array.isArray(addrData) ? addrData : addrData.results || [];
          setSavedAddresses(list);
          const def = list.find((a: any) => a.is_default);
          if (def) handleSelectAddress(def);
        }
      } catch (error) {
        console.error('Initialization error', error);
      } finally {
        setLoadingInitial(false);
      }
    };
    init();
  }, [isLoggedIn]);

  const totals = useMemo(() => {
    const sub = Number(checkoutSubtotal) || 0;
    if (sub === 0) return { shipping: 0, discount: 0, finalTotal: 0 };
    const shipping    = sub >= config.free_shipping_threshold ? 0 : Number(config.shipping_fee);
    const discount    = appliedCoupon ? Number(appliedCoupon.discount) : 0;
    const finalTotal  = sub + shipping - discount;
    return { shipping, discount, finalTotal };
  }, [checkoutSubtotal, config, appliedCoupon]);

  const isIndianPincode    = useMemo(() => /^[1-9][0-9]{5}$/.test(address.pincode), [address.pincode]);
  const showPincodeWarning = hasAttemptedPay && (!isIndianPincode || !address.state);

  const validateForm = () => {
    const newErrors: Record<string, boolean> = {};
    const mandatory = ['firstName', 'lastName', 'country', 'state', 'city', 'street', 'pincode', 'phone'];
    mandatory.forEach(f => {
      if (!address[f as keyof typeof address]?.trim()) newErrors[f] = true;
    });
    if (address.phone && !/^[0-9]{10}$/.test(address.phone)) newErrors.phone = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSelectAddress = (addr: any) => {
    setAddress({
      firstName: addr.first_name || '', lastName: addr.last_name || '',
      country: addr.country || 'India', state: addr.state || '',
      city: addr.city || '', street: addr.address || '',
      landmark: addr.landmark || '', pincode: addr.zip_code || '',
      phone: addr.phone || '',
    });
    setSaveAsDefault(false);
    setHasAttemptedPay(false);
    setErrors({});
    toast.success(`Address "${addr.label}" selected`);
  };

  const resetAddressForm = () => {
    setAddress({ firstName: '', lastName: '', country: 'India', state: '', city: '', street: '', landmark: '', pincode: '', phone: '' });
    setSaveAsDefault(false);
    setHasAttemptedPay(false);
    setErrors({});
    toast.info('Enter new delivery details');
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setIsValidatingCoupon(true);
    try {
      const res = await storeService.validateCoupon(couponCode, checkoutSubtotal);
      setAppliedCoupon(res);
      toast.success(res.message || 'Coupon applied!');
    } catch (err: any) {
      toast.error(err.error || 'Invalid coupon code');
      setAppliedCoupon(null);
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handlePayment = async () => {
    setHasAttemptedPay(true);

    // ── GUEST CHECKOUT ── validate guest email first
    if (!isLoggedIn) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!guestEmail.trim() || !emailRegex.test(guestEmail)) {
        setGuestEmailError(true);
        toast.error('Email Required', { description: 'Please enter a valid email address to receive order updates.' });
        window.scrollTo({ top: 200, behavior: 'smooth' });
        return;
      }
      setGuestEmailError(false);
    }

    if (!/^[1-9][0-9]{5}$/.test(address.pincode)) {
      toast.error('Invalid Shipping Location', {
        description: 'Shipping is only available in India. Please use a valid Indian Pincode.',
      });
      setErrors(prev => ({ ...prev, pincode: true }));
      return;
    }

    const isValid = validateForm();
    if (!isValid) {
      if (address.phone && !/^[0-9]{10}$/.test(address.phone)) {
        toast.error('Invalid Phone Number', { description: 'Please enter a valid 10-digit phone number.' });
      } else {
        toast.error('Required Fields Missing', { description: 'Please fill in all mandatory fields highlighted in red.' });
      }
      window.scrollTo({ top: 200, behavior: 'smooth' });
      return;
    }

    setIsProcessing(true);
    const scriptLoaded = await loadRazorpay();
    if (!scriptLoaded) {
      toast.error('Razorpay SDK failed to load.');
      setIsProcessing(false);
      return;
    }

    try {
      const orderData: any = {
        total_amount:     totals.finalTotal,
        shipping_address: address.street,
        landmark:         address.landmark,
        firstName:        address.firstName,
        lastName:         address.lastName,
        city:             address.city,
        state:            address.state,
        country:          address.country,
        zip_code:         address.pincode,
        phone:            address.phone,
        coupon_code:      appliedCoupon?.code || null,
        save_address:     isLoggedIn ? saveAsDefault : false,
        items: checkoutItems.map((item: any) => ({
          productId:    item.productId || item.id,
          product_type: item.product_type,
          title:        item.name || item.title,
          price:        item.price,
          quantity:     item.quantity,
          size:         item.selectedSize || item.size,
          color:        item.selectedColor?.name || item.color || '',
        })),
      };

      // ── GUEST CHECKOUT ── include guest_email when not logged in
      if (!isLoggedIn) {
        orderData.guest_email = guestEmail.trim();
      }

      const backendOrder = await orderService.createCheckoutSession(orderData);

      const options = {
        key:         backendOrder.key || import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount:      backendOrder.amount,
        currency:    backendOrder.currency || 'INR',
        name:        'GTD Fashion',
        description: 'Secure Checkout',
        order_id:    backendOrder.razorpay_order_id,
        handler: async (response: any) => {
          try {
            await orderService.verifyPayment(response);

            if (!isDirectBuy) clearCart();

            // ── GUEST CHECKOUT ── show modal instead of navigating to /profile
            if (!isLoggedIn) {
              setShowGuestSuccessModal(true);
            } else {
              toast.success('Order Placed Successfully!');
              navigate('/profile');
            }
          } catch {
            toast.error('Payment verification failed.');
          }
        },
        prefill: {
          name:    `${address.firstName} ${address.lastName}`,
          contact: address.phone,
          email:   isLoggedIn ? '' : guestEmail,
        },
        theme: { color: '#ec4899' },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.error || 'Payment initialization failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const errorStyle = (field: string) =>
    errors[field] ? 'border-red-500 bg-red-50 focus-visible:ring-red-500' : '';

  if (loadingInitial)
    return (
      <div className="h-screen flex items-center justify-center bg-[#FFF8F8]">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* ── GUEST SUCCESS MODAL ── */}
      {showGuestSuccessModal && (
        <GuestSuccessModal
          email={guestEmail}
          onClose={() => {
            setShowGuestSuccessModal(false);
            navigate('/');
          }}
        />
      )}

      <main className="pt-40 pb-20 container mx-auto px-4 max-w-6xl">
        <h1 className="text-2xl font-black uppercase mb-10 tracking-tight">Checkout</h1>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* ─── LEFT COLUMN ─── */}
          <div className="lg:col-span-7 space-y-10">

            {/* ── GUEST CHECKOUT ── Login prompt OR guest email field */}
            {!isLoggedIn && (
              <div className="space-y-4">
                {/* Login Banner */}
                <div className="flex items-start gap-4 p-5 rounded-2xl border-2 border-zinc-100 bg-zinc-50">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <LogIn size={16} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-black uppercase tracking-widest text-zinc-800 mb-1">
                      Have an account?
                    </p>
                    <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                      Log in / Sign Up for faster checkout and easy order tracking.
                    </p>
                  </div>
                  <Link
                    to="/login"
                    state={{ from: location.pathname }}
                    className="shrink-0 h-9 px-4 flex items-center justify-center rounded-xl bg-black text-white text-[9px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors"
                  >
                    Log In / Sign up
                  </Link>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-zinc-100" />
                  <span className="text-[9px] font-black uppercase text-zinc-400 tracking-widest">or continue as guest</span>
                  <div className="flex-1 h-px bg-zinc-100" />
                </div>

                {/* Guest email input */}
                <div className="relative">
                  <Mail
                    size={14}
                    className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${guestEmailError ? 'text-red-400' : 'text-zinc-400'}`}
                  />
                  <Input
                    type="email"
                    placeholder="Email Address for Updates *"
                    value={guestEmail}
                    onChange={e => {
                      setGuestEmail(e.target.value);
                      if (guestEmailError) setGuestEmailError(false);
                    }}
                    className={`pl-9 h-12 text-sm font-medium ${
                      guestEmailError
                        ? 'border-red-500 bg-red-50 focus-visible:ring-red-500'
                        : 'border-zinc-200 bg-white'
                    }`}
                  />
                  {guestEmailError && (
                    <p className="mt-1.5 text-[10px] font-bold text-red-500 uppercase tracking-wide">
                      A valid email is required to place your order.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* ── SAVED ADDRESSES (logged-in only) ── */}
            {isLoggedIn && savedAddresses.length > 0 && (
              <div>
                <div className="flex justify-between items-end mb-4">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Select Delivery Address</p>
                  <button
                    onClick={resetAddressForm}
                    className="flex items-center gap-1 text-[10px] font-black uppercase text-primary border-b border-primary"
                  >
                    <Plus size={12} /> New Address
                  </button>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {savedAddresses.map((addr) => (
                    <button
                      key={addr.id}
                      onClick={() => handleSelectAddress(addr)}
                      className={`flex-shrink-0 w-64 text-left p-4 rounded-2xl border-2 transition-all ${
                        address.phone === addr.phone
                          ? 'border-black bg-zinc-50'
                          : 'border-zinc-100 bg-white hover:border-zinc-300'
                      }`}
                    >
                      <p className="font-bold text-sm uppercase">{addr.label}</p>
                      <p className="text-xs text-gray-500 truncate mt-1">{addr.address}</p>
                      <p className="text-[10px] text-zinc-400 mt-2 uppercase">{addr.city}, {addr.state}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── DELIVERY DETAILS FORM ── */}
            <section className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-3">
                <MapPin size={16} className="text-primary" /> Delivery Details
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="First Name *"
                  className={errorStyle('firstName')}
                  value={address.firstName}
                  onChange={e => { setAddress({ ...address, firstName: e.target.value }); if (errors.firstName) setErrors({ ...errors, firstName: false }); }}
                />
                <Input
                  placeholder="Last Name *"
                  className={errorStyle('lastName')}
                  value={address.lastName}
                  onChange={e => { setAddress({ ...address, lastName: e.target.value }); if (errors.lastName) setErrors({ ...errors, lastName: false }); }}
                />
                <Input
                  className={`col-span-2 ${errorStyle('phone')}`}
                  placeholder="Contact Number *"
                  value={address.phone}
                  onChange={e => { setAddress({ ...address, phone: e.target.value }); if (errors.phone) setErrors({ ...errors, phone: false }); }}
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
                    setAddress({ ...address, pincode: val });
                    if (errors.pincode) setErrors({ ...errors, pincode: false });
                    if (hasAttemptedPay) setHasAttemptedPay(false);
                  }}
                  maxLength={6}
                />
                <Input
                  placeholder="State *"
                  className={errorStyle('state')}
                  value={address.state}
                  onChange={e => { setAddress({ ...address, state: e.target.value }); if (errors.state) setErrors({ ...errors, state: false }); }}
                />
                <Input
                  placeholder="City *"
                  className={`col-span-2 ${errorStyle('city')}`}
                  value={address.city}
                  onChange={e => { setAddress({ ...address, city: e.target.value }); if (errors.city) setErrors({ ...errors, city: false }); }}
                />
                <Input
                  className={`col-span-2 ${errorStyle('street')}`}
                  placeholder="Street Address / House No. *"
                  value={address.street}
                  onChange={e => { setAddress({ ...address, street: e.target.value }); if (errors.street) setErrors({ ...errors, street: false }); }}
                />
                <Input
                  className="col-span-2"
                  placeholder="Landmark (Optional)"
                  value={address.landmark}
                  onChange={e => setAddress({ ...address, landmark: e.target.value })}
                />
              </div>

              {/* Save address — only shown to logged-in users */}
              {isLoggedIn && (
                <div
                  className="flex items-center gap-3 cursor-pointer group"
                  onClick={() => {
                    if (!saveAsDefault && !/^[0-9]{10}$/.test(address.phone)) {
                      toast.error('Invalid Phone Number', { description: 'Please enter exactly 10 digits before saving.' });
                      return;
                    }
                    setSaveAsDefault(!saveAsDefault);
                  }}
                >
                  {saveAsDefault
                    ? <CheckSquare size={18} className="text-primary" />
                    : <Square size={18} className="text-zinc-300" />
                  }
                  <span className="text-[10px] font-bold uppercase text-zinc-500 group-hover:text-black transition-colors">
                    Save this as default address
                  </span>
                </div>
              )}
            </section>
          </div>

          {/* ─── RIGHT COLUMN — ORDER SUMMARY ─── */}
          <div className="lg:col-span-5">
            <div className="bg-zinc-50 p-8 rounded-3xl border border-zinc-100 sticky top-32 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-8 text-zinc-400">Order Summary</h3>

              {/* Items preview */}
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

              {/* Coupon */}
              <div className="mb-8 p-4 bg-white border border-zinc-200 rounded-2xl">
                <p className="text-[9px] font-black uppercase text-zinc-400 mb-3 tracking-widest">Apply Promo Code</p>
                <div className="flex gap-2">
                  <Input
                    placeholder="ENTER CODE"
                    className="h-10 text-xs font-bold uppercase border-none bg-zinc-50"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value.toUpperCase())}
                  />
                  <Button
                    onClick={handleApplyCoupon}
                    disabled={isValidatingCoupon}
                    className="bg-black text-white h-10 px-4 text-[9px] font-black uppercase"
                  >
                    {isValidatingCoupon ? '...' : 'Apply'}
                  </Button>
                </div>
                {appliedCoupon && (
                  <p className="mt-2 text-[9px] font-bold text-green-600 flex items-center gap-1 uppercase tracking-tighter">
                    <ShieldCheck size={12} /> {appliedCoupon.message}
                  </p>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-4 mb-10 text-xs font-bold uppercase tracking-wider">
                <div className="flex justify-between text-zinc-500">
                  <span>Subtotal</span>
                  <span>{formatPrice(checkoutSubtotal)}</span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span className="flex items-center gap-2 text-primary">Delivery <Truck size={12} /></span>
                  <span>
                    {totals.shipping === 0
                      ? <span className="text-green-600 font-black uppercase">Free</span>
                      : formatPrice(totals.shipping)
                    }
                  </span>
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

              {/* India-only shipping warning */}
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

              {/* Policy note */}
              <div className="mt-6 mb-6 p-4 bg-amber-50/50 border border-amber-100 rounded-xl">
                <p className="text-[10px] leading-relaxed text-amber-900/80 font-medium">
                  By clicking Pay Now, you agree to our{' '}
                  <Link to="/policies/return-policy" className="underline font-bold">Return Policy</Link>.{' '}
                  <span className="block mt-1 font-bold">⚠️ Note: Mandatory Unboxing Video required for all claims.</span>
                </p>
              </div>

              {/* Pay button */}
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