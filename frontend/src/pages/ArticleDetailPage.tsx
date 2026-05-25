import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
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
    <div className="min-h-screen bg-background pb-16">
      {isLoading && (
        <div className="pt-16 md:pt-24 container mx-auto px-4 max-w-6xl text-center py-16">
          <p className="text-lg text-muted-foreground animate-pulse">Loading project...</p>
        </div>
      )}

      {isError && !isLoading && (
        <div className="pt-16 md:pt-24 container mx-auto px-4 max-w-6xl text-center py-16">
          <p className="text-lg text-muted-foreground">Failed to load project.</p>
        </div>
      )}

      {!isLoading && !isError && !article && (
        <div className="pt-16 md:pt-24 container mx-auto px-4 max-w-6xl text-center py-16">
          <p className="text-lg text-muted-foreground">Project not found.</p>
        </div>
      )}

      {article && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-12"
        >
          {/* Full Bleed Project Hero Banner */}
          <div className="relative h-[250px] sm:h-[380px] md:h-[520px] w-full bg-muted flex items-center justify-center overflow-hidden">
            {article.image ? (
              <img
                src={article.image}
                alt={article.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <span className="text-8xl">{article.emoji || "🩺"}</span>
            )}
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/15" />

            {/* Back Button and Title Container (Aligned to max-w-6xl grid!) */}
            <div className="absolute inset-0 flex flex-col justify-between pt-10 pb-6 px-6 md:pt-14 md:pb-10 md:px-10 pointer-events-none">
              <div className="container mx-auto px-4 max-w-6xl w-full flex justify-start pointer-events-auto">
                <button
                  type="button"
                  className="flex items-center gap-2 text-xs font-bold text-white bg-black/40 hover:bg-black/60 backdrop-blur-sm px-4 py-2.5 rounded-full border border-white/10 transition-colors shadow-soft"
                  onClick={() => navigate("/projects")}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to projects
                </button>
              </div>

              {/* Title & Category Tag inside Hero (Aligned to max-w-6xl grid!) */}
              <div className="container mx-auto px-4 max-w-6xl w-full text-left space-y-3 pointer-events-auto">
                {article.category && (
                  <span className="inline-block px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-extrabold uppercase tracking-widest">
                    {article.category}
                  </span>
                )}
                <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-white leading-tight font-serif drop-shadow-sm">
                  {article.title}
                </h1>
              </div>
            </div>
          </div>

          {/* Two-Column Details Grid */}
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
              {/* Left Column: Product Case Overview & Content */}
              <div className="lg:col-span-2 text-left space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-xs uppercase font-extrabold tracking-wider text-primary">
                      Product Case Overview
                    </span>
                  </div>

                  {article.excerpt && (
                    <p className="text-lg md:text-xl font-medium text-foreground/90 leading-relaxed font-sans">
                      {article.excerpt}
                    </p>
                  )}
                </div>

                {article.content && (
                  <div className="space-y-5 text-base leading-relaxed text-muted-foreground font-sans">
                    {article.content.split("\n").map((paragraph, index) => {
                      const trimmed = paragraph.trim();
                      if (!trimmed) return null;
                      return <p key={index}>{trimmed}</p>;
                    })}
                  </div>
                )}
              </div>

              {/* Right Column: Project Parameters Card */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-soft relative overflow-hidden text-left">
                  <div className="absolute top-0 left-0 w-full h-1 gradient-primary" />
                  
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-foreground/80 mb-6 border-b border-border pb-3">
                    Project Parameters
                  </h3>

                  <div className="space-y-5">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                        Release State
                      </span>
                      <div>
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Production Live
                        </span>
                      </div>
                    </div>

                    {article.category && (
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                          Category
                        </span>
                        <span className="text-sm font-semibold text-foreground">
                          {article.category}
                        </span>
                      </div>
                    )}

                    {publishedLabel && (
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                          Published Date
                        </span>
                        <span className="text-sm font-semibold text-foreground">
                          {publishedLabel}
                        </span>
                      </div>
                    )}

                    {readTimeLabel && (
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                          Read Time
                        </span>
                        <span className="text-sm font-semibold text-foreground">
                          {readTimeLabel}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      <Footer />
      <FloatingButtons />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

export default ArticleDetailPage;
