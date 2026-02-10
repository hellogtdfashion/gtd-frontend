import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const ExploreAll = () => {
  return (
    <section className="py-12 bg-[#FFF8F8] border-y border-pink-100/50">
      <div className="container-luxury mx-auto px-4">
        <div className="flex flex-col items-center justify-center text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif italic text-2xl md:text-3xl text-primary mb-2">
              The Complete Collection
            </h2>
            <p className="text-primary/60 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mb-8">
              Explore every thread of elegance
            </p>
            
            <Link to="/category/all">
              <Button className="bg-primary hover:bg-primary/90 text-white px-10 md:px-16 py-6 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] transition-transform hover:scale-105 shadow-lg h-auto">
                Explore All Products
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ExploreAll;