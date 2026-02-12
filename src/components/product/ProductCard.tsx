import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const ProductCard = ({ product, index = 0 }: { product: any; index?: number }) => {
  const price = Number(product.price);
  const original = Number(product.original_price);
  const savings = original > price ? Math.floor(original - price) : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group bg-white overflow-hidden transition-all duration-500"
    >
      <Link to={`/product/${product.slug}`}>
        {/* Image Container with Rating Overlay */}
        <div className="relative aspect-[3/4] bg-zinc-50 overflow-hidden mb-3">
          <img 
            src={product.images?.[0]?.url || ''} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
            alt={product.title}
          />
          
          {/* Rating Pill - Top Left Style from reference */}
          {product.average_rating > 0 && (
            <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 flex items-center gap-1 shadow-sm border border-zinc-100 rounded-md z-10">
              <span className="text-[11px] font-bold text-black">{product.average_rating}</span>
              <Star size={10} className="fill-[#F4C430] text-[#F4C430]" />
              {product.review_count > 0 && (
                <span className="text-[10px] text-zinc-400 border-l border-zinc-200 pl-1 ml-1 font-medium">
                  {product.review_count}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Text Content */}
        <div className="space-y-1 px-1">
          <p className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest truncate">
            {product.category_name}
          </p>
          <h3 className="text-[13px] font-bold text-black uppercase truncate group-hover:text-zinc-600 transition-colors">
            {product.title}
          </h3>
          
          <div className="flex items-center gap-2 pt-0.5">
            <span className="text-sm font-black text-black">₹{price}</span>
            {original > price && (
              <>
                <span className="text-[11px] text-zinc-600 line-through font-medium">₹{original}</span>
                {/* Fixed OFF Amount in Green beside original price */}
                <span className="text-[10px] font-black text-green-600 uppercase tracking-tighter">
                  ₹{savings} OFF
                </span>
              </>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;