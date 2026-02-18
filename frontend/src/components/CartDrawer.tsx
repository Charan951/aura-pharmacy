import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authApi, useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

type CheckoutStage = "cart" | "address" | "payment";

type ShippingAddress = {
  line1: string;
  city: string;
  state: string;
  postalCode: string;
};

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const { items, totalItems, totalAmount, incrementItem, decrementItem, removeItem, clearCart } = useCart();
  const itemCount = totalItems;
  const total = totalAmount;
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [stage, setStage] = useState<CheckoutStage>("cart");
  const [address, setAddress] = useState<ShippingAddress>({
    line1: "",
    city: "",
    state: "",
    postalCode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");

  const handleCheckout = async () => {
    if (!itemCount) {
      toast.info("Add items to your cart before checkout");
      return;
    }

    if (!isAuthenticated || !token) {
      toast.info("Please login to complete your order");
      onClose();
      navigate("/login");
      return;
    }

    setStage("address");
  };

  const handlePlaceOrder = async () => {
    if (!isAuthenticated || !token) {
      toast.info("Please login to complete your order");
      onClose();
      navigate("/login");
      return;
    }

    if (!address.line1 || !address.city || !address.state || !address.postalCode) {
      toast.error("Please fill in your complete address");
      setStage("address");
      return;
    }

    setSubmitting(true);

    try {
      const itemsForApi = items.map((item) => ({
        productId: item.productId,
        name: item.name,
        brand: item.brand,
        price: item.price,
        quantity: item.qty,
      }));

      await authApi.createOrder(
        {
          items: itemsForApi,
          shippingAddress: address,
          paymentMethod,
        },
        token,
      );

      toast.success("Order placed successfully");
      onClose();
      setStage("cart");
      clearCart();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to place order";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

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

            {/* Content */}
            {stage === "cart" && (
              <>
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {items.map((item, i) => {
                    const limit = item.maxQty;
                    const reachedLimit = typeof limit === "number" && item.qty >= limit;

                    return (
                      <motion.div
                        key={`${item.productId ?? item.name}-${i}`}
                        className="flex items-center gap-4 p-3 rounded-2xl bg-muted/50 border border-border/50"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <div className="w-14 h-14 rounded-xl bg-accent/50 flex items-center justify-center text-2xl">
                          💊
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.brand}</p>
                          <p className="text-sm font-bold text-primary mt-1">₹{item.price}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {typeof limit === "number" && (
                            <span className="text-[10px] text-muted-foreground">
                              Max {limit} {limit === 1 ? "unit" : "units"}
                            </span>
                          )}
                          <div className="flex items-center gap-2">
                            <motion.button
                              whileTap={{ scale: 0.8 }}
                              className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center"
                              onClick={() => decrementItem(item.productId, item.name)}
                            >
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
                            <motion.button
                              whileTap={{ scale: 0.8 }}
                              className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                                reachedLimit
                                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                                  : "gradient-primary text-primary-foreground"
                              }`}
                              onClick={() => {
                                if (!reachedLimit) {
                                  incrementItem(item.productId, item.name);
                                }
                              }}
                            >
                              <Plus className="w-3 h-3" />
                            </motion.button>
                            <motion.button
                              whileTap={{ scale: 0.8 }}
                              className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center"
                              onClick={() => removeItem(item.productId, item.name)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="border-t border-border p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-xl font-bold text-foreground">₹{total}</span>
                  </div>
                  <motion.div whileTap={{ scale: 0.97 }}>
                    <Button
                      className="w-full gradient-primary text-primary-foreground rounded-2xl h-12 text-base font-semibold"
                      onClick={handleCheckout}
                      disabled={submitting}
                    >
                      Proceed to Checkout
                    </Button>
                  </motion.div>
                </div>
              </>
            )}

            {stage === "address" && (
              <div className="flex-1 flex flex-col">
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  <h4 className="text-sm font-semibold">Delivery address</h4>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">House / Street</label>
                      <input
                        className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                        value={address.line1}
                        onChange={(event) => setAddress({ ...address, line1: event.target.value })}
                        placeholder="123, MG Road"
                      />
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-1 space-y-1">
                        <label className="text-xs text-muted-foreground">City</label>
                        <input
                          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                          value={address.city}
                          onChange={(event) => setAddress({ ...address, city: event.target.value })}
                          placeholder="Bangalore"
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <label className="text-xs text-muted-foreground">State</label>
                        <input
                          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                          value={address.state}
                          onChange={(event) => setAddress({ ...address, state: event.target.value })}
                          placeholder="Karnataka"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">Pincode</label>
                      <input
                        className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                        value={address.postalCode}
                        onChange={(event) => setAddress({ ...address, postalCode: event.target.value })}
                        placeholder="560001"
                      />
                    </div>
                  </div>
                </div>
                <div className="border-t border-border p-5 flex gap-3">
                  <Button variant="outline" className="flex-1 rounded-2xl h-11 text-sm" onClick={() => setStage("cart")}>
                    Back to Cart
                  </Button>
                  <Button
                    className="flex-1 gradient-primary text-primary-foreground rounded-2xl h-11 text-sm font-semibold"
                    onClick={() => setStage("payment")}
                  >
                    Continue to Payment
                  </Button>
                </div>
              </div>
            )}

            {stage === "payment" && (
              <div className="flex-1 flex flex-col">
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  <h4 className="text-sm font-semibold">Select payment method</h4>
                  <div className="space-y-2">
                    <button
                      type="button"
                      className={`w-full flex items-center justify-between rounded-xl border px-3 py-2 text-sm ${
                        paymentMethod === "online" ? "border-primary bg-primary/5" : "border-border bg-background"
                      }`}
                      onClick={() => setPaymentMethod("online")}
                    >
                      <span>Online payment</span>
                      {paymentMethod === "online" && <span className="text-xs text-primary font-semibold">Selected</span>}
                    </button>
                    <button
                      type="button"
                      className={`w-full flex items-center justify-between rounded-xl border px-3 py-2 text-sm ${
                        paymentMethod === "cod" ? "border-primary bg-primary/5" : "border-border bg-background"
                      }`}
                      onClick={() => setPaymentMethod("cod")}
                    >
                      <span>Cash on delivery</span>
                      {paymentMethod === "cod" && <span className="text-xs text-primary font-semibold">Selected</span>}
                    </button>
                  </div>

                  <div className="mt-4 space-y-1 rounded-xl border border-dashed border-border px-3 py-2">
                    <p className="text-xs text-muted-foreground">Deliver to</p>
                    <p className="text-sm font-medium">
                      {address.line1}, {address.city}, {address.state} - {address.postalCode}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Payable amount</span>
                    <span className="text-lg font-semibold">₹{total}</span>
                  </div>
                </div>
                <div className="border-t border-border p-5 flex gap-3">
                  <Button variant="outline" className="flex-1 rounded-2xl h-11 text-sm" onClick={() => setStage("address")}>
                    Back to Address
                  </Button>
                  <Button
                    className="flex-1 gradient-primary text-primary-foreground rounded-2xl h-11 text-sm font-semibold"
                    onClick={handlePlaceOrder}
                    disabled={submitting}
                  >
                    {submitting ? "Placing order..." : "Place Order"}
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
