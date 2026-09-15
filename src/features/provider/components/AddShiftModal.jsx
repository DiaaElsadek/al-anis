import { Plus } from "lucide-react";
import PropTypes from "prop-types";
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

export default function AddShiftModal({
  open,
  onOpenChange,
  singleDate,
  setSingleDate,
  singleShift,
  setSingleShift,
  singleNotes,
  setSingleNotes,
  onSubmit,
  isPending,
}) {
  const { t } = useTranslation(["provider", "common"]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" className="text-xs font-semibold shadow-sm">
          <Plus className="h-4 w-4 me-1.5" />
          {t("provider:availability.addShift")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("provider:availability.modalTitle")}</DialogTitle>
          <DialogDescription className="text-xs mt-0.5">
            {t("provider:availability.subtitle")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">{t("provider:availability.selectDate")}</Label>
            <Input
              type="date"
              value={singleDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setSingleDate(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              {t("provider:availability.selectShift")}
            </Label>
            <select
              value={singleShift}
              onChange={(e) => setSingleShift(e.target.value)}
              className="w-full h-10 rounded-lg border border-input bg-background px-3 text-xs"
            >
              <option value={ShiftType.MORNING}>{t("common:shifts.morning")}</option>
              <option value={ShiftType.EVENING}>{t("common:shifts.evening")}</option>
              <option value={ShiftType.NIGHT}>{t("common:shifts.night")}</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">{t("common:edit")}</Label>
            <Input
              placeholder="Notes..."
              value={singleNotes}
              onChange={(e) => setSingleNotes(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t("common:cancel")}
            </Button>
            <Button onClick={onSubmit} disabled={isPending}>
              {isPending ? t("common:loading") : t("provider:availability.saveShift")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

AddShiftModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  singleDate: PropTypes.string.isRequired,
  setSingleDate: PropTypes.func.isRequired,
  singleShift: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  setSingleShift: PropTypes.func.isRequired,
  singleNotes: PropTypes.string.isRequired,
  setSingleNotes: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isPending: PropTypes.bool,
};
