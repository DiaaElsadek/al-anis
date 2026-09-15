import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import CategoryIcon from "@/components/shared/CategoryIcon";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function CategoryFormDialog({
  open,
  onOpenChange,
  editingCategory,
  register,
  handleSubmit,
  onSubmit,
  watch,
  setValue,
  isActiveValue,
  isSaving,
}) {
  const { t } = useTranslation(["admin", "common"]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingCategory
              ? t("admin:categories.editModalTitle")
              : t("admin:categories.createModalTitle")}
          </DialogTitle>
          <DialogDescription className="text-xs mt-0.5">
            {t("admin:categories.subtitle")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5 col-span-2">
              <Label className="text-xs font-semibold">{t("admin:categories.nameAr")} *</Label>
              <Input placeholder="e.g. تمريض منزلي" {...register("name", { required: true })} />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{t("admin:categories.icon")}</Label>
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-md bg-muted flex items-center justify-center text-primary shrink-0 border border-input">
                  <CategoryIcon icon={watch("icon")} className="h-4 w-4" />
                </div>
                <Input placeholder="Stethoscope" className="text-xs" {...register("icon")} />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">{t("admin:categories.nameEn")}</Label>
            <Input placeholder="e.g. Home Nursing" {...register("nameEn")} />
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
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("common:actions.cancel")}
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? t("common:actions.saveChanges") : t("common:actions.save")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

CategoryFormDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  editingCategory: PropTypes.object,
  register: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  watch: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  isActiveValue: PropTypes.bool.isRequired,
  isSaving: PropTypes.bool,
};
