import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  { name: "Dr. Priya Sharma", role: "Cardiologist", text: "MediCare has been our go-to recommendation for patients. Genuine medicines, fast delivery, and excellent customer support.", rating: 5 },
  { name: "Rajesh Kumar", role: "Regular Customer", text: "I've been ordering my monthly medicines from here for over a year. Great discounts and always on-time delivery!", rating: 5 },
  { name: "Anita Desai", role: "Healthcare Professional", text: "The quality of products and professionalism is unmatched. Their prescription upload feature is so convenient.", rating: 4 },
  { name: "Mohammed Ali", role: "Regular Customer", text: "Amazing service! Got my medicines delivered within 2 hours. The app is easy to use and prices are very competitive.", rating: 5 },
];

const TestimonialsSection = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 bg-card">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-foreground">Trusted by Thousands</h2>
          <p className="text-muted-foreground mt-2">What our customers say about us</p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
              className="bg-background rounded-3xl p-8 border border-border/50 shadow-card text-center"
            >
              <Quote className="w-8 h-8 text-primary/30 mx-auto mb-4" />
              <p className="text-foreground text-lg leading-relaxed italic">
                "{testimonials[current].text}"
              </p>
              <div className="flex items-center justify-center gap-0.5 mt-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < testimonials[current].rating
                        ? "fill-warning text-warning"
                        : "text-muted"
                    }`}
                  />
                ))}
              </div>
              <p className="mt-3 font-semibold text-foreground">{testimonials[current].name}</p>
              <p className="text-sm text-muted-foreground">{testimonials[current].role}</p>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === current ? "w-6 gradient-primary" : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
