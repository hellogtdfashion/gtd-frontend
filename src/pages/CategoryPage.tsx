import { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Loader2, X, Check, ChevronDown } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { storeService } from '@/services/api';

const CategoryPage = () => {
  const { category, collection } = useParams();
  const [searchParams] = useSearchParams();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState<any>(null);
  
  const [maxPrice, setMaxPrice] = useState(10000);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch category info for the header title
        const allCategories = await storeService.getCategories();
        const currentCat = allCategories.find((c: any) => c.slug === category);
        setCategoryData(currentCat);

        const params: any = {};
        
        // 🔥 PRIORITY FILTERING LOGIC: 
        // Ensures URLs like /category/lehengas fetch based on your "Ticked" checkboxes
        if (category === 'lehengas') {
            params.is_featured_lehenga = 'true';
        } else if (category === 'sarees') {
            params.is_saree_collection = 'true';
        } else if (category === 'kids') {
            params.is_kids_collection = 'true';
        } else if (collection === 'best-sellers') {
            params.is_best_seller = 'true';
        } else if (collection === 'new-arrivals') {
            params.is_new_arrival = 'true';
        } else if (category && category !== 'all') {
            params.category = category;
        }
        
        const data = await storeService.getProducts(params);
        const fetched = data.results || data;
        setProducts(fetched);

        if (fetched.length > 0) {
            const high = Math.max(...fetched.map((p: any) => Number(p.price)));
            setMaxPrice(high);
        }
      } catch (err) { 
          console.error("Collection Load Error:", err); 
      } finally { 
          setLoading(false); 
      }
    };
    loadData();
  }, [category, collection]);

  const filterOptions = useMemo(() => {
    const sizes = new Set<string>();
    const colors = new Set<string>();
    let maxP = 0;
    products.forEach(p => {
      if (Number(p.price) > maxP) maxP = Number(p.price);
      p.variants?.forEach((v: any) => {
        if (v.size_name) sizes.add(v.size_name);
        if (v.color_name) colors.add(v.color_name);
      });
    });
    return { sizes: Array.from(sizes).sort(), colors: Array.from(colors).sort(), absMax: maxP };
  }, [products]);

  const filteredProducts = useMemo(() => {
    let res = [...products].filter(p => Number(p.price) <= maxPrice);
    if (selectedSizes.length > 0) res = res.filter(p => p.variants?.some((v: any) => selectedSizes.includes(v.size_name)));
    if (selectedColors.length > 0) res = res.filter(p => p.variants?.some((v: any) => selectedColors.includes(v.color_name)));
    if (sortBy === 'price-low') res.sort((a, b) => Number(a.price) - Number(b.price));
    if (sortBy === 'price-high') res.sort((a, b) => Number(b.price) - Number(a.price));
    return res;
  }, [products, maxPrice, selectedSizes, selectedColors, sortBy]);

  const FilterSidebar = () => (
    <div className="space-y-12 py-4">
      <div>
        <h4 className="font-black uppercase text-[11px] tracking-[0.2em] mb-6 text-black">Budget: Up to ₹{maxPrice}</h4>
        <Slider value={[maxPrice]} onValueChange={(v) => setMaxPrice(v[0])} min={0} max={filterOptions.absMax || 10000} step={100} className="cursor-pointer" />
      </div>

      {filterOptions.colors.length > 0 && (
        <div>
          <h4 className="font-black uppercase text-[11px] tracking-[0.2em] mb-4 text-black">Colors</h4>
          <div className="flex flex-wrap gap-2">
            {filterOptions.colors.map(c => (
              <button key={c} onClick={() => setSelectedColors(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c])} 
                className={`px-4 py-2 rounded-full text-[10px] font-black border transition-all ${selectedColors.includes(c) ? 'bg-black text-white border-black shadow-lg' : 'bg-zinc-50 text-zinc-400 border-transparent hover:border-zinc-200'}`}>
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
                <Checkbox checked={selectedSizes.includes(s)} onCheckedChange={(c) => c ? setSelectedSizes([...selectedSizes, s]) : setSelectedSizes(selectedSizes.filter(x => x !== s))} />
                <span className="text-[12px] font-bold text-zinc-500 group-hover:text-black uppercase tracking-tight">{s}</span>
              </label>
            ))}
          </div>
        </div>
      )}
      
      <button onClick={() => {setSelectedSizes([]); setSelectedColors([]); setMaxPrice(filterOptions.absMax || 10000);}} className="text-[10px] font-black uppercase tracking-widest text-pink-500 underline underline-offset-4">
        Reset Filters
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24 md:pt-40 pb-16 px-4 max-w-[1440px] mx-auto">
        <div className="mb-12">
            <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-black leading-none">
              {collection ? collection.replace('-', ' ') : categoryData?.name || category}
            </h1>
            <p className="text-zinc-400 text-xs font-bold uppercase tracking-[0.3em] mt-4 ml-1">
                {filteredProducts.length} Curated Pieces
            </p>
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
                <SheetContent side="left" className="w-[320px] bg-white border-r-0 shadow-2xl">
                  <SheetHeader className="mb-10 text-left border-b border-zinc-100 pb-6">
                    <SheetTitle className="font-black uppercase text-3xl tracking-tighter">Refine</SheetTitle>
                  </SheetHeader>
                  <FilterSidebar />
                </SheetContent>
              </Sheet>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 border-zinc-200 h-12 rounded-none text-[10px] font-black uppercase tracking-[0.2em] focus:ring-black">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent className="rounded-none border-zinc-200">
                  <SelectItem value="newest" className="text-xs uppercase font-bold tracking-widest">Newest First</SelectItem>
                  <SelectItem value="price-low" className="text-xs uppercase font-bold tracking-widest">Price: Low to High</SelectItem>
                  <SelectItem value="price-high" className="text-xs uppercase font-bold tracking-widest">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-40 gap-4">
                    <Loader2 className="animate-spin text-pink-500 w-10 h-10" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Loading Collection</span>
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-40 text-center">
                    <p className="text-zinc-400 font-bold uppercase text-xs tracking-widest">No pieces match your current criteria.</p>
                    <button onClick={() => {setSelectedSizes([]); setSelectedColors([]); setMaxPrice(filterOptions.absMax || 10000);}} className="mt-6 text-black font-black uppercase text-[10px] tracking-widest underline underline-offset-8">
                        View Full Collection
                    </button>
                </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-16">
                {filteredProducts.map((p, i) => (
                    <ProductCard key={p.id} product={p} index={i} />
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

export default CategoryPage;