import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Filter, SlidersHorizontal, Grid3X3, LayoutGrid, X } from 'lucide-react';
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

import categorySarees from '@/assets/category-sarees.jpg';
import categoryLehengas from '@/assets/category-lehengas.jpg';
import categoryKurtas from '@/assets/category-kurtas.jpg';
import categoryMens from '@/assets/category-mens.jpg';
import categoryKids from '@/assets/category-kids.jpg';
import categoryJewellery from '@/assets/category-jewellery.jpg';

const categoryBanners: Record<string, string> = {
  sarees: categorySarees,
  lehengas: categoryLehengas,
  'kurta-sets': categoryKurtas,
  'mens-ethnic': categoryMens,
  kids: categoryKids,
  jewellery: categoryJewellery,
};

const subcategoryFilters: Record<string, string[]> = {
  sarees: ['All', 'Silk Sarees', 'Cotton Sarees', 'Party Wear', 'With Blouse'],
  lehengas: ['All', 'Bridal', 'Party Wear', 'Festive'],
  'kurta-sets': ['All', 'Anarkali', 'Straight Cut', 'A-Line'],
  'mens-ethnic': ['All', 'Kurtas', 'Sherwanis', 'Nehru Jackets'],
  kids: ['All', 'Girls', 'Boys'],
  jewellery: ['All', 'Traditional', 'Kundan', 'Temple'],
};

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];
const colors = [
  { name: 'Pink', hex: '#FF69B4' },
  { name: 'Red', hex: '#DC143C' },
  { name: 'Blue', hex: '#4169E1' },
  { name: 'Green', hex: '#228B22' },
  { name: 'Gold', hex: '#D4AF37' },
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
];

const CategoryPage = () => {
  const { category = 'sarees' } = useParams();
  const [priceRange, setPriceRange] = useState([500, 30000]);
  const [selectedSubcategory, setSelectedSubcategory] = useState('All');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'large'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categoryData = categories.find((c) => c.slug === category);
  const categoryName = categoryData?.name || category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ');
  const bannerImage = categoryBanners[category] || categorySarees;
  const subcategories = subcategoryFilters[category] || ['All'];

  // Filter products
  let filteredProducts = products.filter((p) => {
    // Category filter
    const categoryMatch = p.category === category || 
      (category === 'women' && ['sarees', 'lehengas', 'kurta-sets'].includes(p.category));
    
    // Price filter
    const priceMatch = p.price >= priceRange[0] && p.price <= priceRange[1];
    
    // Subcategory filter
    const subcategoryMatch = selectedSubcategory === 'All' || p.subcategory === selectedSubcategory;
    
    return categoryMatch && priceMatch && subcategoryMatch;
  });

  // Sort products
  filteredProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'popularity':
        return b.reviewCount - a.reviewCount;
      default:
        return 0;
    }
  });

  const FilterSidebar = () => (
    <div className="space-y-8">
      {/* Price Range */}
      <div>
        <h4 className="font-display font-medium mb-4">Price Range</h4>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          min={500}
          max={30000}
          step={500}
          className="mb-4"
        />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{formatPrice(priceRange[0])}</span>
          <span>{formatPrice(priceRange[1])}</span>
        </div>
      </div>

      {/* Size */}
      <div>
        <h4 className="font-display font-medium mb-4">Size</h4>
        <div className="space-y-3">
          {sizes.map((size) => (
            <label key={size} className="flex items-center gap-3 cursor-pointer">
              <Checkbox
                checked={selectedSizes.includes(size)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedSizes([...selectedSizes, size]);
                  } else {
                    setSelectedSizes(selectedSizes.filter((s) => s !== size));
                  }
                }}
              />
              <span className="text-sm">{size}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <h4 className="font-display font-medium mb-4">Color</h4>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color.name}
              onClick={() => {
                if (selectedColors.includes(color.name)) {
                  setSelectedColors(selectedColors.filter((c) => c !== color.name));
                } else {
                  setSelectedColors([...selectedColors, color.name]);
                }
              }}
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                selectedColors.includes(color.name)
                  ? 'border-accent scale-110'
                  : 'border-border'
              }`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          setPriceRange([500, 30000]);
          setSelectedSizes([]);
          setSelectedColors([]);
          setSelectedSubcategory('All');
        }}
      >
        Clear All Filters
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20 pb-20 lg:pb-8">
        {/* Category Banner */}
        <div className="relative h-48 md:h-64 overflow-hidden">
          <img
            src={bannerImage}
            alt={categoryName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/80 to-brand-dark/40" />
          <div className="absolute inset-0 flex items-center">
            <div className="container-luxury mx-auto px-4 md:px-8 lg:px-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-white/70 text-sm mb-3">
                  <Link to="/" className="hover:text-white transition-colors">Home</Link>
                  <ChevronRight className="w-4 h-4" />
                  <span className="text-white">{categoryName}</span>
                </div>
                <h1 className="heading-display text-white">{categoryName}</h1>
                <p className="text-white/70 mt-2">{filteredProducts.length} products</p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Subcategory Pills */}
        <div className="sticky top-16 md:top-20 bg-background/95 backdrop-blur-md z-30 border-b border-border">
          <div className="container-luxury mx-auto px-4 md:px-8 lg:px-16 py-4">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {subcategories.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubcategory(sub)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    selectedSubcategory === sub
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-foreground hover:bg-secondary/80'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="container-luxury mx-auto px-4 md:px-8 lg:px-16 py-8">
          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-40">
                <div className="flex items-center gap-2 mb-6">
                  <Filter className="w-5 h-5 text-accent" />
                  <h3 className="font-display text-lg font-medium">Filters</h3>
                </div>
                <FilterSidebar />
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  {/* Mobile Filter Button */}
                  <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="lg:hidden">
                        <SlidersHorizontal className="w-4 h-4 mr-2" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80">
                      <SheetHeader>
                        <SheetTitle className="flex items-center gap-2">
                          <Filter className="w-5 h-5 text-accent" />
                          Filters
                        </SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <FilterSidebar />
                      </div>
                    </SheetContent>
                  </Sheet>

                  {/* View Mode Toggle */}
                  <div className="hidden md:flex items-center gap-1 border border-border rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded ${viewMode === 'grid' ? 'bg-secondary' : ''}`}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('large')}
                      className={`p-2 rounded ${viewMode === 'large' ? 'bg-secondary' : ''}`}
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40 md:w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="popularity">Popularity</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Active Filters */}
              {(selectedSizes.length > 0 || selectedColors.length > 0) && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedSizes.map((size) => (
                    <span
                      key={size}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-secondary rounded-full text-sm"
                    >
                      {size}
                      <button onClick={() => setSelectedSizes(selectedSizes.filter((s) => s !== size))}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {selectedColors.map((color) => (
                    <span
                      key={color}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-secondary rounded-full text-sm"
                    >
                      {color}
                      <button onClick={() => setSelectedColors(selectedColors.filter((c) => c !== color))}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Products */}
              <div className={`grid gap-4 md:gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1 md:grid-cols-2'
              }`}>
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>

              {/* No Results */}
              {filteredProducts.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-muted-foreground">No products found matching your filters.</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setPriceRange([500, 30000]);
                      setSelectedSizes([]);
                      setSelectedColors([]);
                      setSelectedSubcategory('All');
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}

              {/* Pagination */}
              {filteredProducts.length > 0 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="default" size="sm">1</Button>
                  <Button variant="outline" size="sm">2</Button>
                  <Button variant="outline" size="sm">3</Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
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
