import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock/Asset imports
import founder1 from '@/assets/founder1.jpeg';
import founder2 from '@/assets/founder2.jpeg';
import founder3 from '@/assets/founder3.jpeg';

const sliderImages = [founder1, founder2, founder3];

const BrandStory = () => {
  const [current, setCurrent] = useState(0);

  // Decreased timer to 3000ms (3 seconds) for a snappier feel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % sliderImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="section-padding bg-background overflow-hidden border-t border-border/50">
      <div className="container-luxury mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-center">
          
          {/* LEFT SIDE: AUTO-SLIDING IMAGES WITH CROSS-FADE */}
          <div className="relative group">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl z-10 border-[8px] border-white bg-gray-100">
              <AnimatePresence mode="popLayout"> {/* Faster, overlapping transition */}
                <motion.img
                  key={current}
                  src={sliderImages[current]}
                  // Image comes from center and fades in simultaneously
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ 
                    duration: 0.8, // Faster transition
                    ease: [0.4, 0, 0.2, 1] // Custom cubic-bezier for a "boutique" feel
                  }}
                  className="absolute inset-0 w-full h-full object-cover"
                  alt="Founder"
                />
              </AnimatePresence>
            </div>
            
            {/* Matte Gold Decorative Frame Backing */}
            <div className="absolute -top-6 -left-6 w-full h-full border border-accent/30 rounded-2xl -z-10" />
            
            {/* Floating Experience Badge */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              className="absolute -bottom-8 -right-4 bg-accent text-white px-8 py-5 rounded-sm shadow-xl z-20 hidden md:block"
            >
              <p className="text-4xl font-display font-light leading-none">05</p>
              <p className="text-[9px] font-bold uppercase tracking-[0.3em] mt-2 opacity-90 text-center">Years</p>
            </motion.div>
          </div>

          {/* RIGHT SIDE: MINIMALIST WARM INFO */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col text-center lg:text-left"
          >
            <span className="tagline-gold">The Essence of GTD</span>
            
            <h2 className="font-display text-2xl md:text-2xl font-bold text-foreground leading-[1.1] mb-8">
              Woven with Passion, <br />
              <span className="italic text-primary font-serif font-medium tracking-tight">Curated for Elegance.</span>
            </h2>
            
            <div className="space-y-8 max-w-xl">
              <p className="text-foreground/80 text-xl md:text-xl font-small leading-relaxed italic">
                "Every design is a tribute to the timeless beauty of the Indian woman."
              </p>
              
              <div className="h-px w-20 bg-accent/40 mx-auto lg:mx-0" />

              
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default BrandStory;