import { motion } from 'framer-motion';
import { Award, Heart, Users, Truck } from 'lucide-react';

import founderImage from '@/assets/founder.jpg';

const values = [
  {
    icon: Award,
    title: 'Premium Quality',
    description: 'Every piece is carefully crafted with the finest fabrics.',
  },
  {
    icon: Heart,
    title: 'Authentic Designs',
    description: 'Traditional craftsmanship meets contemporary elegance.',
  },
  {
    icon: Users,
    title: '111K+ Community',
    description: 'Join our family of style-conscious customers.',
  },
  {
    icon: Truck,
    title: 'Fast Shipping',
    description: 'Pan-India delivery within 4-6 business days.',
  },
];

const BrandStory = () => {
  return (
    <section className="section-padding bg-background overflow-hidden">
      <div className="container-luxury mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
              <img
                src={founderImage}
                alt="Divya - Founder of Glorious Threads"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative Frame */}
            <div className="absolute -top-4 -left-4 w-full h-full border-2 border-accent rounded-2xl -z-10" />
            
            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-luxury p-6"
            >
              <span className="block text-3xl font-display font-bold text-primary">5+</span>
              <span className="text-sm text-muted-foreground">Years of Love</span>
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-accent font-body text-sm tracking-[0.3em] uppercase">
              Our Story
            </span>
            <h2 className="heading-section mt-2 mb-6">
              Crafted with Love
              <br />
              <span className="italic text-primary">by Divya</span>
            </h2>
            
            <div className="space-y-4 text-muted-foreground text-body">
              <p>
                What started as a passion for preserving India's rich textile heritage has 
                blossomed into a beloved boutique that dresses women for their most special moments.
              </p>
              <p>
                At Glorious Threads, we believe every woman deserves to feel like royalty. 
                Each piece in our collection is handpicked to celebrate Indian craftsmanship 
                while embracing modern sensibilities.
              </p>
              <p>
                From our workshop in Mumbai, we work directly with artisan communities across 
                India, ensuring fair wages and keeping traditional weaving techniques alive.
              </p>
            </div>

            {/* Gold Divider */}
            <div className="gold-divider my-8" />

            {/* Value Props */}
            <div className="grid grid-cols-2 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <value.icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{value.title}</h4>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
