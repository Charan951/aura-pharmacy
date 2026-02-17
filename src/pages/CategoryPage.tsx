import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingCart, Star, BadgePercent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { allProducts } from "@/data/products";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import CartDrawer from "@/components/CartDrawer";
import { useState } from "react";

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [cartOpen, setCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const decodedCategory = decodeURIComponent(category || "");
  const filtered = allProducts.filter(
    (p) => p.category.toLowerCase() === decodedCategory.toLowerCase()
  );

  const handleAddToCart = (name: string) => {
    setCartCount((c) => c + 1);
    toast.success(`${name} added to cart!`, { position: "top-right", duration: 2000 });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />

      <div className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-foreground">{decodedCategory}</h1>
            <p className="text-muted-foreground mt-1">{filtered.length} products found</p>
          </motion.div>

          {filtered.length === 0 ? (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-xl text-muted-foreground">No products found in this category.</p>
              <Link to="/">
                <Button className="mt-4 gradient-primary text-primary-foreground rounded-2xl">
                  Go Back Home
                </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filtered.map((product, i) => (
                <motion.div
                  key={product.id}
                  className="group relative bg-card rounded-3xl border border-border/50 overflow-hidden transition-all duration-300 hover:shadow-card-hover"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ scale: 1.03, y: -4 }}
                >
                  {product.discount > 25 && (
                    <motion.div
                      className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full gradient-primary text-primary-foreground text-[10px] font-bold"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <BadgePercent className="w-3 h-3" />
                      {product.discount}% OFF
                    </motion.div>
                  )}

                  {product.tag && (
                    <span className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full bg-trust text-trust-foreground text-[10px] font-bold">
                      {product.tag}
                    </span>
                  )}

                  <div className="h-40 flex items-center justify-center bg-muted/30 text-5xl transition-colors duration-300 group-hover:bg-accent/30">
                    {product.image}
                  </div>

                  <div className="p-4">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{product.brand}</p>
                    <h3 className="font-semibold text-sm text-foreground mt-1 line-clamp-2 leading-snug">{product.name}</h3>

                    <div className="flex items-center gap-1 mt-2">
                      <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-trust/10">
                        <Star className="w-3 h-3 fill-trust text-trust" />
                        <span className="text-[10px] font-bold text-trust">{product.rating}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">({product.reviews.toLocaleString()})</span>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div>
                        <span className="text-lg font-bold text-foreground">₹{product.price}</span>
                        <span className="text-xs text-muted-foreground line-through ml-1.5">₹{product.originalPrice}</span>
                      </div>
                    </div>

                    <motion.div className="mt-3" whileTap={{ scale: 0.93 }}>
                      <Button
                        size="sm"
                        className="w-full gradient-primary text-primary-foreground rounded-xl text-xs font-semibold"
                        onClick={() => handleAddToCart(product.name)}
                      >
                        <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
                        Add to Cart
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
      <FloatingButtons />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} itemCount={cartCount} />
    </div>
  );
};

export default CategoryPage;
