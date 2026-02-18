import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import Navbar from "@/components/Navbar";
import CategorySection from "@/components/CategorySection";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import CartDrawer from "@/components/CartDrawer";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/api";
import { apiBaseUrl } from "@/lib/utils";
import { toast } from "sonner";
import { useCart } from "@/hooks/use-cart";

type Product = {
  _id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image?: string;
  category?: string;
  stock?: number;
};

const CategoriesPage = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const { addItem, totalItems } = useCart();

  const { data, isLoading, isError } = useQuery<Product[]>({
    queryKey: ["all-products"],
    queryFn: async () => {
      const response = await apiClient.get<Product[]>(`${apiBaseUrl}/api/products`);
      return response.data;
    },
  });

  const products = data ?? [];

  const cartCount = totalItems;

  const handleAddToCart = (product: Product) => {
    addItem(
      {
        productId: product._id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        maxQty: typeof product.stock === "number" && product.stock > 0 ? product.stock : undefined,
      },
      1,
    );

    toast.success(`${product.name} added to cart!`, { position: "top-right", duration: 2000 });
  };

  const renderProducts = () => {
    if (isLoading) {
      return (
        <motion.div
          className="text-center py-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-lg text-muted-foreground">Loading products...</p>
        </motion.div>
      );
    }

    if (isError) {
      return (
        <motion.div
          className="text-center py-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-lg text-muted-foreground">Failed to load products.</p>
        </motion.div>
      );
    }

    if (products.length === 0) {
      return (
        <motion.div
          className="text-center py-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-lg text-muted-foreground">No products available yet.</p>
        </motion.div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {products.map((product, i) => (
          <motion.div
            key={product._id}
            className="group relative bg-card rounded-3xl border border-border/50 overflow-hidden transition-all duration-300 hover:shadow-card-hover"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            whileHover={{ scale: 1.03, y: -4 }}
          >
            <div className="h-40 flex items-center justify-center bg-muted/30 text-5xl transition-colors duration-300 group-hover:bg-accent/30">
              {product.image ? (
                <img src={product.image} alt={product.name} className="h-32 w-32 object-contain rounded-2xl" />
              ) : (
                <span className="text-4xl">{product.name.charAt(0)}</span>
              )}
            </div>

            <div className="p-4">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                {product.brand}
              </p>
              <h3 className="font-semibold text-sm text-foreground mt-1 line-clamp-2 leading-snug">{product.name}</h3>
              {product.category && (
                <p className="text-[11px] text-muted-foreground mt-1">{product.category}</p>
              )}

              <div className="flex items-center justify-between mt-3">
                <div>
                  <span className="text-lg font-bold text-foreground">₹{product.price}</span>
                  {typeof product.originalPrice === "number" && product.originalPrice > product.price && (
                    <span className="text-xs text-muted-foreground line-through ml-1.5">
                      ₹{product.originalPrice}
                    </span>
                  )}
                </div>
              </div>

              <motion.div className="mt-3" whileTap={{ scale: 0.93 }}>
                <Button
                  size="sm"
                  className="w-full gradient-primary text-primary-foreground rounded-xl text-xs font-semibold"
                  onClick={() => handleAddToCart(product)}
                >
                  <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
                  Add to Cart
                </Button>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />
      <main className="pt-32 md:pt-40 pb-16">
        <CategorySection />

        <section className="mt-10">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">All Products</h2>
              {!isLoading && !isError && (
                <p className="text-sm text-muted-foreground">
                  {products.length} product{products.length === 1 ? "" : "s"} available
                </p>
              )}
            </div>
            {renderProducts()}
          </div>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

export default CategoriesPage;
