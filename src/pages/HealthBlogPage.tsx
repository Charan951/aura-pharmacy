import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import CartDrawer from "@/components/CartDrawer";
import { useState } from "react";

const posts = [
  { title: "10 Tips for Managing Diabetes at Home", excerpt: "Learn how to keep your blood sugar levels in check with these simple daily habits and dietary changes.", date: "Feb 15, 2026", readTime: "5 min read", category: "Diabetes", emoji: "🩺" },
  { title: "Understanding Your Blood Pressure Readings", excerpt: "A comprehensive guide to what your BP numbers mean and when you should be concerned.", date: "Feb 12, 2026", readTime: "4 min read", category: "Heart Health", emoji: "❤️" },
  { title: "Best Vitamins for Winter Immunity", excerpt: "Boost your immune system this winter with these essential vitamins and supplements.", date: "Feb 10, 2026", readTime: "3 min read", category: "Nutrition", emoji: "🧴" },
  { title: "Baby Skincare: A Complete Guide", excerpt: "Everything you need to know about keeping your baby's skin healthy and moisturized.", date: "Feb 8, 2026", readTime: "6 min read", category: "Baby Care", emoji: "👶" },
  { title: "How to Choose the Right Sunscreen", excerpt: "SPF, PA+, physical vs chemical – demystifying sunscreen labels for better protection.", date: "Feb 5, 2026", readTime: "4 min read", category: "Skin Care", emoji: "☀️" },
  { title: "Home Remedies for Common Cold", excerpt: "Natural and effective remedies to help you recover faster from cold and flu symptoms.", date: "Feb 2, 2026", readTime: "3 min read", category: "Wellness", emoji: "🤧" },
];

const HealthBlogPage = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />
      <div className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground">Health Blog</h1>
            <p className="text-muted-foreground mt-2">Expert advice and tips for a healthier life</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <motion.article
                key={post.title}
                className="bg-card rounded-3xl border border-border/50 overflow-hidden cursor-pointer group transition-all duration-300 hover:shadow-card-hover"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
              >
                <div className="h-44 bg-muted/30 flex items-center justify-center text-6xl group-hover:bg-accent/30 transition-colors">
                  {post.emoji}
                </div>
                <div className="p-5">
                  <span className="inline-block px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-semibold uppercase tracking-wider">
                    {post.category}
                  </span>
                  <h3 className="font-bold text-foreground mt-3 text-lg leading-snug group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</div>
                    <div className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</div>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Read More <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
      <Footer />
      <FloatingButtons />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} itemCount={cartCount} />
    </div>
  );
};

export default HealthBlogPage;
