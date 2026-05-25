import { LayoutDashboard, Boxes, ShoppingBag, FileText, Package, Users, BarChart3, Settings, Tag, BookOpen, LogOut } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

const navItems = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Categories", to: "/admin/categories", icon: Boxes },
  { label: "Orders", to: "/admin/orders", icon: ShoppingBag },
  { label: "Prescriptions", to: "/admin/prescriptions", icon: FileText },
  { label: "Inventory", to: "/admin/inventory", icon: Package },
  { label: "Offers", to: "/admin/offers", icon: Tag },
  { label: "Articles", to: "/admin/articles", icon: BookOpen },
  { label: "Staff", to: "/admin/staff", icon: Users },
  { label: "Reports", to: "/admin/reports", icon: BarChart3 },
  { label: "Settings", to: "/admin/settings", icon: Settings },
];

const AdminLayout = () => {
  const { clearSession } = useAuth();

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <aside className="hidden md:flex w-64 flex-col border-r bg-card/80 backdrop-blur">
        <div className="flex items-center px-6 py-4 border-b">
          <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center mr-2">
            <span className="text-primary-foreground font-bold text-lg">+</span>
          </div>
          <div>
            <p className="text-sm font-semibold">MediCare</p>
            <p className="text-[10px] text-muted-foreground tracking-wide uppercase">Admin</p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-colors",
                  isActive && "bg-primary/10 text-primary",
                )
              }
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t mt-auto">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 px-3 py-2 rounded-xl text-sm font-medium text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors"
            onClick={() => {
              clearSession();
              toast.success("Logged out successfully");
            }}
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </Button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col">
        <header className="flex items-center justify-between gap-4 px-4 md:px-8 py-3 border-b bg-background/60 backdrop-blur sticky top-0 z-10">
          <div className="flex items-center gap-3 flex-1">
            <h1 className="text-lg md:text-xl font-semibold">Admin Dashboard</h1>
            <span className="hidden md:inline-flex items-center rounded-full bg-emerald-50 text-emerald-600 text-xs px-2 py-0.5 border border-emerald-100">
              Order status updated
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              <Input placeholder="Search orders, products..." className="h-9 w-56" />
            </div>
            <Button variant="outline" size="sm" className="rounded-full">
              Today
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5"
              onClick={() => {
                clearSession();
                toast.success("Logged out successfully");
              }}
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </header>
        <div className="flex-1 p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
