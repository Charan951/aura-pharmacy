import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { authFetch, useAuth } from "@/hooks/use-auth";
import { apiBaseUrl, cn } from "@/lib/utils";
import { toast } from "sonner";

type OrderItem = {
  name: string;
  brand?: string;
  price: number;
  quantity: number;
};

type Order = {
  _id: string;
  user?: {
    name: string;
    email: string;
  };
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

const statusOptions = ["all", "pending", "confirmed", "packed", "shipped", "delivered", "cancelled"] as const;

type StatusFilter = (typeof statusOptions)[number];

const AdminOrdersPage = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery<Order[]>({
    queryKey: ["admin-orders", { statusFilter, fromDate, toDate }],
    queryFn: () => {
      const params = new URLSearchParams();
      if (statusFilter !== "all") {
        params.set("status", statusFilter);
      }
      if (fromDate) {
        params.set("from", fromDate);
      }
      if (toDate) {
        params.set("to", toDate);
      }
      const query = params.toString();
      const url = query ? `${apiBaseUrl}/api/orders?${query}` : `${apiBaseUrl}/api/orders`;

      return authFetch(
        url,
        {
          method: "GET",
        },
        token,
      );
    },
    enabled: Boolean(token),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      authFetch(
        `${apiBaseUrl}/api/orders/${id}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({ status }),
        },
        token,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
      toast.success("Order status updated");
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Failed to update order status";
      toast.error(message);
    },
  });

  const orders = useMemo(() => {
    const list = data ?? [];
    if (!search.trim()) {
      return list;
    }

    const term = search.trim().toLowerCase();

    return list.filter((order) => {
      const idMatch = order._id.toLowerCase().includes(term);
      const customerMatch =
        order.user &&
        (order.user.name.toLowerCase().includes(term) || order.user.email.toLowerCase().includes(term));
      const itemsMatch = order.items.some((item) => item.name.toLowerCase().includes(term));

      return idMatch || customerMatch || itemsMatch;
    });
  }, [data, search]);

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg md:text-xl font-semibold">Orders</h2>
          <p className="text-xs text-muted-foreground">
            View and manage orders placed by customers, and track their status.
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Status</span>
            <Select
              value={statusFilter}
              onValueChange={(value: StatusFilter) => setStatusFilter(value)}
            >
              <SelectTrigger className="h-8 w-32 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((value) => (
                  <SelectItem key={value} value={value} className="text-xs">
                    {value === "all" ? "All" : capitalise(value)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <span className="text-muted-foreground">From</span>
            <input
              type="date"
              value={fromDate}
              onChange={(event) => setFromDate(event.target.value)}
              className="h-8 rounded-md border border-input bg-background px-2 py-1 text-xs"
            />
            <span className="text-muted-foreground">To</span>
            <input
              type="date"
              value={toDate}
              onChange={(event) => setToDate(event.target.value)}
              className="h-8 rounded-md border border-input bg-background px-2 py-1 text-xs"
            />
          </div>
          <div className="flex-1">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by order ID, customer, or item..."
              className="h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs"
            />
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm md:text-base">Orders list</CardTitle>
          <span className="text-[11px] text-muted-foreground">
            {isLoading ? "Loading..." : `${orders.length} order${orders.length === 1 ? "" : "s"}`}
          </span>
        </CardHeader>
        <CardContent className="pt-0">
          {!isLoading && orders.length === 0 && (
            <p className="text-xs text-muted-foreground">No orders found for the selected filter.</p>
          )}
          {orders.length > 0 && (
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
                        {order.user ? `${order.user.name} • ${order.user.email}` : "Guest customer"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Amount</p>
                      <p className="text-sm font-semibold">₹{order.total.toFixed(2)}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                    {order.shippingAddress && (
                      <p className="text-[11px] text-muted-foreground mt-0.5">
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
                        {order.paymentMethod === "cod" ? "Cash on delivery" : "Online payment"}
                      </p>
                    )}
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-t border-border/40 pt-2">
                    <div className="flex flex-col gap-1 text-[11px] text-muted-foreground">
                      <div className="flex flex-wrap gap-1.5">
                        {order.items.map((item, index) => (
                          <span key={index} className="inline-flex items-center rounded-full bg-muted px-1.5 py-0.5">
                            {item.name}
                            <span className="ml-1 text-[10px] text-foreground">×{item.quantity}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 justify-end">
                      {["pending", "confirmed", "packed", "shipped", "delivered"].map((status) => (
                        <Button
                          key={status}
                          variant={order.status === status ? "default" : "outline"}
                          size="xs"
                          className="text-[10px] px-2 py-0.5 rounded-full"
                          disabled={statusMutation.isPending}
                          onClick={() =>
                            statusMutation.mutate({
                              id: order._id,
                              status,
                            })
                          }
                        >
                          {capitalise(status)}
                        </Button>
                      ))}
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

export default AdminOrdersPage;
