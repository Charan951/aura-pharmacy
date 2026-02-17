import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { ShieldCheck, Users, Package, Award, Heart, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import CartDrawer from "@/components/CartDrawer";

const stats = [
  { icon: Package, label: "Orders Delivered", value: 150000, suffix: "+" },
  { icon: Users, label: "Happy Customers", value: 85000, suffix: "+" },
  { icon: ShieldCheck, label: "Genuine Products", value: 25000, suffix: "+" },
  { icon: Award, label: "Years of Trust", value: 12, suffix: "" },
];

const CountUp = ({ target, suffix }: { target: number; suffix: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

const values = [
  { icon: Heart, title: "Customer First", desc: "Every decision we make starts with how it benefits our customers' health and wellbeing." },
  { icon: ShieldCheck, title: "100% Genuine", desc: "We source directly from manufacturers and authorized distributors only." },
  { icon: Clock, title: "Fast Delivery", desc: "Get your medicines delivered within hours, because health can't wait." },
];

const AboutPage = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />

      {/* Hero */}
      <section className="pt-32 pb-16 gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            className="text-4xl md:text-5xl font-extrabold text-foreground"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            About <span className="text-gradient">MediCare</span>
          </motion.h1>
          <motion.p
            className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            We are India's most trusted online pharmacy, committed to making quality healthcare accessible and affordable for everyone.
          </motion.p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center p-6 rounded-3xl bg-background border border-border/50"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-3xl font-extrabold text-foreground">
                  <CountUp target={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl font-bold text-foreground text-center mb-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Our Values
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                className="p-6 rounded-3xl bg-card border border-border/50 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
                  <v.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-bold text-foreground">{v.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <FloatingButtons />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} itemCount={cartCount} />
    </div>
  );
};

export default AboutPage;
