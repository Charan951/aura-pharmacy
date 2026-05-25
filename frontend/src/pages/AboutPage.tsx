import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import CartDrawer from "@/components/CartDrawer";
import { useCart } from "@/hooks/use-cart";
import { apiClient } from "@/api";
import { apiBaseUrl } from "@/lib/utils";

const AboutPage = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const { totalItems } = useCart();
  const [aboutImageOne, setAboutImageOne] = useState<string | null>(null);
  const [aboutImageTwo, setAboutImageTwo] = useState<string | null>(null);

  const cartCount = totalItems;

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await apiClient.get<{
          aboutSectionOneImage: string;
          aboutSectionTwoImage: string;
        }>(`${apiBaseUrl}/api/settings/about`);

        setAboutImageOne(response.data.aboutSectionOneImage);
        setAboutImageTwo(response.data.aboutSectionTwoImage);
      } catch {
        // Silent fail, fall back to defaults
      }
    };

    loadSettings();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />

      <section className="pt-32 md:pt-40 pb-16">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            className="text-4xl md:text-5xl font-extrabold text-foreground"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            About <span className="text-gradient">MediCare</span>
          </motion.h1>
          <motion.p
            className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            Learn more about your pharmacy, its mission, and how it serves customers.
          </motion.p>
        </div>
      </section>

      <section className="pb-16">
        <div className="container mx-auto px-4 space-y-16">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-left"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Caring for your family&apos;s everyday health
              </h2>
              <p className="mt-4 text-sm md:text-base text-muted-foreground leading-relaxed">
                MediCare is built around a simple idea: medicines and health essentials should be
                easy to access, clearly explained, and delivered with care. From daily
                prescriptions to wellness products, our team works behind the scenes to make sure
                every order is safe, accurate, and on time.
              </p>
              <p className="mt-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                Our pharmacists review critical orders, double-check interactions, and are always
                ready to help you understand how and when to take your medicines. With digital
                prescriptions, refill reminders and transparent pricing, we aim to be your trusted
                health partner, not just another online store.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-primary/20 border border-primary/15 h-80 md:h-[400px] flex items-center justify-center">
                <img
                  src={aboutImageOne || "https://via.placeholder.com/640x360.png?text=Pharmacy+Team"}
                  alt="Pharmacy team"
                  className="absolute inset-4 rounded-2xl object-contain w-[calc(100%-2rem)] h-[calc(100%-2rem)] bg-white p-4 shadow-sm"
                />
              </div>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="order-2 md:order-1"
            >
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-emerald-500/20 border border-emerald-500/15 h-80 md:h-[400px] flex items-center justify-center">
                <img
                  src={
                    aboutImageTwo ||
                    "https://via.placeholder.com/640x360.png?text=Digital+Pharmacy+Experience"
                  }
                  alt="Digital pharmacy experience"
                  className="absolute inset-4 rounded-2xl object-contain w-[calc(100%-2rem)] h-[calc(100%-2rem)] bg-white p-4 shadow-sm"
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="order-1 md:order-2 text-left"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Technology that keeps your orders on track
              </h2>
              <p className="mt-4 text-sm md:text-base text-muted-foreground leading-relaxed">
                Behind every delivery is a connected system that tracks stock levels, checks batch
                expiry dates and keeps your prescription history organised. This helps us avoid
                errors, recommend suitable alternatives when items are out of stock, and keep your
                doctor informed when needed.
              </p>
              <p className="mt-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                Whether you order through the website or upload a prescription from your phone, you
                get the same level of care, packing standards and support. Our goal is to bring the
                familiar trust of your neighbourhood pharmacy into a modern, digital experience.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingButtons />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

export default AboutPage;
