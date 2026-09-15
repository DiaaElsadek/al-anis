import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Sparkles,
} from "lucide-react";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/api/category";
import { getLocalizedCategoryName } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/shared/EmptyState";

export default function AdminCategoriesPage() {
  const { t, i18n } = useTranslation(["admin", "common"]);
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: getCategories,
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      nameEn: "",
      description: "",
      icon: "🩺",
      isActive: true,
    },
  });

  const isActiveValue = watch("isActive");

  // Open modal for edit
  const handleEdit = (cat) => {
    setEditingCategory(cat);
    reset({
      name: cat.name || "",
      nameEn: cat.nameEn || "",
      description: cat.description || "",
      icon: cat.icon || "🩺",
      isActive: cat.isActive ?? true,
    });
    setModalOpen(true);
  };

  // Open modal for create
  const handleCreate = () => {
    setEditingCategory(null);
    reset({
      name: "",
      nameEn: "",
      description: "",
      icon: "🩺",
      isActive: true,
    });
    setModalOpen(true);
  };

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: (data) => {
      if (editingCategory) {
        return updateCategory(editingCategory.id, data);
      }
      return createCategory(data);
    },
    onSuccess: () => {
      toast.success(
        editingCategory ? "Category updated!" : "Category created successfully!"
      );
      queryClient.invalidateQueries(["admin-categories"]);
      queryClient.invalidateQueries(["active-categories"]);
      setModalOpen(false);
    },
    onError: (error) => {
      toast.error("Category save error", {
        description: error?.response?.data?.message || "Please check inputs.",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => deleteCategory(id),
    onSuccess: () => {
      toast.success("Category deleted.");
      queryClient.invalidateQueries(["admin-categories"]);
      queryClient.invalidateQueries(["active-categories"]);
    },
    onError: (error) => {
      toast.error("Could not delete category", {
        description: error?.response?.data?.message || "Ensure no active pricing relies on it.",
      });
    },
  });

  const onSubmit = (data) => {
    saveMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("admin:categories.title")}</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("admin:categories.subtitle")}
          </p>
        </div>

        <Button size="sm" className="text-xs font-semibold shadow-sm" onClick={handleCreate}>
          <Plus className="h-4 w-4 me-1.5" />
          {t("admin:categories.addCategory")}
        </Button>
      </div>

      <Card className="border-border/70 shadow-sm bg-card">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="py-16 text-center">
              <EmptyState
                icon={FolderTree}
                title={t("common:empty.noResults")}
                description={t("common:empty.tryAdjusting")}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/20 text-muted-foreground">
                    <th className="py-3 px-4 font-semibold text-start">{t("admin:categories.icon")}</th>
                    <th className="py-3 px-4 font-semibold text-start">{t("admin:categories.nameAr")}</th>
                    <th className="py-3 px-4 font-semibold text-start">{t("admin:categories.nameEn")}</th>
                    <th className="py-3 px-4 font-semibold text-start">{t("admin:categories.description")}</th>
                    <th className="py-3 px-4 font-semibold text-center">{t("admin:categories.activeStatus")}</th>
                    <th className="py-3 px-4 font-semibold text-end">{t("admin:applications.actions")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {categories.map((c) => (
                    <tr key={c.id} className="hover:bg-muted/25 transition-colors">
                      <td className="py-3 px-4 text-base">{c.icon || "🩺"}</td>
                      <td className="py-3 px-4 font-bold text-foreground">{c.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">{c.nameEn || "—"}</td>
                      <td className="py-3 px-4 text-muted-foreground max-w-[240px] truncate">
                        {c.description || "—"}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge
                          variant="outline"
                          className={
                            c.isActive
                              ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
                              : "bg-muted text-muted-foreground"
                          }
                        >
                          {c.isActive ? t("common:status.active") : t("common:status.suspended")}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-end">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            onClick={() => handleEdit(c)}
                            title={t("common:actions.edit")}
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            title={t("common:actions.delete")}
                            onClick={() => {
                              if (confirm(t("admin:categories.deleteConfirm"))) {
                                deleteMutation.mutate(c.id);
                              }
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Category Create/Edit Modal Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? t("admin:categories.editModalTitle") : t("admin:categories.createModalTitle")}
            </DialogTitle>
            <DialogDescription className="text-xs mt-0.5">
              {t("admin:categories.subtitle")}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5 col-span-2">
                <Label className="text-xs font-semibold">{t("admin:categories.nameAr")} *</Label>
                <Input
                  placeholder="e.g. تمريض منزلي"
                  {...register("name", { required: true })}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">{t("admin:categories.icon")}</Label>
                <Input
                  placeholder="🩺"
                  className="text-center text-lg"
                  maxLength={4}
                  {...register("icon")}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{t("admin:categories.nameEn")}</Label>
              <Input
                placeholder="e.g. Home Nursing"
                {...register("nameEn")}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{t("admin:categories.description")}</Label>
              <Textarea
                rows={3}
                placeholder="Brief description..."
                className="text-xs resize-none"
                {...register("description")}
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Checkbox
                id="catActive"
                checked={isActiveValue}
                onCheckedChange={(val) => setValue("isActive", !!val)}
              />
              <label
                htmlFor="catActive"
                className="text-xs font-medium text-foreground cursor-pointer select-none"
              >
                {t("admin:categories.activeStatus")}
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setModalOpen(false)}
              >
                {t("common:actions.cancel")}
              </Button>
              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? t("common:actions.saveChanges") : t("common:actions.save")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
