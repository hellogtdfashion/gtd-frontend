import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/data/products';

import productLehenga1 from '@/assets/product-lehenga-1.jpg';
import categoryLehengas from '@/assets/category-lehengas.jpg';

const featuredLehengas = [
  {
    id: '1',
    name: 'Midnight Royale Bridal Lehenga',
    price: 24999,
    originalPrice: 32999,
    image: productLehenga1,
    story: 'Handcrafted over 3 months by master artisans from Jaipur.',
  },
  {
    id: '2',
    name: 'Coral Sunset Festive Lehenga',
    price: 18999,
    image: categoryLehengas,
    story: 'Inspired by the vibrant hues of Indian sunsets.',
  },
];

const FeaturedLehengas = () => {
  return (
    <section className="section-padding bg-secondary/30 overflow-hidden">
      <div className="container-luxury mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-accent font-body text-sm tracking-[0.3em] uppercase">
            Statement Pieces
          </span>
          <h2 className="heading-section mt-2">Featured Lehengas</h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            Exquisite bridal and festive lehengas for your most cherished moments.
          </p>
        </motion.div>

        {/* Featured Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {featuredLehengas.map((lehenga, index) => (
            <motion.div
              key={lehenga.id}
              initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="group relative"
            >
              <Link to={`/product/${lehenga.id}`}>
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                  <img
                    src={lehenga.image}
                    alt={lehenga.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <p className="text-white/70 text-sm italic mb-2">
                      "{lehenga.story}"
                    </p>
                    <h3 className="font-display text-xl md:text-2xl text-white mb-3">
                      {lehenga.name}
                    </h3>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-lg font-semibold text-white">
                        {formatPrice(lehenga.price)}
                      </span>
                      {lehenga.originalPrice && (
                        <span className="text-sm text-white/60 line-through">
                          {formatPrice(lehenga.originalPrice)}
                        </span>
                      )}
                    </div>
                    <Button className="btn-gold">
                      View Details
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
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
          <Link to="/category/lehengas">
            <Button variant="outline" className="group">
              Explore All Lehengas
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedLehengas;
