import { motion } from "framer-motion";
import { Pill, Heart, Baby, Eye, Droplets, Activity, Stethoscope, Apple } from "lucide-react";

const categories = [
  { icon: Pill, name: "Medicines", color: "bg-primary/10 text-primary" },
  { icon: Heart, name: "Heart Care", color: "bg-destructive/10 text-destructive" },
  { icon: Baby, name: "Baby Care", color: "bg-warning/10 text-warning" },
  { icon: Eye, name: "Eye Care", color: "bg-secondary/10 text-secondary" },
  { icon: Droplets, name: "Skin Care", color: "bg-accent text-accent-foreground" },
  { icon: Activity, name: "Fitness", color: "bg-trust/10 text-trust" },
  { icon: Stethoscope, name: "Devices", color: "bg-primary/10 text-primary" },
  { icon: Apple, name: "Nutrition", color: "bg-trust/10 text-trust" },
];

const CategorySection = () => {
  return (
    <section className="py-16 bg-card">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-foreground">Shop by Category</h2>
          <p className="text-muted-foreground mt-2">Browse through our wide range of healthcare products</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              className="group cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -5, rotateY: 5 }}
            >
              <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-background border border-border/50 transition-all duration-300 group-hover:shadow-card-hover group-hover:border-primary/20">
                <motion.div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center ${cat.color} transition-all duration-300`}
                  whileHover={{ scale: 1.1 }}
                >
                  <cat.icon className="w-6 h-6" />
                </motion.div>
                <span className="text-xs font-semibold text-foreground text-center">{cat.name}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
