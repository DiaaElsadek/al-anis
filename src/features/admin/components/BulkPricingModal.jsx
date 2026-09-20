import { Layers, Sparkles } from "lucide-react";
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
import { getLocalizedCategoryName } from "@/lib/utils";

export default function BulkPricingModal({
  open,
  onOpenChange,
  bulkCatId,
  setBulkCatId,
  morningPrice,
  setMorningPrice,
  eveningPrice,
  setEveningPrice,
  nightPrice,
  setNightPrice,
  categories,
  onSave,
  isPending,
}) {
  const { t, i18n } = useTranslation(["admin", "common", "client"]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-xs font-semibold">
          <Layers className="h-4 w-4 me-1.5 text-primary" />
          {t("admin:pricing.bulkPricing")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle>{t("admin:pricing.bulkModalTitle")}</DialogTitle>
              <DialogDescription className="text-xs mt-0.5">
                {t("admin:pricing.subtitle")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">{t("admin:pricing.category")} *</Label>
            <Select value={bulkCatId || ""} onValueChange={setBulkCatId}>
              <SelectTrigger className="w-full h-10 text-xs">
                <SelectValue placeholder={t("client:directory.allCategories")} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id} className="text-xs">
                    {getLocalizedCategoryName(c, i18n.language)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1.5">
              <Label className="text-[11px] font-semibold">{t("common:shifts.morning")}</Label>
              <Input
                type="number"
                value={morningPrice}
                onChange={(e) => setMorningPrice(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-semibold">{t("common:shifts.evening")}</Label>
              <Input
                type="number"
                value={eveningPrice}
                onChange={(e) => setEveningPrice(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-semibold">{t("common:shifts.night")}</Label>
              <Input
                type="number"
                value={nightPrice}
                onChange={(e) => setNightPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t("common:actions.cancel")}
            </Button>
            <Button onClick={onSave} disabled={!bulkCatId || isPending}>
              {isPending ? t("common:actions.saveChanges") : t("common:actions.save")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
