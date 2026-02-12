import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/product/ProductCard';
import { storeService } from "../../services/api";

const FeaturedLehengas = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // 🔥 Fetching based on the new admin checkbox
        const data = await storeService.getProducts({ is_featured_lehenga: 'true' });
        setProducts(data.results || data);
      } catch (err) {
        console.error("Lehengas Load Error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>;
  if (products.length === 0) return null;

  return (
    <section id="lehengas" className="section-padding bg-secondary/30 overflow-hidden">
      <div className="container-luxury mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-8 px-1"
        >
          <div>
            <h2 className="heading-section mt-2">Featured Lehengas</h2>
          </div>
          <div className="flex items-center">
            <Link to="/category/lehengas">
              <Button variant="ghost" className="group text-primary hover:bg-[#F4C430] hover:text-black font-black uppercase text-[10px] md:text-xs tracking-widest px-3 py-2 transition-all">
                View All <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* 2 per row on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {products.slice(0, 4).map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedLehengas;