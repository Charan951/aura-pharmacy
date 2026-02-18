import { useMemo, useState } from "react";
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

type Product = {
  _id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  category?: string;
  image?: string;
  stock: number;
  minStock: number;
  isActive: boolean;
};

type Category = {
  _id: string;
  name: string;
  isActive: boolean;
};

type ProductFormState = {
  name: string;
  brand: string;
  price: string;
  originalPrice: string;
  category: string;
  stock: string;
  minStock: string;
  imageData: string | null;
};

const emptyForm: ProductFormState = {
  name: "",
  brand: "",
  price: "",
  originalPrice: "",
  category: "",
  stock: "",
  minStock: "",
  imageData: null,
};

const AdminInventoryPage = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [includeInactive, setIncludeInactive] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductFormState>(emptyForm);

  const { data, isLoading } = useQuery<Product[]>({
    queryKey: ["admin-products", { includeInactive }],
    queryFn: () =>
      authFetch(
        `${apiBaseUrl}/api/products?includeInactive=${includeInactive}`,
        {
          method: "GET",
        },
        token,
      ),
    enabled: Boolean(token),
  });

  const { data: categoriesData } = useQuery<Category[]>({
    queryKey: ["admin-categories", { includeInactive: false }],
    queryFn: () =>
      authFetch(
        `${apiBaseUrl}/api/categories`,
        {
          method: "GET",
        },
        token,
      ),
    enabled: Boolean(token),
  });

  const activeCategories = useMemo(
    () => (categoriesData ?? []).filter((category) => category.isActive),
    [categoriesData],
  );

  const createMutation = useMutation({
    mutationFn: (payload: ProductFormState) =>
      authFetch(
        `${apiBaseUrl}/api/products`,
        {
          method: "POST",
          body: JSON.stringify(formToPayload(payload)),
        },
        token,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
      toast.success("Product created");
      closeDialog();
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Failed to create product";
      toast.error(message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: ProductFormState) => {
      if (!editingProduct) {
        throw new Error("No product selected");
      }
      return authFetch(
        `${apiBaseUrl}/api/products/${editingProduct._id}`,
        {
          method: "PUT",
          body: JSON.stringify(formToPayload(payload)),
        },
        token,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
      toast.success("Product updated");
      closeDialog();
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Failed to update product";
      toast.error(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      authFetch(
        `${apiBaseUrl}/api/products/${id}`,
        {
          method: "DELETE",
        },
        token,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
      toast.success("Product archived");
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Failed to delete product";
      toast.error(message);
    },
  });

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      brand: product.brand,
      price: product.price.toString(),
      originalPrice: product.originalPrice ? product.originalPrice.toString() : "",
      category: product.category ?? "",
      stock: product.stock.toString(),
      minStock: product.minStock.toString(),
      imageData: null,
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingProduct(null);
    setForm(emptyForm);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (editingProduct) {
      updateMutation.mutate(form);
    } else {
      createMutation.mutate(form);
    }
  };

  const handleChange = (key: keyof ProductFormState, value: string) => {
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
          <h2 className="text-lg md:text-xl font-semibold">Inventory</h2>
          <p className="text-xs text-muted-foreground">
            Manage product catalog, stock levels, and low stock thresholds.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">Show inactive</span>
            <Switch checked={includeInactive} onCheckedChange={setIncludeInactive} />
          </div>
          <Button size="sm" className="rounded-full" onClick={handleOpenCreate}>
            <Plus className="w-4 h-4 mr-1" />
            Add product
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm md:text-base">Product list</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {isLoading && <p className="text-xs text-muted-foreground">Loading products...</p>}
          {!isLoading && (!data || data.length === 0) && (
            <p className="text-xs text-muted-foreground">No products yet. Create your first product.</p>
          )}
          {!isLoading && data && data.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-border/60 text-[11px] text-muted-foreground">
                    <th className="text-left py-2 pr-4 font-medium">Product</th>
                    <th className="text-left py-2 pr-4 font-medium">Category</th>
                    <th className="text-right py-2 pr-4 font-medium">Price</th>
                    <th className="text-right py-2 pr-4 font-medium">Stock</th>
                    <th className="text-center py-2 pr-4 font-medium">Active</th>
                    <th className="text-right py-2 pl-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((product) => {
                    const isLow = product.stock <= product.minStock;

                    return (
                      <tr key={product._id} className="border-b border-border/40 last:border-0">
                        <td className="py-2 pr-4">
                          <div className="flex flex-col">
                            <span className="font-medium">{product.name}</span>
                            <span className="text-[11px] text-muted-foreground">{product.brand}</span>
                          </div>
                        </td>
                        <td className="py-2 pr-4 text-[11px]">{product.category || "-"}</td>
                        <td className="py-2 pr-4 text-right text-sm">
                          ₹{product.price.toFixed(2)}
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="ml-1 text-[11px] text-muted-foreground line-through">
                              ₹{product.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </td>
                        <td className="py-2 pr-4 text-right">
                          <span className="text-sm">{product.stock}</span>
                          <span className="ml-1 text-[11px] text-muted-foreground">/ {product.minStock}</span>
                          {isLow && (
                            <span className="ml-1 inline-flex items-center rounded-full bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 border border-amber-200">
                              Low
                            </span>
                          )}
                        </td>
                        <td className="py-2 pr-4 text-center">
                          <span
                            className={
                              product.isActive
                                ? "inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 border border-emerald-200"
                                : "inline-flex items-center rounded-full bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-600 border border-slate-200"
                            }
                          >
                            {product.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="py-2 pl-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleOpenEdit(product)}
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive"
                              onClick={() => deleteMutation.mutate(product._id)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Edit product" : "Add product"}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1 md:col-span-2">
                <Label>Image</Label>
                <Input type="file" accept="image/*" onChange={handleImageChange} />
              </div>
              <div className="space-y-1">
                <Label>Name</Label>
                <Input value={form.name} onChange={(event) => handleChange("name", event.target.value)} required />
              </div>
              <div className="space-y-1">
                <Label>Brand</Label>
                <Input value={form.brand} onChange={(event) => handleChange("brand", event.target.value)} required />
              </div>
              <div className="space-y-1">
                <Label>Category</Label>
                <select
                  value={form.category}
                  onChange={(event) => handleChange("category", event.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-2 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="">Select category</option>
                  {activeCategories.map((category) => (
                    <option key={category._id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label>Price (₹)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={(event) => handleChange("price", event.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label>Original price (₹)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.originalPrice}
                  onChange={(event) => handleChange("originalPrice", event.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label>Stock</Label>
                <Input
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(event) => handleChange("stock", event.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label>Low stock threshold</Label>
                <Input
                  type="number"
                  min="0"
                  value={form.minStock}
                  onChange={(event) => handleChange("minStock", event.target.value)}
                  required
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
                {editingProduct ? "Save changes" : "Create product"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const formToPayload = (form: ProductFormState) => {
  return {
    name: form.name.trim(),
    brand: form.brand.trim(),
    category: form.category.trim() || undefined,
    price: Number(form.price) || 0,
    originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
    stock: Number(form.stock) || 0,
    minStock: Number(form.minStock) || 0,
    imageData: form.imageData || undefined,
  };
};

export default AdminInventoryPage;
