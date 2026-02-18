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
  const isLoggedIn = Boolean(token);

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
    <div className="max-w-4xl mx-auto space-y-6 px-4 py-6 md:py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Upload Prescription</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Prescription image</Label>
              <Input type="file" accept="image/*" onChange={handleFileChange} required />
            </div>
            <div className="space-y-2">
              <Label>Notes for pharmacist</Label>
              <Textarea
                rows={3}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Mention any special instructions or allergies."
              />
            </div>
            {preview && (
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="border rounded-lg overflow-hidden max-h-80">
                  <img src={preview} alt="Prescription preview" className="w-full object-contain" />
                </div>
              </div>
            )}
            <Button type="submit" disabled={uploadMutation.isPending}>
              Submit prescription
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Your prescriptions</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <p className="text-xs text-muted-foreground">Loading prescriptions...</p>}
          {!isLoading && (!data || data.length === 0) && (
            <p className="text-xs text-muted-foreground">You have not uploaded any prescriptions yet.</p>
          )}
          {!isLoading && data && data.length > 0 && (
            <div className="space-y-2">
              {data.map((prescription) => (
                <div
                  key={prescription._id}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-2 rounded-xl border border-border/70 bg-card/80 px-3 py-2.5 md:px-4 md:py-3"
                >
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                      {new Date(prescription.createdAt).toLocaleString()}
                    </p>
                    {prescription.notes && (
                      <p className="text-xs text-foreground line-clamp-2">{prescription.notes}</p>
                    )}
                    {prescription.adminComment && (
                      <p className="text-[11px] text-muted-foreground">
                        Pharmacist note: {prescription.adminComment}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge className={statusClass(prescription.status)}>{statusLabel(prescription.status)}</Badge>
                    {prescription.decidedAt && (
                      <span className="text-[11px] text-muted-foreground">
                        Updated {new Date(prescription.decidedAt).toLocaleString()}
                      </span>
                    )}
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
    return "bg-emerald-50 text-emerald-700 border border-emerald-200";
  }
  if (status === "rejected") {
    return "bg-rose-50 text-rose-700 border border-rose-200";
  }
  return "bg-amber-50 text-amber-700 border border-amber-200";
};

export default PrescriptionUploadPage;
