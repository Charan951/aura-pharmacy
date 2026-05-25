import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import CartDrawer from "@/components/CartDrawer";
import { authApi, useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { User, Mail, Shield, UserCircle2, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const ProfilePage = () => {
  const { user, token, setSession, isAuthenticated } = useAuth();
  const [cartOpen, setCartOpen] = useState(false);
  const { totalItems } = useCart();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [saving, setSaving] = useState(false);

  const cartCount = totalItems;

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: { pathname: "/profile" } }} replace />;
  }

  const handleSave = async () => {
    if (!editName.trim() || !editEmail.trim()) {
      toast.error("Name and email are required");
      return;
    }

    setSaving(true);
    try {
      const data = await authApi.updateProfile(editName, editEmail, editPhone, token || "");
      setSession(data.user, token || "");
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update profile";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  // Get initials for avatar
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />

      <main className="relative pt-32 md:pt-40 pb-20 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10 flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-xl"
          >
            <Card className="bg-card border-border/50 shadow-glow overflow-hidden rounded-3xl">
              {/* Header profile banner */}
              <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/30 relative">
                <div className="absolute -bottom-10 left-8">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
                    className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold border-4 border-card shadow-lg"
                  >
                    {initials}
                  </motion.div>
                </div>
              </div>

              <CardContent className="pt-14 px-8 pb-8 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">Account Profile</h1>
                    <p className="text-xs text-muted-foreground mt-0.5">Manage your personal information and orders</p>
                  </div>
                  {!isEditing && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditName(user.name);
                        setEditEmail(user.email);
                        setEditPhone(user.phone || "");
                        setIsEditing(true);
                      }}
                      className="rounded-xl px-4 py-2 border-primary/20 text-primary hover:bg-primary/10 hover:text-primary transition-all duration-300 h-9 text-xs font-semibold"
                    >
                      Edit Profile
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Name field */}
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.01] border border-white/5">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5 text-left w-full">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Full Name</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full bg-transparent border-b border-white/10 focus:border-primary text-sm font-semibold text-foreground py-0.5 outline-none transition-colors"
                        />
                      ) : (
                        <p className="text-sm font-semibold text-foreground">{user.name}</p>
                      )}
                    </div>
                  </div>

                  {/* Email field */}
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.01] border border-white/5">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5 text-left w-full">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Email Address</p>
                      {isEditing ? (
                        <input
                          type="email"
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          className="w-full bg-transparent border-b border-white/10 focus:border-primary text-sm font-semibold text-foreground py-0.5 outline-none transition-colors"
                        />
                      ) : (
                        <p className="text-sm font-semibold text-foreground">{user.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Mobile number field */}
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.01] border border-white/5">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5 text-left w-full">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Mobile Number</p>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          className="w-full bg-transparent border-b border-white/10 focus:border-primary text-sm font-semibold text-foreground py-0.5 outline-none transition-colors"
                        />
                      ) : (
                        <p className="text-sm font-semibold text-foreground">{user.phone || "Not provided"}</p>
                      )}
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end gap-3 pt-2">
                    <Button
                      variant="ghost"
                      onClick={() => setIsEditing(false)}
                      disabled={saving}
                      className="rounded-xl px-5 h-9 text-xs text-muted-foreground hover:text-foreground transition-all duration-300"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={saving}
                      className="rounded-xl px-5 h-9 text-xs bg-primary hover:bg-primary/95 text-primary-foreground font-semibold shadow-glow-sm transition-all duration-300"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                )}

              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
      <FloatingButtons />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

export default ProfilePage;
