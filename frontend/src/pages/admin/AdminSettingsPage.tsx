import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth, authFetch } from "@/hooks/use-auth";
import { apiBaseUrl } from "@/lib/utils";
import { toast } from "sonner";

type AboutSettings = {
  aboutSectionOneImage: string;
  aboutSectionTwoImage: string;
};

type AboutSettingsFormState = {
  sectionOneImageData: string | null;
  sectionTwoImageData: string | null;
};

const emptyForm: AboutSettingsFormState = {
  sectionOneImageData: null,
  sectionTwoImageData: null,
};

const AdminSettingsPage = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<AboutSettingsFormState>(emptyForm);

  const { data, isLoading } = useQuery<AboutSettings>({
    queryKey: ["admin-settings-about"],
    queryFn: () =>
      authFetch(
        `${apiBaseUrl}/api/admin/settings/about`,
        {
          method: "GET",
        },
        token,
      ),
    enabled: Boolean(token),
  });

  const updateMutation = useMutation({
    mutationFn: (payload: AboutSettingsFormState) =>
      authFetch(
        `${apiBaseUrl}/api/admin/settings/about`,
        {
          method: "PUT",
          body: JSON.stringify(payload),
        },
        token,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-settings-about"] });
      toast.success("About page images updated");
      setForm(emptyForm);
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Failed to update about page images";
      toast.error(message);
    },
  });

  const handleImageChange = (key: keyof AboutSettingsFormState, file: File | undefined) => {
    if (!file) {
      setForm((prev) => ({
        ...prev,
        [key]: null,
      }));
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setForm((prev) => ({
          ...prev,
          [key]: result,
        }));
      }
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    updateMutation.mutate(form);
  };

  const currentSettings = data;

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h2 className="text-lg md:text-xl font-semibold">Settings</h2>
        <p className="text-xs text-muted-foreground">
          Update global content such as About page photos.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm md:text-base">About page images</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {isLoading && (
            <p className="text-xs text-muted-foreground">Loading current images...</p>
          )}
          {!isLoading && currentSettings && (
            <form onSubmit={handleSubmit} className="space-y-6 mt-2">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label>Top section image</Label>
                    <p className="text-[11px] text-muted-foreground">
                      Shown on the left content with image on the right.
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) =>
                        handleImageChange("sectionOneImageData", event.target.files?.[0])
                      }
                      className="text-xs"
                    />
                  </div>
                  <div className="rounded-2xl border border-border/70 overflow-hidden bg-muted/30 h-40 flex items-center justify-center">
                    <img
                      src={currentSettings.aboutSectionOneImage}
                      alt="About top section"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label>Bottom section image</Label>
                    <p className="text-[11px] text-muted-foreground">
                      Shown on the lower section where image and content swap sides.
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) =>
                        handleImageChange("sectionTwoImageData", event.target.files?.[0])
                      }
                      className="text-xs"
                    />
                  </div>
                  <div className="rounded-2xl border border-border/70 overflow-hidden bg-muted/30 h-40 flex items-center justify-center">
                    <img
                      src={currentSettings.aboutSectionTwoImage}
                      alt="About bottom section"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  size="sm"
                  className="rounded-full"
                  disabled={updateMutation.isPending}
                >
                  Save changes
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettingsPage;

