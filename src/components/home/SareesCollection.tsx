import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getProductsByCategory, formatPrice } from '@/data/products';

import productSaree1 from '@/assets/product-saree-1.jpg';
import categorySarees from '@/assets/category-sarees.jpg';

const filterPills = ['All', 'Silk', 'Cotton', 'Party Wear'];

const SareesCollection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sarees = getProductsByCategory('sarees');

  const sareeImages = [productSaree1, categorySarees, productSaree1, categorySarees, productSaree1, categorySarees];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 350;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="section-padding bg-background">
      <div className="container-luxury mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-8"
        >
          <div>
            <span className="text-accent font-body text-sm tracking-[0.3em] uppercase">
              Heritage Collection
            </span>
            <h2 className="heading-section mt-2">Timeless Drapes</h2>
            <p className="text-muted-foreground mt-2 max-w-md">
              From Banarasi to Kanjivaram, discover sarees that celebrate India's weaving traditions.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 mt-6 lg:mt-0">
            {/* Filter Pills */}
            <div className="flex gap-2">
              {filterPills.map((pill, index) => (
                <button
                  key={pill}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    index === 0
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-foreground hover:bg-secondary/80'
                  }`}
                >
                  {pill}
                </button>
              ))}
            </div>
            
            {/* Navigation */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-border hover:border-accent hover:text-accent"
                onClick={() => scroll('left')}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-border hover:border-accent hover:text-accent"
                onClick={() => scroll('right')}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Sarees Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4"
        >
          {sarees.map((saree, index) => (
            <motion.div
              key={saree.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex-shrink-0 w-72 md:w-80"
            >
              <Link to={`/product/${saree.slug}`} className="group">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-secondary mb-4">
                  <img
                    src={sareeImages[index % sareeImages.length]}
                    alt={saree.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Fabric Tag */}
                  <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full">
                    <span className="text-xs font-medium text-foreground">
                      {saree.subcategory}
                    </span>
                  </div>
                </div>
                
                <h3 className="font-display text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {saree.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {saree.fabric}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-lg font-semibold text-foreground">
                    {formatPrice(saree.price)}
                  </span>
                  {saree.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(saree.originalPrice)}
                    </span>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-10"
        >
          <Link to="/category/sarees">
            <Button variant="outline" className="group">
              View All Sarees
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default SareesCollection;
