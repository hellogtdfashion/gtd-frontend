import { Link } from 'react-router-dom';
import { Instagram, Mail, Phone, MapPin, Clock, Heart } from 'lucide-react';
import logo from '@/assets/logo.png';

const Footer = () => {
  return (
    <footer className="bg-brand-dark text-white/90 border-t border-white/5">
      <div className="container-luxury mx-auto section-padding">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

          {/* 1. BRAND IDENTITY - Left aligned */}
          <div className="col-span-1 md:col-span-6 lg:col-span-5 flex flex-col items-start space-y-6">
            <Link to="/" className="flex flex-col md:flex-row items-start md:items-center gap-4 transition-transform hover:scale-[1.01] group">
              <img src={logo} alt="GTD Logo" className="h-20 md:h-24 w-auto object-contain shrink-0 block" />
              <div className="flex flex-col justify-center text-left">
                <h1 className="font-serif italic text-[20px] md:text-[22px] lg:text-[26px] font-medium text-white leading-tight whitespace-nowrap group-hover:text-accent transition-colors">
                  Glorious Threads by Divya
                </h1>
              </div>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed text-left max-w-md">
              Premium Indian ethnic wear celebrating timeless craftsmanship, elegance, and modern tradition.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/gloriousthreads_by_divya/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-accent hover:text-white transition-all">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* 2. SHOP, CONTACT, HOURS - Left aligned */}
          <div className="col-span-1 md:col-span-6 lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="sm:col-span-1">
              <h4 className="font-display text-base font-bold mb-6 text-white uppercase tracking-widest text-left">Shop</h4>
              <ul className="space-y-4 text-sm text-white/60 text-left">
                <li><Link to="/category/sarees" className="hover:text-accent transition-colors">Sarees</Link></li>
                <li><Link to="/category/lehengas" className="hover:text-accent transition-colors">Lehengas</Link></li>
                <li><Link to="/category/kurta-sets" className="hover:text-accent transition-colors">Kurta Sets</Link></li>
                <li><Link to="/category/gowns" className="hover:text-accent transition-colors">Gowns</Link></li>
              </ul>
            </div>

            <div className="sm:col-span-1">
              <h4 className="font-display text-base font-bold mb-6 text-white uppercase tracking-widest text-left">Contact</h4>
              <div className="space-y-4 text-sm text-white/60 flex flex-col items-start">
                <div className="flex items-center gap-3 text-left"><Phone className="w-4 h-4 text-accent shrink-0" /><span>+91 85000 85065</span></div>
                <div className="flex items-center gap-3 text-left"><Mail className="w-4 h-4 text-accent shrink-0" /><span className="italic">gtd@gmail.com</span></div>
                <div className="flex items-start gap-3 text-left"><MapPin className="w-4 h-4 text-accent mt-1 shrink-0" /><span>Bangalore, Karnataka, 560102 India</span></div>
              </div>
            </div>

            <div className="sm:col-span-1">
              <h4 className="font-display text-base font-bold mb-6 text-white uppercase tracking-widest text-left">Hours</h4>
              <div className="space-y-4 text-sm text-white/60 flex flex-col items-start">
                <div className="flex items-start gap-3"><Clock className="w-4 h-4 text-accent mt-1 shrink-0" /><div className="space-y-2 text-left"><p>Mon – Sat:<br/><strong>9 AM – 6 PM</strong></p><p>Sun:<br/><strong>9 AM – 1 PM</strong></p></div></div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR - Centered alignment */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col items-center gap-6 text-[10px] uppercase tracking-widest text-white/30 font-bold text-center">
          
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/policies/shipping" className="hover:text-white transition-colors">Shipping</Link>
            <Link to="/policies/return-policy" className="hover:text-white transition-colors">Return & Exchange</Link>
            <Link to="/policies/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/policies/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>

          <div className="space-y-2">
            <p>© 2026 Glorious Threads by Divya. All rights reserved.</p>
            
           {/* StaffArc Branding with Precise Asset Path */}
<div className="flex justify-center items-center gap-1 text-[11px] font-medium text-white/50 normal-case">
  Made with <Heart className="inline h-4 w-4 text-red-500 mx-1 fill-red-500" /> by
  <a
    href="https://staffarc.in"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-1 text-orange-600 hover:underline transition-all"
  >
    <img
      src="https://www.staffarc.in/images/Staffarc-logo.png"
      alt="StaffArc logo"
      className="h-5 w-5 object-contain"
    />
    StaffArc
  </a>
</div> 
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;