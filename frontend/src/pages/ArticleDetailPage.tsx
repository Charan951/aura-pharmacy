import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import CartDrawer from "@/components/CartDrawer";
import { useCart } from "@/hooks/use-cart";
import { apiClient } from "@/api";
import { apiBaseUrl } from "@/lib/utils";

type Article = {
  _id: string;
  title: string;
  excerpt?: string;
  content?: string;
  category?: string;
  emoji?: string;
  readTimeMinutes?: number;
  publishedAt?: string;
  image?: string;
};

const ArticleDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cartOpen, setCartOpen] = useState(false);
  const { totalItems } = useCart();

  const cartCount = totalItems;

  const { data, isLoading, isError } = useQuery<Article | null>({
    queryKey: ["article", id],
    enabled: Boolean(id),
    queryFn: async () => {
      if (!id) return null;
      const response = await apiClient.get<Article>(`${apiBaseUrl}/api/articles/${id}`);
      return response.data;
    },
  });

  const article = data;

  const publishedLabel =
    article?.publishedAt != null ? new Date(article.publishedAt).toLocaleDateString() : "";

  const readTimeLabel =
    typeof article?.readTimeMinutes === "number" && article.readTimeMinutes > 0
      ? `${article.readTimeMinutes} min read`
      : "";

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />
      <div className="pt-32 md:pt-40 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <button
            type="button"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to articles
          </button>

          {isLoading && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-lg text-muted-foreground">Loading article...</p>
            </motion.div>
          )}

          {isError && !isLoading && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-lg text-muted-foreground">Failed to load article.</p>
            </motion.div>
          )}

          {!isLoading && !isError && !article && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-lg text-muted-foreground">Article not found.</p>
            </motion.div>
          )}

          {article && (
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-3xl border border-border/50 overflow-hidden shadow-sm"
            >
              {article.image && (
                <div className="h-64 bg-muted/30 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6 md:p-8">
                {article.category && (
                  <span className="inline-block px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-semibold uppercase tracking-wider">
                    {article.category}
                  </span>
                )}
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mt-3">
                  {article.title}
                </h1>
                {article.excerpt && (
                  <p className="text-base text-muted-foreground mt-3">{article.excerpt}</p>
                )}
                <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                  {publishedLabel && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{publishedLabel}</span>
                    </div>
                  )}
                  {readTimeLabel && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{readTimeLabel}</span>
                    </div>
                  )}
                </div>
                {article.content && (
                  <div className="mt-6 space-y-4 text-sm leading-relaxed text-foreground">
                    {article.content.split("\n").map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                )}
              </div>
            </motion.article>
          )}
        </div>
      </div>
      <Footer />
      <FloatingButtons />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

export default ArticleDetailPage;
