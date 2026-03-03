import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Truck, Clock, ShieldCheck, Zap } from 'lucide-react';

const ShippingPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-40 pb-20 container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-black uppercase mb-10 tracking-tight text-left">Shipping Policy</h1>
        
        <div className="space-y-12 text-left">
          {/* Free Shipping Highlight */}
          <section className="bg-black text-white p-8 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-white/10 p-3 rounded-full">
                <Zap className="text-[#F4C430]" size={32} />
              </div>
              <div>
                <h2 className="font-black uppercase text-xl">100% Free Shipping</h2>
                <p className="text-zinc-400 text-sm italic">Complimentary delivery on all orders across India.</p>
              </div>
            </div>
            <div className="border border-white/20 px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest">
              Limited Time Offer
            </div>
          </section>

          {/* Shipping Timelines */}
          <section className="grid md:grid-cols-2 gap-8">
            <div className="border border-zinc-100 p-8 rounded-[2rem] hover:shadow-lg transition-shadow">
              <Clock className="text-black mb-4" size={32} />
              <h3 className="font-black uppercase text-sm mb-2">Processing Time</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Our team carefully inspects and prepares your order within <strong>2–4 business days</strong> to ensure maximum quality.
              </p>
            </div>
            <div className="border border-zinc-100 p-8 rounded-[2rem] hover:shadow-lg transition-shadow">
              <Truck className="text-black mb-4" size={32} />
              <h3 className="font-black uppercase text-sm mb-2">Delivery Time</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Once dispatched, domestic orders typically reach your doorstep within <strong>5–7 business days</strong>.
              </p>
            </div>
          </section>

          {/* Secure Packaging */}
          <section className="space-y-4 px-4">
            <h2 className="font-black uppercase text-lg flex items-center gap-2">
              <ShieldCheck size={20} /> Secure Handling
            </h2>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Every GTD Fashion piece is shipped in premium, tamper-proof packaging. We partner with India's leading logistics providers to ensure your luxury purchase is handled with the utmost care from our warehouse to your wardrobe.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ShippingPolicy;