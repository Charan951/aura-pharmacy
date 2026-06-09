import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/api";
import { apiBaseUrl } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";
import { Link } from "react-router-dom";

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

const FeaturedProducts = () => {
  const { addItem } = useCart();

  const { data, isLoading, isError } = useQuery<Product[]>({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const response = await apiClient.get<Product[]>(`${apiBaseUrl}/api/products`);
      return response.data;
    },
  });

  const featured = Array.isArray(data) ? data.slice(0, 4) : [];

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

  return (
    <section className="py-16 md:py-24 bg-background relative">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-semibold mb-4 uppercase tracking-wider">
              Trending Now
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
              Featured <span className="text-gradient">Products</span>
            </h2>
          </div>
          <Link
            to="/categories"
            className="group flex items-center gap-1.5 text-sm font-semibold text-primary mt-4 sm:mt-0 hover:underline"
          >
            View All Products <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-card rounded-3xl border border-border/40 p-4 h-80 animate-pulse flex flex-col justify-between">
                <div className="h-40 bg-muted/40 rounded-2xl" />
                <div className="space-y-2 mt-4 flex-1">
                  <div className="h-4 bg-muted/40 rounded w-1/3" />
                  <div className="h-6 bg-muted/40 rounded w-3/4" />
                </div>
                <div className="h-9 bg-muted/40 rounded-xl mt-3" />
              </div>
            ))}
          </div>
        ) : isError || featured.length === 0 ? (
          <div className="text-center py-12 rounded-3xl border border-dashed border-border/50">
            <p className="text-muted-foreground text-sm">
              {isError
                ? "Failed to load featured products. Please check if the backend is running."
                : "No featured products available at this moment."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((product, i) => (
              <motion.div
                key={product._id}
                className="group relative bg-card rounded-3xl border border-border/50 overflow-hidden transition-all duration-300 hover:shadow-card-hover"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.02, y: -4 }}
              >
                <div className="h-44 bg-white flex items-center justify-center border-b border-border/10 p-4 relative overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <span className="text-5xl font-bold text-gray-300">{product.name.charAt(0)}</span>
                  )}
                </div>

                <div className="p-5">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                    {product.brand}
                  </p>
                  <h3 className="font-bold text-sm text-foreground mt-1 line-clamp-2 leading-snug h-10 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>

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

                  <motion.div className="mt-4" whileTap={{ scale: 0.95 }}>
                    <Button
                      size="sm"
                      className="w-full gradient-primary text-primary-foreground rounded-xl text-xs font-semibold shadow-soft"
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
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
