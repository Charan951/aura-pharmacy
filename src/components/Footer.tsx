import { motion } from "framer-motion";
import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  const links = {
    "Quick Links": ["Home", "Shop", "Categories", "Offers", "About Us"],
    "Customer Care": ["Track Order", "Return Policy", "FAQs", "Contact Us", "Feedback"],
    "Legal": ["Privacy Policy", "Terms of Service", "Refund Policy", "Disclaimer"],
  };

  return (
    <footer className="bg-foreground text-background/80 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">+</span>
              </div>
              <span className="text-xl font-bold text-background">MediCare</span>
            </div>
            <p className="text-sm leading-relaxed text-background/60">
              India's most trusted online pharmacy. We deliver genuine medicines with care.
            </p>
            <div className="space-y-2 mt-4 text-sm text-background/60">
              <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> 1800-123-4567</div>
              <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> support@medicare.com</div>
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Mumbai, India</div>
            </div>
          </motion.div>

          {/* Links */}
          {Object.entries(links).map(([title, items], i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i + 1) * 0.1 }}
            >
              <h4 className="font-semibold text-background mb-4">{title}</h4>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-background/50 hover:text-background transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="border-t border-background/10 mt-12 pt-6 text-center text-xs text-background/40">
          © 2026 MediCare Pharmacy. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
