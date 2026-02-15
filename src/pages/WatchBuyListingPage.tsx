import { useState, useEffect, useMemo } from 'react';
import { SlidersHorizontal, Loader2, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WatchBuyCard from '@/components/product/WatchBuyCard';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { storeService } from '@/services/api';

const WatchBuyListingPage = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [maxPrice, setMaxPrice] = useState(20000);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  // 🔥 Add state for selected colors
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const loadVideos = async () => {
      setLoading(true);
      try {
        const data = await storeService.getWatchBuyProducts();
        setVideos(data);
        if (data.length > 0) {
          const high = Math.max(...data.map((v: any) => Number(v.price)));
          setMaxPrice(high);
        }
      } catch (err) {
        console.error("Video Listing Load Error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadVideos();
  }, []);

  const filterOptions = useMemo(() => {
    const sizes = new Set<string>();
    // 🔥 Add a Set for colors
    const colors = new Set<string>();
    let absMax = 0;
    videos.forEach(v => {
      if (Number(v.price) > absMax) absMax = Number(v.price);
      v.variants?.forEach((variant: any) => {
        if (variant.size) sizes.add(variant.size);
        // 🔥 Extract colors from variants
        if (variant.color) colors.add(variant.color);
      });
    });
    return { 
        sizes: Array.from(sizes).sort(), 
        colors: Array.from(colors).sort(), 
        absMax 
    };
  }, [videos]);

  const filteredVideos = useMemo(() => {
    let res = [...videos].filter(v => Number(v.price) <= maxPrice);
    
    if (selectedSizes.length > 0) {
      res = res.filter(v => v.variants?.some((varnt: any) => selectedSizes.includes(varnt.size)));
    }
    
    // 🔥 Add the color filtering logic
    if (selectedColors.length > 0) {
      res = res.filter(v => v.variants?.some((varnt: any) => selectedColors.includes(varnt.color)));
    }

    if (sortBy === 'price-low') res.sort((a, b) => Number(a.price) - Number(b.price));
    if (sortBy === 'price-high') res.sort((a, b) => Number(b.price) - Number(a.price));
    return res;
  }, [videos, maxPrice, selectedSizes, selectedColors, sortBy]);

  const FilterSidebar = () => (
    <div className="space-y-12 py-4">
      <div>
        <h4 className="font-black uppercase text-[11px] tracking-[0.2em] mb-6 text-black">Budget: Up to ₹{maxPrice}</h4>
        <Slider value={[maxPrice]} onValueChange={(v) => setMaxPrice(v[0])} min={0} max={filterOptions.absMax || 20000} step={500} />
      </div>

      {/* 🔥 NEW: Color Filter UI */}
      {filterOptions.colors.length > 0 && (
        <div>
          <h4 className="font-black uppercase text-[11px] tracking-[0.2em] mb-4 text-black">Colors</h4>
          <div className="flex flex-wrap gap-2">
            {filterOptions.colors.map(c => (
              <button 
                key={c} 
                onClick={() => setSelectedColors(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c])} 
                className={`px-4 py-2 rounded-full text-[10px] font-black border transition-all 
                  ${selectedColors.includes(c) 
                    ? 'bg-black text-white border-black shadow-lg' 
                    : 'bg-zinc-50 text-zinc-400 border-transparent hover:border-zinc-200'}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {filterOptions.sizes.length > 0 && (
        <div>
          <h4 className="font-black uppercase text-[11px] tracking-[0.2em] mb-4 text-black">Size</h4>
          <div className="grid grid-cols-2 gap-3">
            {filterOptions.sizes.map(s => (
              <label key={s} className="flex items-center gap-3 cursor-pointer group">
                <Checkbox 
                   checked={selectedSizes.includes(s)} 
                   onCheckedChange={(c) => c ? setSelectedSizes([...selectedSizes, s]) : setSelectedSizes(selectedSizes.filter(x => x !== s))} 
                />
                <span className="text-[12px] font-bold text-zinc-500 group-hover:text-black uppercase">{s}</span>
              </label>
            ))}
          </div>
        </div>
      )}
      
      <button 
        onClick={() => {
            setSelectedSizes([]); 
            setSelectedColors([]); // 🔥 Reset colors too
            setMaxPrice(filterOptions.absMax || 20000);
        }} 
        className="text-[10px] font-black uppercase tracking-widest text-pink-500 underline underline-offset-4"
      >
        Reset Filters
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24 md:pt-40 pb-16 px-4 max-w-[1440px] mx-auto">
        <div className="mb-12">
            <Link to="/" className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-6 hover:text-black transition-colors">
               <ChevronLeft size={14} className="mr-1" /> Back
            </Link>
            <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-black leading-none">Watch & Buy</h1>
            <p className="text-zinc-400 text-xs font-bold uppercase tracking-[0.3em] mt-4">{filteredVideos.length} Video Looks</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          <aside className="hidden lg:block w-72 shrink-0 border-r border-zinc-100 pr-10">
            <div className="sticky top-40"><FilterSidebar /></div>
          </aside>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-10 pb-6 border-b border-zinc-100">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden border-black text-black h-12 rounded-none px-6 text-[10px] font-black uppercase tracking-[0.2em]">
                    <SlidersHorizontal size={14} className="mr-2" /> Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[320px] bg-white">
                  <SheetHeader className="mb-10 text-left border-b border-zinc-100 pb-6">
                    <SheetTitle className="font-black uppercase text-3xl tracking-tighter">Refine Videos</SheetTitle>
                  </SheetHeader>
                  <FilterSidebar />
                </SheetContent>
              </Sheet>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 border-zinc-200 h-12 rounded-none text-[10px] font-black uppercase tracking-[0.2em]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-40 gap-4">
                  <Loader2 className="animate-spin text-pink-500 w-10 h-10" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Loading Looks</span>
                </div>
            ) : (
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-12">
                {filteredVideos.map((item, index) => (
                  <WatchBuyCard 
                    key={item.id} 
                    item={item} 
                    index={index} 
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WatchBuyListingPage;