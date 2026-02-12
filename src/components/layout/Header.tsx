import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, ShoppingBag, Menu, X, ArrowUpRight, ChevronRight, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import logo from '@/assets/logo.png'; 
import { useCart } from '@/context/CartContext';
import { storeService } from "../../services/api";

const Header = () => {
  const [navData, setNavData] = useState<any[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [productResults, setProductResults] = useState<any[]>([]);
  const [categoryResults, setCategoryResults] = useState<any[]>([]);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems } = useCart();
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const isLoggedIn = !!localStorage.getItem("userToken");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await storeService.getCategories();
        setNavData(data);
      } catch (err) {
        console.error("Nav Load Error", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      const query = searchQuery.toLowerCase().trim();
      if (query.length > 1) {
        try {
          const results = await storeService.searchEverything(query);
          setProductResults(results.products || []);
          setCategoryResults(results.categories || []);
        } catch (err) {
          console.error("Search error", err);
        }
      } else {
        setProductResults([]);
        setCategoryResults([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleResultClick = (href: string) => {
    navigate(href);
    setSearchQuery('');
    setIsMobileSearchOpen(false);
  };

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMobileSearchOpen(false);
  }, [location]);

  const SearchDropdown = () => (
    <AnimatePresence>
      {(productResults.length > 0 || categoryResults.length > 0) && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full left-0 right-0 bg-white mt-2 rounded-2xl shadow-2xl border border-pink-100 overflow-hidden z-[100] max-h-[400px] overflow-y-auto">
          {categoryResults.length > 0 && (
            <div className="p-3 border-b border-pink-50 bg-[#FFF8F8]/30">
              <p className="text-[10px] uppercase font-bold text-gray-400 mb-2 px-2 tracking-widest">Categories</p>
              {categoryResults.map(cat => (
                <button key={cat.id} onClick={() => handleResultClick(`/category/${cat.slug}`)} className="flex items-center justify-between w-full p-2 hover:bg-white rounded-lg text-sm text-gray-700 font-bold uppercase tracking-tight">
                  {cat.name} <ArrowUpRight className="w-3 h-3 text-primary" />
                </button>
              ))}
            </div>
          )}
          <div className="p-3 bg-white">
            <p className="text-[10px] uppercase font-bold text-gray-400 mb-2 px-2 tracking-widest">Products</p>
            {productResults.map(p => (
              <button key={p.id} onClick={() => handleResultClick(`/product/${p.slug}`)} className="flex items-center gap-3 w-full p-2 hover:bg-[#FFF8F8] rounded-xl text-left transition-colors">
                <img src={p.images?.[0]?.url || ''} className="w-10 h-12 object-cover rounded-lg" alt={p.name} />
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-800 uppercase tracking-tighter line-clamp-1">{p.name}</p>
                  <p className="text-[10px] text-primary font-bold">₹{p.price}</p>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="fixed top-0 left-0 right-0 z-50 font-sans">
      <header className="bg-white border-b border-pink-100 shadow-sm h-20 md:h-24 flex items-center">
        <div className="container mx-auto px-4 w-full flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild><Button variant="ghost" className="lg:hidden p-1 h-10 w-10"><Menu className="w-8 h-8 text-primary" /></Button></SheetTrigger>
              <SheetContent side="left" className="w-[85%] p-0 bg-white flex flex-col">
                <SheetHeader className="p-6 border-b border-pink-50 bg-[#FFF8F8] text-left">
                  <div className="flex items-center gap-3">
                    <img src={logo} className="h-12 w-12 rounded-full aspect-square object-contain bg-white shadow-sm border border-pink-50" alt="logo" />
                    <SheetTitle className="font-serif italic text-primary text-lg">GTD Fashion</SheetTitle>
                  </div>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto">
                  <nav className="flex flex-col">
                    {navData.map((item) => (
                      <div key={item.id} className="border-b border-pink-50/30">
                        <Link to={`/category/${item.slug}`} className="w-full flex items-center justify-between px-6 py-5 text-sm font-bold uppercase tracking-widest text-gray-700">
                          {item.name} <ChevronRight className="w-4 h-4 text-gray-300" />
                        </Link>
                      </div>
                    ))}
                  </nav>
                </div>
                <div className="p-6 border-t border-pink-50">
                    <Link to={isLoggedIn ? "/profile" : "/login"} className="flex items-center justify-between w-full p-4 bg-primary rounded-xl text-white shadow-lg">
                        <div className="flex items-center gap-3"><UserCircle className="w-6 h-6" /><span className="text-xs font-bold uppercase tracking-widest">{isLoggedIn ? "My Account" : "Login / Register"}</span></div>
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
              </SheetContent>
            </Sheet>
            <Link to="/" className="flex items-center gap-2">
                <img src={logo} alt="GTD Logo" className="h-10 w-10 md:h-12 md:w-12 rounded-full aspect-square object-contain border border-pink-50 bg-white" />
                <h1 className="font-serif italic text-[15px] md:text-[18px] font-medium text-primary whitespace-nowrap hidden sm:block">Glorious Threads by Divya</h1>
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-4 xl:gap-8 mx-auto">
            {navData.filter(c => c.is_navbar_visible).map((item) => (
              <Link key={item.id} to={`/category/${item.slug}`} className="text-[11px] font-bold uppercase tracking-widest text-gray-700 hover:text-primary py-4 transition-colors">
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-4 justify-end">
            <div className="hidden lg:flex relative w-48 xl:w-64">
                <Input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="h-9 pr-8 bg-gray-50 border-pink-100 focus:border-primary rounded-full text-xs font-bold" />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <SearchDropdown />
            </div>

            <Button variant="ghost" className="p-0 h-10 w-10 lg:hidden" onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}>
              {isMobileSearchOpen ? <X className="w-8 h-8 text-primary" /> : <Search className="w-8 h-8 text-primary" />}
            </Button>
            <Link to={isLoggedIn ? "/profile" : "/login"} className="hidden lg:flex h-10 w-10 items-center justify-center"><User className="w-7 h-7 text-primary hover:text-accent transition-colors" /></Link>
            <Link to="/cart" className="relative h-10 w-10 flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-primary hover:text-accent transition-colors" />
                {cartCount > 0 && <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] bg-accent text-white text-[10px] rounded-full flex items-center justify-center font-bold px-1 border-2 border-white">{cartCount}</span>}
            </Link>
          </div>
        </div>

        <AnimatePresence>
          {isMobileSearchOpen && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-pink-100 p-6 shadow-2xl z-50">
              <div className="relative">
                <Input autoFocus placeholder="What are you looking for?" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="h-14 pr-12 bg-gray-50 border-pink-100 rounded-xl font-bold text-lg" />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-primary" />
                <SearchDropdown />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </div>
  );
};

export default Header;