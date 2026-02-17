import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, User, Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface NavbarProps {
  cartCount: number;
  onCartOpen: () => void;
}

const Navbar = ({ cartCount, onCartOpen }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Categories", to: "/#categories" },
    { label: "Offers", to: "/offers" },
    { label: "Health Blog", to: "/health-blog" },
    { label: "About", to: "/about" },
  ];

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass shadow-soft py-2"
          : "bg-card/90 backdrop-blur-sm py-4"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Top bar */}
      <div className="hidden md:block border-b border-border/50">
        <div className="container mx-auto px-4 flex items-center justify-between py-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Phone className="w-3 h-3" />
            <span>24/7 Support: 1800-123-4567</span>
          </div>
          <span>Free delivery on orders above ₹499</span>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <motion.a
            href="/"
            className="flex items-center gap-2 shrink-0"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">+</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-gradient">MediCare</span>
              <span className="block text-[10px] text-muted-foreground -mt-1 tracking-wider">PHARMACY</span>
            </div>
          </motion.a>

          {/* Search */}
          <motion.div
            className="flex-1 max-w-xl hidden md:block"
            animate={{ maxWidth: searchFocused ? "36rem" : "32rem" }}
            transition={{ duration: 0.3 }}
          >
            <div
              className={`relative flex items-center rounded-2xl border transition-all duration-300 ${
                searchFocused
                  ? "border-primary shadow-glow bg-card"
                  : "border-border bg-muted/50"
              }`}
            >
              <Search className="w-4 h-4 ml-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search medicines, health products..."
                className="w-full px-3 py-2.5 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </div>
          </motion.div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hidden md:flex rounded-xl">
              <User className="w-5 h-5" />
            </Button>

            <motion.div whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-xl"
                onClick={onCartOpen}
              >
                <ShoppingCart className="w-5 h-5" />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full gradient-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-xl"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6 mt-2 pb-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors pb-1 group"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 rounded-full gradient-primary transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-border/50"
          >
            <div className="container mx-auto px-4 py-4 space-y-3">
              <div className="relative flex items-center rounded-2xl border border-border bg-muted/50">
                <Search className="w-4 h-4 ml-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search medicines..."
                  className="w-full px-3 py-2.5 bg-transparent text-sm outline-none"
                />
              </div>
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={link.to}
                    className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
