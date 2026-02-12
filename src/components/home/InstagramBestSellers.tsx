import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/product/ProductCard';
import { storeService } from "../../services/api";

const BestSellers = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        // Fetching best sellers from the dynamic backend endpoint
        const data = await storeService.getProducts({ is_best_seller: true });
        setProducts(data.results || data);
      } catch (err) {
        console.error("Best Sellers Load Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBestSellers();
  }, []);

  if (loading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>;
  if (products.length === 0) return null;

  return (
    <section className="section-padding bg-background">
      <div className="container-luxury mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.6 }} 
          className="flex items-end justify-between mb-8 px-1"
        >
          <div>
            <h2 className="heading-section mt-2">Best Sellers</h2>
          </div>
          
          <div className="flex items-center">
            <Link to="/collections/best-sellers">
              <Button 
                variant="ghost" 
                className="group text-primary hover:bg-[#F4C430] hover:text-black font-black uppercase text-[10px] md:text-xs tracking-widest px-3 py-2 md:px-5 md:py-6 transition-all duration-300"
              >
                View All <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* MOBILE: 2 Columns Grid (Top 4 items)
            DESKTOP: Horizontal scroll (flex)
        */}
        <div className="grid grid-cols-2 md:flex md:overflow-x-auto gap-3 md:gap-6 scrollbar-hide pb-4">
          {products.map((product, index) => (
            <div 
              key={product.id} 
              className={`w-full md:w-72 md:flex-shrink-0 ${index >= 4 ? 'hidden md:block' : ''}`}
            >
              <ProductCard product={product} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSellers;