import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

export const CartDrawer = ({ open, setOpen }: { open: boolean, setOpen: (o: boolean) => void }) => {
  const { cartItems, updateQuantity, removeFromCart, subtotal } = useCart();
  const navigate = useNavigate();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col bg-white">
        <SheetHeader className="p-6 border-b border-pink-50">
          <SheetTitle className="flex items-center gap-2 font-black uppercase tracking-tighter">
            <ShoppingBag size={20} /> Your Bag ({cartItems.length})
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <ShoppingBag size={48} className="text-pink-100" />
              <p className="text-zinc-400 font-medium">Your bag is empty</p>
              <Button onClick={() => setOpen(false)} variant="outline" className="rounded-full uppercase text-[10px] font-bold">Start Shopping</Button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 group">
                {/* 4. Click leads to product */}
                <Link to={`/product/${item.slug}`} onClick={() => setOpen(false)} className="w-20 h-28 bg-zinc-50 rounded-xl overflow-hidden border border-pink-50 flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </Link>
                
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <Link to={`/product/${item.slug}`} onClick={() => setOpen(false)} className="font-bold text-xs uppercase hover:text-primary transition-colors line-clamp-1">{item.name}</Link>
                    <p className="text-[10px] text-zinc-400 font-bold mt-1 uppercase tracking-widest">{item.selectedSize} | {item.selectedColor.name}</p>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center border border-zinc-100 rounded-lg bg-zinc-50">
                      {/* 3. If quantity is 1, show Trash icon to remove */}
                      <button 
                        onClick={() => item.quantity === 1 ? removeFromCart(item.id) : updateQuantity(item.id, -1)} 
                        className="p-2 hover:text-primary transition-colors"
                      >
                        {item.quantity === 1 ? <Trash2 size={12} className="text-red-400" /> : <Minus size={12} />}
                      </button>
                      <span className="text-[10px] font-black w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-2 hover:text-primary transition-colors">
                        <Plus size={12} />
                      </button>
                    </div>
                    <p className="font-black text-sm">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-6 border-t border-pink-50 bg-[#FFF8F8]/30 space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Subtotal</span>
              <span className="text-xl font-black text-primary">₹{subtotal}</span>
            </div>
            {/* 2. Professional Checkout Only */}
            <Button 
              onClick={() => { setOpen(false); navigate('/checkout'); }}
              className="w-full bg-primary hover:bg-primary/90 text-white h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20"
            >
              Secure Checkout <ArrowRight size={16} className="ml-2" />
            </Button>
            <p className="text-[8px] text-center text-zinc-400 uppercase font-bold tracking-widest">Shipping & Taxes calculated at checkout</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};