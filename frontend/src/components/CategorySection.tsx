import { motion } from "framer-motion";
import { Pill, Heart, Baby, Eye, Droplets, Activity, Stethoscope, Apple } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  { icon: Pill, name: "Medicines", color: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-white" },
  { icon: Heart, name: "Heart Care", color: "bg-rose-500/10 text-rose-400 border border-rose-500/20 group-hover:bg-rose-500 group-hover:text-white" },
  { icon: Baby, name: "Baby Care", color: "bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:bg-amber-500 group-hover:text-white" },
  { icon: Eye, name: "Eye Care", color: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:bg-cyan-500 group-hover:text-white" },
  { icon: Droplets, name: "Skin Care", color: "bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 group-hover:bg-fuchsia-500 group-hover:text-white" },
  { icon: Activity, name: "Fitness", color: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white" },
  { icon: Stethoscope, name: "Devices", color: "bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:bg-blue-500 group-hover:text-white" },
  { icon: Apple, name: "Nutrition", color: "bg-teal-500/10 text-teal-400 border border-teal-500/20 group-hover:bg-teal-500 group-hover:text-white" },
];

const CategorySection = () => {
  return (
    <section id="categories" className="py-20 relative overflow-hidden bg-background">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Shop by Category</h2>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">Browse through our wide range of premium healthcare products</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              className="group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -5 }}
            >
              <Link to={`/category/${encodeURIComponent(cat.name)}`}>
                <div className="flex flex-col items-center gap-4 p-5 rounded-2xl bg-white/[0.01] border border-white/5 transition-all duration-300 group-hover:bg-white/[0.03] group-hover:border-primary/30 group-hover:shadow-glow cursor-pointer relative overflow-hidden h-full">
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <motion.div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center ${cat.color} transition-all duration-300 relative z-10`}
                    whileHover={{ scale: 1.1 }}
                  >
                    <cat.icon className="w-6 h-6" />
                  </motion.div>
                  <span className="text-xs font-semibold text-foreground/80 group-hover:text-foreground text-center relative z-10 transition-colors duration-300">{cat.name}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
