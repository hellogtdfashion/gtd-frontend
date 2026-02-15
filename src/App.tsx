import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import ScrollToTop from "./components/layout/ScrollToTop";
import Login from "./pages/Login";
import WatchAndBuyDetails from "./pages/WatchAndBuyDetails"
import WatchBuyListingPage from "./pages/WatchBuyListingPage";
// Pages
import UserProfile from "./pages/UserProfile";
import Index from "./pages/Index";
import CategoryPage from "./pages/CategoryPage";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage"; // Ensure this page is created
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/category/:category/:subcategory" element={<CategoryPage />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/watch-and-buy/:slug" element={<WatchAndBuyDetails />} />
            <Route path="/watch-and-buy" element={<WatchBuyListingPage />} />
            <Route path="/collections/:collection" element={<CategoryPage />} />
            <Route path="/wishlist" element={<CartPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;