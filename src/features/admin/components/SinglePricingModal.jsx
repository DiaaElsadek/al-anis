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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
              <Select value={selectedCatId || ""} onValueChange={setSelectedCatId}>
                <SelectTrigger className="w-full h-10 text-xs">
                  <SelectValue placeholder={t("client:directory.allCategories")} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id} className="text-xs">
                      {i18n.language === "ar" ? c.name || c.nameEn : c.nameEn || c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {!editingPricing && (
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{t("admin:pricing.shiftType")}</Label>
              <Select value={shiftType} onValueChange={setShiftType}>
                <SelectTrigger className="w-full h-10 text-xs">
                  <SelectValue placeholder={t("admin:pricing.shiftType")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ShiftType.MORNING} className="text-xs">
                    {t("common:shifts.morning")} ({t("common:shifts.morningTime")})
                  </SelectItem>
                  <SelectItem value={ShiftType.EVENING} className="text-xs">
                    {t("common:shifts.evening")} ({t("common:shifts.eveningTime")})
                  </SelectItem>
                  <SelectItem value={ShiftType.NIGHT} className="text-xs">
                    {t("common:shifts.night")} ({t("common:shifts.nightTime")})
                  </SelectItem>
                </SelectContent>
              </Select>
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
