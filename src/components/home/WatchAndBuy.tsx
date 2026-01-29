import { motion } from 'framer-motion';
import { Play, Instagram } from 'lucide-react';

const reels = [
  { id: 1, thumbnail: '/placeholder.svg', views: '12.5K', title: 'Styling Tips: Banarasi Saree' },
  { id: 2, thumbnail: '/placeholder.svg', views: '8.2K', title: 'How to Drape a Lehenga Dupatta' },
  { id: 3, thumbnail: '/placeholder.svg', views: '15.1K', title: 'Festive Kurta Lookbook' },
  { id: 4, thumbnail: '/placeholder.svg', views: '9.8K', title: 'Bridal Jewelry Pairing' },
  { id: 5, thumbnail: '/placeholder.svg', views: '11.3K', title: 'Kids Ethnic Fashion' },
  { id: 6, thumbnail: '/placeholder.svg', views: '7.6K', title: 'Men\'s Wedding Collection' },
];

const WatchAndBuy = () => {
  return (
    <section className="section-padding bg-brand-dark text-white relative overflow-hidden">
      {/* Decorative Pattern */}
      <div className="absolute inset-0 pattern-paisley opacity-30" />
      
      <div className="container-luxury mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Instagram className="w-5 h-5 text-accent" />
            <span className="text-accent font-body text-sm tracking-[0.3em] uppercase">
              Shop from Our Reels
            </span>
          </div>
          <h2 className="heading-section text-white">Watch & Buy</h2>
          <p className="text-white/60 mt-3 max-w-lg mx-auto">
            Get styling inspiration from our Instagram. Tap any reel to shop the look.
          </p>
          
          {/* Social Proof Badge */}
          <div className="inline-flex items-center gap-2 mt-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <div className="flex -space-x-2">
              <div className="w-6 h-6 rounded-full bg-accent/80" />
              <div className="w-6 h-6 rounded-full bg-primary/80" />
              <div className="w-6 h-6 rounded-full bg-white/80" />
            </div>
            <span className="text-sm font-medium">
              <span className="text-accent">111K+</span> followers trust us
            </span>
          </div>
        </motion.div>

        {/* Reels Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {reels.map((reel, index) => (
            <motion.div
              key={reel.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-white/10">
                <img
                  src={reel.thumbnail}
                  alt={reel.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:bg-white/30">
                    <Play className="w-5 h-5 text-white fill-white ml-1" />
                  </div>
                </div>
                
                {/* Views */}
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-xs text-white/80">{reel.views} views</span>
                  <p className="text-sm text-white font-medium line-clamp-1 mt-1">
                    {reel.title}
                  </p>
                </div>
              </div>
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
          <a
            href="https://instagram.com/gtdbydivya"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-accent hover:text-white transition-colors"
          >
            <Instagram className="w-5 h-5" />
            <span className="font-medium">Follow @gtdbydivya</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default WatchAndBuy;
