import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import CartDrawer from "@/components/CartDrawer";
import { useCart } from "@/hooks/use-cart";

const ReturnPolicyPage = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const { totalItems } = useCart();

  const cartCount = totalItems;

  const sections = [
    {
      title: "1. Items eligible for return",
      content:
        "Unopened medicines, wellness products and personal care items in original condition and packaging may be eligible for return within 3 days of delivery. Temperature-sensitive or cold-chain medicines cannot be returned unless there is a verified delivery error.",
    },
    {
      title: "2. Situations where returns are accepted",
      content:
        "We accept returns when you receive the wrong product, damaged packing that affects product quality, an incorrect quantity, or an expired or near-expiry product. In such cases we will arrange a replacement or issue a refund as applicable.",
    },
    {
      title: "3. How to raise a return request",
      content:
        "Please contact our customer support via the Contact Us page or call 1800-123-4567 within 48 hours of delivery. Keep your order ID, product photos and packaging details ready so that our team can quickly verify and approve your request.",
    },
    {
      title: "4. Refund timelines",
      content:
        "Once the product is picked up and inspected, refunds for prepaid orders are typically processed within 5–7 working days to the original payment method. For cash on delivery orders, refunds are issued as wallet credit or bank transfer after confirmation.",
    },
    {
      title: "5. Exceptions and pharmacy guidelines",
      content:
        "As per pharmacy regulations, prescription medicines that have been opened or used cannot be returned. We also reserve the right to decline returns that show signs of tampering, misuse or are requested outside the allowed time window.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />
      <div className="pt-32 md:pt-40 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 text-center"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">Return & refund policy</h1>
            <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
              We follow pharmacy best practices to keep you safe while offering a fair and transparent
              return experience.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl border border-border/60 bg-card/80 p-6 md:p-8 space-y-5 text-sm md:text-base text-muted-foreground leading-relaxed shadow-sm"
          >
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="text-base md:text-lg font-semibold text-foreground mb-1">
                  {section.title}
                </h2>
                <p>{section.content}</p>
              </div>
            ))}
            <p className="text-xs text-muted-foreground mt-4">
              This policy is a general guideline and may be updated based on local regulations and
              pharmacy standards. The final decision on returns rests with MediCare&apos;s quality team.
            </p>
          </motion.div>
        </div>
      </div>
      <Footer />
      <FloatingButtons />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

export default ReturnPolicyPage;
