import { motion } from "framer-motion";
import { ShieldCheck, Truck, CreditCard, FileText } from "lucide-react";

const WhyChooseUs = () => {
  const features = [
    {
      icon: ShieldCheck,
      title: "Certified Pharmacists",
      description: "Every order is reviewed and verified by a licensed pharmacist for absolute safety.",
      color: "from-blue-500/10 to-indigo-500/10 border-blue-500/20 text-blue-400",
    },
    {
      icon: Truck,
      title: "Express Delivery",
      description: "Quick, temperature-controlled doorstep packaging ensures medicine efficacy.",
      color: "from-teal-500/10 to-emerald-500/10 border-teal-500/20 text-teal-400",
    },
    {
      icon: CreditCard,
      title: "Secure Payments",
      description: "Multiple safe payment methods with fully encrypted, secure transactions.",
      color: "from-purple-500/10 to-pink-500/10 border-purple-500/20 text-purple-400",
    },
    {
      icon: FileText,
      title: "Prescription Care",
      description: "Quick upload and review system to deliver prescription drugs right to your home.",
      color: "from-amber-500/10 to-orange-500/10 border-amber-500/20 text-amber-400",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-card/30 relative overflow-hidden border-t border-b border-border/30">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.span
            className="inline-block px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-semibold mb-4 uppercase tracking-wider"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Our Guarantee
          </motion.span>
          <motion.h2
            className="text-3xl md:text-4xl font-extrabold text-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Why Choose <span className="text-gradient">MediCare</span>?
          </motion.h2>
          <motion.p
            className="text-base text-muted-foreground mt-4 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            Your wellness is our singular focus. Discover the pillars of quality and convenience that set us apart.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              className={`rounded-3xl border bg-gradient-to-br ${feat.color} p-6 flex flex-col items-center text-center hover:bg-muted/10 transition-all duration-300 shadow-soft`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6, scale: 1.02 }}
            >
              <div className="w-12 h-12 rounded-2xl bg-muted/30 flex items-center justify-center mb-5 border border-border/40 shadow-inner">
                <feat.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-3">{feat.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
