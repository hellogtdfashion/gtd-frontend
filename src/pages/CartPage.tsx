import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, X, ShoppingBag, ArrowRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, subtotal } = useCart();
  
  // Shipping logic: Free over ₹2000
  const shipping = subtotal > 2000 || subtotal === 0 ? 0 : 150;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-28 pb-16">
        <div className="container-luxury mx-auto px-4">
          <h1 className="text-3xl font-black text-black mb-10 uppercase tracking-tighter">
            Shopping Bag ({cartItems.length})
          </h1>

          {cartItems.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="mx-auto mb-4 text-gray-200" size={64} />
              <p className="text-muted-foreground mb-8 font-medium">Your bag is currently empty.</p>
              <Link to="/">
                <Button className="bg-[#1F2B5B] text-white px-10 h-12 uppercase font-bold rounded-xl">
                  Discover Collections
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Items List */}
              <div className="lg:col-span-2 space-y-8">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-6 pb-8 border-b border-gray-100 animate-in fade-in slide-in-from-bottom-2">
                    <div className="w-24 h-32 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-pink-50">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-black text-black text-sm uppercase tracking-tight">{item.name}</h3>
                          <button 
                            onClick={() => removeFromCart(item.id, item.selectedSize)} 
                            className="text-gray-300 hover:text-red-500 transition-colors"
                          >
                            <X size={20} />
                          </button>
                        </div>
                        <div className="flex gap-3 mt-2">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded">Size: {item.selectedSize}</p>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded flex items-center gap-1">
                                Color: <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.selectedColor.hex }} /> {item.selectedColor.name}
                            </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-end">
                        <div className="flex items-center bg-gray-50 rounded-lg border border-gray-100">
                          <button className="px-3 py-2 hover:bg-gray-200 transition-colors" onClick={() => updateQuantity(item.id, item.selectedSize, -1)}>-</button>
                          <span className="px-4 text-sm font-black">{item.quantity}</span>
                          <button className="px-3 py-2 hover:bg-gray-200 transition-colors" onClick={() => updateQuantity(item.id, item.selectedSize, 1)}>+</button>
                        </div>
                        <span className="font-black text-[#1F2B5B] text-lg">₹{item.price * item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary Sidebar */}
              <div className="bg-[#FFF8F8] p-8 rounded-[2.5rem] h-fit border border-pink-100 shadow-sm">
                <h2 className="text-xl font-black text-black mb-6 uppercase tracking-widest">Summary</h2>
                <div className="space-y-4 text-xs font-bold border-b border-pink-100 pb-6">
                  <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>₹{subtotal}</span></div>
                  <div className="flex justify-between text-gray-500"><span>Estimated Shipping</span><span>{shipping === 0 ? <span className="text-green-600">FREE</span> : `₹${shipping}`}</span></div>
                </div>
                <div className="flex justify-between text-xl font-black text-black pt-6 mb-8 uppercase tracking-tighter">
                  <span>Total</span><span>₹{subtotal + shipping}</span>
                </div>
                <Link to="/checkout">
                  <Button className="w-full bg-[#1F2B5B] hover:bg-[#151e41] text-white h-16 font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-blue-900/10">
                    Proceed to Checkout <ArrowRight size={16} className="ml-2" />
                  </Button>
                </Link>
                <p className="text-[9px] text-gray-400 text-center mt-6 uppercase font-bold tracking-widest">Secure SSL Encrypted Checkout</p>
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