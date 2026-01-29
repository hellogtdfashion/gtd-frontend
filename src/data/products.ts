export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  subcategory: string;
  price: number;
  originalPrice?: number;
  images: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  rating: number;
  reviewCount: number;
  badge?: 'new' | 'bestseller' | 'lowstock';
  description: string;
  fabric: string;
  care: string[];
  inStock: boolean;
  isFeatured?: boolean;
  isInstagramPick?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  subcategories?: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  product: string;
  date: string;
}

export const categories: Category[] = [
  { id: '1', name: 'Sarees', slug: 'sarees', image: '/placeholder.svg', subcategories: ['Silk Sarees', 'Cotton Sarees', 'Party Wear', 'With Blouse'] },
  { id: '2', name: 'Lehengas', slug: 'lehengas', image: '/placeholder.svg', subcategories: ['Bridal', 'Party Wear', 'Festive'] },
  { id: '3', name: 'Kurta Sets', slug: 'kurta-sets', image: '/placeholder.svg', subcategories: ['Anarkali', 'Straight Cut', 'A-Line'] },
  { id: '4', name: "Men's Ethnic", slug: 'mens-ethnic', image: '/placeholder.svg', subcategories: ['Kurtas', 'Sherwanis', 'Nehru Jackets'] },
  { id: '5', name: 'Kids', slug: 'kids', image: '/placeholder.svg', subcategories: ['Girls', 'Boys'] },
  { id: '6', name: 'Jewellery', slug: 'jewellery', image: '/placeholder.svg', subcategories: ['Traditional', 'Kundan', 'Temple'] },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Banarasi Silk Saree in Royal Magenta',
    slug: 'banarasi-silk-saree-royal-magenta',
    category: 'sarees',
    subcategory: 'Silk Sarees',
    price: 8999,
    originalPrice: 12999,
    images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    colors: [{ name: 'Magenta', hex: '#8B008B' }, { name: 'Gold', hex: '#D4AF37' }],
    sizes: ['Free Size'],
    rating: 4.8,
    reviewCount: 124,
    badge: 'bestseller',
    description: 'Exquisite Banarasi silk saree featuring intricate zari work and traditional motifs. Perfect for weddings and festive occasions.',
    fabric: '100% Pure Banarasi Silk with Real Zari',
    care: ['Dry clean only', 'Store in muslin cloth', 'Iron on low heat'],
    inStock: true,
    isFeatured: true,
    isInstagramPick: true,
  },
  {
    id: '2',
    name: 'Designer Anarkali Kurta Set - Blush Pink',
    slug: 'designer-anarkali-kurta-blush-pink',
    category: 'kurta-sets',
    subcategory: 'Anarkali',
    price: 4599,
    originalPrice: 5999,
    images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    colors: [{ name: 'Blush Pink', hex: '#FFB6C1' }, { name: 'Ivory', hex: '#FFFFF0' }],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    rating: 4.9,
    reviewCount: 89,
    badge: 'new',
    description: 'Elegant floor-length Anarkali suit with delicate thread embroidery and sequin detailing. Comes with matching dupatta and churidar.',
    fabric: 'Georgette with Santoon lining',
    care: ['Dry clean recommended', 'Iron inside out'],
    inStock: true,
    isFeatured: true,
  },
  {
    id: '3',
    name: 'Bridal Lehenga - Midnight Blue with Gold',
    slug: 'bridal-lehenga-midnight-blue-gold',
    category: 'lehengas',
    subcategory: 'Bridal',
    price: 24999,
    images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    colors: [{ name: 'Midnight Blue', hex: '#191970' }],
    sizes: ['S', 'M', 'L', 'XL'],
    rating: 5.0,
    reviewCount: 47,
    badge: 'bestseller',
    description: 'Stunning bridal lehenga with heavy zardozi and sequin work. Features a semi-stitched lehenga, unstitched blouse, and net dupatta.',
    fabric: 'Premium Velvet with Net Dupatta',
    care: ['Professional dry clean only', 'Handle with care'],
    inStock: true,
    isFeatured: true,
  },
  {
    id: '4',
    name: 'Cotton Chanderi Saree - Mint Green',
    slug: 'cotton-chanderi-saree-mint-green',
    category: 'sarees',
    subcategory: 'Cotton Sarees',
    price: 2499,
    originalPrice: 3499,
    images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    colors: [{ name: 'Mint Green', hex: '#98FF98' }, { name: 'Yellow', hex: '#FFFFE0' }],
    sizes: ['Free Size'],
    rating: 4.6,
    reviewCount: 156,
    badge: 'new',
    description: 'Light and airy Chanderi cotton saree with subtle silver zari border. Perfect for summer occasions and daily wear.',
    fabric: 'Pure Chanderi Cotton',
    care: ['Machine wash cold', 'Do not bleach', 'Hang dry'],
    inStock: true,
    isInstagramPick: true,
  },
  {
    id: '5',
    name: 'Festive Lehenga - Coral Sunset',
    slug: 'festive-lehenga-coral-sunset',
    category: 'lehengas',
    subcategory: 'Festive',
    price: 12999,
    originalPrice: 16999,
    images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    colors: [{ name: 'Coral', hex: '#FF7F50' }, { name: 'Peach', hex: '#FFDAB9' }],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    rating: 4.7,
    reviewCount: 78,
    description: 'Beautiful festive lehenga with gradient effect and mirror work. Perfect for sangeet and reception.',
    fabric: 'Organza with Silk blend',
    care: ['Dry clean only', 'Store flat'],
    inStock: true,
    isFeatured: true,
  },
  {
    id: '6',
    name: 'Men\'s Silk Kurta - Classic Ivory',
    slug: 'mens-silk-kurta-classic-ivory',
    category: 'mens-ethnic',
    subcategory: 'Kurtas',
    price: 3499,
    images: ['/placeholder.svg', '/placeholder.svg'],
    colors: [{ name: 'Ivory', hex: '#FFFFF0' }, { name: 'Gold', hex: '#D4AF37' }],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    rating: 4.5,
    reviewCount: 92,
    badge: 'new',
    description: 'Premium silk kurta with subtle self-work pattern. Perfect for festivals and celebrations.',
    fabric: 'Art Silk',
    care: ['Dry clean only'],
    inStock: true,
  },
  {
    id: '7',
    name: 'Girls Lehenga Set - Princess Pink',
    slug: 'girls-lehenga-princess-pink',
    category: 'kids',
    subcategory: 'Girls',
    price: 1999,
    originalPrice: 2799,
    images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    colors: [{ name: 'Pink', hex: '#FF69B4' }, { name: 'Purple', hex: '#DDA0DD' }],
    sizes: ['2-3Y', '3-4Y', '4-5Y', '5-6Y', '6-7Y', '7-8Y'],
    rating: 4.9,
    reviewCount: 234,
    badge: 'bestseller',
    description: 'Adorable lehenga set for little princesses. Features sequin work and comes with matching accessories.',
    fabric: 'Net with Satin lining',
    care: ['Hand wash cold', 'Iron low'],
    inStock: true,
  },
  {
    id: '8',
    name: 'Kundan Bridal Jewellery Set',
    slug: 'kundan-bridal-jewellery-set',
    category: 'jewellery',
    subcategory: 'Kundan',
    price: 4999,
    originalPrice: 6999,
    images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    colors: [{ name: 'Gold', hex: '#D4AF37' }],
    sizes: ['One Size'],
    rating: 4.8,
    reviewCount: 67,
    badge: 'new',
    description: 'Stunning 5-piece Kundan jewellery set including necklace, earrings, maang tikka, and haath phool.',
    fabric: 'Gold-plated brass with Kundan stones',
    care: ['Store in jewellery box', 'Avoid water exposure'],
    inStock: true,
    isInstagramPick: true,
  },
  {
    id: '9',
    name: 'Party Wear Saree - Black Sequin',
    slug: 'party-wear-saree-black-sequin',
    category: 'sarees',
    subcategory: 'Party Wear',
    price: 5999,
    images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    colors: [{ name: 'Black', hex: '#000000' }, { name: 'Silver', hex: '#C0C0C0' }],
    sizes: ['Free Size'],
    rating: 4.7,
    reviewCount: 145,
    badge: 'bestseller',
    description: 'Glamorous party wear saree with all-over sequin work. Perfect for cocktail parties and receptions.',
    fabric: 'Georgette with Sequin work',
    care: ['Dry clean only'],
    inStock: true,
    isInstagramPick: true,
  },
  {
    id: '10',
    name: 'Men\'s Sherwani - Royal Maroon',
    slug: 'mens-sherwani-royal-maroon',
    category: 'mens-ethnic',
    subcategory: 'Sherwanis',
    price: 15999,
    originalPrice: 19999,
    images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    colors: [{ name: 'Maroon', hex: '#800000' }],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    rating: 4.9,
    reviewCount: 56,
    description: 'Majestic sherwani with intricate zardozi work. Perfect for grooms and special occasions.',
    fabric: 'Jacquard Silk with Zardozi',
    care: ['Dry clean only', 'Store on hanger'],
    inStock: true,
  },
  {
    id: '11',
    name: 'Straight Cut Kurta Set - Teal',
    slug: 'straight-cut-kurta-teal',
    category: 'kurta-sets',
    subcategory: 'Straight Cut',
    price: 2999,
    images: ['/placeholder.svg', '/placeholder.svg'],
    colors: [{ name: 'Teal', hex: '#008080' }, { name: 'Mustard', hex: '#FFDB58' }],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    rating: 4.6,
    reviewCount: 203,
    badge: 'new',
    description: 'Elegant straight-cut kurta with block print and mirror detailing. Includes palazzo pants.',
    fabric: 'Rayon',
    care: ['Machine wash cold', 'Iron medium'],
    inStock: true,
  },
  {
    id: '12',
    name: 'Temple Jewellery Necklace',
    slug: 'temple-jewellery-necklace',
    category: 'jewellery',
    subcategory: 'Temple',
    price: 2499,
    images: ['/placeholder.svg', '/placeholder.svg'],
    colors: [{ name: 'Antique Gold', hex: '#CFB53B' }],
    sizes: ['One Size'],
    rating: 4.7,
    reviewCount: 89,
    description: 'Traditional temple jewellery necklace with Goddess Lakshmi motif. Perfect for South Indian weddings.',
    fabric: 'Gold-plated copper',
    care: ['Store separately', 'Clean with soft cloth'],
    inStock: true,
  },
  {
    id: '13',
    name: 'Boys Kurta Pyjama - Royal Blue',
    slug: 'boys-kurta-pyjama-royal-blue',
    category: 'kids',
    subcategory: 'Boys',
    price: 1499,
    images: ['/placeholder.svg', '/placeholder.svg'],
    colors: [{ name: 'Royal Blue', hex: '#4169E1' }, { name: 'White', hex: '#FFFFFF' }],
    sizes: ['2-3Y', '3-4Y', '4-5Y', '5-6Y', '6-7Y', '7-8Y', '8-9Y', '9-10Y'],
    rating: 4.8,
    reviewCount: 178,
    description: 'Stylish kurta pyjama set for young gentlemen. Features subtle embroidery on neckline.',
    fabric: 'Cotton Silk blend',
    care: ['Hand wash cold', 'Iron low'],
    inStock: true,
  },
  {
    id: '14',
    name: 'Kanjivaram Silk Saree - Emerald',
    slug: 'kanjivaram-silk-saree-emerald',
    category: 'sarees',
    subcategory: 'Silk Sarees',
    price: 14999,
    images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    colors: [{ name: 'Emerald', hex: '#50C878' }],
    sizes: ['Free Size'],
    rating: 5.0,
    reviewCount: 67,
    badge: 'bestseller',
    description: 'Authentic Kanjivaram silk saree with real gold zari. A timeless heirloom piece.',
    fabric: 'Pure Kanjivaram Silk',
    care: ['Dry clean only', 'Store with silica gel'],
    inStock: true,
    isFeatured: true,
  },
  {
    id: '15',
    name: 'Reception Lehenga - Rose Gold',
    slug: 'reception-lehenga-rose-gold',
    category: 'lehengas',
    subcategory: 'Party Wear',
    price: 18999,
    originalPrice: 24999,
    images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    colors: [{ name: 'Rose Gold', hex: '#B76E79' }],
    sizes: ['XS', 'S', 'M', 'L'],
    rating: 4.9,
    reviewCount: 34,
    badge: 'new',
    description: 'Dreamy rose gold lehenga with intricate beadwork and sequins. Perfect for reception.',
    fabric: 'Net with Satin inner',
    care: ['Dry clean only'],
    inStock: true,
    isFeatured: true,
    isInstagramPick: true,
  },
  {
    id: '16',
    name: 'A-Line Kurta - Lavender Dreams',
    slug: 'a-line-kurta-lavender',
    category: 'kurta-sets',
    subcategory: 'A-Line',
    price: 2299,
    images: ['/placeholder.svg', '/placeholder.svg'],
    colors: [{ name: 'Lavender', hex: '#E6E6FA' }, { name: 'White', hex: '#FFFFFF' }],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    rating: 4.5,
    reviewCount: 167,
    description: 'Comfortable A-line kurta with chikankari embroidery. Perfect for office and casual wear.',
    fabric: 'Cotton',
    care: ['Machine wash', 'Iron medium'],
    inStock: true,
  },
  {
    id: '17',
    name: 'Nehru Jacket - Charcoal Grey',
    slug: 'nehru-jacket-charcoal',
    category: 'mens-ethnic',
    subcategory: 'Nehru Jackets',
    price: 2999,
    images: ['/placeholder.svg', '/placeholder.svg'],
    colors: [{ name: 'Charcoal', hex: '#36454F' }, { name: 'Navy', hex: '#000080' }],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    rating: 4.7,
    reviewCount: 123,
    badge: 'bestseller',
    description: 'Classic Nehru jacket with subtle brocade pattern. Versatile piece for any occasion.',
    fabric: 'Jacquard',
    care: ['Dry clean recommended'],
    inStock: true,
  },
  {
    id: '18',
    name: 'Saree with Stitched Blouse - Peach',
    slug: 'saree-stitched-blouse-peach',
    category: 'sarees',
    subcategory: 'With Blouse',
    price: 3999,
    originalPrice: 5499,
    images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    colors: [{ name: 'Peach', hex: '#FFDAB9' }],
    sizes: ['S', 'M', 'L', 'XL'],
    rating: 4.6,
    reviewCount: 234,
    badge: 'new',
    description: 'Ready-to-wear saree with pre-stitched pleats and matching designer blouse.',
    fabric: 'Georgette',
    care: ['Dry clean only'],
    inStock: true,
    isInstagramPick: true,
  },
  {
    id: '19',
    name: 'Girls Anarkali - Butter Yellow',
    slug: 'girls-anarkali-butter-yellow',
    category: 'kids',
    subcategory: 'Girls',
    price: 1799,
    images: ['/placeholder.svg', '/placeholder.svg'],
    colors: [{ name: 'Yellow', hex: '#FFFACD' }, { name: 'Orange', hex: '#FFA500' }],
    sizes: ['2-3Y', '3-4Y', '4-5Y', '5-6Y', '6-7Y'],
    rating: 4.8,
    reviewCount: 145,
    description: 'Bright and cheerful Anarkali dress for little girls. Perfect for festivals.',
    fabric: 'Silk blend',
    care: ['Hand wash', 'Iron low'],
    inStock: true,
  },
  {
    id: '20',
    name: 'Polki Diamond Earrings',
    slug: 'polki-diamond-earrings',
    category: 'jewellery',
    subcategory: 'Traditional',
    price: 3499,
    images: ['/placeholder.svg', '/placeholder.svg'],
    colors: [{ name: 'Gold', hex: '#D4AF37' }],
    sizes: ['One Size'],
    rating: 4.9,
    reviewCount: 78,
    badge: 'bestseller',
    description: 'Elegant polki diamond earrings with pearl drops. Perfect for bridal trousseau.',
    fabric: 'Gold-plated with polki and pearls',
    care: ['Store in box', 'Avoid perfume'],
    inStock: true,
  },
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    location: 'Mumbai',
    rating: 5,
    comment: 'Absolutely stunning saree! The quality exceeded my expectations. The fabric feels luxurious and the color is exactly as shown. Will definitely order again!',
    product: 'Banarasi Silk Saree',
    date: '2 weeks ago',
  },
  {
    id: '2',
    name: 'Anjali Patel',
    location: 'Delhi',
    rating: 5,
    comment: 'The bridal lehenga is a dream come true! Every detail is perfect. Divya ji personally helped me with customizations. Truly a boutique experience!',
    product: 'Bridal Lehenga',
    date: '1 month ago',
  },
  {
    id: '3',
    name: 'Meera Reddy',
    location: 'Bangalore',
    rating: 5,
    comment: 'Fast shipping and beautiful packaging. The kurta set fits perfectly. Love how they include care instructions and a handwritten thank you note!',
    product: 'Anarkali Kurta Set',
    date: '3 weeks ago',
  },
  {
    id: '4',
    name: 'Kavitha Nair',
    location: 'Chennai',
    rating: 4,
    comment: 'Great collection of South Indian jewellery. The temple necklace is exactly what I was looking for. Highly recommend GTD for authentic ethnic wear.',
    product: 'Temple Jewellery',
    date: '1 week ago',
  },
  {
    id: '5',
    name: 'Ritu Gupta',
    location: 'Jaipur',
    rating: 5,
    comment: 'My daughter looked like a princess in the kids lehenga! The quality is amazing and it arrived beautifully packed. Thank you GTD!',
    product: 'Kids Lehenga Set',
    date: '2 months ago',
  },
  {
    id: '6',
    name: 'Sneha Kulkarni',
    location: 'Pune',
    rating: 5,
    comment: 'Been following GTD on Instagram for years. Finally ordered and the experience was amazing. The Kanjivaram saree is pure perfection!',
    product: 'Kanjivaram Silk Saree',
    date: '1 month ago',
  },
];

export const getProductsByCategory = (categorySlug: string): Product[] => {
  return products.filter(p => p.category === categorySlug);
};

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find(p => p.slug === slug);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter(p => p.isFeatured);
};

export const getNewArrivals = (): Product[] => {
  return products.filter(p => p.badge === 'new').slice(0, 10);
};

export const getBestSellers = (): Product[] => {
  return products.filter(p => p.badge === 'bestseller');
};

export const getInstagramPicks = (): Product[] => {
  return products.filter(p => p.isInstagramPick);
};

export const formatPrice = (price: number): string => {
  return `₹${price.toLocaleString('en-IN')}`;
};
