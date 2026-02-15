import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, Minus, Plus, Loader2, Truck, RotateCcw, 
  Camera, Heart, Share2, ShoppingBag, CheckCircle2, ChevronLeft 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { storeService } from '@/services/api';
import { useCart } from '@/context/CartContext';
import { toast } from "sonner";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const WatchAndBuyDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  // Review Form State
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ 
    name: '', 
    rating: 5, 
    comment: '', 
    image: null as File | null 
  });
  const [hoveredStar, setHoveredStar] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await storeService.getWatchBuyDetail(slug!);
        setProduct(data);
        setReviews(data.reviews || []);

        if (data.variants?.length > 0) {
          setSelectedColor(data.variants[0].color);
          setSelectedSize(data.variants[0].size);
        }
      } catch (err) { 
        console.error("Failed to load video product:", err); 
      } finally { 
        setLoading(false); 
      }
    };
    loadData();
  }, [slug]);

  const uniqueColors = useMemo(() => {
    if (!product) return [];
    return Array.from(new Set(product.variants.map((v: any) => v.color))).filter(Boolean);
  }, [product]);

  const availableSizesForColor = useMemo(() => {
    if (!product || !selectedColor) return [];
    return product.variants.filter((v: any) => v.color === selectedColor);
  }, [product, selectedColor]);

  const discount = product?.original_price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100) 
    : 0;

  // 🔥 Matches your CartContext requirement for { name, hex }
  const colorForCart = useMemo(() => ({
    name: selectedColor,
    hex: "" 
  }), [selectedColor]);

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
    if (reviewForm.image) {
        formData.append('image', reviewForm.image);
    }

    try {
    // Submit to the backend
    await storeService.addWatchBuyReview(product.slug, formData);

    toast.success("Review submitted!");
    setShowReviewForm(false);
    setReviewForm({ name: '', rating: 5, comment: '', image: null });

    // 🔥 CRITICAL: Re-fetch product details to sync the 'reviews' array
    const updatedData = await storeService.getWatchBuyDetail(slug!);
    setProduct(updatedData);
    setReviews(updatedData.reviews || []);

  } catch (err) {
    toast.error("Failed to post review");
  }
  };

  if (loading) return <div className="h-screen flex justify-center items-center"><Loader2 className="animate-spin text-pink-500" /></div>;
  if (!product) return null;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24 md:pt-32 pb-10">
        <div className="max-w-[1400px] mx-auto px-4 md:px-10">
          
          <Link to="/watch-and-buy" className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black mb-8 transition-colors">
            <ChevronLeft size={14} className="mr-1" /> Back
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            {/* LEFT: VIDEO PLAYER */}
            <div className="lg:col-span-6">
              <div className="aspect-[9/16] bg-black relative rounded-[40px] overflow-hidden shadow-3xl border-[12px] border-white">
                <video src={product.video_url} autoPlay loop muted playsInline controls className="w-full h-full object-cover" />
              </div>
            </div>

            {/* RIGHT: CONTENT */}
            <div className="lg:col-span-6 flex flex-col pt-2">
              <div className="mb-6">
                <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-tight text-zinc-800 mb-4">{product.name}</h1>
                
                <div className="flex items-center gap-4 py-6 border-y border-zinc-100">
                  <span className="text-3xl font-extrabold text-black">₹{Number(product.price).toLocaleString('en-IN')}</span>
                  {product.original_price && (
                    <>
                      <span className="text-xl text-zinc-300 line-through">₹{Number(product.original_price).toLocaleString('en-IN')}</span>
                      <span className="text-pink-500 font-extrabold text-sm uppercase">{discount}% OFF</span>
                    </>
                  )}
                </div>
              </div>

              {/* Color Selection */}
              <div className="my-8">
                <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-700 block mb-4">Select Color</span>
                <div className="flex gap-3">
                  {uniqueColors.map((color: any) => (
                    <button 
                      key={color} 
                      onClick={() => setSelectedColor(color)}
                      className={`px-6 py-3 border-2 text-[10px] font-bold uppercase tracking-widest transition-all
                        ${selectedColor === color ? 'bg-black text-white border-black' : 'bg-white border-zinc-100 hover:border-black'}`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="mb-8">
                <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-700 block mb-4">Select Size</span>
                <div className="flex flex-wrap gap-2">
                  {availableSizesForColor.map((v: any) => (
                    <button 
                      key={v.id} 
                      onClick={() => setSelectedSize(v.size)}
                      disabled={v.stock === 0}
                      className={`h-12 px-6 border-2 font-bold text-xs transition-all
                        ${selectedSize === v.size ? 'bg-black text-white border-black' : 'bg-white border-zinc-100 hover:border-black'}
                        ${v.stock === 0 ? 'opacity-20 cursor-not-allowed' : ''}`}
                    >
                      {v.size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stylist Note */}
              <div className="mb-8 bg-zinc-50 p-6 rounded-3xl border border-zinc-100">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-800 mb-2 flex items-center">
                  <CheckCircle2 size={14} className="mr-2 text-pink-500" /> Stylist Note
                </h4>
                <p className="text-sm text-zinc-600 italic leading-relaxed">
                  {product.variants.find((v: any) => v.color === selectedColor)?.color_note || "Expertly curated for your collection."}
                </p>
              </div>

              <div className="mb-10">
                <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-700 block mb-4">Quantity</span>
                <div className="flex items-center w-fit border-2 border-zinc-100 bg-zinc-50/50">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 hover:bg-zinc-100 border-r border-zinc-100"><Minus size={14}/></button>
                  <span className="px-8 font-extrabold text-sm">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-3 hover:bg-zinc-100 border-l border-zinc-100"><Plus size={14}/></button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-10">
                <Button onClick={() => addToCart(product, quantity, selectedSize, colorForCart)} variant="outline" className="h-16 uppercase font-black text-xs tracking-widest">Add to Bag</Button>
                <Button onClick={() => { addToCart(product, quantity, selectedSize, colorForCart); navigate('/cart'); }} className="h-16 bg-zinc-900 text-white uppercase font-black text-xs tracking-widest">Buy Now</Button>
              </div>
            </div>
          </div>

          <div className="mt-20 border-t border-zinc-100 pt-16 max-w-4xl">
            <Tabs defaultValue="details">
              <TabsList className="bg-transparent border-none gap-10 mb-10">
                <TabsTrigger value="details" className="bg-transparent rounded-none border-b-2 border-transparent data-[state=active]:border-black text-[11px] uppercase font-bold tracking-widest">Product Details</TabsTrigger>
                <TabsTrigger value="reviews" className="bg-transparent rounded-none border-b-2 border-transparent data-[state=active]:border-black text-[11px] uppercase font-bold tracking-widest">Reviews ({reviews.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="text-zinc-600 text-sm leading-relaxed space-y-6">
                <p className="italic">"{product.description}"</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                  {product.features && (
                    <div className="flex items-start gap-2 text-[10px] font-bold uppercase text-zinc-400">
                      <div className="w-1 h-1 bg-pink-500 rounded-full mt-1.5" /> {product.features}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="reviews">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-sm font-bold uppercase tracking-widest">Experience</h3>
                  <button onClick={() => setShowReviewForm(!showReviewForm)} className="text-[10px] font-black underline uppercase text-pink-500">
                    {showReviewForm ? "Cancel" : "Write a Review"}
                  </button>
                </div>

                {showReviewForm && (
                  <form onSubmit={handleReviewSubmit} className="bg-zinc-50 p-8 mb-12 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Your Name</label>
                        <input placeholder="Enter name" required className="w-full p-4 text-xs border-none bg-white outline-none" value={reviewForm.name} onChange={e => setReviewForm({...reviewForm, name: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Rating</label>
                        <div className="flex gap-2 bg-white p-3 h-[50px] items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              size={20} 
                              className={`cursor-pointer transition-colors ${ (hoveredStar || reviewForm.rating) >= star ? 'fill-[#F4C430] text-[#F4C430]' : 'text-zinc-200' }`}
                              onMouseEnter={() => setHoveredStar(star)}
                              onMouseLeave={() => setHoveredStar(0)}
                              onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 🔥 NEW: Photo Upload Section */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Add Photo (Optional)</label>
                      <div 
                        onClick={() => fileInputRef.current?.click()} 
                        className="w-full py-10 border-2 border-dashed border-zinc-200 bg-white flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-zinc-50 transition-colors"
                      >
                        <Camera size={24} className="text-zinc-400" />
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                          {reviewForm.image ? reviewForm.image.name : "Click to upload your Look"}
                        </span>
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          className="hidden" 
                          accept="image/*" 
                          onChange={(e) => setReviewForm({...reviewForm, image: e.target.files?.[0] || null})} 
                        />
                      </div>
                    </div>

                    <textarea placeholder="Tell us about the quality..." required className="w-full p-4 text-xs border-none bg-white h-32 outline-none" value={reviewForm.comment} onChange={e => setReviewForm({...reviewForm, comment: e.target.value})} />
                    <Button type="submit" className="bg-black text-white text-[10px] h-14 px-10 uppercase font-bold tracking-widest">Submit Feedback</Button>
                  </form>
                )}

                <div className="space-y-12">
                  {reviews.map(r => (
                    <div key={r.id} className="border-b border-zinc-50 pb-8">
                      <div className="flex text-[#F4C430] mb-3">
                        {[...Array(5)].map((_, i) => <Star key={i} size={10} className={i < r.rating ? 'fill-current' : 'text-zinc-200'} />)}
                      </div>
                      <p className="text-sm text-zinc-800 font-medium mb-4 italic">"{r.comment}"</p>
                      {/* 🔥 Display Review Image */}
                      {r.image && <img src={r.image} className="w-24 aspect-[3/4] object-cover mb-4 border border-zinc-100" alt="Review" />}
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">— {r.user_name}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WatchAndBuyDetails;