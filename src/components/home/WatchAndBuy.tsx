import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { storeService } from "../../services/api";
import WatchBuyCard from '@/components/product/WatchBuyCard'; // 🔥 Using the card here

const WatchAndBuy = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await storeService.getWatchBuyProducts();
        setVideos(res);
      } catch (err) { 
        console.error("Watch & Buy Load Error:", err); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchVideos();
  }, []);

  if (loading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>;
  if (videos.length === 0) return null;

  return (
    <section className="section-padding bg-[#FFF9F9] overflow-hidden">
      <div className="container-luxury mx-auto px-4">
        
        {/* HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.6 }} 
          className="flex items-end justify-between mb-10 px-1"
        >
          <div>
             <h2 className="heading-section mt-2 italic font-serif">Watch & Buy</h2>
             <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Curated Looks in Motion</p>
          </div>
          
          <div className="flex items-center">
            <Link to="/watch-and-buy">
              <Button 
                variant="ghost" 
                className="group text-primary hover:bg-[#F4C430] hover:text-black font-black uppercase text-[10px] md:text-xs tracking-widest px-3 py-2 md:px-5 md:py-6 transition-all duration-300"
              >
                View All <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* 🔥 HORIZONTAL SCROLLING CONTAINER */}
        <div className="flex overflow-x-auto gap-4 md:gap-8 pb-8 scrollbar-hide snap-x snap-mandatory">
          {videos.slice(0, 10).map((item, index) => (
            <div key={item.id} className="snap-center">
              {/* 🔥 We use the WatchBuyCard here to display each product */}
              <WatchBuyCard item={item} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WatchAndBuy;