import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getProductsByCategory, formatPrice } from '@/data/products';

import categoryKids from '@/assets/category-kids.jpg';

const KidsCollection = () => {
  const kidsProducts = getProductsByCategory('kids');

  return (
    <section className="section-padding bg-gradient-to-br from-pink-50 via-purple-50 to-yellow-50 overflow-hidden relative">
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-200 rounded-full opacity-40 blur-xl" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-pink-200 rounded-full opacity-40 blur-xl" />
      
      <div className="container-luxury mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-primary font-body text-sm tracking-[0.3em] uppercase">
              For Your Little Ones
            </span>
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <h2 className="heading-section">Little Royalty</h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            Adorable ethnic wear for your little princes and princesses. Make every occasion magical.
          </p>
        </motion.div>

        {/* Kids Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {kidsProducts.slice(0, 4).map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link to={`/product/${product.slug}`} className="group">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-lg mb-4">
                  <img
                    src={categoryKids}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Age Badge */}
                  <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full">
                    <span className="text-xs font-medium text-foreground">
                      Ages 2-10
                    </span>
                  </div>
                </div>
                
                <h3 className="font-body font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-semibold text-foreground">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-10"
        >
          <Link to="/category/kids">
            <Button className="btn-primary group">
              Shop Kids Collection
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default KidsCollection;
