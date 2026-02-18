import { useQuery } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { authFetch, useAuth } from "@/hooks/use-auth";
import { apiBaseUrl, cn } from "@/lib/utils";

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
  const isLoggedIn = Boolean(token);

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

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4 py-6 md:py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">My Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <p className="text-xs text-muted-foreground">Loading your orders...</p>}
          {isError && (
            <p className="text-xs text-destructive">Failed to load your orders. Please try again later.</p>
          )}
          {!isLoading && !isError && orders.length === 0 && (
            <p className="text-xs text-muted-foreground">
              You have not placed any orders yet. Start by adding items to your cart.
            </p>
          )}
          {!isLoading && !isError && orders.length > 0 && (
            <div className="space-y-3">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="rounded-xl border border-border/70 bg-card/80 px-3 py-2.5 md:px-4 md:py-3 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold">Order {order._id.slice(-6)}</span>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] px-2 py-0.5 rounded-full border",
                            badgeTone(order.status),
                          )}
                        >
                          {capitalise(order.status)}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        Placed on {new Date(order.createdAt).toLocaleString()}
                      </p>
                      {order.shippingAddress && (
                        <p className="text-[11px] text-muted-foreground">
                          Deliver to{" "}
                          {[
                            order.shippingAddress.line1,
                            order.shippingAddress.city,
                            order.shippingAddress.state,
                            order.shippingAddress.postalCode,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      )}
                      {order.paymentMethod && (
                        <p className="text-[11px] text-muted-foreground">
                          Payment: {order.paymentMethod === "cod" ? "Cash on delivery" : "Online"}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Total amount</p>
                      <p className="text-sm font-semibold">₹{order.total.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-t border-border/40 pt-2">
                    <div className="flex flex-wrap gap-1.5 text-[11px] text-muted-foreground">
                      {order.items.map((item, index) => (
                        <span key={index} className="inline-flex items-center rounded-full bg-muted px-1.5 py-0.5">
                          {item.name}
                          {item.quantity > 1 && (
                            <span className="ml-1 text-[10px] text-foreground">×{item.quantity}</span>
                          )}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-end">
                      <Button
                        variant="outline"
                        size="xs"
                        className="text-[10px] px-2 py-0.5 rounded-full"
                        disabled
                      >
                        View details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
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

export default MyOrdersPage;
