import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Minus, Plus, ChevronRight, ChevronLeft, Loader2, Truck, RotateCcw, Camera, Share2, X, Zap, ShieldCheck, PackageCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { storeService } from '@/services/api';
import { useCart } from '@/context/CartContext';
import { toast } from "sonner";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart(); // Destructured cartItems to check existing quantities
  
  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedColor, setSelectedColor] = useState<any>(null); 
  const [selectedSize, setSelectedSize] = useState("");
  const [displayPrice, setDisplayPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);
  const [displayOriginalPrice, setDisplayOriginalPrice] = useState<number>(0);
  // --- ZOOM STATE ---
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, comment: '', image: null as File | null });
  const [hoveredStar, setHoveredStar] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
  const loadData = async () => {
    try {
      setLoading(true);
      const [data, reviewsData] = await Promise.all([
        storeService.getProductBySlug(slug!),
        storeService.getReviews(slug!)
      ]);
      setProduct(data);
      setReviews(reviewsData.results || reviewsData);
      setDisplayPrice(Number(data.price));
      // 🔥 ADD THIS LINE HERE
      setDisplayOriginalPrice(Number(data.original_price)); 
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };
  loadData();
}, [slug]);

  useEffect(() => {
    if (selectedSize && selectedColor) {
      const sizeObj = selectedColor.sizes.find((s: any) => s.size === selectedSize);
      if (sizeObj) {
        setDisplayPrice(Number(sizeObj.price));
        // 🔥 Update the original price too
        setDisplayOriginalPrice(Number(sizeObj.original_price));
      }
    }
  }, [selectedSize, selectedColor]);

  // --- FIXED DISPLAY IMAGES LOGIC ---
  const displayImages = useMemo(() => {
  if (!product) return [];

  // No color selected → show all images
  if (!selectedColor) return product.images;

  const filtered = product.images.filter(
    (img: any) =>
      img.color === selectedColor.id ||
      img.color_name === selectedColor.name
  );

  // fallback
  return filtered.length > 0 ? filtered : product.images;
}, [product, selectedColor]);

  const availableSizes = useMemo(() => {
    if (selectedColor) return selectedColor.sizes || [];
    if (product && product.colors?.length > 0) return product.colors[0].sizes || [];
    return [];
  }, [product, selectedColor]);

  // --- STOCK HELPERS ---
  const selectedVariant = useMemo(() => {
    if (!selectedSize || availableSizes.length === 0) return null;
    return availableSizes.find((s: any) => s.size === selectedSize);
  }, [selectedSize, availableSizes]);

  const quantityInCart = useMemo(() => {
    if (!product || !selectedColor || !selectedSize) return 0;
    const variantId = `${product.id}-${selectedColor.name}-${selectedSize}`;
    const item = cartItems.find((i: any) => i.id === variantId);
    return item ? item.quantity : 0;
  }, [cartItems, product, selectedColor, selectedSize]);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.comment) {
      toast.error("Please fill in all fields");
      return;
    }
    const formData = new FormData();
    formData.append('user_name', reviewForm.name);
    formData.append('rating', reviewForm.rating.toString());
    formData.append('comment', reviewForm.comment);
    if (reviewForm.image) formData.append('image', reviewForm.image);

    try {
      await storeService.addReview(slug!, formData); 
      toast.success("Review posted! It will appear shortly.");
      setShowReviewForm(false);
      setReviewForm({ name: '', rating: 5, comment: '', image: null });
      const updated = await storeService.getReviews(slug!);
      setReviews(updated.results || updated);
    } catch (err: any) { 
      console.error("Review Error:", err);
      toast.error(err.detail || "Error posting review"); 
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: product.title,
      text: `Check out this ${product.title} on Watch & Buy!`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

const handleAddToCart = (action: 'bag' | 'buy') => {
    if (!selectedColor) {
      toast.error("Please select a color first"); 
      return;
    }
    if (!selectedSize) {
      toast.error("Please select a size first"); 
      return;
    }

    // --- STOCK VALIDATION ---
    if (selectedVariant) {
      const totalRequested = quantity + quantityInCart;
      if (totalRequested > selectedVariant.stock) {
        toast.error(`Cannot add more. Only ${selectedVariant.stock} items total allowed (You already have ${quantityInCart} in bag).`);
        return;
      }
    }

    const variantImage = product.images.find((i: any) => 
      i.color === selectedColor.id || i.color_name === selectedColor.name
    )?.url || product.images[0]?.url;

    if (action === 'buy') {
      const directItem = {
        productId: product.id,
        product_type: 'REGULAR',
        name: product.title,
        price: displayPrice,
        quantity: quantity,
        selectedSize: selectedSize,
        selectedColor: selectedColor,
        image: variantImage,
        stock: selectedVariant?.stock
      };
      navigate('/checkout', { state: { directItem: [directItem] } });
    } else {
      addToCart(product, quantity, selectedSize, selectedColor, variantImage, displayPrice,selectedVariant?.stock);
      toast.success("Added to bag");
    }
  };

  const savings = displayOriginalPrice ? Math.floor(displayOriginalPrice - displayPrice) : 0;

  if (loading) return <div className="h-screen flex justify-center items-center"><Loader2 className="animate-spin text-pink-500" /></div>;
  if (!product) return null;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24 md:pt-40 pb-24 md:pb-10">
        <div className="max-w-[1400px] mx-auto px-4 md:px-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-[450px_1fr] gap-4 lg:gap-8 items-start">
            
            {/* LEFT SIDE: IMAGE SECTION */}
            <div className="lg:sticky lg:top-40 space-y-4">
              <div className="aspect-[3/4] min-h-[500px] bg-zinc-50 relative overflow-hidden group w-full flex items-center justify-center p-8 cursor-zoom-in rounded-2xl" onClick={() => setIsZoomOpen(true)}>
                {displayImages.length > 1 && (
                  <>
                    <button 
                      onClick={(e) => { e.stopPropagation(); prevImage(); }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full shadow-lg z-10 hover:bg-white transition-all border border-zinc-100"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); nextImage(); }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full shadow-lg z-10 hover:bg-white transition-all border border-zinc-100"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}

                <img 
                  src={displayImages[currentImage]?.url} 
                  className="max-w-full max-h-full object-contain transition-opacity duration-300" 
                  alt="" 
                />
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleShare(); }}
                    className="bg-white/90 p-3 rounded-full shadow-sm hover:bg-zinc-100 transition-colors"
                  >
                    <Share2 size={18} />
                  </button>
                </div>
              </div>

              <div className="hidden md:flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                {displayImages.map((img: any, i: number) => (
                  <button 
                    key={i} 
                    onClick={() => setCurrentImage(i)} 
                    className={`shrink-0 w-20 aspect-[3/4] border-2 transition-all rounded-lg overflow-hidden ${currentImage === i ? 'border-black' : 'border-transparent'}`}
                  >
                    <img src={img.url} className="w-full h-full object-cover" alt="" />
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT SIDE: DETAILS SECTION */}
            <div className="flex flex-col pt-2 max-w-2xl text-left">
              <div className="mb-6">
                <h1 className="text-xl md:text-3xl font-bold tracking-tight text-zinc-800 mb-1">{product.title}</h1>
                <p className="text-sm text-zinc-400 font-medium uppercase tracking-widest mb-4">{product.category_name}</p>
                <div className="flex items-center gap-3 py-4 border-y border-zinc-100">
                  <span className="text-2xl font-extrabold text-black">₹{displayPrice}</span>
                  {displayOriginalPrice > 0 && (
                    <>
                      <span className="text-lg text-zinc-300 line-through">₹{displayOriginalPrice}</span>
                      <span className="text-pink-500 font-extrabold text-sm uppercase">
                        ₹{Math.floor(displayOriginalPrice - displayPrice)} OFF
                      </span>
                    </>
                  )}
                </div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase mt-2 tracking-widest">Inclusive of all taxes</p>
              </div>

              {/* COLOR SECTION */}
              <div className="mb-8">
                <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-700 block mb-4">
                    Select Color {selectedColor ? `: ${selectedColor.name}` : '(Required)'}
                </span>
                <div className="flex flex-wrap gap-4">
                  {product.colors.map((c: any) => (
                    <button 
                        key={c.name} 
                        onClick={() => {setSelectedColor(c); setCurrentImage(0); setSelectedSize("");}} 
                        className={`w-12 h-12 rounded-full border-2 transition-all p-0.5 flex-shrink-0 ${selectedColor?.name === c.name ? 'border-black scale-110' : 'border-zinc-200 hover:border-zinc-400'}`}
                        title={c.name}
                    >
                        <img 
                          src={product.images.find((i:any)=>i.color === c.id || i.color_name === c.name)?.url || product.images[0].url} 
                          className="w-full h-full object-cover rounded-full" 
                          alt={c.name}
                        />
                    </button>
                  ))}
                </div>
              </div>

              {/* SIZE SECTION */}
              <div className="mb-8">
                <div className="flex justify-between mb-4">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-700">
                    Size {selectedSize ? `: ${selectedSize}` : '(Required)'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((s: any) => (
                    <button 
                        key={s.size} 
                        onClick={() => setSelectedSize(s.size)} 
                        disabled={!s.inStock} 
                        className={`h-12 px-6 border-2 font-bold text-xs transition-all ${selectedSize === s.size ? 'bg-black text-white border-black' : 'bg-white border-zinc-100 hover:border-black'} ${!s.inStock ? 'opacity-20 cursor-not-allowed' : ''}`}
                    >
                      {s.size}
                    </button>
                  ))}
                </div>
                {/* 🔥 ADD THIS CONDITIONAL TRIGGER BUTTON HERE */}
                {product.size_chart && (
                    <button
                      type="button"
                      onClick={() => setIsSizeChartOpen(true)}
                      className="text-[11px] font-extrabold uppercase text-primary hover:text-black tracking-wider underline transition-colors duration-200"
                    >
                      Size Guide
                    </button>
                  )}
                </div>

              {/* QUANTITY SECTION WITH STOCK VALIDATION */}
              <div className="mb-10">
                <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-700 block mb-4">
                  Quantity {selectedVariant ? `(Only ${selectedVariant.stock} available)` : ''}
                </span>
                <div className="flex items-center w-fit border-2 border-zinc-100 bg-zinc-50/50">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 hover:bg-zinc-100 border-r border-zinc-100"><Minus size={14}/></button>
                  <span className="px-8 font-extrabold text-sm">{quantity}</span>
                  <button 
                    onClick={() => {
                      if (selectedVariant && (quantity + quantityInCart) < selectedVariant.stock) {
                        setQuantity(quantity + 1);
                      } else if (selectedVariant) {
                        toast.error(`Stock limit reached. Only ${selectedVariant.stock} items available.`);
                      } else {
                        toast.error("Please select a size first");
                      }
                    }} 
                    className="px-4 py-3 hover:bg-zinc-100 border-l border-zinc-100"
                  >
                    <Plus size={14}/>
                  </button>
                </div>
              </div>

              <div className="relative bg-white grid grid-cols-2 gap-3 mb-10">
                <Button 
                    onClick={() => handleAddToCart('bag')} 
                    className="h-14 rounded-none uppercase text-[10px] font-extrabold tracking-widest bg-white border-2 border-primary text-primary hover:bg-pink-50 transition-all"
                >
                    Add to Bag
                </Button>
                <Button 
                    onClick={() => handleAddToCart('buy')} 
                    className="h-14 rounded-none uppercase text-[10px] font-extrabold tracking-widest bg-primary text-white hover:bg-primary shadow-lg shadow-primary/20 active:scale-95 transition-all"
                >
                    Buy Now
                </Button>
              </div>

              {/* CONNECT BADGES */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-t border-zinc-50 text-[9px] font-black uppercase tracking-widest text-zinc-500">
                <div className="flex flex-col items-center gap-2 text-center">
                    <Truck size={20} strokeWidth={1.5} className="text-pink-500" />
                    <span>Free Shipping</span>
                </div>
                <div className="flex flex-col items-center gap-2 text-center">
                    <Zap size={20} strokeWidth={1.5} className="text-pink-500" />
                    <span>Fast Dispatch</span>
                </div>
                <div className="flex flex-col items-center gap-2 text-center">
                    <ShieldCheck size={20} strokeWidth={1.5} className="text-pink-500" />
                    <span>Secure Payment</span>
                </div>
                <div className="flex flex-col items-center gap-2 text-center">
                    <PackageCheck size={20} strokeWidth={1.5} className="text-pink-500" />
                    <span>Quality Assured</span>
                </div>
              </div>

              <div className="mt-8 border-t border-zinc-100 pt-8">
                <Tabs defaultValue="details">
                  <TabsList className="bg-transparent border-none gap-10 mb-6">
                    <TabsTrigger value="details" className="bg-transparent rounded-none border-b-2 border-transparent data-[state=active]:border-black text-[11px] uppercase font-bold tracking-widest px-0">Product Details</TabsTrigger>
                    <TabsTrigger value="reviews" className="bg-transparent rounded-none border-b-2 border-transparent data-[state=active]:border-black text-[11px] uppercase font-bold tracking-widest px-0">Reviews ({reviews.length})</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="details" className="text-zinc-600 text-sm leading-relaxed space-y-8 animate-in fade-in">
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-black mb-3">Description</h4>
                      <p>{product.description}</p>
                    </div>
                    {product.features && (
                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-black mb-3">Key Features</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {product.features.split('\n').filter((f: string) => f.trim() !== '').map((f: any, i: any) => (
                            <div key={i} className="flex items-center gap-2 text-[10px] font-bold uppercase text-zinc-500">
                              <div className="w-1 h-1 bg-pink-500 rounded-full" /> {f}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {product.care_instructions && (
                      <div className="pt-4 border-t border-zinc-50">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-black mb-3">Care Instructions</h4>
                        <div className="space-y-2">
                          {product.care_instructions.split('\n').filter((line: string) => line.trim() !== '').map((line: any, i: any) => (
                            <div key={i} className="flex items-start gap-2 text-[10px] font-bold uppercase text-zinc-400">
                              <span className="text-primary">•</span>
                              <span>{line}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="reviews">
  <div className="flex justify-between items-center mb-6">
    <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-800">Customer Reviews</h3>
    <button 
      onClick={() => setShowReviewForm(!showReviewForm)} 
      className={`text-[10px] font-black uppercase transition-all tracking-widest ${showReviewForm ? 'text-red-500' : 'underline text-primary'}`}
    >
      {showReviewForm ? "Close" : "Write a Review"}
    </button>
  </div>

  {/* --- REVIEW FORM --- */}
  {showReviewForm && (
    <div className="mb-12 p-6 bg-zinc-50 rounded-2xl border border-zinc-100 animate-in fade-in slide-in-from-top-4 duration-300">
      <form onSubmit={handleReviewSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Your Name</label>
            <input 
              type="text" 
              value={reviewForm.name}
              onChange={(e) => setReviewForm({...reviewForm, name: e.target.value})}
              className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
              placeholder="e.g. Anjali Sharma"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block">Rating</label>
            <div className="flex gap-1 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star}
                  size={22}
                  className={`cursor-pointer transition-all ${
                    (hoveredStar || reviewForm.rating) >= star ? 'fill-[#F4C430] text-[#F4C430] scale-110' : 'text-zinc-300'
                  }`}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  onClick={() => setReviewForm({...reviewForm, rating: star})}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Your Experience</label>
          <textarea 
            rows={4}
            value={reviewForm.comment}
            onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
            className="w-full p-4 bg-white border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
            placeholder="How is the fabric quality? Did it match the pictures?"
          />
        </div>

        {/* IMAGE UPLOAD SECTION */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block">Add Photo (Optional)</label>
          <div className="flex items-center gap-4">
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-zinc-200 rounded-xl hover:border-primary transition-colors text-zinc-400 hover:text-primary"
            >
              <Camera size={18} />
              <span className="text-[10px] font-bold uppercase">Upload Image</span>
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={(e) => setReviewForm({...reviewForm, image: e.target.files?.[0] || null})}
            />
            {reviewForm.image && (
              <div className="flex items-center gap-2 bg-pink-50 px-3 py-1 rounded-full border border-pink-100">
                <span className="text-[9px] font-bold text-primary truncate max-w-[100px]">{reviewForm.image.name}</span>
                <button type="button" onClick={() => setReviewForm({...reviewForm, image: null})}><X size={12} className="text-primary"/></button>
              </div>
            )}
          </div>
        </div>

        <Button type="submit" className="w-full bg-black text-white py-7 uppercase text-[10px] font-black tracking-[0.2em] rounded-xl hover:bg-zinc-800 transition-all">
          Submit Review
        </Button>
      </form>
    </div>
  )}

  {/* --- REVIEWS LIST --- */}
  <div className="space-y-10">
    {reviews.length > 0 ? (
      reviews.map(r => (
        <div key={r.id} className="border-b border-zinc-50 pb-8 last:border-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex text-[#F4C430] gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} className={i < r.rating ? 'fill-current' : 'text-zinc-200'} />
              ))}
            </div>
            <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-tighter">{r.date}</span>
          </div>
          
          <p className="text-sm text-zinc-700 leading-relaxed mb-4 font-medium italic">"{r.comment}"</p>
          
          {r.image && (
             <div className="mb-4">
                <img src={r.image} className="w-20 h-24 object-cover rounded-lg border border-zinc-100" alt="Review" />
             </div>
          )}

          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-zinc-100 rounded-full flex items-center justify-center text-[8px] font-bold text-zinc-400">
              {r.user_name.charAt(0)}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
              {r.user_name} <span className="mx-2 font-normal text-zinc-200">|</span> <span className="font-bold text-zinc-300">{r.location || "Verified Buyer"}</span>
            </span>
          </div>
        </div>
      ))
    ) : (
      <div className="text-center py-20 bg-zinc-50/50 rounded-3xl border border-dashed border-zinc-100">
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">No reviews for this masterpiece yet.</p>
        <button onClick={() => setShowReviewForm(true)} className="mt-2 text-[10px] font-black text-primary underline uppercase tracking-widest">Be the first to review</button>
      </div>
    )}
  </div>
</TabsContent>
                </Tabs>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* --- ZOOM MODAL / LIGHTBOX --- */}
      {isZoomOpen && (
        <div className="fixed inset-0 z-[100] bg-white flex items-center justify-center p-4 animate-in fade-in duration-300">
          <button 
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-8 right-8 p-3 bg-zinc-100 rounded-full hover:bg-zinc-200 transition-all text-black"
          >
            <X size={28} />
          </button>
          <img 
            src={displayImages[currentImage]?.url} 
            className="max-w-full max-h-[90vh] object-contain shadow-2xl" 
            alt="Zoomed Product"
          />
        </div>
      )}

      {/* --- RESPONSIVE SIZE GUIDE MODAL --- */}
      {isSizeChartOpen && product.size_chart && (
        <div 
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setIsSizeChartOpen(false)}
        >
          <div 
            className="relative bg-white p-5 md:p-6 rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsSizeChartOpen(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-black transition-colors rounded-full hover:bg-zinc-100"
            >
              <X size={18} />
            </button>
            
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4 mt-2 text-zinc-800 text-center">
              Size Reference Guide
            </h3>
            
            <div className="w-full overflow-y-auto rounded-xl border border-zinc-100 bg-zinc-50/50 p-2 flex items-center justify-center">
              <img 
                src={product.size_chart} 
                className="max-w-full h-auto max-h-[65vh] object-contain rounded-lg" 
                alt="Size Matrix Diagram"
              />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProductDetail;