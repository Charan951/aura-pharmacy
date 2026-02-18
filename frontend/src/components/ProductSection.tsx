import { motion } from "framer-motion";
import { ShoppingCart, Star, BadgePercent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { allProducts, type Product } from "@/data/products";

const products = allProducts.slice(0, 8);

interface ProductSectionProps {
  onAddToCart: () => void;
}

const ProductSection = ({ onAddToCart }: ProductSectionProps) => {
  const handleAddToCart = (product: Product) => {
    onAddToCart();
    toast.success(`${product.name} added to cart!`, {
      position: "top-right",
      duration: 2000,
    });
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          className="flex items-center justify-between mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div>
            <h2 className="text-3xl font-bold text-foreground">Trending Products</h2>
            <p className="text-muted-foreground mt-1">Best deals on top healthcare products</p>
          </div>
          <Button variant="outline" className="hidden md:flex rounded-2xl border-primary/30 text-primary hover:bg-primary/5">
            View All
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              className="group relative bg-card rounded-3xl border border-border/50 overflow-hidden transition-all duration-300 hover:shadow-card-hover"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ scale: 1.03, y: -4 }}
            >
              {/* Discount badge */}
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

              {/* Product image */}
              <div className="h-40 flex items-center justify-center bg-muted/30 text-5xl transition-colors duration-300 group-hover:bg-accent/30">
                {product.image}
              </div>

              {/* Info */}
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

                {/* Add to cart - slides up on hover */}
                <motion.div
                  className="mt-3"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <motion.div whileTap={{ scale: 0.93 }}>
                    <Button
                      size="sm"
                      className="w-full gradient-primary text-primary-foreground rounded-xl text-xs font-semibold"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
                      Add to Cart
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
