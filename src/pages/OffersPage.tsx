import { motion } from "framer-motion";
import { Percent, Clock, ArrowRight, Tag, Gift, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import CartDrawer from "@/components/CartDrawer";
import { useState } from "react";

const allOffers = [
  { title: "Flat 25% Off", desc: "On all diabetes care products", icon: Percent, expire: "Ends in 2 days", code: "DIABETES25", bg: "gradient-primary" },
  { title: "Buy 2 Get 1 Free", desc: "On vitamins & supplements", icon: Gift, expire: "This week only", code: "VITA21", bg: "bg-trust" },
  { title: "Free Health Checkup", desc: "On orders above ₹1999", icon: Zap, expire: "Limited time", code: "HEALTH99", bg: "bg-secondary" },
  { title: "30% Off First Order", desc: "For new customers only", icon: Tag, expire: "No expiry", code: "NEW30", bg: "gradient-primary" },
  { title: "Flat ₹200 Off", desc: "On baby care essentials", icon: Gift, expire: "Ends in 5 days", code: "BABY200", bg: "bg-warning" },
  { title: "Up to 40% Off", desc: "On medical devices", icon: Percent, expire: "Weekend special", code: "DEVICE40", bg: "bg-trust" },
];

const OffersPage = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />
      <div className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground">Today's Offers & Deals</h1>
            <p className="text-muted-foreground mt-2">Grab the best deals on medicines and healthcare products</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allOffers.map((offer, i) => (
              <motion.div
                key={offer.title}
                className={`${offer.bg} rounded-3xl p-6 text-primary-foreground overflow-hidden relative cursor-pointer`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.03, y: -4 }}
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <offer.icon className="w-10 h-10 mb-4 opacity-80" />
                <h3 className="text-2xl font-bold">{offer.title}</h3>
                <p className="text-sm opacity-80 mt-1">{offer.desc}</p>
                <div className="mt-3 inline-block px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-sm">
                  Code: {offer.code}
                </div>
                <p className="text-xs mt-3 opacity-60">{offer.expire}</p>
                <Button size="sm" variant="ghost" className="mt-4 text-primary-foreground hover:bg-white/10 rounded-xl px-0">
                  Shop Now <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
      <FloatingButtons />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} itemCount={cartCount} />
    </div>
  );
};

export default OffersPage;
