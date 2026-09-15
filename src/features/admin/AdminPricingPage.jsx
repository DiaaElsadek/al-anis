import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DollarSign, AlertCircle, Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { getCategories } from "@/api/category";
import {
  getCategoriesWithPricing,
  createPricing,
  updatePricing,
  deletePricing,
  createBulkPricing,
} from "@/api/servicePricing";
import CategoryIcon from "@/components/shared/CategoryIcon";
import EmptyState from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import BulkPricingModal from "@/features/admin/components/BulkPricingModal";
import SinglePricingModal from "@/features/admin/components/SinglePricingModal";
import { ShiftType } from "@/lib/constants";
import { formatPrice, handleMutationError } from "@/lib/utils";

export default function AdminPricingPage() {
  const { t, i18n } = useTranslation(["admin", "common"]);
  const queryClient = useQueryClient();
  const [singleModalOpen, setSingleModalOpen] = useState(false);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [editingPricing, setEditingPricing] = useState(null);

  // Form states for single
  const [selectedCatId, setSelectedCatId] = useState("");
  const [shiftType, setShiftType] = useState(ShiftType.MORNING);
  const [price, setPrice] = useState(300);
  const [description, setDescription] = useState("");

  // Form states for bulk
  const [bulkCatId, setBulkCatId] = useState("");
  const [morningPrice, setMorningPrice] = useState(250);
  const [eveningPrice, setEveningPrice] = useState(300);
  const [nightPrice, setNightPrice] = useState(350);

  // Queries
  const {
    data: categoriesWithPricing = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["admin-categories-with-pricing"],
    queryFn: getCategoriesWithPricing,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: getCategories,
  });

  // Single pricing mutation
  const singleMutation = useMutation({
    mutationFn: () => {
      if (editingPricing) {
        return updatePricing(editingPricing.id, {
          pricePerShift: Number(price),
          description,
          isActive: true,
        });
      }
      return createPricing({
        categoryId: selectedCatId,
        shiftType: Number(shiftType),
        pricePerShift: Number(price),
        description,
        isActive: true,
      });
    },
    onSuccess: () => {
      toast.success(editingPricing ? "Shift price updated!" : "Shift price configured!");
      queryClient.invalidateQueries(["admin-categories-with-pricing"]);
      setSingleModalOpen(false);
      setEditingPricing(null);
    },
    onError: (error) => handleMutationError(error, t, "common:error"),
  });

  // Bulk pricing mutation
  const bulkMutation = useMutation({
    mutationFn: () =>
      createBulkPricing({
        categoryId: bulkCatId,
        pricings: [
          {
            shiftType: ShiftType.MORNING,
            pricePerShift: Number(morningPrice),
            description: "Default morning shift",
            isActive: true,
          },
          {
            shiftType: ShiftType.EVENING,
            pricePerShift: Number(eveningPrice),
            description: "Default evening shift",
            isActive: true,
          },
          {
            shiftType: ShiftType.NIGHT,
            pricePerShift: Number(nightPrice),
            description: "Default night shift",
            isActive: true,
          },
        ],
      }),
    onSuccess: () => {
      toast.success("Standard shift pricing matrix created!");
      queryClient.invalidateQueries(["admin-categories-with-pricing"]);
      setBulkModalOpen(false);
    },
    onError: (error) => handleMutationError(error, t, "common:error"),
  });

  // Delete pricing mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => deletePricing(id),
    onSuccess: () => {
      toast.success("Shift pricing tier removed.");
      queryClient.invalidateQueries(["admin-categories-with-pricing"]);
    },
    onError: (error) => handleMutationError(error, t, "common:error"),
  });

  // Helper for edit pricing
  const handleOpenEdit = (pricing, catId) => {
    setEditingPricing(pricing);
    setSelectedCatId(catId);
    setShiftType(pricing.shiftType);
    setPrice(pricing.pricePerShift);
    setDescription(pricing.description || "");
    setSingleModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("admin:pricing.title")}</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{t("admin:pricing.subtitle")}</p>
        </div>

        <div className="flex items-center gap-2">
          <BulkPricingModal
            open={bulkModalOpen}
            onOpenChange={setBulkModalOpen}
            bulkCatId={bulkCatId}
            setBulkCatId={setBulkCatId}
            morningPrice={morningPrice}
            setMorningPrice={setMorningPrice}
            eveningPrice={eveningPrice}
            setEveningPrice={setEveningPrice}
            nightPrice={nightPrice}
            setNightPrice={setNightPrice}
            categories={categories}
            onSave={() => bulkMutation.mutate()}
            isPending={bulkMutation.isPending}
          />

          <SinglePricingModal
            open={singleModalOpen}
            onOpenChange={setSingleModalOpen}
            editingPricing={editingPricing}
            selectedCatId={selectedCatId}
            setSelectedCatId={setSelectedCatId}
            shiftType={shiftType}
            setShiftType={setShiftType}
            price={price}
            setPrice={setPrice}
            description={description}
            setDescription={setDescription}
            categories={categories}
            onSave={() => singleMutation.mutate()}
            isPending={singleMutation.isPending}
            onOpenAdd={() => {
              setEditingPricing(null);
              setSelectedCatId(categories[0]?.id || "");
              setShiftType(ShiftType.MORNING);
              setPrice(300);
              setDescription("");
            }}
          />
        </div>
      </div>

      {/* Categories with Pricing Matrix */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
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
      ) : categoriesWithPricing.length === 0 ? (
        <div className="py-16 text-center">
          <EmptyState
            icon={DollarSign}
            title={t("common:empty.noResults")}
            description={t("common:empty.tryAdjusting")}
          />
        </div>
      ) : (
        <div className="space-y-4">
          {categoriesWithPricing.map((item) => (
            <Card
              key={item.categoryId}
              className="border-border/70 shadow-sm bg-card overflow-hidden"
            >
              <div className="p-4 bg-muted/20 border-b border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <CategoryIcon
                      icon={item.categoryIcon}
                      name={item.categoryName}
                      className="h-4 w-4"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-foreground">{item.categoryName}</h3>
                    <p className="text-[11px] text-muted-foreground">
                      {item.categoryDescription || "—"}
                    </p>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs"
                  onClick={() => {
                    setBulkCatId(item.categoryId);
                    setBulkModalOpen(true);
                  }}
                >
                  {t("common:actions.edit")}
                </Button>
              </div>

              <CardContent className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      shift: ShiftType.MORNING,
                      label: t("common:shifts.morning"),
                      hours: t("common:shifts.morningTime"),
                    },
                    {
                      shift: ShiftType.EVENING,
                      label: t("common:shifts.evening"),
                      hours: t("common:shifts.eveningTime"),
                    },
                    {
                      shift: ShiftType.NIGHT,
                      label: t("common:shifts.night"),
                      hours: t("common:shifts.nightTime"),
                    },
                  ].map((s) => {
                    const priceRecord = item.pricing?.find((p) => Number(p.shiftType) === s.shift);

                    return (
                      <div
                        key={s.shift}
                        className="p-3.5 rounded-xl border border-border/60 bg-muted/15 flex items-center justify-between"
                      >
                        <div>
                          <span className="font-bold text-xs text-foreground block">{s.label}</span>
                          <span className="text-[10px] text-muted-foreground block">{s.hours}</span>
                          <span className="text-base font-extrabold text-primary block mt-1">
                            {priceRecord
                              ? formatPrice(priceRecord.pricePerShift, "EGP", i18n.language)
                              : "—"}
                          </span>
                        </div>

                        {priceRecord && (
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-foreground"
                              onClick={() => handleOpenEdit(priceRecord, item.categoryId)}
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
                                if (confirm(t("common:actions.delete") + "?")) {
                                  deleteMutation.mutate(priceRecord.id);
                                }
                              }}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
