import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
import ProductSection from "@/components/ProductSection";
import OffersSection from "@/components/OffersSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import CartDrawer from "@/components/CartDrawer";

const Index = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />
      <HeroSection />
      <CategorySection />
      <OffersSection />
      <ProductSection onAddToCart={() => setCartCount((c) => c + 1)} />
      <TestimonialsSection />
      <Footer />
      <FloatingButtons />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} itemCount={cartCount} />
    </div>
  );
};

export default Index;
