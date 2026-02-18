import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Tag, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import CartDrawer from "@/components/CartDrawer";
import { useCart } from "@/hooks/use-cart";
import { apiClient } from "@/api";
import { apiBaseUrl } from "@/lib/utils";

type Offer = {
  _id: string;
  title: string;
  description?: string;
  code?: string;
  expiresAt?: string;
  image?: string;
};

const OffersPage = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const { totalItems } = useCart();

  const cartCount = totalItems;

  const { data, isLoading, isError } = useQuery<Offer[]>({
    queryKey: ["offers"],
    queryFn: async () => {
      const response = await apiClient.get<Offer[]>(`${apiBaseUrl}/api/offers`);
      return response.data;
    },
  });

  const offers = data ?? [];

  const renderContent = () => {
    if (isLoading) {
      return (
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-lg text-muted-foreground">Loading offers...</p>
        </motion.div>
      );
    }

    if (isError) {
      return (
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-lg text-muted-foreground">Failed to load offers.</p>
        </motion.div>
      );
    }

    if (offers.length === 0) {
      return (
        <div className="flex justify-center">
          <div className="rounded-3xl border border-dashed border-border/60 px-6 py-8 max-w-md text-center">
            <p className="text-sm text-muted-foreground">
              No active offers are available right now. New promotions will appear here when configured.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((offer, index) => {
          const expiresLabel =
            offer.expiresAt != null
              ? new Date(offer.expiresAt).toLocaleDateString()
              : "Limited time offer";

          return (
            <motion.div
              key={offer._id}
              className="rounded-3xl p-6 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground overflow-hidden relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
              <div className="flex items-center gap-3 mb-3 relative z-10">
                {offer.image ? (
                  <img
                    src={offer.image}
                    alt={offer.title}
                    className="w-10 h-10 rounded-full object-cover border border-white/40 shadow-sm"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
                    <Tag className="w-5 h-5 opacity-80" />
                  </div>
                )}
                <h3 className="text-xl font-bold">{offer.title}</h3>
              </div>
              {offer.description && (
                <p className="text-sm opacity-90 mt-1 relative z-10">{offer.description}</p>
              )}
              {offer.code && (
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-sm relative z-10">
                  <span>Code:</span>
                  <span className="font-mono tracking-wide">{offer.code}</span>
                </div>
              )}
              <div className="mt-4 flex items-center gap-2 text-xs opacity-80 relative z-10">
                <Clock className="w-3.5 h-3.5" />
                <span>{expiresLabel}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />
      <div className="pt-32 md:pt-40 pb-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground">Offers</h1>
            <p className="text-muted-foreground mt-2">
              View active promotions and discounts from your pharmacy.
            </p>
          </motion.div>

          {renderContent()}
        </div>
      </div>
      <Footer />
      <FloatingButtons />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

export default OffersPage;
