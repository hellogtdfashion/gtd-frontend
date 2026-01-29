import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Star, Heart, Minus, Plus, Truck, RotateCcw, ShieldCheck } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductCard from '@/components/product/ProductCard';
import { getProductBySlug, products, formatPrice, testimonials } from '@/data/products';

import productSaree1 from '@/assets/product-saree-1.jpg';
import productLehenga1 from '@/assets/product-lehenga-1.jpg';
import productKurta1 from '@/assets/product-kurta-1.jpg';

const productImages = [productSaree1, productLehenga1, productKurta1, productSaree1];

const ProductDetail = () => {
  const { slug } = useParams();
  const product = getProductBySlug(slug || '') || products[0];
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24 pb-20 lg:pb-8">
        <div className="container-luxury mx-auto px-4 md:px-8 lg:px-16">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-8">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to={`/category/${product.category}`} className="hover:text-foreground capitalize">{product.category}</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground line-clamp-1">{product.name}</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Images */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="aspect-square rounded-2xl overflow-hidden bg-secondary mb-4">
                <img src={productImages[selectedImage % productImages.length]} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex gap-3">
                {productImages.slice(0, 4).map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)} className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${selectedImage === i ? 'border-accent' : 'border-transparent'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              {product.badge && <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${product.badge === 'new' ? 'bg-primary text-primary-foreground' : 'bg-accent text-white'}`}>{product.badge === 'new' ? 'New Arrival' : 'Bestseller'}</span>}
              <h1 className="heading-card text-2xl md:text-3xl mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-accent fill-accent' : 'text-muted'}`} />)}</div>
                <span className="text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
                {product.originalPrice && <span className="text-lg text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>}
              </div>

              {/* Colors */}
              <div className="mb-6">
                <span className="text-sm font-medium mb-2 block">Color: {selectedColor.name}</span>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <button key={color.name} onClick={() => setSelectedColor(color)} className={`w-10 h-10 rounded-full border-2 ${selectedColor.name === color.name ? 'border-accent' : 'border-border'}`} style={{ backgroundColor: color.hex }} />
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div className="mb-6">
                <span className="text-sm font-medium mb-2 block">Size</span>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button key={size} onClick={() => setSelectedSize(size)} className={`px-4 py-2 border rounded-lg text-sm ${selectedSize === size ? 'border-accent bg-accent/10' : 'border-border'}`}>{size}</button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <span className="text-sm font-medium mb-2 block">Quantity</span>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus className="w-4 h-4" /></Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}><Plus className="w-4 h-4" /></Button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Button className="btn-primary flex-1">Add to Cart</Button>
                <Button variant="outline" className="flex-1" onClick={() => setIsWishlisted(!isWishlisted)}>
                  <Heart className={`w-4 h-4 mr-2 ${isWishlisted ? 'fill-primary text-primary' : ''}`} />
                  {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-secondary/50 rounded-xl">
                <div className="text-center"><Truck className="w-5 h-5 mx-auto text-accent mb-1" /><span className="text-xs">4-6 Days Delivery</span></div>
                <div className="text-center"><RotateCcw className="w-5 h-5 mx-auto text-accent mb-1" /><span className="text-xs">Easy Returns</span></div>
                <div className="text-center"><ShieldCheck className="w-5 h-5 mx-auto text-accent mb-1" /><span className="text-xs">Secure Payment</span></div>
              </div>
            </motion.div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="description" className="mt-16">
            <TabsList className="w-full justify-start"><TabsTrigger value="description">Description</TabsTrigger><TabsTrigger value="fabric">Fabric & Care</TabsTrigger><TabsTrigger value="reviews">Reviews</TabsTrigger></TabsList>
            <TabsContent value="description" className="mt-6"><p className="text-muted-foreground">{product.description}</p></TabsContent>
            <TabsContent value="fabric" className="mt-6"><p className="font-medium mb-2">Fabric: {product.fabric}</p><ul className="list-disc list-inside text-muted-foreground">{product.care.map((c, i) => <li key={i}>{c}</li>)}</ul></TabsContent>
            <TabsContent value="reviews" className="mt-6"><div className="space-y-4">{testimonials.slice(0, 3).map((t) => <div key={t.id} className="p-4 bg-secondary/50 rounded-lg"><div className="flex gap-1 mb-2">{[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < t.rating ? 'text-accent fill-accent' : 'text-muted'}`} />)}</div><p className="text-sm mb-2">{t.comment}</p><p className="text-xs text-muted-foreground">{t.name} • {t.date}</p></div>)}</div></TabsContent>
          </Tabs>

          {/* Related Products */}
          <div className="mt-16"><h2 className="heading-section mb-8">You May Also Like</h2><div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{relatedProducts.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}</div></div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
