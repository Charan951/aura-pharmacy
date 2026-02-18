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

type Category = {
  _id: string;
  name: string;
  description?: string;
  isActive: boolean;
};

type CategoryFormState = {
  name: string;
  description: string;
};

const emptyForm: CategoryFormState = {
  name: "",
  description: "",
};

const AdminCategoriesPage = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [includeInactive, setIncludeInactive] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form, setForm] = useState<CategoryFormState>(emptyForm);

  const { data, isLoading } = useQuery<Category[]>({
    queryKey: ["admin-categories", { includeInactive }],
    queryFn: () =>
      authFetch(
        `${apiBaseUrl}/api/categories?includeInactive=${includeInactive}`,
        {
          method: "GET",
        },
        token,
      ),
    enabled: Boolean(token),
  });

  const createMutation = useMutation({
    mutationFn: (payload: CategoryFormState) =>
      authFetch(
        `${apiBaseUrl}/api/categories`,
        {
          method: "POST",
          body: JSON.stringify(formToPayload(payload)),
        },
        token,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      toast.success("Category created");
      closeDialog();
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Failed to create category";
      toast.error(message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: CategoryFormState) => {
      if (!editingCategory) {
        throw new Error("No category selected");
      }
      return authFetch(
        `${apiBaseUrl}/api/categories/${editingCategory._id}`,
        {
          method: "PUT",
          body: JSON.stringify(formToPayload(payload)),
        },
        token,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      toast.success("Category updated");
      closeDialog();
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Failed to update category";
      toast.error(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      authFetch(
        `${apiBaseUrl}/api/categories/${id}`,
        {
          method: "DELETE",
        },
        token,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      toast.success("Category archived");
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Failed to delete category";
      toast.error(message);
    },
  });

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setEditingCategory(category);
    setForm({
      name: category.name,
      description: category.description ?? "",
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingCategory(null);
    setForm(emptyForm);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (editingCategory) {
      updateMutation.mutate(form);
    } else {
      createMutation.mutate(form);
    }
  };

  const handleChange = (key: keyof CategoryFormState, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg md:text-xl font-semibold">Categories</h2>
          <p className="text-xs text-muted-foreground">
            Manage product categories used across your pharmacy storefront and inventory.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">Show inactive</span>
            <Switch checked={includeInactive} onCheckedChange={setIncludeInactive} />
          </div>
          <Button size="sm" className="rounded-full" onClick={handleOpenCreate}>
            <Plus className="w-4 h-4 mr-1" />
            Add category
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm md:text-base">Category list</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {isLoading && <p className="text-xs text-muted-foreground">Loading categories...</p>}
          {!isLoading && (!data || data.length === 0) && (
            <p className="text-xs text-muted-foreground">No categories yet. Create your first category.</p>
          )}
          {!isLoading && data && data.length > 0 && (
            <div className="space-y-2">
              {data.map((category) => (
                <div
                  key={category._id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-card/80 px-3 py-2.5 md:px-4 md:py-3"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{category.name}</span>
                      <span
                        className={
                          category.isActive
                            ? "inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 border border-emerald-200"
                            : "inline-flex items-center rounded-full bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-600 border border-slate-200"
                        }
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    {category.description && (
                      <p className="text-[11px] text-muted-foreground">{category.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleOpenEdit(category)}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive"
                      onClick={() => deleteMutation.mutate(category._id)}
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
              <DialogTitle>{editingCategory ? "Edit category" : "Add category"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label>Name</Label>
                <Input value={form.name} onChange={(event) => handleChange("name", event.target.value)} required />
              </div>
              <div className="space-y-1">
                <Label>Description</Label>
                <Input
                  value={form.description}
                  onChange={(event) => handleChange("description", event.target.value)}
                  placeholder="Short description for this category"
                />
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
                {editingCategory ? "Save changes" : "Create category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const formToPayload = (form: CategoryFormState) => {
  return {
    name: form.name.trim(),
    description: form.description.trim() || undefined,
  };
};

export default AdminCategoriesPage;

