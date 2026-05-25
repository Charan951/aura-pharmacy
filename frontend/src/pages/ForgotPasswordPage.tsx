import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import FloatingButtons from "@/components/FloatingButtons";
import CartDrawer from "@/components/CartDrawer";
import { toast } from "sonner";
import { useCart } from "@/hooks/use-cart";
import { apiClient } from "@/api";
import { apiBaseUrl } from "@/lib/utils";
import { Eye, EyeOff, KeyRound, Mail, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState<1 | 2>(1); // 1 = request code, 2 = verify and reset
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { totalItems } = useCart();

  const cartCount = totalItems;

  const handleRequestCode = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      await apiClient.post(`${apiBaseUrl}/api/auth/forgot-password`, { email });
      toast.success("Verification code sent to your email!");
      setStep(2);
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to send reset code";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async (event: React.FormEvent) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setSubmitting(true);

    try {
      await apiClient.post(`${apiBaseUrl}/api/auth/reset-password`, {
        email,
        otp: otp.trim(),
        newPassword,
      });
      toast.success("Password reset successfully! Please login with your new password.");
      navigate("/login");
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to reset password";
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
          <Card className="w-full max-w-md p-8 space-y-6 bg-card border-border/50 shadow-glow relative z-10">
            {step === 1 ? (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center space-y-1">
                  <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
                    <KeyRound className="w-6 h-6 text-primary" /> Forgot Password
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Enter your email address and we will send you a 6-digit code to reset your password.
                  </p>
                </div>

                <form className="space-y-4" onSubmit={handleRequestCode}>
                  <div className="space-y-2 text-left">
                    <label className="text-sm font-medium flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-muted-foreground" /> Email Address
                    </label>
                    <Input
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full h-11" disabled={submitting}>
                    {submitting ? "Sending Code..." : "Send Verification Code"}
                  </Button>
                </form>

                <div className="text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center space-y-1">
                  <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
                    <KeyRound className="w-6 h-6 text-primary" /> Reset Password
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    We sent a 6-digit reset code to <strong className="text-foreground">{email}</strong>.
                  </p>
                </div>

                <form className="space-y-4" onSubmit={handleResetPassword}>
                  <div className="space-y-2 text-left">
                    <label className="text-sm font-medium">Verification Code</label>
                    <Input
                      type="text"
                      maxLength={6}
                      placeholder="Enter 6-digit code"
                      className="text-center text-lg tracking-widest font-bold"
                      value={otp}
                      onChange={(event) => setOtp(event.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2 text-left">
                    <label className="text-sm font-medium">New Password</label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                        required
                        className="pr-10"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-left">
                    <label className="text-sm font-medium">Confirm New Password</label>
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full h-11" disabled={submitting}>
                    {submitting ? "Resetting Password..." : "Reset Password"}
                  </Button>
                </form>

                <div className="text-center">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
                    onClick={() => setStep(1)}
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>
                </div>
              </motion.div>
            )}
          </Card>
        </div>
      </main>
      <FloatingButtons />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

export default ForgotPasswordPage;
