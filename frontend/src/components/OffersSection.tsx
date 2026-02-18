import { motion } from "framer-motion";
import { Percent, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const offers = [
  { title: "Flat 25% Off", desc: "On all diabetes care products", bg: "gradient-primary", icon: Percent, expire: "Ends in 2 days" },
  { title: "Buy 2 Get 1 Free", desc: "On vitamins & supplements", bg: "bg-trust", icon: Percent, expire: "This week only" },
  { title: "Free Health Checkup", desc: "On orders above ₹1999", bg: "bg-secondary", icon: Clock, expire: "Limited time" },
];

const OffersSection = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-foreground">Today's Offers</h2>
          <p className="text-muted-foreground mt-2">Don't miss out on these amazing deals</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {offers.map((offer, i) => (
            <motion.div
              key={offer.title}
              className={`${offer.bg} rounded-3xl p-6 text-primary-foreground cursor-pointer overflow-hidden relative`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <offer.icon className="w-8 h-8 mb-3 opacity-80" />
              <h3 className="text-2xl font-bold">{offer.title}</h3>
              <p className="text-sm opacity-80 mt-1">{offer.desc}</p>
              <p className="text-xs mt-3 opacity-60">{offer.expire}</p>
              <Button
                size="sm"
                variant="ghost"
                className="mt-4 text-primary-foreground hover:bg-white/10 rounded-xl px-0"
              >
                Shop Now <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OffersSection;
