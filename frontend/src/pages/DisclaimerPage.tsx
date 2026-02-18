import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import CartDrawer from "@/components/CartDrawer";
import { useCart } from "@/hooks/use-cart";

const DisclaimerPage = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const { totalItems } = useCart();

  const cartCount = totalItems;

  const sections = [
    {
      title: "1. No substitute for medical advice",
      content:
        "Information provided on MediCare Pharmacy, including health articles, product descriptions and FAQs, is meant for general education only. It should not be treated as medical advice, diagnosis or treatment for any condition. Always consult a registered doctor or qualified healthcare professional before starting, changing or stopping any medicine.",
    },
    {
      title: "2. Accuracy of content",
      content:
        "We make reasonable efforts to keep product information, availability and pricing up to date. However, typographical errors, delays in stock updates or changes in manufacturer packaging can occur. Actual packaging, ingredients and warnings on the product may differ from what is displayed online.",
    },
    {
      title: "3. Third‑party links and services",
      content:
        "Our website may contain links to third‑party websites, apps or services for convenience. MediCare Pharmacy does not control and is not responsible for the content, privacy practices or policies of these external sites. Accessing them is at your own discretion and risk.",
    },
    {
      title: "4. Limitation of liability",
      content:
        "While we take care to deliver genuine medicines and a safe experience, unforeseen issues may still arise. To the maximum extent permitted by law, MediCare Pharmacy and its team are not liable for any indirect, incidental or consequential loss arising from use of the website, delay in deliveries or reliance on informational content.",
    },
    {
      title: "5. Changes to this disclaimer",
      content:
        "This disclaimer may be updated periodically to reflect changes in our services or regulatory requirements. Continued use of MediCare Pharmacy after updates will be considered as acceptance of the revised disclaimer.",
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
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">Disclaimer</h1>
            <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
              Please read this disclaimer carefully to understand the nature and limitations of the
              services and information provided by MediCare Pharmacy.
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
              If you have any questions about this disclaimer or how it applies to you, please reach
              out to our customer support team before using our services.
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

export default DisclaimerPage;

