import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import categorySarees from '@/assets/category-sarees.jpg';
import categoryLehengas from '@/assets/category-lehengas.jpg';
import categoryKurtas from '@/assets/category-kurtas.jpg';
import categoryMens from '@/assets/category-mens.jpg';
import categoryKids from '@/assets/category-kids.jpg';
import categoryJewellery from '@/assets/category-jewellery.jpg';

const categories = [
  { name: 'Sarees', image: categorySarees, href: '/category/sarees', count: '120+ Designs' },
  { name: 'Lehengas', image: categoryLehengas, href: '/category/lehengas', count: '80+ Designs' },
  { name: 'Kurta Sets', image: categoryKurtas, href: '/category/kurta-sets', count: '150+ Designs' },
  { name: "Men's Ethnic", image: categoryMens, href: '/category/mens-ethnic', count: '60+ Designs' },
  { name: 'Kids', image: categoryKids, href: '/category/kids', count: '90+ Designs' },
  { name: 'Jewellery', image: categoryJewellery, href: '/category/jewellery', count: '200+ Pieces' },
];

const CategoryCircles = () => {
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
            Explore
          </span>
          <h2 className="heading-section mt-2">Shop by Category</h2>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                to={category.href}
                className="flex flex-col items-center group"
              >
                <div className="category-circle w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 mb-3">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover img-zoom"
                  />
                </div>
                <h3 className="font-display text-sm md:text-base font-medium text-foreground group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <span className="text-xs text-muted-foreground mt-0.5">
                  {category.count}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryCircles;
