import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { storeService } from "../../services/api";
import { Loader2 } from "lucide-react";

const CategoryCircles = () => {
  const [featuredCategories, setFeaturedCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const data = await storeService.getCategories();
        // Only show categories marked as "featured" in Admin
        setFeaturedCategories(data.filter((cat: any) => cat.is_featured));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadFeatured();
  }, []);

  if (loading) return <div className="py-10 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <section className="pt-6 pb-10 md:pt-10 md:pb-16 bg-[#FFF8F8]">
      <div className="container-luxury mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-8 md:gap-x-10 md:gap-y-12">
          {featuredCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="flex-shrink-0"
            >
              <Link to={`/category/${category.slug}`} className="flex flex-col items-center group w-[75px] md:w-28 lg:w-32">
                <div className="relative p-1 rounded-full border border-primary/20 group-hover:border-primary group-hover:shadow-[0_0_15px_rgba(var(--primary),0.2)] transition-all duration-500">
                  <div className="w-16 h-16 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden shadow-sm">
                    {/* Using the dynamic image from Backend */}
                    <img
                      src={category.image} 
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125"
                    />
                  </div>
                </div>
                <h3 className="mt-3 text-center text-[10px] md:text-[12px] font-bold text-foreground group-hover:text-primary transition-colors uppercase tracking-tight leading-tight px-1">
                  {category.name}
                </h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryCircles;