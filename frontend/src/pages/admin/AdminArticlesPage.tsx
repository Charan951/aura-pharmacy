import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useAuth, authFetch } from "@/hooks/use-auth";
import { apiBaseUrl } from "@/lib/utils";
import { toast } from "sonner";

type Article = {
  _id: string;
  title: string;
  excerpt?: string;
  content?: string;
  category?: string;
  emoji?: string;
  readTimeMinutes?: number;
  isPublished: boolean;
  publishedAt?: string;
  image?: string;
};

type ArticleFormState = {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  emoji: string;
  readTimeMinutes: string;
  isPublished: boolean;
  publishedAt: string;
  imageData: string | null;
};

const emptyForm: ArticleFormState = {
  title: "",
  excerpt: "",
  content: "",
  category: "",
  emoji: "",
  readTimeMinutes: "",
  isPublished: true,
  publishedAt: "",
  imageData: null,
};

const AdminArticlesPage = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [showUnpublished, setShowUnpublished] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [form, setForm] = useState<ArticleFormState>(emptyForm);

  const { data, isLoading } = useQuery<Article[]>({
    queryKey: ["admin-articles"],
    queryFn: () =>
      authFetch(
        `${apiBaseUrl}/api/admin/articles`,
        {
          method: "GET",
        },
        token,
      ),
    enabled: Boolean(token),
  });

  const articles = (data ?? []).filter((article) =>
    showUnpublished ? true : article.isPublished,
  );

  const createMutation = useMutation({
    mutationFn: (payload: ArticleFormState) =>
      authFetch(
        `${apiBaseUrl}/api/admin/articles`,
        {
          method: "POST",
          body: JSON.stringify(formToPayload(payload)),
        },
        token,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      toast.success("Article created");
      closeDialog();
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Failed to create article";
      toast.error(message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: ArticleFormState) => {
      if (!editingArticle) {
        throw new Error("No article selected");
      }
      return authFetch(
        `${apiBaseUrl}/api/admin/articles/${editingArticle._id}`,
        {
          method: "PUT",
          body: JSON.stringify(formToPayload(payload)),
        },
        token,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      toast.success("Article updated");
      closeDialog();
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Failed to update article";
      toast.error(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      authFetch(
        `${apiBaseUrl}/api/admin/articles/${id}`,
        {
          method: "DELETE",
        },
        token,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      toast.success("Article deleted");
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Failed to delete article";
      toast.error(message);
    },
  });

  const handleOpenCreate = () => {
    setEditingArticle(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const handleOpenEdit = (article: Article) => {
    setEditingArticle(article);
    setForm({
      title: article.title,
      excerpt: article.excerpt ?? "",
      content: article.content ?? "",
      category: article.category ?? "",
      emoji: article.emoji ?? "",
      readTimeMinutes:
        typeof article.readTimeMinutes === "number" ? String(article.readTimeMinutes) : "",
      isPublished: article.isPublished,
      publishedAt: article.publishedAt ? article.publishedAt.slice(0, 10) : "",
      imageData: null,
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingArticle(null);
    setForm(emptyForm);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (editingArticle) {
      updateMutation.mutate(form);
    } else {
      createMutation.mutate(form);
    }
  };

  const handleChange = (key: keyof ArticleFormState, value: string | boolean) => {
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
          <h2 className="text-lg md:text-xl font-semibold">Health articles</h2>
          <p className="text-xs text-muted-foreground">
            Manage health content displayed on the Health Blog page.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">Include unpublished</span>
            <Switch checked={showUnpublished} onCheckedChange={setShowUnpublished} />
          </div>
          <Button size="sm" className="rounded-full" onClick={handleOpenCreate}>
            <Plus className="w-4 h-4 mr-1" />
            Add article
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm md:text-base">Article list</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {isLoading && <p className="text-xs text-muted-foreground">Loading articles...</p>}
          {!isLoading && articles.length === 0 && (
            <p className="text-xs text-muted-foreground">No articles yet. Create your first post.</p>
          )}
          {!isLoading && articles.length > 0 && (
            <div className="space-y-2">
              {articles.map((article) => (
                <div
                  key={article._id}
                  className="flex items-start justify-between gap-3 rounded-xl border border-border/70 bg-card/80 px-3 py-2.5 md:px-4 md:py-3"
                >
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold truncate">
                        {article.title}
                      </span>
                      <span
                        className={
                          article.isPublished
                            ? "inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 border border-emerald-200"
                            : "inline-flex items-center rounded-full bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-600 border border-slate-200"
                        }
                      >
                        {article.isPublished ? "Published" : "Draft"}
                      </span>
                    </div>
                    {article.category && (
                      <p className="text-[11px] text-muted-foreground">
                        Category: {article.category}
                      </p>
                    )}
                    {article.publishedAt && (
                      <p className="text-[11px] text-muted-foreground">
                        Published on {new Date(article.publishedAt).toLocaleDateString()}
                      </p>
                    )}
                    {article.excerpt && (
                      <p className="text-[11px] text-muted-foreground line-clamp-2">
                        {article.excerpt}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleOpenEdit(article)}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive"
                      onClick={() => deleteMutation.mutate(article._id)}
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
        <DialogContent className="max-w-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>{editingArticle ? "Edit article" : "Add article"}</DialogTitle>
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
                <Label>Excerpt</Label>
                <Input
                  value={form.excerpt}
                  onChange={(event) => handleChange("excerpt", event.target.value)}
                  placeholder="Short summary shown in the list"
                />
              </div>
              <div className="space-y-1">
                <Label>Content</Label>
                <Textarea
                  rows={5}
                  value={form.content}
                  onChange={(event) => handleChange("content", event.target.value)}
                  placeholder="Full article content (optional for now)"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label>Category</Label>
                  <Input
                    value={form.category}
                    onChange={(event) => handleChange("category", event.target.value)}
                    placeholder="Diabetes, Skin care..."
                  />
                </div>
                <div className="space-y-1">
                  <Label>Emoji</Label>
                  <Input
                    value={form.emoji}
                    onChange={(event) => handleChange("emoji", event.target.value)}
                    placeholder="🩺"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Read time (minutes)</Label>
                  <Input
                    type="number"
                    min={1}
                    value={form.readTimeMinutes}
                    onChange={(event) => handleChange("readTimeMinutes", event.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Publish date</Label>
                  <Input
                    type="date"
                    value={form.publishedAt}
                    onChange={(event) => handleChange("publishedAt", event.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <Switch
                    checked={form.isPublished}
                    onCheckedChange={(value) => handleChange("isPublished", value)}
                  />
                  <span className="text-xs text-muted-foreground">Article is published</span>
                </div>
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
                {editingArticle ? "Save changes" : "Create article"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const formToPayload = (form: ArticleFormState) => {
  const readTimeParsed = form.readTimeMinutes.trim().length
    ? Number(form.readTimeMinutes)
    : undefined;

  return {
    title: form.title.trim(),
    excerpt: form.excerpt.trim() || undefined,
    content: form.content.trim() || undefined,
    category: form.category.trim() || undefined,
    emoji: form.emoji.trim() || undefined,
    readTimeMinutes:
      typeof readTimeParsed === "number" && Number.isFinite(readTimeParsed) && readTimeParsed > 0
        ? readTimeParsed
        : undefined,
    isPublished: form.isPublished,
    publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : undefined,
    imageData: form.imageData || undefined,
  };
};

export default AdminArticlesPage;
