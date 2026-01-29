import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, Heart, ShoppingBag, Menu, X, Home, Grid3X3, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navigation = [
  { name: 'Women', href: '/category/women', subcategories: ['Sarees', 'Lehengas', 'Kurta Sets'] },
  { name: 'Men', href: '/category/mens-ethnic', subcategories: ['Kurtas', 'Sherwanis', 'Nehru Jackets'] },
  { name: 'Kids', href: '/category/kids', subcategories: ['Girls', 'Boys'] },
  { name: 'Jewellery', href: '/category/jewellery', subcategories: ['Traditional', 'Kundan', 'Temple'] },
  { name: 'Collections', href: '/collections', subcategories: ['New Arrivals', 'Best Sellers', 'Instagram Picks'] },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      {/* Desktop Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-background/95 backdrop-blur-md shadow-luxury py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="container-luxury mx-auto px-4 md:px-8 lg:px-16">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex flex-col items-center"
              >
                <h1 className="font-display text-xl md:text-2xl lg:text-3xl font-semibold tracking-wide text-foreground">
                  Glorious Threads
                </h1>
                <span className="text-xs md:text-sm tracking-[0.3em] text-accent font-medium uppercase">
                  by Divya
                </span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navigation.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => setHoveredNav(item.name)}
                  onMouseLeave={() => setHoveredNav(null)}
                >
                  <Link
                    to={item.href}
                    className="flex items-center gap-1 font-body text-sm tracking-wide text-foreground hover:text-primary transition-colors py-2"
                  >
                    {item.name}
                    {item.subcategories && (
                      <ChevronDown className="w-3 h-3 transition-transform" />
                    )}
                  </Link>
                  
                  {/* Dropdown */}
                  <AnimatePresence>
                    {hoveredNav === item.name && item.subcategories && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-48 bg-card rounded-lg shadow-luxury-hover border border-border overflow-hidden"
                      >
                        {item.subcategories.map((sub) => (
                          <Link
                            key={sub}
                            to={`${item.href}/${sub.toLowerCase().replace(' ', '-')}`}
                            className="block px-4 py-3 text-sm text-foreground hover:bg-secondary hover:text-primary transition-colors"
                          >
                            {sub}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {/* Right Icons */}
            <div className="flex items-center gap-2 md:gap-4">
              <Button variant="ghost" size="icon" className="hidden md:flex hover:text-primary transition-colors">
                <Search className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hidden md:flex hover:text-primary transition-colors">
                <User className="w-5 h-5" />
              </Button>
              <Link to="/wishlist">
                <Button variant="ghost" size="icon" className="relative hover:text-primary transition-colors">
                  <Heart className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center">
                    3
                  </span>
                </Button>
              </Link>
              <Link to="/cart">
                <Button variant="ghost" size="icon" className="relative hover:text-primary transition-colors">
                  <ShoppingBag className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center">
                    2
                  </span>
                </Button>
              </Link>
              
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-80 p-0">
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-xl font-semibold">Glorious Threads</h2>
                  <span className="text-xs tracking-[0.2em] text-accent uppercase">by Divya</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
            
            <nav className="flex-1 p-4 overflow-y-auto">
              {navigation.map((item) => (
                <div key={item.name} className="mb-4">
                  <Link
                    to={item.href}
                    className="block font-body text-lg font-medium text-foreground py-2 hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                  {item.subcategories && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.subcategories.map((sub) => (
                        <Link
                          key={sub}
                          to={`${item.href}/${sub.toLowerCase().replace(' ', '-')}`}
                          className="block text-sm text-muted-foreground py-1.5 hover:text-primary transition-colors"
                        >
                          {sub}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
            
            <div className="p-4 border-t border-border">
              <div className="flex gap-4">
                <Button variant="ghost" size="icon">
                  <Search className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <User className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border z-50 px-2 py-2">
        <div className="flex items-center justify-around">
          <Link to="/" className="flex flex-col items-center py-1 px-3">
            <Home className="w-5 h-5 text-foreground" />
            <span className="text-[10px] mt-1 text-muted-foreground">Home</span>
          </Link>
          <button className="flex flex-col items-center py-1 px-3" onClick={() => setIsMobileMenuOpen(true)}>
            <Grid3X3 className="w-5 h-5 text-foreground" />
            <span className="text-[10px] mt-1 text-muted-foreground">Categories</span>
          </button>
          <Link to="/wishlist" className="flex flex-col items-center py-1 px-3 relative">
            <Heart className="w-5 h-5 text-foreground" />
            <span className="text-[10px] mt-1 text-muted-foreground">Wishlist</span>
            <span className="absolute top-0 right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center">
              3
            </span>
          </Link>
          <Link to="/profile" className="flex flex-col items-center py-1 px-3">
            <User className="w-5 h-5 text-foreground" />
            <span className="text-[10px] mt-1 text-muted-foreground">Profile</span>
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Header;
