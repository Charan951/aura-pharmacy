import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import CartDrawer from "@/components/CartDrawer";
import { useCart } from "@/hooks/use-cart";

const faqs = [
  {
    question: "Do I need a prescription to order medicines?",
    answer:
      "Yes, prescription medicines require a valid prescription issued by a registered medical practitioner. You can upload a clear photo of the prescription during checkout or from the prescriptions section. Over-the-counter wellness and personal care products can be ordered without a prescription.",
  },
  {
    question: "How long does delivery usually take?",
    answer:
      "Delivery time depends on your location and the type of products ordered. Most metro orders are delivered within 24–48 hours, while non-metro locations may take 3–5 working days. You will receive regular updates by SMS or email once the order is confirmed.",
  },
  {
    question: "Can I change or cancel my order after placing it?",
    answer:
      "You can request a change or cancellation before the order is packed by reaching out to our support team with your order ID. Once the order has been packed or dispatched, cancellations may not be possible due to pharmacy regulations and logistics constraints.",
  },
  {
    question: "How are medicines stored and packed?",
    answer:
      "All medicines are stored in temperature-controlled environments as per manufacturer guidelines. We use tamper-evident, protective packing so that products reach you in good condition. Cold-chain items are shipped with specialised packaging and handling.",
  },
  {
    question: "Is my data secure with MediCare?",
    answer:
      "We take data privacy seriously. Your personal information and prescription data are encrypted and stored securely. We do not share your details with third parties without consent, except where required by law or necessary to fulfil your order.",
  },
];

const FaqsPage = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const { totalItems } = useCart();

  const cartCount = totalItems;

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
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">Frequently asked questions</h1>
            <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
              Find quick answers to common questions about orders, prescriptions and delivery.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl border border-border/60 bg-card/80 divide-y divide-border/60 shadow-sm"
          >
            {faqs.map((faq, index) => (
              <div key={faq.question} className="p-5 md:p-6">
                <h2 className="text-sm md:text-base font-semibold text-foreground">
                  {index + 1}. {faq.question}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </motion.div>

          <p className="mt-6 text-xs text-muted-foreground text-center">
            Still have questions? Visit the Contact Us or Feedback pages and our team will be happy
            to help.
          </p>
        </div>
      </div>
      <Footer />
      <FloatingButtons />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

export default FaqsPage;
