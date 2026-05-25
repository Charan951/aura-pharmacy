import { motion } from "framer-motion";
import { Search, UserCheck, PackageCheck } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      step: "01",
      icon: Search,
      title: "Search or Upload",
      description: "Browse our catalog of genuine medicines or upload your prescription directly.",
    },
    {
      step: "02",
      icon: UserCheck,
      title: "Pharmacist Review",
      description: "Our certified in-house pharmacy experts review and approve your order.",
    },
    {
      step: "03",
      icon: PackageCheck,
      title: "Express Delivery",
      description: "Get your medicines packed under guidelines and delivered right to your door.",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-card/10 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-semibold mb-4 uppercase tracking-wider">
            Simple Process
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-base text-muted-foreground mt-4 leading-relaxed">
            Order your wellness essentials in three simple, quick, and hassle-free steps.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line for larger screens */}
          <div className="hidden lg:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-primary/10 via-primary/40 to-primary/10 -translate-y-1/2 z-0" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 relative z-10">
            {steps.map((item, i) => (
              <motion.div
                key={item.step}
                className="bg-card rounded-3xl border border-border/40 p-8 flex flex-col items-center text-center shadow-soft relative group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                whileHover={{ y: -6 }}
              >
                {/* Step badge */}
                <div className="absolute -top-5 left-8 px-4 py-1 rounded-full gradient-primary text-primary-foreground text-xs font-extrabold shadow-glow">
                  Step {item.step}
                </div>

                <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mb-6 border border-primary/10 text-primary relative group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="w-7 h-7" />
                </div>

                <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed px-2">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
