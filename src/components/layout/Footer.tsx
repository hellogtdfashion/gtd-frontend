import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  return (
    <footer className="bg-brand-dark text-white/90">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="container-luxury mx-auto section-padding">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-display text-2xl md:text-3xl mb-3">Join Our Royal Circle</h3>
            <p className="text-white/60 mb-6 font-body">
              Be the first to know about new collections, exclusive offers & styling tips.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-accent"
              />
              <Button className="btn-gold whitespace-nowrap">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container-luxury mx-auto section-padding">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Shop */}
          <div>
            <h4 className="font-display text-lg mb-4 text-accent">Shop</h4>
            <ul className="space-y-3 font-body text-sm text-white/70">
              <li><Link to="/category/sarees" className="hover:text-accent transition-colors">Sarees</Link></li>
              <li><Link to="/category/lehengas" className="hover:text-accent transition-colors">Lehengas</Link></li>
              <li><Link to="/category/kurta-sets" className="hover:text-accent transition-colors">Kurta Sets</Link></li>
              <li><Link to="/category/mens-ethnic" className="hover:text-accent transition-colors">Men's Ethnic</Link></li>
              <li><Link to="/category/kids" className="hover:text-accent transition-colors">Kids Collection</Link></li>
              <li><Link to="/category/jewellery" className="hover:text-accent transition-colors">Jewellery</Link></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-display text-lg mb-4 text-accent">About</h4>
            <ul className="space-y-3 font-body text-sm text-white/70">
              <li><Link to="/about" className="hover:text-accent transition-colors">Our Story</Link></li>
              <li><Link to="/craftsmanship" className="hover:text-accent transition-colors">Craftsmanship</Link></li>
              <li><Link to="/sustainability" className="hover:text-accent transition-colors">Sustainability</Link></li>
              <li><Link to="/blog" className="hover:text-accent transition-colors">Style Journal</Link></li>
              <li><Link to="/press" className="hover:text-accent transition-colors">Press</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-display text-lg mb-4 text-accent">Customer Care</h4>
            <ul className="space-y-3 font-body text-sm text-white/70">
              <li><Link to="/contact" className="hover:text-accent transition-colors">Contact Us</Link></li>
              <li><Link to="/shipping" className="hover:text-accent transition-colors">Shipping Info</Link></li>
              <li><Link to="/returns" className="hover:text-accent transition-colors">Returns & Exchange</Link></li>
              <li><Link to="/size-guide" className="hover:text-accent transition-colors">Size Guide</Link></li>
              <li><Link to="/faq" className="hover:text-accent transition-colors">FAQs</Link></li>
              <li><Link to="/track-order" className="hover:text-accent transition-colors">Track Order</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-display text-lg mb-4 text-accent">Connect</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-white/70 text-sm">
                <Phone className="w-4 h-4 text-accent" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3 text-white/70 text-sm">
                <Mail className="w-4 h-4 text-accent" />
                <span>hello@gtdbydivya.com</span>
              </div>
              <div className="flex items-start gap-3 text-white/70 text-sm">
                <MapPin className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                <span>Mumbai, Maharashtra, India</span>
              </div>
              
              {/* Social Links */}
              <div className="flex gap-3 pt-2">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-accent hover:text-accent transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-accent hover:text-accent transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-accent hover:text-accent transition-colors"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col items-center md:items-start">
              <div className="font-display text-lg">Glorious Threads by Divya</div>
              <p className="text-xs text-white/40 mt-1">
                © 2024 All rights reserved. Made with love in India.
              </p>
            </div>
            
            {/* Payment & Security */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-white/40 text-xs">
                <svg className="w-8 h-5" viewBox="0 0 38 24" fill="currentColor">
                  <rect width="38" height="24" rx="3" fill="currentColor" fillOpacity="0.3"/>
                  <text x="50%" y="50%" textAnchor="middle" dy=".3em" fontSize="8" fill="currentColor">VISA</text>
                </svg>
                <svg className="w-8 h-5" viewBox="0 0 38 24" fill="currentColor">
                  <rect width="38" height="24" rx="3" fill="currentColor" fillOpacity="0.3"/>
                  <text x="50%" y="50%" textAnchor="middle" dy=".3em" fontSize="6" fill="currentColor">MC</text>
                </svg>
                <svg className="w-8 h-5" viewBox="0 0 38 24" fill="currentColor">
                  <rect width="38" height="24" rx="3" fill="currentColor" fillOpacity="0.3"/>
                  <text x="50%" y="50%" textAnchor="middle" dy=".3em" fontSize="6" fill="currentColor">UPI</text>
                </svg>
                <svg className="w-8 h-5" viewBox="0 0 38 24" fill="currentColor">
                  <rect width="38" height="24" rx="3" fill="currentColor" fillOpacity="0.3"/>
                  <text x="50%" y="50%" textAnchor="middle" dy=".3em" fontSize="5" fill="currentColor">COD</text>
                </svg>
              </div>
              <div className="text-xs text-white/40 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Secure Checkout
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
