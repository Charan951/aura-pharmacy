import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiBaseUrl } from "@/lib/utils";
import { authFetch, useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

type Prescription = {
  _id: string;
  user?: {
    name: string;
    email: string;
  };
  status: string;
  notes?: string;
  adminComment?: string;
  createdAt: string;
  decidedAt?: string;
};

const statusOptions = ["all", "pending", "approved", "rejected"] as const;

type StatusFilter = (typeof statusOptions)[number];

const AdminPrescriptionsPage = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected] = useState<Prescription | null>(null);
  const [adminComment, setAdminComment] = useState("");
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [imageData, setImageData] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);

  const { data, isLoading } = useQuery<Prescription[]>({
    queryKey: ["admin-prescriptions", { statusFilter }],
    queryFn: () => {
      const params = new URLSearchParams();
      if (statusFilter !== "all") {
        params.set("status", statusFilter);
      }
      const query = params.toString();
      const url = query ? `${apiBaseUrl}/api/prescriptions?${query}` : `${apiBaseUrl}/api/prescriptions`;

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

  const decisionMutation = useMutation({
    mutationFn: ({ id, action }: { id: string; action: "approve" | "reject" }) =>
      authFetch(
        `${apiBaseUrl}/api/prescriptions/${id}/${action}`,
        {
          method: "PUT",
          body: JSON.stringify({ adminComment }),
        },
        token,
      ),
    onSuccess: () => {
      toast.success("Prescription updated");
      queryClient.invalidateQueries({ queryKey: ["admin-prescriptions"] });
      setDialogOpen(false);
      setSelected(null);
      setAdminComment("");
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Failed to update prescription";
      toast.error(message);
    },
  });

  const handleOpenDecision = (prescription: Prescription) => {
    setSelected(prescription);
    setAdminComment("");
    setDialogOpen(true);
  };

  const handleViewImage = async (prescription: Prescription) => {
    if (!token) {
      return;
    }

    setSelected(prescription);
    setImageData(null);
    setImageLoading(true);
    setImageDialogOpen(true);

    try {
      const response = await authFetch(
        `${apiBaseUrl}/api/prescriptions/${prescription._id}/image`,
        {
          method: "GET",
        },
        token,
      );

      if (response && typeof response.imageData === "string") {
        setImageData(response.imageData);
      } else {
        toast.error("Failed to load prescription image");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load prescription image";
      toast.error(message);
    } finally {
      setImageLoading(false);
    }
  };

  const handleApprove = () => {
    if (!selected) return;
    decisionMutation.mutate({ id: selected._id, action: "approve" });
  };

  const handleReject = () => {
    if (!selected) return;
    decisionMutation.mutate({ id: selected._id, action: "reject" });
  };

  const prescriptions = data ?? [];

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg md:text-xl font-semibold">Prescriptions</h2>
          <p className="text-xs text-muted-foreground">
            Review uploaded prescriptions and approve or reject them.
          </p>
        </div>
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
                  {value === "all" ? "All" : value.charAt(0).toUpperCase() + value.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm md:text-base">Prescription list</CardTitle>
          <span className="text-[11px] text-muted-foreground">
            {isLoading ? "Loading..." : `${prescriptions.length} record${prescriptions.length === 1 ? "" : "s"}`}
          </span>
        </CardHeader>
        <CardContent className="pt-0">
          {isLoading && <p className="text-xs text-muted-foreground">Loading prescriptions...</p>}
          {!isLoading && prescriptions.length === 0 && (
            <p className="text-xs text-muted-foreground">No prescriptions found for this filter.</p>
          )}
          {prescriptions.length > 0 && (
            <div className="space-y-2">
              {prescriptions.map((prescription) => (
                <div
                  key={prescription._id}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-2 rounded-xl border border-border/70 bg-card/80 px-3 py-2.5 md:px-4 md:py-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold">
                        {prescription.user ? prescription.user.name : "Unknown customer"}
                      </p>
                      {prescription.user && (
                        <span className="text-[11px] text-muted-foreground">{prescription.user.email}</span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Uploaded {new Date(prescription.createdAt).toLocaleString()}
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
                  <div className="flex items-center gap-2 justify-end">
                    <Badge className={statusClass(prescription.status)}>
                      {statusLabel(prescription.status)}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={() => handleViewImage(prescription)}
                    >
                      View image
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={() => handleOpenDecision(prescription)}
                    >
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review prescription</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">
                {selected.user ? `${selected.user.name} • ${selected.user.email}` : "Unknown customer"}
              </p>
              <p className="text-xs text-muted-foreground">
                Uploaded {new Date(selected.createdAt).toLocaleString()}
              </p>
              {selected.notes && <p className="text-xs">{selected.notes}</p>}
              <Textarea
                rows={3}
                value={adminComment}
                onChange={(event) => setAdminComment(event.target.value)}
                placeholder="Optional note for the customer"
              />
            </div>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setDialogOpen(false);
                setSelected(null);
                setAdminComment("");
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="outline"
              className="border-amber-300 text-amber-700"
              disabled={decisionMutation.isPending}
              onClick={handleReject}
            >
              Reject
            </Button>
            <Button
              type="button"
              disabled={decisionMutation.isPending}
              onClick={handleApprove}
            >
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={imageDialogOpen}
        onOpenChange={(open) => {
          setImageDialogOpen(open);
          if (!open) {
            setImageData(null);
            setImageLoading(false);
          }
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Prescription image</DialogTitle>
          </DialogHeader>
          {imageLoading && <p className="text-xs text-muted-foreground">Loading image...</p>}
          {!imageLoading && imageData && (
            <div className="border rounded-lg overflow-hidden max-h-[70vh]">
              <img src={imageData} alt="Prescription" className="w-full object-contain" />
            </div>
          )}
          {!imageLoading && !imageData && (
            <p className="text-xs text-muted-foreground">No image available.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
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

export default AdminPrescriptionsPage;
