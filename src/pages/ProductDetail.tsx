import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Minus, Plus, ChevronRight, Loader2, Truck, RotateCcw, Camera, Heart, Share2 } from 'lucide-react';
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
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedColor, setSelectedColor] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [displayPrice, setDisplayPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);

  // 🔥 UPDATED REVIEW STATE
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
        if (data.colors?.length > 0) {
          const initialColor = data.colors[0];
          setSelectedColor(initialColor);
          setCurrentImage(0);
          if (initialColor.sizes?.length > 0) {
            setSelectedSize(initialColor.sizes[0].size);
            setDisplayPrice(Number(initialColor.sizes[0].price));
          }
        } else {
          setDisplayPrice(Number(data.price));
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    loadData();
  }, [slug]);

  useEffect(() => {
    if (selectedSize && selectedColor) {
      const sizeObj = selectedColor.sizes.find((s: any) => s.size === selectedSize);
      if (sizeObj) setDisplayPrice(Number(sizeObj.price));
      else {
        const firstAvailable = selectedColor.sizes[0];
        if (firstAvailable) {
          setSelectedSize(firstAvailable.size);
          setDisplayPrice(Number(firstAvailable.price));
        }
      }
    }
  }, [selectedSize, selectedColor]);

  const displayImages = useMemo(() => {
    if (!product || !selectedColor) return [];
    const filtered = product.images.filter((img: any) => img.color === selectedColor.id || !img.color);
    return filtered.length > 0 ? filtered : product.images;
  }, [product, selectedColor]);

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
    // 🔥 Ensure you use the submitReview method which has the multipart/form-data header
    await storeService.addReview(slug!, formData); 
    toast.success("Review posted! It will appear shortly.");
    setShowReviewForm(false);
    setReviewForm({ name: '', rating: 5, comment: '', image: null }); // Reset form
    
    // Refresh reviews
    const updated = await storeService.getReviews(slug!);
    setReviews(updated.results || updated);
  } catch (err: any) { 
    console.error("Review Error:", err);
    toast.error(err.detail || "Error posting review"); 
  }
  };

  const savings = product?.original_price ? Math.floor(product.original_price - displayPrice) : 0;

  if (loading) return <div className="h-screen flex justify-center items-center"><Loader2 className="animate-spin text-pink-500" /></div>;
  if (!product) return null;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-16 md:pt-28 pb-10">
        <div className="max-w-[1400px] mx-auto px-4 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            <div className="lg:col-span-7 space-y-4">
              <div className="aspect-[3/4] bg-zinc-50 relative overflow-hidden group">
                <img src={displayImages[currentImage]?.url} className="w-full h-full object-cover transition-opacity duration-300" alt="" />
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <button className="bg-white/90 p-3 rounded-full shadow-sm hover:bg-zinc-100"><Heart size={18} /></button>
                  <button className="bg-white/90 p-3 rounded-full shadow-sm hover:bg-zinc-100"><Share2 size={18} /></button>
                </div>
              </div>
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {displayImages.map((img: any, i: number) => (
                  <button key={i} onClick={() => setCurrentImage(i)} className={`shrink-0 w-20 aspect-[3/4] border-2 transition-all ${currentImage === i ? 'border-black' : 'border-transparent opacity-40'}`}>
                    <img src={img.url} className="w-full h-full object-cover" alt="" />
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col pt-2">
              <div className="mb-6">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-800 mb-1">{product.title}</h1>
                <p className="text-sm text-zinc-400 font-medium uppercase tracking-widest mb-4">{product.category_name}</p>
                <div className="flex items-center gap-3 py-4 border-y border-zinc-100">
                  <span className="text-2xl font-extrabold text-black">₹{displayPrice}</span>
                  {product.original_price && (
                    <>
                      <span className="text-lg text-zinc-300 line-through">₹{product.original_price}</span>
                      <span className="text-pink-500 font-extrabold text-sm uppercase">₹{savings} OFF</span>
                    </>
                  )}
                </div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase mt-2 tracking-widest">Inclusive of all taxes</p>
              </div>

              <div className="mb-8">
                <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-700 block mb-4">Select Color</span>
                <div className="flex gap-3">
                  {product.colors.map((c: any) => (
                    <button key={c.name} onClick={() => {setSelectedColor(c); setCurrentImage(0);}} className={`w-14 h-18 border-2 transition-all overflow-hidden ${selectedColor?.name === c.name ? 'border-black' : 'border-zinc-100 opacity-60'}`}>
                      <img src={product.images.find((i:any)=>i.color === c.id || i.color_name === c.name)?.url || product.images[0].url} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <div className="flex justify-between mb-4">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-700">Size</span>
                  <button className="text-[10px] font-bold underline uppercase">Guide</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedColor?.sizes.map((s: any) => (
                    <button key={s.size} onClick={() => setSelectedSize(s.size)} disabled={!s.inStock} className={`h-12 px-6 border-2 font-bold text-xs transition-all ${selectedSize === s.size ? 'bg-black text-white border-black' : 'bg-white border-zinc-100 hover:border-black'} ${!s.inStock ? 'opacity-20 cursor-not-allowed' : ''}`}>
                      {s.size}
                    </button>
                  ))}
                </div>
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
                <Button onClick={() => addToCart(product, quantity, selectedSize, selectedColor)} variant="outline" className="btn-premium border-zinc-900 text-zinc-900">Add to Bag</Button>
                <Button onClick={() => { addToCart(product, quantity, selectedSize, selectedColor); navigate('/cart'); }} className="btn-premium bg-zinc-900 text-white">Buy Now</Button>
              </div>

              <div className="space-y-4 pt-8 border-t border-zinc-50 text-[11px] font-bold uppercase tracking-widest text-zinc-500">
                <div className="flex items-center gap-3"><Truck size={18} strokeWidth={1.5} /> Free Shipping & Returns</div>
                <div className="flex items-center gap-3"><RotateCcw size={18} strokeWidth={1.5}/> 100% Quality Guaranteed</div>
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
                <p>{product.description}</p>
                <div className="grid grid-cols-2 gap-4 pt-6">
                  {product.features?.split('\n').map((f:any, i:any) => (
                    <div key={i} className="flex items-center gap-2 text-[10px] font-bold uppercase text-zinc-400">
                      <div className="w-1 h-1 bg-pink-500 rounded-full" /> {f}
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* 🔥 UPDATED REVIEWS CONTENT */}
              <TabsContent value="reviews">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-sm font-bold uppercase tracking-widest">User Experiences</h3>
                  <button onClick={() => setShowReviewForm(!showReviewForm)} className="text-[10px] font-black underline uppercase">
                    {showReviewForm ? "Cancel" : "Write a Review"}
                  </button>
                </div>

                {showReviewForm && (
                  <form onSubmit={handleReviewSubmit} className="bg-zinc-50 p-8 mb-12 space-y-6 animate-in fade-in">
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

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Product Photo (Optional)</label>
                      <div onClick={() => fileInputRef.current?.click()} className="w-full py-10 border-2 border-dashed border-zinc-200 bg-white flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-zinc-50 transition-colors">
                        <Camera size={24} className="text-zinc-400" />
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                          {reviewForm.image ? reviewForm.image.name : "Click to upload a photo"}
                        </span>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
    // 🔥 FIX: Use e.target.files[0] to get the actual file object
    const file = e.target.files ? e.target.files[0] : null;
    setReviewForm({ ...reviewForm, image: file }); 
  }} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Your Comment</label>
                      <textarea placeholder="Tell us about the fit and quality..." required className="w-full p-4 text-xs border-none bg-white h-32 outline-none" value={reviewForm.comment} onChange={e => setReviewForm({...reviewForm, comment: e.target.value})} />
                    </div>

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
                      {r.image && <img 
    src={r.image} 
    className="w-24 h-32 object-cover rounded-lg mb-4" 
    alt="Review" 
    onError={(e) => console.log("Broken image link:", r.image)} 
  />}
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

export default ProductDetail;