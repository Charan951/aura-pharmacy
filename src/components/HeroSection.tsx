import { motion } from "framer-motion";
import { ShieldCheck, Truck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-pharmacy.png";

const HeroSection = () => {
  const trustBadges = [
    { icon: ShieldCheck, label: "100% Genuine" },
    { icon: Truck, label: "Free Delivery" },
    { icon: Clock, label: "24/7 Support" },
  ];

  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden gradient-hero animate-gradient">
      {/* Floating shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-secondary/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Text */}
          <motion.div
            className="flex-1 text-center lg:text-left"
            initial={{ x: -60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.span
              className="inline-block px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-semibold mb-4 uppercase tracking-wider"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              India's Trusted Online Pharmacy
            </motion.span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-foreground">
              Your Health,{" "}
              <span className="text-gradient">Our Priority</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Get genuine medicines, healthcare products & lab tests delivered at your doorstep with up to <strong className="text-foreground">25% off</strong>.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button size="lg" className="gradient-primary text-primary-foreground rounded-2xl px-8 shadow-glow text-base font-semibold">
                  Order Medicines
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button size="lg" variant="outline" className="rounded-2xl px-8 text-base font-semibold border-primary/30 text-primary hover:bg-primary/5">
                  Upload Prescription
                </Button>
              </motion.div>
            </div>

            {/* Trust badges */}
            <div className="mt-10 flex flex-wrap gap-6 justify-center lg:justify-start">
              {trustBadges.map((badge, i) => (
                <motion.div
                  key={badge.label}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  <badge.icon className="w-5 h-5 text-trust" />
                  <span className="font-medium">{badge.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            className="flex-1 flex justify-center"
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            <motion.img
              src={heroImg}
              alt="Healthcare products"
              className="w-full max-w-md lg:max-w-lg drop-shadow-2xl"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
