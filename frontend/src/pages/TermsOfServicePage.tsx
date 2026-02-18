import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import CartDrawer from "@/components/CartDrawer";
import { useCart } from "@/hooks/use-cart";

const TermsOfServicePage = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const { totalItems } = useCart();

  const cartCount = totalItems;

  const sections = [
    {
      title: "1. Using MediCare Pharmacy",
      content:
        "By creating an account or placing an order on MediCare Pharmacy, you confirm that you are at least 18 years old and are legally allowed to purchase medicines and healthcare products in your region. You agree to provide accurate information and to use the platform only for personal, non-commercial purposes.",
    },
    {
      title: "2. Prescriptions and medicine orders",
      content:
        "Certain products may require a valid prescription from a registered medical practitioner. Our pharmacists may review, verify or decline orders if prescriptions are unclear, expired, inappropriate or incomplete. We may also contact you or your doctor for clarification before processing such orders.",
    },
    {
      title: "3. Pricing, payment and cancellations",
      content:
        "Product prices, discounts and availability may change from time to time. Your final payable amount will be shown at checkout before you confirm the order. Payments are processed through secure gateways. Orders may be cancelled by you before they are packed, or by us if items are unavailable or fail mandatory checks.",
    },
    {
      title: "4. Delivery and service limitations",
      content:
        "We aim to deliver orders within the timelines shown at checkout, but actual delivery times may vary due to location, inventory, courier capacity and regulatory checks. In some areas or for some medicines, we may be unable to deliver due to compliance or safety reasons.",
    },
    {
      title: "5. Liability and medical advice",
      content:
        "Content on the website, including health tips and product descriptions, is for general information only and is not a substitute for professional medical advice. Always consult a qualified doctor for diagnosis and treatment. To the extent permitted by law, MediCare Pharmacy is not liable for indirect or consequential damages arising from use of the service.",
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
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">Terms of service</h1>
            <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
              These terms explain your responsibilities and how MediCare Pharmacy provides its online
              pharmacy services.
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
              By continuing to use the website or mobile experience, you indicate that you have read
              and agree to these terms. If you do not agree, you should stop using MediCare Pharmacy.
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

export default TermsOfServicePage;

