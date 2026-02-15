import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { storeService } from '@/services/api';

// Fallbacks
import founder1 from '@/assets/founder1.jpeg';
import founder2 from '@/assets/founder2.jpeg';
import founder3 from '@/assets/founder3.jpeg';

const defaultImages = [founder1, founder2, founder3];

const BrandStory = () => {
  const [current, setCurrent] = useState(0);
  const [sliderImages, setSliderImages] = useState(defaultImages);
  const [storyContent, setStoryContent] = useState({
    tagline: "The Art of Draping",
    headingLine1: "Woven with Passion",
    headingLine2: "Defined by Grace",
    description: "Every design is a tribute to the timeless beauty of the Indian woman.",
    years: "05"
  });

  useEffect(() => {
    const fetchStoryData = async () => {
      try {
        const data = await storeService.getWebContent();
        const story = data.brand_story;

        if (story) {
          // 1. Update Images
          if (story.images && story.images.length > 0) {
            setSliderImages(story.images.map((imgObj: any) => imgObj.image));
          }

          // 2. Split the dynamic heading
          // If the admin types "Line 1 | Line 2", it splits them.
          const headingParts = story.heading ? story.heading.split('|') : ["Woven with Passion", "Defined by Grace"];

          setStoryContent({
            tagline: story.tagline || "Our Story",
            headingLine1: headingParts[0]?.trim() || "Woven with Passion",
            headingLine2: headingParts[1]?.trim() || "Defined by Grace",
            description: story.content || "Every design is a tribute to the timeless beauty of the Indian woman.",
            years: story.experience_years ? String(story.experience_years).padStart(2, '0') : "05"
          });
        }
      } catch (error) {
        console.error("Failed to load brand story", error);
      }
    };
    fetchStoryData();
  }, []);

  // Seamless 2-second transition
  useEffect(() => {
    if (sliderImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % sliderImages.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [sliderImages]);

  return (
    <section className="relative py-24 md:py-32 bg-white overflow-hidden">
      <div className="container-luxury mx-auto px-4">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* IMAGE SECTION */}
          <div className="lg:col-span-6 relative">
            <div className="relative z-10 w-full max-w-[480px] mx-auto">
              <div className="relative aspect-[4/5] rounded-t-[200px] rounded-b-3xl overflow-hidden shadow-2xl border-[10px] border-white bg-gray-50">
                <AnimatePresence mode="popLayout">
                  <motion.img
                    key={current}
                    src={sliderImages[current]}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }} // Smooth 1s crossfade
                    className="absolute inset-0 w-full h-full object-cover"
                    alt="Brand Story"
                  />
                </AnimatePresence>
              </div>
              
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                className="absolute -bottom-6 -right-4 bg-primary text-white px-6 py-4 rounded-lg shadow-xl z-20"
              >
                <p className="text-3xl font-serif leading-none">{storyContent.years}</p>
                <p className="text-[8px] font-bold uppercase tracking-widest text-center mt-1">Years</p>
              </motion.div>
            </div>
            <div className="absolute top-8 left-8 right-8 bottom-[-20px] border-r border-b border-accent/20 rounded-br-[80px] -z-10" />
          </div>

          {/* TEXT SECTION */}
          <div className="lg:col-span-6 lg:pl-16">
            <div className="flex flex-col text-left">
              <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-accent mb-6">
                {storyContent.tagline}
              </span>

              {/* Both lines are now fully dynamic from the split logic */}
              <h2 className="font-display text-4xl md:text-5xl lg:text-5xl font-light text-foreground leading-tight mb-8">
                {storyContent.headingLine1} <br />
                <span className="italic text-primary font-serif font-medium">
                  {storyContent.headingLine2}
                </span>
              </h2>

              <div className="max-w-xl border-l-2 border-accent/10 pl-8">
                <p className="text-foreground/70 text-lg md:text-xl font-light leading-relaxed mb-10 italic">
                  "{storyContent.description}"
                </p>
                <div className="flex items-center gap-4">
                   <div className="h-px w-12 bg-accent" />
                   <p className="font-serif text-primary/60 text-lg">Glorious Threads by Divya</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default BrandStory;