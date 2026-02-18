import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { DollarSign, Package, ShoppingBag, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { apiBaseUrl } from "@/lib/utils";
import { authFetch, useAuth } from "@/hooks/use-auth";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Bar,
  BarChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
} from "recharts";

type DashboardResponse = {
  summary: {
    totalSales: number;
    totalOrders: number;
    totalCustomers: number;
    lowStockItems: number;
  };
  charts: {
    dailyOrders: { date: string; count: number; total: number }[];
    monthlyRevenue: { month: string; total: number }[];
    categoryRevenue: { category: string; total: number }[];
  };
  recentOrders: { _id: string; total: number; status: string; createdAt: string }[];
  topProducts: { productId: string; name: string; brand: string; quantity: number; revenue: number }[];
  lowStock: { _id: string; name: string; brand: string; stock: number; minStock: number }[];
};

const AdminDashboardPage = () => {
  const { token } = useAuth();

  const { data, isLoading } = useQuery<DashboardResponse>({
    queryKey: ["admin-dashboard"],
    queryFn: () => {
      if (!token) {
        throw new Error("Missing token");
      }

      return authFetch(
        `${apiBaseUrl}/api/admin/dashboard`,
        {
          method: "GET",
        },
        token,
      );
    },
    enabled: Boolean(token),
  });

  const dailyOrdersData = useMemo(
    () =>
      data?.charts.dailyOrders.map((item) => ({
        date: item.date.slice(5),
        orders: item.count,
      })) ?? [],
    [data],
  );

  const monthlyRevenueData = useMemo(
    () =>
      data?.charts.monthlyRevenue.map((item) => ({
        month: item.month.slice(5),
        revenue: item.total,
      })) ?? [],
    [data],
  );

  const categoryRevenueData = useMemo(
    () =>
      data?.charts.categoryRevenue.map((item) => ({
        category: item.category,
        revenue: item.total,
      })) ?? [],
    [data],
  );

  const topProductsPieData = useMemo(
    () =>
      data?.topProducts.map((item) => ({
        name: item.name,
        value: item.revenue,
      })) ?? [],
    [data],
  );

  const colors = ["#22c55e", "#0ea5e9", "#a855f7", "#f97316", "#e11d48"];

  if (isLoading || !data) {
    return (
      <div className="grid gap-4 md:gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="h-28 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <Card className="h-72 animate-pulse" />
          <Card className="h-72 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={DollarSign}
          label="Total Sales"
          value={data.summary.totalSales}
          prefix="₹"
          tone="primary"
        />
        <MetricCard icon={ShoppingBag} label="Total Orders" value={data.summary.totalOrders} tone="blue" />
        <MetricCard icon={Users} label="Total Customers" value={data.summary.totalCustomers} tone="emerald" />
        <MetricCard icon={Package} label="Low Stock Items" value={data.summary.lowStockItems} tone="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <Card className="h-72 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Daily Orders</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 flex-1">
            <ChartContainer
              className="h-64"
              config={{
                orders: {
                  label: "Orders",
                  color: "#0ea5e9",
                },
              }}
            >
              <LineChart data={dailyOrdersData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="var(--color-orders)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1 h-72 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 flex-1">
            <ChartContainer
              className="h-64"
              config={{
                revenue: {
                  label: "Revenue",
                  color: "#22c55e",
                },
              }}
            >
              <BarChart data={monthlyRevenueData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-1 h-72 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Revenue by Category</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 flex-1">
            {categoryRevenueData.length > 0 ? (
              <div className="space-y-2 h-full overflow-y-auto">
                {categoryRevenueData.map((item) => (
                  <div key={item.category} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{item.category}</span>
                    <span className="font-semibold">₹{item.revenue.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">No category-wise revenue yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {data.recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between rounded-xl border border-border/60 px-3 py-2.5"
                >
                  <div>
                    <p className="text-xs text-muted-foreground">Order ID</p>
                    <p className="text-sm font-medium truncate max-w-[140px]">{order._id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Amount</p>
                    <p className="text-sm font-semibold">₹{order.total.toFixed(2)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[11px] font-medium rounded-full px-2 py-0.5",
                        statusTone(order.status) === "success" && "border-emerald-300 bg-emerald-50 text-emerald-700",
                        statusTone(order.status) === "warning" && "border-amber-300 bg-amber-50 text-amber-700",
                        statusTone(order.status) === "default" && "border-slate-300 bg-slate-50 text-slate-700",
                      )}
                    >
                      {order.status}
                    </Badge>
                    <span className="text-[11px] text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
              {data.recentOrders.length === 0 && (
                <p className="text-xs text-muted-foreground">No orders yet. New orders will appear here.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4 md:space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Top Products</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {topProductsPieData.length > 0 ? (
                <div className="h-48">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={topProductsPieData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={70}>
                        {topProductsPieData.map((entry, index) => (
                          <Cell key={entry.name} fill={colors[index % colors.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No product sales yet.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Low Stock Alert</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              {data.lowStock.map((product) => (
                <div
                  key={product._id}
                  className="flex items-center justify-between rounded-xl border border-border/60 px-3 py-2"
                >
                  <div>
                    <p className="text-xs font-medium">{product.name}</p>
                    <p className="text-[11px] text-muted-foreground">{product.brand}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-muted-foreground">In stock</p>
                    <p className="text-sm font-semibold">{product.stock}</p>
                  </div>
                </div>
              ))}
              {data.lowStock.length === 0 && (
                <p className="text-xs text-muted-foreground">All products are above the minimum stock level.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

type MetricTone = "primary" | "blue" | "emerald" | "orange";

type MetricCardProps = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  prefix?: string;
  tone: MetricTone;
};

const MetricCard = ({ icon: Icon, label, value, prefix, tone }: MetricCardProps) => {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <p className="text-xs text-muted-foreground">{label}</p>
        <span
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-lg border text-xs",
            tone === "primary" && "border-primary/30 bg-primary/10 text-primary",
            tone === "blue" && "border-sky-300/70 bg-sky-50 text-sky-600",
            tone === "emerald" && "border-emerald-300/70 bg-emerald-50 text-emerald-600",
            tone === "orange" && "border-amber-300/70 bg-amber-50 text-amber-600",
          )}
        >
          <Icon className="h-3.5 w-3.5" />
        </span>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="text-xl font-semibold">
          {prefix}
          {value.toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
};

const statusTone = (status: string): "success" | "warning" | "default" => {
  const normalized = status.toLowerCase();
  if (normalized === "delivered" || normalized === "confirmed" || normalized === "shipped") {
    return "success";
  }
  if (normalized === "pending" || normalized === "packed") {
    return "warning";
  }
  return "default";
};

export default AdminDashboardPage;
