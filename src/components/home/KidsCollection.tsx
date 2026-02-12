import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/product/ProductCard';
import { storeService } from "../../services/api";

const KidsCollection = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // 🔥 Fetching based on the new admin checkbox
        const data = await storeService.getProducts({ is_kids_collection: 'true' });
        setProducts(data.results || data);
      } catch (err) {
        console.error("Kids Load Error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <section id="kids" className="section-padding bg-[#FFF9F0] border-t border-pink-50">
      <div className="container-luxury mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-8 px-1"
        >
          <div>
            <span className="text-[10px] font-black text-pink-500 uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="w-3 h-3" /> Little Royalty
            </span>
            <h2 className="heading-section mt-1 text-black">Kids Collection</h2>
          </div>
          <div className="flex items-center">
            <Link to="/category/kids">
              <Button variant="ghost" className="group text-black hover:bg-[#F4C430] font-black uppercase text-[10px] md:text-xs tracking-widest px-3 py-2 transition-all">
                View All <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {products.slice(0, 4).map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default KidsCollection;