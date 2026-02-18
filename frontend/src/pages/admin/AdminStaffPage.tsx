import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth, authFetch } from "@/hooks/use-auth";
import { apiBaseUrl } from "@/lib/utils";
import { toast } from "sonner";
import { Trash2, UserPlus } from "lucide-react";

type Staff = {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

type StaffFormState = {
  name: string;
  email: string;
  password: string;
};

const emptyForm: StaffFormState = {
  name: "",
  email: "",
  password: "",
};

const AdminStaffPage = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<StaffFormState>(emptyForm);

  const { data, isLoading } = useQuery<Staff[]>({
    queryKey: ["admin-staff"],
    queryFn: () =>
      authFetch(
        `${apiBaseUrl}/api/admin/staff`,
        {
          method: "GET",
        },
        token,
      ),
    enabled: Boolean(token),
  });

  const createMutation = useMutation({
    mutationFn: (payload: StaffFormState) =>
      authFetch(
        `${apiBaseUrl}/api/admin/staff`,
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
        token,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-staff"] });
      toast.success("Staff member created");
      closeDialog();
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Failed to create staff member";
      toast.error(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      authFetch(
        `${apiBaseUrl}/api/admin/staff/${id}`,
        {
          method: "DELETE",
        },
        token,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-staff"] });
      toast.success("Staff member deleted");
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Failed to delete staff member";
      toast.error(message);
    },
  });

  const handleOpenCreate = () => {
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setForm(emptyForm);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    createMutation.mutate(form);
  };

  const handleChange = (key: keyof StaffFormState, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg md:text-xl font-semibold">Staff</h2>
          <p className="text-xs text-muted-foreground">
            Manage your internal pharmacy staff accounts used for operations.
          </p>
        </div>
        <Button size="sm" className="rounded-full" onClick={handleOpenCreate}>
          <UserPlus className="w-4 h-4 mr-1" />
          Add staff
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm md:text-base">Staff members</CardTitle>
          <span className="text-[11px] text-muted-foreground">
            {isLoading ? "Loading..." : `${data?.length ?? 0} member${data && data.length === 1 ? "" : "s"}`}
          </span>
        </CardHeader>
        <CardContent className="pt-0">
          {isLoading && <p className="text-xs text-muted-foreground">Loading staff...</p>}
          {!isLoading && (!data || data.length === 0) && (
            <p className="text-xs text-muted-foreground">No staff members yet. Create your first staff account.</p>
          )}
          {!isLoading && data && data.length > 0 && (
            <div className="space-y-2">
              {data.map((staff) => (
                <div
                  key={staff._id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-card/80 px-3 py-2.5 md:px-4 md:py-3"
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold">{staff.name}</p>
                    <p className="text-[11px] text-muted-foreground">{staff.email}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(staff.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive"
                      onClick={() => deleteMutation.mutate(staff._id)}
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
              <DialogTitle>Add staff member</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label>Full name</Label>
                <Input
                  value={form.name}
                  onChange={(event) => handleChange("name", event.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(event) => handleChange("email", event.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label>Password</Label>
                <Input
                  type="password"
                  value={form.password}
                  minLength={6}
                  onChange={(event) => handleChange("password", event.target.value)}
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
                disabled={createMutation.isPending}
              >
                Create staff
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminStaffPage;

