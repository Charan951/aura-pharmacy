import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import CartDrawer from "@/components/CartDrawer";
import { useCart } from "@/hooks/use-cart";

const PrivacyPolicyPage = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const { totalItems } = useCart();

  const cartCount = totalItems;

  const sections = [
    {
      title: "1. Information we collect",
      content:
        "When you create an account, place an order or contact support, we collect details such as your name, contact information, delivery address, prescription information shared by you, and basic technical data like device type and browser. We only collect information that is necessary to provide pharmacy services safely and in line with regulations.",
    },
    {
      title: "2. How we use your data",
      content:
        "Your information is used to process orders, verify prescriptions, coordinate delivery, send important updates about your purchases and respond to your queries. We may also use anonymised and aggregated data to improve our services, product availability and user experience across the platform.",
    },
    {
      title: "3. Sharing with third parties",
      content:
        "We do not sell your personal data. Limited information may be shared with trusted partners such as delivery providers, payment gateways and labs, strictly for fulfilling your orders or services you request. All such partners are required to follow confidentiality and data protection obligations.",
    },
    {
      title: "4. Data security and retention",
      content:
        "We use industry-standard safeguards to protect your data, including encryption in transit and access controls for sensitive records. Your information is retained only for as long as required by law or for providing you ongoing pharmacy services, after which it is securely deleted or anonymised.",
    },
    {
      title: "5. Your rights and choices",
      content:
        "You can review or update your profile details from the My Account section and contact us to request correction of inaccurate information. For certain records such as prescriptions and invoices, we may be required to retain data for a minimum period as per applicable healthcare regulations.",
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
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">Privacy policy</h1>
            <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
              Learn how we collect, use and protect your personal and health information when you use
              MediCare Pharmacy.
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
              This summary is for convenience and may be updated to reflect changes in technology or
              regulations. For specific questions about how your data is handled, please reach out to
              our support team.
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

export default PrivacyPolicyPage;

