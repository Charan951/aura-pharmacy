import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import CartDrawer from "@/components/CartDrawer";
import { useCart } from "@/hooks/use-cart";

const ContactPage = () => {
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
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 text-center"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">Contact us</h1>
            <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
              Have a question about your order, prescriptions or our services? Share a few details
              and our pharmacy support team will get back to you.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-3xl border border-border/60 bg-card/80 p-6 md:p-8 shadow-sm space-y-4"
            >
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground" htmlFor="name">
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground" htmlFor="email">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground" htmlFor="subject">
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                  placeholder="Order support, prescription query..."
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground" htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/60 min-h-[120px] resize-y"
                  placeholder="Share as much detail as possible so we can assist you quickly."
                  required
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
                disabled
              >
                Submit enquiry (coming soon)
              </button>
              <p className="text-[11px] text-muted-foreground">
                For urgent order or medicine-related queries, please call 9929299201 instead of
                using this form.
              </p>
            </motion.form>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-3xl border border-border/60 bg-muted/40 p-6 md:p-8 space-y-4 text-sm text-muted-foreground leading-relaxed"
            >
              <h2 className="text-base md:text-lg font-semibold text-foreground">Support hours</h2>
              <p>
                Our pharmacy support team is available from <strong>9:00 AM to 9:00 PM</strong>,{" "}
                seven days a week, including most public holidays.
              </p>
              <h2 className="text-base md:text-lg font-semibold text-foreground mt-4">
                Contact details
              </h2>
              <ul className="space-y-1 text-sm">
                <li>Phone: 9929299201</li>
                <li>Email: charan@gmail.com</li>
                <li>Address: Hyderabad, India</li>
              </ul>
              <p className="mt-4">
                You can also reach us via the prescription upload and feedback sections within your
                account. We aim to respond to most non-urgent queries within one business day.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
      <FloatingButtons />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

export default ContactPage;
