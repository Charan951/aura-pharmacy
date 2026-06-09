import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, User, Menu, X, Sun, Moon, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { apiClient, PRODUCT_ENDPOINTS, OFFER_ENDPOINTS, ARTICLE_ENDPOINTS } from "@/api";

interface NavbarProps {
  cartCount: number;
  onCartOpen: () => void;
}

const Navbar = ({ cartCount, onCartOpen }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, clearSession } = useAuth();
  const { totalItems } = useCart();
  const queryClient = useQueryClient();
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (value: string) => {
    const term = value.trim();
    if (!term) {
      return;
    }
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  const handlePrefetch = (to: string) => {
    if (to === "/categories") {
      queryClient.prefetchQuery({
        queryKey: ["all-products"],
        queryFn: async () => {
          const response = await apiClient.get(PRODUCT_ENDPOINTS.LIST);
          return response.data;
        },
      });
    }

    if (to === "/offers") {
      queryClient.prefetchQuery({
        queryKey: ["offers"],
        queryFn: async () => {
          const response = await apiClient.get(OFFER_ENDPOINTS.LIST);
          return response.data;
        },
      });
    }

    if (to === "/projects") {
      queryClient.prefetchQuery({
        queryKey: ["articles"],
        queryFn: async () => {
          const response = await apiClient.get(ARTICLE_ENDPOINTS.LIST);
          return response.data;
        },
      });
    }
  };

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "About Us", to: "/about" },
    { label: "Categories", to: "/categories" },
    { label: "Projects", to: "/projects" },
    { label: "Offers", to: "/offers" },
    { label: "Contact Us", to: "/contact" },
  ];

  const isActiveLink = (to: string) => {
    if (to === "/") {
      return location.pathname === "/";
    }

    if (to === "/categories") {
      return (
        location.pathname === "/categories" ||
        location.pathname.startsWith("/category/") ||
        location.pathname === "/search"
      );
    }

    if (to === "/projects") {
      return location.pathname.startsWith("/projects");
    }

    return location.pathname === to;
  };

  const showSearch =
    location.pathname === "/categories" ||
    location.pathname.startsWith("/category/") ||
    location.pathname === "/search";

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
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-6">
          <motion.a
            href="/"
            className="flex items-center gap-2 shrink-0"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">+</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-gradient">MediCare</span>
              <span className="block text-[10px] text-muted-foreground -mt-1 tracking-wider">PHARMACY</span>
            </div>
          </motion.a>

          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link, index) => {
                const active = isActiveLink(link.to);
                return (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.04 }}
                  >
                    <Link
                      to={link.to}
                      className={`relative text-sm font-medium pb-1 group ${
                        active
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      onMouseEnter={() => handlePrefetch(link.to)}
                      onFocus={() => handlePrefetch(link.to)}
                    >
                      {link.label}
                      <span
                        className={`absolute bottom-0 left-0 h-0.5 rounded-full gradient-primary transition-all duration-300 ${
                          active ? "w-full" : "w-0 group-hover:w-full"
                        }`}
                      />
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {showSearch && (
              <motion.div
                className="flex-1 max-w-xl hidden lg:block"
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
                    value={searchValue}
                    onChange={(event) => setSearchValue(event.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        handleSearch(searchValue);
                      }
                    }}
                  />
                </div>
              </motion.div>
            )}

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl transition-all duration-300"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
              >
                {mounted && theme === "dark" ? (
                  <Sun className="w-5 h-5 text-amber-400" />
                ) : (
                  <Moon className="w-5 h-5 text-foreground" />
                )}
              </Button>

              {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hidden md:flex rounded-xl">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">Signed in as</span>
                      <span className="text-sm font-medium text-foreground truncate">
                        {user?.name || user?.email}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user?.role === "admin" || user?.role === "staff" ? (
                    <DropdownMenuItem
                      onClick={() => {
                        navigate("/admin");
                      }}
                      className="font-semibold text-primary hover:text-primary-foreground focus:text-primary-foreground focus:bg-primary/90"
                    >
                      Admin Dashboard
                    </DropdownMenuItem>
                  ) : (
                    <>
                      <DropdownMenuItem
                        onClick={() => {
                          navigate("/orders");
                        }}
                      >
                        My Orders
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          navigate("/prescriptions");
                        }}
                      >
                        Prescriptions
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          navigate("/profile");
                        }}
                      >
                        Profile
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      clearSession();
                      toast.success("Logged out");
                    }}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden md:flex rounded-xl"
                  onClick={() => navigate("/login")}
                >
                  <User className="w-5 h-5" />
                </Button>
              )}
              
              {/* Notification Bell */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative rounded-xl transition-all duration-300">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 p-2">
                  <DropdownMenuLabel className="font-semibold text-sm flex items-center justify-between">
                    <span>Notifications</span>
                    <button className="text-[10px] text-primary hover:underline font-medium">Mark all as read</button>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-72 overflow-y-auto space-y-1 py-1">
                    <DropdownMenuItem className="flex flex-col items-start p-2.5 cursor-pointer rounded-lg hover:bg-muted">
                      <div className="flex items-center gap-2 w-full">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                        <span className="font-semibold text-xs text-foreground">Prescription Verified</span>
                        <span className="text-[9px] text-muted-foreground ml-auto">Just now</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1 leading-normal">
                        Your uploaded prescription for Amoxicillin has been reviewed and verified by our pharmacist.
                      </p>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-1" />
                    <DropdownMenuItem className="flex flex-col items-start p-2.5 cursor-pointer rounded-lg hover:bg-muted">
                      <div className="flex items-center gap-2 w-full">
                        <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                        <span className="font-semibold text-xs text-foreground">Order Dispatched</span>
                        <span className="text-[9px] text-muted-foreground ml-auto">2h ago</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1 leading-normal">
                        Order #71A9B2 containing Vitamin C has been packed and handed over to delivery partner.
                      </p>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-1" />
                    <DropdownMenuItem className="flex flex-col items-start p-2.5 cursor-pointer rounded-lg hover:bg-muted">
                      <div className="flex items-center gap-2 w-full">
                        <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                        <span className="font-semibold text-xs text-foreground">Summer Offers Live</span>
                        <span className="text-[9px] text-muted-foreground ml-auto">1d ago</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1 leading-normal">
                        Get flat 20% discount on skincare products and summer protection creams.
                      </p>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <motion.div whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative rounded-xl"
                  onClick={onCartOpen}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <AnimatePresence>
                    {totalItems > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full gradient-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center"
                      >
                        {totalItems}
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
        </div>

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
              {showSearch && (
                <div className="relative flex items-center rounded-2xl border border-border bg-muted/50">
                  <Search className="w-4 h-4 ml-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search medicines..."
                    className="w-full px-3 py-2.5 bg-transparent text-sm outline-none"
                    value={searchValue}
                    onChange={(event) => setSearchValue(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        handleSearch(searchValue);
                        setMobileMenuOpen(false);
                      }
                    }}
                  />
                </div>
              )}
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

              {isAuthenticated && (
                <>
                  <div className="h-px bg-border/50 my-2" />
                  {user?.role === "admin" || user?.role === "staff" ? (
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: navLinks.length * 0.05 }}
                    >
                      <Link
                        to="/admin"
                        className="block py-2 text-sm font-semibold text-primary hover:text-primary-foreground"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    </motion.div>
                  ) : (
                    <>
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: (navLinks.length + 1) * 0.05 }}
                      >
                        <Link
                          to="/orders"
                          className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          My Orders
                        </Link>
                      </motion.div>
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: (navLinks.length + 2) * 0.05 }}
                      >
                        <Link
                          to="/prescriptions"
                          className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Prescriptions
                        </Link>
                      </motion.div>
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: (navLinks.length + 3) * 0.05 }}
                      >
                        <Link
                          to="/profile"
                          className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Profile
                        </Link>
                      </motion.div>
                    </>
                  )}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: (navLinks.length + 4) * 0.05 }}
                  >
                    <button
                      onClick={() => {
                        clearSession();
                        setMobileMenuOpen(false);
                        toast.success("Logged out");
                      }}
                      className="block w-full text-left py-2 text-sm font-medium text-rose-400 hover:text-rose-300"
                    >
                      Logout
                    </button>
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
