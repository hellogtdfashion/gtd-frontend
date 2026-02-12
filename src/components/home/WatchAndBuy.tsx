import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { storeService } from "../../services/api";

const WatchAndBuy = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await storeService.getWatchBuyProducts();
        setVideos(res);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchVideos();
  }, []);

  if (loading) return null;
  if (videos.length === 0) return null;

  return (
    <section className="section-padding bg-[#FFF9F9]">
      <div className="container-luxury mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-2xl md:text-3xl font-black text-black uppercase tracking-tight">Watch & Buy</h2>
        </div>

        {/* 🔥 MOBILE: 2 Columns Grid
            🔥 DESKTOP: 4 Columns Grid (Recent 4)
        */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {videos.slice(0, 4).map((item) => (
            <div key={item.id} className="relative aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl bg-black group">
              <video
                src={item.video_url}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
              />
              
              <Link to={`/product/${item.product_slug}`} className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-4 md:p-6">
                <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="text-[8px] md:text-[10px] font-black text-pink-400 uppercase tracking-widest">{item.category}</span>
                    <h3 className="text-white font-bold text-xs md:text-sm uppercase mt-1 line-clamp-1">{item.name}</h3>
                    <div className="flex flex-col md:flex-row md:items-center justify-between mt-3 gap-2">
                        <span className="text-white font-black text-sm">₹{item.price}</span>
                        <Button size="sm" className="h-7 md:h-8 rounded-full bg-[#F4C430] text-black hover:bg-white text-[8px] md:text-[10px] font-black uppercase">
                            Shop Look
                        </Button>
                    </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WatchAndBuy;