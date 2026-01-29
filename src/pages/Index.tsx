import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import CategoryCircles from '@/components/home/CategoryCircles';
import NewArrivals from '@/components/home/NewArrivals';
import WatchAndBuy from '@/components/home/WatchAndBuy';
import InstagramBestSellers from '@/components/home/InstagramBestSellers';
import FeaturedLehengas from '@/components/home/FeaturedLehengas';
import SareesCollection from '@/components/home/SareesCollection';
import BrandStory from '@/components/home/BrandStory';
import KidsCollection from '@/components/home/KidsCollection';
import Testimonials from '@/components/home/Testimonials';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <CategoryCircles />
        <NewArrivals />
        <WatchAndBuy />
        <InstagramBestSellers />
        <FeaturedLehengas />
        <SareesCollection />
        <BrandStory />
        <KidsCollection />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
