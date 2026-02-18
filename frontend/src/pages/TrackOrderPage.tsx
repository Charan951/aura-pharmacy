import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import CartDrawer from "@/components/CartDrawer";
import { useCart } from "@/hooks/use-cart";
import { useAuth, authFetch } from "@/hooks/use-auth";
import { apiBaseUrl, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type OrderItem = {
  name: string;
  brand?: string;
  price: number;
  quantity: number;
};

type Order = {
  _id: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
  shippingAddress?: {
    line1?: string;
    city?: string;
    state?: string;
    postalCode?: string;
  };
  paymentMethod?: string;
};

const capitalise = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

const badgeTone = (status: string) => {
  const normalized = status.toLowerCase();
  if (normalized === "delivered") {
    return "border-emerald-300 bg-emerald-50 text-emerald-700";
  }
  if (normalized === "shipped" || normalized === "packed" || normalized === "confirmed") {
    return "border-sky-300 bg-sky-50 text-sky-700";
  }
  if (normalized === "pending") {
    return "border-amber-300 bg-amber-50 text-amber-700";
  }
  if (normalized === "cancelled") {
    return "border-rose-300 bg-rose-50 text-rose-700";
  }
  return "border-slate-300 bg-slate-50 text-slate-700";
};

const TrackOrderPage = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const { totalItems } = useCart();
  const { token, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [orderId, setOrderId] = useState("");
  const [contact, setContact] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cartCount = totalItems;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedOrderId = orderId.trim();
    const trimmedContact = contact.trim();

    if (!trimmedOrderId || !trimmedContact) {
      return;
    }

    if (!isAuthenticated || !token) {
      toast.info("Please login to view your order status");
      navigate("/login", { state: { from: { pathname: "/track-order" } } });
      return;
    }

    if (user && trimmedContact && trimmedContact.toLowerCase() !== user.email.toLowerCase()) {
      toast.error("Contact email does not match your logged in account");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setTrackedOrder(null);

    try {
      const orders = (await authFetch(
        `${apiBaseUrl}/api/orders/my`,
        {
          method: "GET",
        },
        token,
      )) as Order[];

      const foundOrder =
        orders.find((order) => order._id === trimmedOrderId) ||
        orders.find((order) => order._id.toLowerCase().endsWith(trimmedOrderId.toLowerCase()));

      if (!foundOrder) {
        setError("No order found with this ID in your account.");
        return;
      }

      setTrackedOrder(foundOrder);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch order status.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />
      <div className="pt-32 md:pt-40 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 text-center"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">Track your order</h1>
            <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
              Check the live status of your MediCare order using your order ID and registered
              mobile number or email address.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl border border-border/60 bg-card/80 p-6 md:p-8 shadow-sm"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground" htmlFor="order-id">
                  Order ID
                </label>
                <input
                  id="order-id"
                  type="text"
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                  placeholder="Enter the Order ID from your confirmation message"
                  value={orderId}
                  onChange={(event) => setOrderId(event.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground" htmlFor="contact">
                  Registered mobile or email
                </label>
                <input
                  id="contact"
                  type="text"
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                  placeholder="Enter the phone number or email used while placing the order"
                  value={contact}
                  onChange={(event) => setContact(event.target.value)}
                  required
                />
              </div>
              <p className="text-[11px] text-muted-foreground">
                You need to be logged in and use your account email so we can securely match your
                order to your profile. For the most accurate status including packing, dispatch and
                delivery, log in to your account and open the{" "}
                <span className="font-medium text-foreground">My Orders</span> section.
              </p>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Checking..." : "Track order"}
              </button>
            </form>
            {error && <p className="mt-4 text-xs text-destructive">{error}</p>}
            {trackedOrder && (
              <div className="mt-6 rounded-2xl border border-border/60 bg-background/60 p-4 space-y-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold">Order {trackedOrder._id.slice(-6)}</span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] px-2 py-0.5 rounded-full border",
                          badgeTone(trackedOrder.status),
                        )}
                      >
                        {capitalise(trackedOrder.status)}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Placed on {new Date(trackedOrder.createdAt).toLocaleString()}
                    </p>
                    {trackedOrder.shippingAddress && (
                      <p className="text-[11px] text-muted-foreground">
                        Deliver to{" "}
                        {[
                          trackedOrder.shippingAddress.line1,
                          trackedOrder.shippingAddress.city,
                          trackedOrder.shippingAddress.state,
                          trackedOrder.shippingAddress.postalCode,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    )}
                    {trackedOrder.paymentMethod && (
                      <p className="text-[11px] text-muted-foreground">
                        Payment: {trackedOrder.paymentMethod === "cod" ? "Cash on delivery" : "Online"}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Total amount</p>
                    <p className="text-sm font-semibold">₹{trackedOrder.total.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 border-t border-border/40 pt-2 text-[11px] text-muted-foreground">
                  {trackedOrder.items.map((item, index) => (
                    <span key={index} className="inline-flex items-center rounded-full bg-muted px-1.5 py-0.5">
                      {item.name}
                      {item.quantity > 1 && (
                        <span className="ml-1 text-[10px] text-foreground">×{item.quantity}</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          <div className="mt-8 text-xs text-muted-foreground space-y-1">
            <p>Need urgent help? Call our support team at 1800-123-4567 with your order ID.</p>
          </div>
        </div>
      </div>
      <Footer />
      <FloatingButtons />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

export default TrackOrderPage;
