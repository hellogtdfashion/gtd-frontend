import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getInstagramPicks, formatPrice } from '@/data/products';

import productSaree1 from '@/assets/product-saree-1.jpg';
import productKurta1 from '@/assets/product-kurta-1.jpg';
import productLehenga1 from '@/assets/product-lehenga-1.jpg';

const productImages = [productSaree1, productKurta1, productLehenga1, productSaree1];

const InstagramBestSellers = () => {
  const products = getInstagramPicks().slice(0, 4);

  const mockEngagement = [
    { likes: '2.4K', comments: '156' },
    { likes: '1.8K', comments: '89' },
    { likes: '3.1K', comments: '234' },
    { likes: '2.1K', comments: '178' },
  ];

  return (
    <section className="section-padding bg-background">
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
            Community Favorites
          </span>
          <h2 className="heading-section mt-2">As Seen on Instagram</h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            The styles our community loves most. Real customers, real style inspiration.
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <Link to={`/product/${product.slug}`}>
                <div className="relative aspect-square rounded-lg overflow-hidden bg-secondary mb-3">
                  <img
                    src={productImages[index]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Instagram Badge */}
                  <div className="absolute top-3 left-3 px-2 py-1 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full">
                    <span className="text-xs text-white font-medium">Instagram Favorite</span>
                  </div>
                  
                  {/* Engagement Stats */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center gap-3">
                    <div className="flex items-center gap-1 text-white text-sm">
                      <Heart className="w-4 h-4 fill-white" />
                      <span>{mockEngagement[index].likes}</span>
                    </div>
                    <div className="flex items-center gap-1 text-white text-sm">
                      <MessageCircle className="w-4 h-4" />
                      <span>{mockEngagement[index].comments}</span>
                    </div>
                  </div>
                </div>
                
                <h3 className="font-body text-sm font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm font-semibold text-foreground mt-1">
                  {formatPrice(product.price)}
                </p>
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
          <Link to="/collections/instagram-picks">
            <Button variant="outline" className="group border-accent text-accent hover:bg-accent hover:text-white">
              Shop All Instagram Picks
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default InstagramBestSellers;
