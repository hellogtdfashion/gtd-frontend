import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import heroimage1 from '@/assets/heroimage1.png'; 
import { storeService } from '@/services/api';

const HeroSection = () => {
  // Store the full slide object to access both image and link
  const [heroData, setHeroData] = useState({
    image: heroimage1,
    link: "/category/all"
  });

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const data = await storeService.getWebContent();
        if (data.hero_slides && data.hero_slides.length > 0) {
          // Use the first active slide
          const topSlide = data.hero_slides[0];
          setHeroData({
            image: topSlide.image,
            link: topSlide.link_url || "/category/all"
          });
        }
      } catch (error) {
        console.error("Failed to load dynamic hero content", error);
      }
    };

    fetchHeroData();
  }, []);

  return (
    <section className="relative w-full bg-white pt-28 md:pt-32">
      <div className="container-luxury mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative w-full aspect-[3/2] md:aspect-[21/8] rounded-2xl overflow-hidden shadow-2xl"
        >
          {/* Wrap the image in a Link so the whole banner is clickable */}
          <Link to={heroData.link} className="block w-full h-full group">
            <img 
              src={heroData.image} 
              className="w-full h-full object-cover object-[center_30%] transition-transform duration-700 group-hover:scale-105" 
              alt="Promotion Banner" 
            />
            
            {/* Subtle overlay effect on hover to indicate clickability */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;