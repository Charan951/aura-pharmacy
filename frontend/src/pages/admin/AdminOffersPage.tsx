import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useAuth, authFetch } from "@/hooks/use-auth";
import { apiBaseUrl } from "@/lib/utils";
import { toast } from "sonner";

type Offer = {
  _id: string;
  title: string;
  description?: string;
  code?: string;
  expiresAt?: string;
  image?: string;
  isActive: boolean;
};

type OfferFormState = {
  title: string;
  description: string;
  code: string;
  expiresAt: string;
  isActive: boolean;
   imageData: string | null;
};

const emptyForm: OfferFormState = {
  title: "",
  description: "",
  code: "",
  expiresAt: "",
  isActive: true,
  imageData: null,
};

const AdminOffersPage = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [includeInactive, setIncludeInactive] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [form, setForm] = useState<OfferFormState>(emptyForm);

  const { data, isLoading } = useQuery<Offer[]>({
    queryKey: ["admin-offers", { includeInactive }],
    queryFn: () =>
      authFetch(
        `${apiBaseUrl}/api/admin/offers`,
        {
          method: "GET",
        },
        token,
      ),
    enabled: Boolean(token),
  });

  const offers = (data ?? []).filter((offer) => (includeInactive ? true : offer.isActive));

  const createMutation = useMutation({
    mutationFn: (payload: OfferFormState) =>
      authFetch(
        `${apiBaseUrl}/api/admin/offers`,
        {
          method: "POST",
          body: JSON.stringify(formToPayload(payload)),
        },
        token,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-offers"] });
      toast.success("Offer created");
      closeDialog();
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Failed to create offer";
      toast.error(message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: OfferFormState) => {
      if (!editingOffer) {
        throw new Error("No offer selected");
      }
      return authFetch(
        `${apiBaseUrl}/api/admin/offers/${editingOffer._id}`,
        {
          method: "PUT",
          body: JSON.stringify(formToPayload(payload)),
        },
        token,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-offers"] });
      toast.success("Offer updated");
      closeDialog();
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Failed to update offer";
      toast.error(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      authFetch(
        `${apiBaseUrl}/api/admin/offers/${id}`,
        {
          method: "DELETE",
        },
        token,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-offers"] });
      toast.success("Offer archived");
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Failed to delete offer";
      toast.error(message);
    },
  });

  const handleOpenCreate = () => {
    setEditingOffer(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const handleOpenEdit = (offer: Offer) => {
    setEditingOffer(offer);
    setForm({
      title: offer.title,
      description: offer.description ?? "",
      code: offer.code ?? "",
      expiresAt: offer.expiresAt ? offer.expiresAt.slice(0, 10) : "",
      isActive: offer.isActive,
      imageData: null,
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingOffer(null);
    setForm(emptyForm);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (editingOffer) {
      updateMutation.mutate(form);
    } else {
      createMutation.mutate(form);
    }
  };

  const handleChange = (key: keyof OfferFormState, value: string | boolean) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setForm((prev) => ({
        ...prev,
        imageData: null,
      }));
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setForm((prev) => ({
          ...prev,
          imageData: result,
        }));
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg md:text-xl font-semibold">Offers</h2>
          <p className="text-xs text-muted-foreground">
            Manage promotional offers shown on the Offers page.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">Show inactive</span>
            <Switch checked={includeInactive} onCheckedChange={setIncludeInactive} />
          </div>
          <Button size="sm" className="rounded-full" onClick={handleOpenCreate}>
            <Plus className="w-4 h-4 mr-1" />
            Add offer
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm md:text-base">Offer list</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {isLoading && <p className="text-xs text-muted-foreground">Loading offers...</p>}
          {!isLoading && offers.length === 0 && (
            <p className="text-xs text-muted-foreground">No offers yet. Create your first promotion.</p>
          )}
          {!isLoading && offers.length > 0 && (
            <div className="space-y-2">
              {offers.map((offer) => (
                <div
                  key={offer._id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-card/80 px-3 py-2.5 md:px-4 md:py-3"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{offer.title}</span>
                      <span
                        className={
                          offer.isActive
                            ? "inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 border border-emerald-200"
                            : "inline-flex items-center rounded-full bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-600 border border-slate-200"
                        }
                      >
                        {offer.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    {offer.code && (
                      <p className="text-[11px] text-muted-foreground">Code: {offer.code}</p>
                    )}
                    {offer.expiresAt && (
                      <p className="text-[11px] text-muted-foreground">
                        Expires on {new Date(offer.expiresAt).toLocaleDateString()}
                      </p>
                    )}
                    {offer.description && (
                      <p className="text-[11px] text-muted-foreground line-clamp-2">{offer.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleOpenEdit(offer)}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive"
                      onClick={() => deleteMutation.mutate(offer._id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>{editingOffer ? "Edit offer" : "Add offer"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label>Image</Label>
                <Input type="file" accept="image/*" onChange={handleImageChange} />
              </div>
              <div className="space-y-1">
                <Label>Title</Label>
                <Input
                  value={form.title}
                  onChange={(event) => handleChange("title", event.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label>Description</Label>
                <Input
                  value={form.description}
                  onChange={(event) => handleChange("description", event.target.value)}
                  placeholder="Short description for this offer"
                />
              </div>
              <div className="space-y-1">
                <Label>Code</Label>
                <Input
                  value={form.code}
                  onChange={(event) => handleChange("code", event.target.value)}
                  placeholder="PROMO10"
                />
              </div>
              <div className="space-y-1">
                <Label>Expiry date</Label>
                <Input
                  type="date"
                  value={form.expiresAt}
                  onChange={(event) => handleChange("expiresAt", event.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Switch
                  checked={form.isActive}
                  onCheckedChange={(value) => handleChange("isActive", value)}
                />
                <span className="text-xs text-muted-foreground">Offer is active</span>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {editingOffer ? "Save changes" : "Create offer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const formToPayload = (form: OfferFormState) => {
  return {
    title: form.title.trim(),
    description: form.description.trim() || undefined,
    code: form.code.trim() || undefined,
    expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : undefined,
    isActive: form.isActive,
    imageData: form.imageData || undefined,
  };
};

export default AdminOffersPage;
