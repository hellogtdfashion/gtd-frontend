import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/product/ProductCard';
import { storeService } from "../../services/api";

const NewArrivals = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNew = async () => {
      try {
        // Fetching products flagged as new arrivals from the backend
        const data = await storeService.getProducts({ is_new_arrival: true });
        setProducts(data.results || data);
      } catch (err) {
        console.error("New Arrivals Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNew();
  }, []);

  if (loading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>;
  if (products.length === 0) return null;

  return (
    <section className="section-padding bg-secondary/30">
      <div className="container-luxury mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.6 }} 
          className="flex items-end justify-between mb-8"
        >
          <div>
            <h2 className="heading-section mt-2">New Arrivals</h2>
          </div>
          
          <div className="flex items-center">
            {/* 🔥 FIXED: Updated link to match the working collections route format */}
            <Link to="/collections/new-arrivals">
              <Button 
                variant="ghost" 
                className="group text-primary hover:bg-[#F4C430] hover:text-black font-black uppercase text-[10px] md:text-xs tracking-widest px-3 py-2 md:px-5 md:py-6 transition-all duration-300"
              >
                View All <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* 🔥 FIXED GRID: No more scrolling. 
            Mobile: 2 per row (grid-cols-2)
            Desktop: 4 per row (md:grid-cols-4)
        */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.slice(0, 4).map((product, index) => (
            <div key={product.id} className="w-full">
              <ProductCard product={product} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;