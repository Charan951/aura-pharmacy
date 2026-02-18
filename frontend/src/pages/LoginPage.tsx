import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import FloatingButtons from "@/components/FloatingButtons";
import CartDrawer from "@/components/CartDrawer";
import { toast } from "sonner";
import { authApi, useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSession } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { totalItems } = useCart();

  const cartCount = totalItems;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setSubmitting(true);

    try {
      const data = await authApi.login(email, password);

      setSession(data.user, data.token);

      toast.success("Logged in successfully");

      const state = location.state as { from?: { pathname?: string } } | null;
      const fromPath = state?.from?.pathname;
      const targetPath = fromPath || (data.user?.role === "admin" ? "/admin" : "/");

      navigate(targetPath, { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to login";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />
      <main className="relative pt-32 md:pt-40 pb-16 overflow-hidden gradient-hero animate-gradient">
        <div className="container mx-auto px-4 flex justify-center">
          <Card className="w-full max-w-md p-8 space-y-6">
            <div className="text-center space-y-1">
              <h1 className="text-2xl font-bold">Welcome back</h1>
              <p className="text-sm text-muted-foreground">Login to continue shopping with MediCare</p>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full h-11" disabled={submitting}>
                {submitting ? "Logging in..." : "Login"}
              </Button>
            </form>
            <p className="text-xs text-muted-foreground text-center">
              New to MediCare?{" "}
              <Link to="/register" className="text-primary font-medium">
                Create an account
              </Link>
            </p>
          </Card>
        </div>
      </main>
      <FloatingButtons />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

export default LoginPage;
