import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, X, ShoppingBag, ArrowRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { products, formatPrice } from '@/data/products';
import productSaree1 from '@/assets/product-saree-1.jpg';
import productKurta1 from '@/assets/product-kurta-1.jpg';

const initialCart = [
  { ...products[0], quantity: 1, selectedSize: 'M', selectedColor: products[0].colors[0], image: productSaree1 },
  { ...products[1], quantity: 2, selectedSize: 'L', selectedColor: products[1].colors[0], image: productKurta1 },
];

const CartPage = () => {
  const [cartItems, setCartItems] = useState(initialCart);
  const [couponCode, setCouponCode] = useState('');

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(items => items.map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 1999 ? 0 : 99;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24 pb-20 lg:pb-8">
        <div className="container-luxury mx-auto px-4 md:px-8 lg:px-16">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="heading-section mb-8">
            <ShoppingBag className="inline-block w-8 h-8 mr-3 text-accent" />
            Shopping Cart ({cartItems.length} items)
          </motion.h1>

          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="w-16 h-16 mx-auto text-muted mb-4" />
              <p className="text-muted-foreground mb-6">Your cart is empty</p>
              <Link to="/"><Button className="btn-primary">Continue Shopping</Button></Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <motion.div key={item.id} layout className="flex gap-4 p-4 bg-card rounded-xl shadow-luxury">
                    <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <Link to={`/product/${item.slug}`} className="font-medium hover:text-primary line-clamp-1">{item.name}</Link>
                        <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive"><X className="w-5 h-5" /></button>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.selectedColor.name} • {item.selectedSize}</p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="icon" className="w-8 h-8" onClick={() => updateQuantity(item.id, -1)}><Minus className="w-3 h-3" /></Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button variant="outline" size="icon" className="w-8 h-8" onClick={() => updateQuantity(item.id, 1)}><Plus className="w-3 h-3" /></Button>
                        </div>
                        <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Summary */}
              <div className="bg-secondary/50 rounded-xl p-6 h-fit sticky top-24">
                <h2 className="font-display text-xl font-medium mb-6">Order Summary</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                  <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
                  {shipping > 0 && <p className="text-xs text-muted-foreground">Free shipping on orders above ₹1,999</p>}
                </div>
                <div className="flex gap-2 my-6">
                  <Input placeholder="Coupon code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
                  <Button variant="outline">Apply</Button>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t border-border pt-4 mb-6">
                  <span>Total</span><span>{formatPrice(total)}</span>
                </div>
                <Button className="btn-primary w-full group">
                  Proceed to Checkout
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Link to="/" className="block text-center text-sm text-muted-foreground mt-4 hover:text-foreground">Continue Shopping</Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;
