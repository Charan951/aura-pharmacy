import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  itemCount: number;
}

const cartItems = [
  { id: 1, name: "Dolo 650mg Tablet", brand: "Micro Labs", price: 28, qty: 2 },
  { id: 2, name: "Vitamin D3 Supplement", brand: "HealthKart", price: 420, qty: 1 },
];

const CartDrawer = ({ isOpen, onClose, itemCount }: CartDrawerProps) => {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card z-50 shadow-2xl flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-lg text-foreground">Your Cart</h3>
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">{itemCount}</span>
              </div>
              <motion.button
                onClick={onClose}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-xl hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cartItems.map((item, i) => (
                <motion.div
                  key={item.id}
                  className="flex items-center gap-4 p-3 rounded-2xl bg-muted/50 border border-border/50"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="w-14 h-14 rounded-xl bg-accent/50 flex items-center justify-center text-2xl">💊</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.brand}</p>
                    <p className="text-sm font-bold text-primary mt-1">₹{item.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.button whileTap={{ scale: 0.8 }} className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center">
                      <Minus className="w-3 h-3" />
                    </motion.button>
                    <motion.span
                      key={item.qty}
                      initial={{ scale: 1.3 }}
                      animate={{ scale: 1 }}
                      className="text-sm font-bold w-5 text-center"
                    >
                      {item.qty}
                    </motion.span>
                    <motion.button whileTap={{ scale: 0.8 }} className="w-7 h-7 rounded-lg gradient-primary text-primary-foreground flex items-center justify-center">
                      <Plus className="w-3 h-3" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-border p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-xl font-bold text-foreground">₹{total}</span>
              </div>
              <motion.div whileTap={{ scale: 0.97 }}>
                <Button className="w-full gradient-primary text-primary-foreground rounded-2xl h-12 text-base font-semibold">
                  Proceed to Checkout
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
