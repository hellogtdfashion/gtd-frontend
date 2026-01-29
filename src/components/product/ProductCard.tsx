import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Eye, ShoppingBag, Star } from 'lucide-react';
import { Product, formatPrice } from '@/data/products';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group product-card"
      onMouseEnter={() => {
        setIsHovered(true);
        if (product.images.length > 1) setCurrentImageIndex(1);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentImageIndex(0);
      }}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-secondary">
        {/* Main Image */}
        <Link to={`/product/${product.slug}`}>
          <img
            src={product.images[currentImageIndex]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.badge === 'new' && (
            <span className="badge-new rounded-sm">New</span>
          )}
          {product.badge === 'bestseller' && (
            <span className="badge-bestseller rounded-sm">Bestseller</span>
          )}
          {hasDiscount && (
            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-sm font-medium">
              -{discountPercentage}%
            </span>
          )}
          {product.badge === 'lowstock' && (
            <span className="bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-sm font-medium">
              Low Stock
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.preventDefault();
            setIsWishlisted(!isWishlisted);
          }}
          className={`wishlist-heart absolute top-3 right-3 ${
            isWishlisted ? 'bg-primary text-primary-foreground' : ''
          }`}
        >
          <Heart
            className={`w-4 h-4 transition-all ${isWishlisted ? 'fill-current' : ''}`}
          />
        </motion.button>

        {/* Quick Actions Overlay */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent"
        >
          <div className="flex gap-2">
            <Button
              size="sm"
              className="flex-1 bg-white text-foreground hover:bg-primary hover:text-white transition-colors"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
            <Link to={`/product/${product.slug}`}>
              <Button
                size="sm"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-foreground"
              >
                <Eye className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${
                i < Math.floor(product.rating)
                  ? 'text-accent fill-accent'
                  : 'text-muted'
              }`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">
            ({product.reviewCount})
          </span>
        </div>

        {/* Name */}
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-body text-sm font-medium text-foreground line-clamp-2 hover:text-primary transition-colors mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="price-current">{formatPrice(product.price)}</span>
          {hasDiscount && (
            <span className="price-original">{formatPrice(product.originalPrice!)}</span>
          )}
        </div>

        {/* Colors */}
        {product.colors.length > 1 && (
          <div className="flex items-center gap-1 mt-2">
            {product.colors.slice(0, 4).map((color, i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-full border border-border"
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-xs text-muted-foreground">
                +{product.colors.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;
