import { useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import CartDrawer from "@/components/CartDrawer";
import { apiClient, PRODUCT_ENDPOINTS } from "@/api";
import { toast } from "sonner";
import { categories as categoryNames } from "@/data/products";
import { useCart } from "@/hooks/use-cart";

type Product = {
  _id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image?: string;
  stock?: number;
};

const CategoryPage = () => {
  const { category } = useParams<{ category?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [cartOpen, setCartOpen] = useState(false);
  const { addItem, totalItems } = useCart();

  const decodedCategory = decodeURIComponent(category || "");
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = (searchParams.get("q") || "").trim();
  const isSearchMode = !decodedCategory && searchTerm.length > 0;

  const { data, isLoading, isError } = useQuery<Product[]>({
    queryKey: ["category-products", { category: decodedCategory, search: searchTerm, isSearchMode }],
    queryFn: async () => {
      const params: Record<string, string> = {};

      if (isSearchMode) {
        params.search = searchTerm;
      } else if (decodedCategory.length > 0) {
        params.category = decodedCategory;
      }

      const response = await apiClient.get<Product[]>(PRODUCT_ENDPOINTS.LIST, {
        params,
      });
      return response.data;
    },
    enabled: isSearchMode ? searchTerm.length > 0 : decodedCategory.length > 0,
    placeholderData: keepPreviousData,
  });

  const products = Array.isArray(data) ? data : [];

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

  const handleCategoryFilterClick = (name: string) => {
    navigate(`/category/${encodeURIComponent(name)}`);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <motion.div
          className="text-center py-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-xl text-muted-foreground">Loading products...</p>
        </motion.div>
      );
    }

    if (isError) {
      return (
        <motion.div
          className="text-center py-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-xl text-muted-foreground">Failed to load products.</p>
          <Link to="/">
            <Button className="mt-4 gradient-primary text-primary-foreground rounded-2xl">
              Go Back Home
            </Button>
          </Link>
        </motion.div>
      );
    }

    if (products.length === 0) {
      return (
        <motion.div
          className="text-center py-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-xl text-muted-foreground">
            {isSearchMode ? "No products found for this search." : "No products found in this category."}
          </p>
          <Link to="/">
            <Button className="mt-4 gradient-primary text-primary-foreground rounded-2xl">
              Go Back Home
            </Button>
          </Link>
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
            transition={{ delay: i * 0.07 }}
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

      <div className="pt-32 md:pt-40 pb-16">
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
            <h1 className="text-3xl font-bold text-foreground">
              {isSearchMode ? `Search results for "${searchTerm}"` : decodedCategory}
            </h1>
            {!isLoading && !isError && (
              <p className="text-muted-foreground mt-1">
                {products.length} product{products.length === 1 ? "" : "s"} found
                {isSearchMode && searchTerm ? ` for "${searchTerm}"` : ""}
              </p>
            )}
          </motion.div>

          <div className="flex flex-wrap gap-2 mb-6">
            {categoryNames.map((name) => (
              <Button
                key={name}
                variant={name === decodedCategory ? "default" : "outline"}
                size="sm"
                className="rounded-full text-xs"
                onClick={() => handleCategoryFilterClick(name)}
              >
                {name}
              </Button>
            ))}
          </div>

          {renderContent()}
        </div>
      </div>

      <Footer />
      <FloatingButtons />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

export default CategoryPage;
