import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import CartDrawer from "@/components/CartDrawer";
import { useCart } from "@/hooks/use-cart";
import { Link } from "react-router-dom";
import { apiClient, ARTICLE_ENDPOINTS } from "@/api";

type Article = {
  _id: string;
  title: string;
  excerpt?: string;
  category?: string;
  emoji?: string;
  readTimeMinutes?: number;
  publishedAt?: string;
  image?: string;
};

const HealthBlogPage = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const { totalItems } = useCart();

  const cartCount = totalItems;

  const { data, isLoading, isError } = useQuery<Article[]>({
    queryKey: ["articles"],
    queryFn: async () => {
      const response = await apiClient.get<Article[]>(ARTICLE_ENDPOINTS.LIST);
      return response.data;
    },
  });

  const articles = data ?? [];

  const renderContent = () => {
    if (isLoading) {
      return (
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-lg text-muted-foreground">Loading articles...</p>
        </motion.div>
      );
    }

    if (isError) {
      return (
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-lg text-muted-foreground">Failed to load articles.</p>
        </motion.div>
      );
    }

    if (articles.length === 0) {
      return (
        <div className="flex justify-center">
          <div className="rounded-3xl border border-dashed border-border/60 px-6 py-8 max-w-md text-center">
            <p className="text-sm text-muted-foreground">
              No health articles have been published yet. New posts will appear here once created.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, index) => {
          const publishedLabel =
            article.publishedAt != null
              ? new Date(article.publishedAt).toLocaleDateString()
              : "";
          const readTimeLabel =
            typeof article.readTimeMinutes === "number" && article.readTimeMinutes > 0
              ? `${article.readTimeMinutes} min read`
              : "";

          return (
            <motion.article
              key={article._id}
              className="bg-card rounded-3xl border border-border/50 overflow-hidden group transition-all duration-300 hover:shadow-card-hover"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              whileHover={{ y: -4 }}
            >
              <Link to={`/projects/${article._id}`} className="block cursor-pointer">
                <div className="h-56 bg-white flex items-center justify-center group-hover:bg-accent/5 transition-colors overflow-hidden border-b border-border/10 p-4">
                  {article.image ? (
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-6xl">{article.emoji || "🩺"}</span>
                  )}
                </div>
                <div className="p-5">
                  {article.category && (
                    <span className="inline-block px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-semibold uppercase tracking-wider">
                      {article.category}
                    </span>
                  )}
                  <h3 className="font-bold text-foreground mt-3 text-lg leading-snug group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {article.excerpt}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{publishedLabel || "Recently added"}</span>
                    </div>
                    {readTimeLabel && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{readTimeLabel}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-primary">
                    Read More <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.article>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />
      <div className="pt-32 md:pt-40 pb-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground">Projects</h1>
            <p className="text-muted-foreground mt-2">
              Explore our custom healthcare projects and pharmacy solutions.
            </p>
          </motion.div>

          {renderContent()}
        </div>
      </div>
      <Footer />
      <FloatingButtons />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

export default HealthBlogPage;
