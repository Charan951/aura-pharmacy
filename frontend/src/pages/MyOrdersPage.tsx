import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import CartDrawer from "@/components/CartDrawer";
import { authFetch, useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { apiBaseUrl, cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, MapPin, CreditCard, ShoppingBag, ArrowRight } from "lucide-react";

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

const MyOrdersPage = () => {
  const { token } = useAuth();
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { totalItems } = useCart();
  const isLoggedIn = Boolean(token);

  const cartCount = totalItems;

  const { data, isLoading, isError } = useQuery<Order[]>({
    queryKey: ["my-orders"],
    queryFn: () =>
      authFetch(
        `${apiBaseUrl}/api/orders/my`,
        {
          method: "GET",
        },
        token,
      ),
    enabled: isLoggedIn,
  });

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: { pathname: "/orders" } }} replace />;
  }

  const orders = data ?? [];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />

      <main className="relative pt-32 md:pt-40 pb-20 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 max-w-4xl relative z-10 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-left space-y-1"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">My Orders</h1>
            <p className="text-sm text-muted-foreground">Track and manage your order history</p>
          </motion.div>

          <Card className="bg-card border-border/50 shadow-glow p-6 md:p-8 rounded-3xl">
            <CardContent className="p-0">
              {isLoading && (
                <div className="text-center py-12 space-y-3">
                  <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-sm text-muted-foreground">Loading your orders...</p>
                </div>
              )}

              {isError && (
                <div className="text-center py-12">
                  <p className="text-sm text-destructive font-medium">Failed to load your orders. Please try again later.</p>
                </div>
              )}

              {!isLoading && !isError && orders.length === 0 && (
                <div className="text-center py-16 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-muted/40 border border-border/50 flex items-center justify-center mx-auto text-muted-foreground">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-base font-semibold text-foreground">No orders yet</p>
                    <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                      You haven't placed any orders. Start browsing our categories to add items to your cart!
                    </p>
                  </div>
                  <Button
                    onClick={() => navigate("/categories")}
                    className="gradient-primary text-primary-foreground rounded-2xl px-6"
                  >
                    Start Shopping
                  </Button>
                </div>
              )}

              {!isLoading && !isError && orders.length > 0 && (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="space-y-4"
                >
                  {orders.map((order) => (
                    <motion.div
                      key={order._id}
                      variants={itemVariants}
                      className="rounded-3xl border border-border/50 bg-card p-6 flex flex-col gap-4 transition-all duration-300 hover:border-primary/20 hover:shadow-glow relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/[0.01] to-transparent pointer-events-none" />

                      {/* Header row */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/50 pb-4 relative z-10">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-sm font-bold text-foreground">Order ID: #{order._id.slice(-6).toUpperCase()}</span>
                          <Badge
                            className={cn(
                              "text-[10px] font-bold px-3 py-1 rounded-full border tracking-wide uppercase",
                              badgeTone(order.status),
                            )}
                          >
                            {order.status}
                          </Badge>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-xs text-muted-foreground">Total Amount</p>
                          <p className="text-lg font-bold text-primary">₹{order.total.toFixed(2)}</p>
                        </div>
                      </div>

                      {/* Details row */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-muted-foreground relative z-10">
                        {/* Time */}
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-muted/40 border border-border/50 flex items-center justify-center text-primary shrink-0">
                            <Calendar className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Placed On</p>
                            <p className="font-medium text-foreground">{new Date(order.createdAt).toLocaleString()}</p>
                          </div>
                        </div>

                        {/* Payment */}
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-muted/40 border border-border/50 flex items-center justify-center text-primary shrink-0">
                            <CreditCard className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Payment Method</p>
                            <p className="font-medium text-foreground capitalize">{order.paymentMethod === "cod" ? "Cash on delivery" : "Online"}</p>
                          </div>
                        </div>

                        {/* Address */}
                        {order.shippingAddress && (
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-muted/40 border border-border/50 flex items-center justify-center text-primary shrink-0">
                              <MapPin className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Delivery Address</p>
                              <p className="font-medium truncate max-w-[200px]" title={[
                                order.shippingAddress.line1,
                                order.shippingAddress.city,
                                order.shippingAddress.state,
                                order.shippingAddress.postalCode,
                              ].filter(Boolean).join(", ")}>
                                {[
                                  order.shippingAddress.line1,
                                  order.shippingAddress.city,
                                ].filter(Boolean).join(", ")}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Items row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-border/50 pt-4 relative z-10">
                        <div className="flex flex-wrap gap-2 text-xs">
                          {order.items.map((item, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center rounded-xl bg-muted/30 border border-border/50 px-3 py-1.5 font-medium text-foreground transition-colors hover:bg-primary/5 hover:border-primary/20"
                            >
                              {item.name}
                              {item.quantity > 1 && (
                                <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded bg-primary/20 text-primary-foreground font-bold">
                                  ×{item.quantity}
                                </span>
                              )}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-end shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs px-4 py-2 rounded-xl text-primary hover:bg-primary/10 gap-1"
                            onClick={() => setSelectedOrder(order)}
                          >
                            Details <ArrowRight className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </div>

        <Dialog open={selectedOrder !== null} onOpenChange={(open) => { if (!open) setSelectedOrder(null); }}>
          <DialogContent className="max-w-lg bg-card border-border/50 rounded-3xl p-6 shadow-glow text-foreground">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold font-serif text-foreground">
                Order Details
              </DialogTitle>
            </DialogHeader>

            {selectedOrder && (
              <div className="space-y-6 pt-4 text-left">
                {/* Status and ID */}
                <div className="flex justify-between items-center border-b border-border/50 pb-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Order ID</p>
                    <p className="text-base font-bold text-foreground">#{selectedOrder._id.toUpperCase()}</p>
                  </div>
                  <Badge className={cn("text-[10px] font-bold px-3 py-1 rounded-full border uppercase tracking-wider", badgeTone(selectedOrder.status))}>
                    {selectedOrder.status}
                  </Badge>
                </div>

                {/* Items List */}
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Items Ordered</p>
                  <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 rounded-xl bg-muted/30 border border-border/50 text-sm">
                        <div className="space-y-0.5">
                          <p className="font-semibold text-foreground">{item.name}</p>
                          {item.brand && <p className="text-[10px] text-muted-foreground uppercase font-medium">{item.brand}</p>}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-foreground">₹{(item.price * item.quantity).toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">₹{item.price.toFixed(2)} × {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping and Payment info */}
                <div className="grid grid-cols-2 gap-4 border-t border-b border-border/50 py-4 text-xs text-muted-foreground">
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-primary" /> Delivery Address
                    </p>
                    {selectedOrder.shippingAddress ? (
                      <p className="leading-relaxed font-medium">
                        {[
                          selectedOrder.shippingAddress.line1,
                          selectedOrder.shippingAddress.city,
                          selectedOrder.shippingAddress.state,
                          selectedOrder.shippingAddress.postalCode,
                        ].filter(Boolean).join(", ")}
                      </p>
                    ) : (
                      <p className="text-muted-foreground">Not provided</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider flex items-center gap-1">
                        <CreditCard className="w-3.5 h-3.5 text-primary" /> Payment Method
                      </p>
                      <p className="font-medium capitalize">{selectedOrder.paymentMethod === "cod" ? "Cash on delivery" : "Online"}</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-primary" /> Order Date
                      </p>
                      <p className="font-medium">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="flex justify-between items-center pt-2">
                  <p className="text-sm font-semibold text-foreground">Total Amount Paid</p>
                  <p className="text-xl font-bold text-primary">₹{selectedOrder.total.toFixed(2)}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>

      <Footer />
      <FloatingButtons />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

const badgeTone = (status: string) => {
  const normalized = status.toLowerCase();
  if (normalized === "delivered") {
    return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";
  }
  if (normalized === "shipped" || normalized === "packed" || normalized === "confirmed") {
    return "border-sky-500/20 bg-sky-500/10 text-sky-400";
  }
  if (normalized === "pending") {
    return "border-amber-500/20 bg-amber-500/10 text-amber-400";
  }
  if (normalized === "cancelled") {
    return "border-rose-500/20 bg-rose-500/10 text-rose-400";
  }
  return "border-slate-500/20 bg-slate-500/10 text-slate-400";
};

export default MyOrdersPage;
