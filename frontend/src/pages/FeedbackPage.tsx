import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import CartDrawer from "@/components/CartDrawer";
import { useCart } from "@/hooks/use-cart";

const FeedbackPage = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const { totalItems } = useCart();

  const cartCount = totalItems;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />
      <div className="pt-32 md:pt-40 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 text-center"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">Share your feedback</h1>
            <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
              Tell us what we are doing well and where we can improve. Your feedback helps us make
              MediCare safer and more convenient for every customer.
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl border border-border/60 bg-card/80 p-6 md:p-8 shadow-sm space-y-4"
          >
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground" htmlFor="experience">
                Overall experience
              </label>
              <select
                id="experience"
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                defaultValue=""
                required
              >
                <option value="" disabled>
                  Select an option
                </option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="average">Average</option>
                <option value="poor">Poor</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground" htmlFor="area">
                Area of feedback
              </label>
              <select
                id="area"
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                defaultValue=""
                required
              >
                <option value="" disabled>
                  Select an option
                </option>
                <option value="ordering">Ordering & checkout</option>
                <option value="delivery">Delivery experience</option>
                <option value="packaging">Product quality & packaging</option>
                <option value="support">Customer support</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground" htmlFor="comments">
                Comments
              </label>
              <textarea
                id="comments"
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/60 min-h-[140px] resize-y"
                placeholder="Share specific details about your experience, suggestions or issues."
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground" htmlFor="contact">
                Contact details (optional)
              </label>
              <input
                id="contact"
                type="text"
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                placeholder="Phone or email if you want us to respond"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
              disabled
            >
              Submit feedback (coming soon)
            </button>
            <p className="text-[11px] text-muted-foreground">
              By sharing feedback, you agree that we may use your comments to improve our services.
              We will not share your personal details with third parties without consent.
            </p>
          </motion.form>
        </div>
      </div>
      <Footer />
      <FloatingButtons />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

export default FeedbackPage;
