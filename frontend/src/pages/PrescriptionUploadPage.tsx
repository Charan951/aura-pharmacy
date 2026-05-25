import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { apiBaseUrl } from "@/lib/utils";
import { authFetch, useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import CartDrawer from "@/components/CartDrawer";
import { useCart } from "@/hooks/use-cart";
import { UploadCloud, FileText } from "lucide-react";

type Prescription = {
  _id: string;
  status: string;
  notes?: string;
  adminComment?: string;
  createdAt: string;
  decidedAt?: string;
};

const PrescriptionUploadPage = () => {
  const { token } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const { totalItems } = useCart();
  const isLoggedIn = Boolean(token);

  const cartCount = totalItems;

  const { data, isLoading, refetch } = useQuery<Prescription[]>({
    queryKey: ["my-prescriptions"],
    queryFn: () =>
      authFetch(
        `${apiBaseUrl}/api/prescriptions/my`,
        {
          method: "GET",
        },
        token,
      ),
    enabled: isLoggedIn,
  });

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!file) {
        throw new Error("Please select a file");
      }

      const base64 = await fileToBase64(file);

      return authFetch(
        `${apiBaseUrl}/api/prescriptions`,
        {
          method: "POST",
          body: JSON.stringify({
            imageData: base64,
            notes,
          }),
        },
        token,
      );
    },
    onSuccess: () => {
      toast.success("Prescription uploaded");
      setFile(null);
      setNotes("");
      setPreview(null);
      refetch();
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Failed to upload prescription";
      toast.error(message);
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (!selected) {
      setFile(null);
      setPreview(null);
      return;
    }
    setFile(selected);

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setPreview(result);
      }
    };
    reader.readAsDataURL(selected);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    uploadMutation.mutate();
  };

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: { pathname: "/prescriptions" } }} replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />

      <main className="relative pt-32 md:pt-40 pb-20 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row gap-6 justify-center items-start max-w-5xl">
          {/* Left card: Upload form */}
          <div className="w-full md:w-1/2">
            <Card className="bg-card border-border/50 shadow-glow overflow-hidden rounded-3xl">
              <CardHeader className="border-b border-white/5 pb-4">
                <CardTitle className="text-lg font-bold text-foreground">Upload Prescription</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Upload a clear photo of your prescription to order</p>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Prescription image</Label>
                    <div className="relative group flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-2xl p-6 bg-white/[0.01] hover:bg-white/[0.02] transition-colors cursor-pointer">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                        required 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <UploadCloud className="w-8 h-8 text-primary/60 group-hover:text-primary transition-colors mb-2" />
                      <p className="text-xs text-foreground font-semibold">
                        {file ? file.name : "Click to upload or drag & drop"}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-1">PNG, JPG or JPEG up to 5MB</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Notes for pharmacist</Label>
                    <Textarea
                      rows={3}
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                      placeholder="Mention any special instructions or allergies."
                      className="bg-white/[0.02] border-white/5 rounded-xl text-xs placeholder:text-muted-foreground/30 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                  {preview && (
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Preview</Label>
                      <div className="border border-white/5 rounded-2xl overflow-hidden max-h-80 bg-black/45 p-2 flex justify-center">
                        <img src={preview} alt="Prescription preview" className="max-h-72 object-contain rounded-xl" />
                      </div>
                    </div>
                  )}
                  <Button type="submit" disabled={uploadMutation.isPending} className="w-full h-11 rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-semibold shadow-glow-sm transition-all duration-300">
                    {uploadMutation.isPending ? "Submitting..." : "Submit prescription"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right card: List */}
          <div className="w-full md:w-1/2">
            <Card className="bg-card border-border/50 shadow-glow overflow-hidden rounded-3xl">
              <CardHeader className="border-b border-white/5 pb-4">
                <CardTitle className="text-lg font-bold text-foreground">Your Prescriptions</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Track the status of your uploaded prescriptions</p>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {isLoading && <p className="text-xs text-muted-foreground">Loading prescriptions...</p>}
                {!isLoading && (!data || data.length === 0) && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FileText className="w-10 h-10 text-muted-foreground/30 mb-3" />
                    <p className="text-xs text-muted-foreground font-medium">You have not uploaded any prescriptions yet.</p>
                  </div>
                )}
                {!isLoading && data && data.length > 0 && (
                  <div className="space-y-3">
                    {data.map((prescription) => (
                      <div
                        key={prescription._id}
                        className="flex flex-col gap-2 rounded-2xl border border-white/5 bg-white/[0.01] p-4 transition-all duration-300 hover:bg-white/[0.02]"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="space-y-0.5 text-left">
                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                              Uploaded On
                            </p>
                            <p className="text-xs font-semibold text-foreground">
                              {new Date(prescription.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <Badge className={`rounded-xl px-2.5 py-1 text-[10px] font-semibold border ${statusClass(prescription.status)}`}>
                            {statusLabel(prescription.status)}
                          </Badge>
                        </div>
                        {prescription.notes && (
                          <div className="text-left bg-white/[0.01] border border-white/5 rounded-xl p-2.5 mt-1">
                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Your Note</p>
                            <p className="text-xs text-foreground font-medium leading-relaxed">{prescription.notes}</p>
                          </div>
                        )}
                        {prescription.adminComment && (
                          <div className="text-left bg-primary/5 border border-primary/10 rounded-xl p-2.5 mt-1">
                            <p className="text-[10px] uppercase tracking-wider text-primary font-semibold mb-1">Pharmacist Note</p>
                            <p className="text-xs text-foreground font-medium leading-relaxed">{prescription.adminComment}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
      <FloatingButtons />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

const fileToBase64 = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result === "string") {
        resolve(result);
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
};

const statusLabel = (status: string) => {
  if (status === "approved") return "Approved";
  if (status === "rejected") return "Rejected";
  return "Pending";
};

const statusClass = (status: string) => {
  if (status === "approved") {
    return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  }
  if (status === "rejected") {
    return "bg-rose-500/10 text-rose-400 border-rose-500/20";
  }
  return "bg-amber-500/10 text-amber-400 border-amber-500/20";
};

export default PrescriptionUploadPage;
