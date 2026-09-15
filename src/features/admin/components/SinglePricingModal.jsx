import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShiftType } from "@/lib/constants";

export default function SinglePricingModal({
  open,
  onOpenChange,
  editingPricing,
  selectedCatId,
  setSelectedCatId,
  shiftType,
  setShiftType,
  price,
  setPrice,
  description,
  setDescription,
  categories,
  onSave,
  isPending,
  onOpenAdd,
}) {
  const { t, i18n } = useTranslation(["admin", "common", "client"]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" className="text-xs font-semibold shadow-sm" onClick={onOpenAdd}>
          <Plus className="h-4 w-4 me-1.5" />
          {t("admin:pricing.addPricing")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingPricing ? t("admin:pricing.editModalTitle") : t("admin:pricing.addPricing")}
          </DialogTitle>
          <DialogDescription className="text-xs mt-0.5">
            {t("admin:pricing.subtitle")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {!editingPricing && (
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{t("admin:pricing.category")} *</Label>
              <select
                value={selectedCatId}
                onChange={(e) => setSelectedCatId(e.target.value)}
                className="w-full h-10 rounded-lg border border-input bg-background px-3 text-xs"
              >
                <option value="">{t("client:directory.allCategories")}</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {i18n.language === "ar" ? c.name || c.nameEn : c.nameEn || c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {!editingPricing && (
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{t("admin:pricing.shiftType")}</Label>
              <select
                value={shiftType}
                onChange={(e) => setShiftType(e.target.value)}
                className="w-full h-10 rounded-lg border border-input bg-background px-3 text-xs"
              >
                <option value={ShiftType.MORNING}>
                  {t("common:shifts.morning")} ({t("common:shifts.morningTime")})
                </option>
                <option value={ShiftType.EVENING}>
                  {t("common:shifts.evening")} ({t("common:shifts.eveningTime")})
                </option>
                <option value={ShiftType.NIGHT}>
                  {t("common:shifts.night")} ({t("common:shifts.nightTime")})
                </option>
              </select>
            </div>
          )}

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">{t("admin:pricing.price")} *</Label>
            <Input
              type="number"
              min="50"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              {t("admin:categories.description")} ({t("common:actions.filter")})
            </Label>
            <Input
              placeholder={t("admin:categories.description")}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t("common:actions.cancel")}
            </Button>
            <Button onClick={onSave} disabled={isPending}>
              {isPending ? t("common:actions.saveChanges") : t("common:actions.save")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
