import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FolderTree, Plus, Edit2, Trash2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { getCategories, createCategory, updateCategory, deleteCategory } from "@/api/category";
import CategoryIcon from "@/components/shared/CategoryIcon";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import EmptyState from "@/components/shared/EmptyState";
import StatusBadge from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CategoryFormDialog from "@/features/admin/components/CategoryFormDialog";
import { handleMutationError } from "@/lib/utils";

export default function AdminCategoriesPage() {
  const { t } = useTranslation(["admin", "common"]);
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const {
    data: categories = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: getCategories,
  });

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      name: "",
      nameEn: "",
      description: "",
      icon: "Stethoscope",
      isActive: true,
    },
  });

  const isActiveValue = watch("isActive");

  // Open modal for edit
  const handleEdit = (cat) => {
    setEditingCategory(cat);
    reset({
      name: cat.name,
      nameEn: cat.nameEn || "",
      description: cat.description || "",
      icon: cat.icon || "Stethoscope",
      isActive: cat.isActive,
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
      icon: "Stethoscope",
      isActive: true,
    });
    setModalOpen(true);
  };

  // Create / Update mutation
  const saveMutation = useMutation({
    mutationFn: (formData) => {
      if (editingCategory) {
        return updateCategory(editingCategory.id, formData);
      }
      return createCategory(formData);
    },
    onSuccess: () => {
      toast.success(
        editingCategory
          ? t("admin:categories.toasts.updated")
          : t("admin:categories.toasts.created")
      );
      queryClient.invalidateQueries(["admin-categories"]);
      queryClient.invalidateQueries(["active-categories"]);
      setModalOpen(false);
      reset();
    },
    onError: (error) => handleMutationError(error, t, "common:error"),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => deleteCategory(id),
    onSuccess: () => {
      toast.success(t("admin:categories.toasts.deleted"));
      queryClient.invalidateQueries(["admin-categories"]);
      queryClient.invalidateQueries(["active-categories"]);
    },
    onError: (error) => handleMutationError(error, t, "common:error"),
  });

  const onSubmit = (values) => {
    saveMutation.mutate(values);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("admin:categories.title")}</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{t("admin:categories.subtitle")}</p>
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
          ) : isError ? (
            <div className="py-16 text-center">
              <EmptyState
                icon={AlertCircle}
                title={t("common:error")}
                description={t("common:empty.tryAdjusting")}
                actionLabel={t("common:actions.retry")}
                onAction={() => refetch()}
              />
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
            <Table className="text-xs text-start">
              <TableHeader className="bg-muted/20 text-muted-foreground">
                <TableRow className="border-b border-border/60">
                  <TableHead className="py-3 px-4 font-semibold text-start">
                    {t("admin:categories.icon")}
                  </TableHead>
                  <TableHead className="py-3 px-4 font-semibold text-start">
                    {t("admin:categories.nameAr")}
                  </TableHead>
                  <TableHead className="py-3 px-4 font-semibold text-start">
                    {t("admin:categories.nameEn")}
                  </TableHead>
                  <TableHead className="py-3 px-4 font-semibold text-start">
                    {t("admin:categories.description")}
                  </TableHead>
                  <TableHead className="py-3 px-4 font-semibold text-center">
                    {t("admin:categories.activeStatus")}
                  </TableHead>
                  <TableHead className="py-3 px-4 font-semibold text-end">
                    {t("admin:applications.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-border/40">
                {categories.map((c) => (
                  <TableRow key={c.id} className="hover:bg-muted/25 transition-colors">
                    <TableCell className="py-3 px-4">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <CategoryIcon icon={c.icon} name={c.name} className="h-4 w-4" />
                      </div>
                    </TableCell>
                    <TableCell className="py-3 px-4 font-bold text-foreground">{c.name}</TableCell>
                    <TableCell className="py-3 px-4 text-muted-foreground">
                      {c.nameEn || "—"}
                    </TableCell>
                    <TableCell className="py-3 px-4 text-muted-foreground max-w-[240px] truncate">
                      {c.description || "—"}
                    </TableCell>
                    <TableCell className="py-3 px-4 text-center">
                      <StatusBadge status={c.isActive ? "active" : "suspended"} />
                    </TableCell>
                    <TableCell className="py-3 px-4 text-end">
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
                          onClick={() => setDeleteConfirmId(c.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Category Create/Edit Modal Dialog */}
      <CategoryFormDialog
        open={modalOpen}
        onOpenChange={setModalOpen}
        editingCategory={editingCategory}
        register={register}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        watch={watch}
        setValue={setValue}
        isActiveValue={isActiveValue}
        isSaving={saveMutation.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deleteConfirmId}
        onOpenChange={(open) => !open && setDeleteConfirmId(null)}
        title={t("common:actions.delete")}
        description={t("admin:categories.deleteConfirm")}
        confirmLabel={t("common:actions.delete")}
        cancelLabel={t("common:actions.cancel")}
        variant="destructive"
        loading={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteConfirmId) {
            deleteMutation.mutate(deleteConfirmId, {
              onSettled: () => setDeleteConfirmId(null),
            });
          }
        }}
      />
    </div>
  );
}
