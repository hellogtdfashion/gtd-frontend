import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, SlidersHorizontal } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { products, categories, formatPrice } from '@/data/products';

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

const CategoryPage = () => {
  const { category, collection } = useParams();
  const [maxPrice, setMaxPrice] = useState(50000);
  const [selectedSubcategory, setSelectedSubcategory] = useState('All');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const isCollection = Boolean(collection);
  const pageTitle = isCollection 
    ? (collection === 'best-sellers' ? 'Best Sellers' : 'Watch & Buy')
    : categories.find(c => c.slug === category)?.name || 'Products';

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      if (collection === 'best-sellers') {
        if (p.badge !== 'bestseller') return false;
      } else if (collection === 'watch-and-buy' || collection === 'instagram-picks') {
        if (!p.isInstagramPick) return false;
      } else if (!isCollection && category && category !== 'all' && p.category !== category) {
      return false;
    }

      if (p.price > maxPrice) return false;
      if (selectedSubcategory !== 'All' && p.subcategory !== selectedSubcategory) return false;
      if (selectedSizes.length > 0 && !p.sizes.some(s => selectedSizes.includes(s))) return false;
      
      return true;
    });

    if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);
    
    return result;
  }, [category, collection, maxPrice, selectedSubcategory, selectedSizes, isCollection, sortBy]);

  const FilterSidebar = () => (
    <div className="space-y-10">
      <div>
        <h4 className="font-bold text-black mb-6 uppercase text-xs tracking-widest">Budget Range</h4>
        <Slider
          value={[maxPrice]}
          onValueChange={(val) => setMaxPrice(val[0])}
          min={500}
          max={50000}
          step={500}
          className="mb-4"
        />
        <div className="flex items-center justify-between font-bold text-[10px] text-black uppercase">
          <span>Min: ₹500</span>
          <span className="text-accent">Up to {formatPrice(maxPrice)}</span>
        </div>
      </div>

      <div>
        <h4 className="font-bold text-black mb-4 uppercase text-xs tracking-widest">Select Size</h4>
        <div className="grid grid-cols-2 gap-2">
          {sizes.map((size) => (
            <label key={size} className="flex items-center gap-2 cursor-pointer group">
              <Checkbox
                className="border-gray-300 data-[state=checked]:bg-black data-[state=checked]:border-black"
                checked={selectedSizes.includes(size)}
                onCheckedChange={(checked) => {
                  checked 
                    ? setSelectedSizes([...selectedSizes, size])
                    : setSelectedSizes(selectedSizes.filter(s => s !== size))
                }}
              />
              <span className="text-xs font-bold text-gray-600 group-hover:text-black transition-colors">{size}</span>
            </label>
          ))}
        </div>
      </div>

      <Button
        variant="ghost"
        className="w-full text-black font-bold hover:bg-gray-100 text-xs uppercase tracking-widest border border-black"
        onClick={() => {
          setMaxPrice(50000);
          setSelectedSizes([]);
          setSelectedSubcategory('All');
        }}
      >
        Clear Filters
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-32 pb-16">
        <div className="container-luxury mx-auto px-4">
          
          <div className="mb-12">
            <div className="flex items-center gap-2 text-gray-400 text-[10px] uppercase tracking-[0.2em] mb-4">
              <Link to="/" className="hover:text-black">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-black font-bold">{pageTitle}</span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-black uppercase tracking-tighter">
              {pageTitle}
            </h1>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-40">
                <FilterSidebar />
              </div>
            </aside>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden border-black text-black h-10 text-xs font-bold uppercase tracking-widest">
                      <SlidersHorizontal className="w-3 h-3 mr-2" /> Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader className="mb-8 border-b pb-4">
                      <SheetTitle className="font-display text-2xl uppercase font-bold">Refine</SheetTitle>
                    </SheetHeader>
                    <FilterSidebar />
                  </SheetContent>
                </Sheet>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 border-black h-10 text-[10px] font-bold uppercase tracking-widest">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">No products found in this range.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;