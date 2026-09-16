import { CalendarRange, Sparkles } from "lucide-react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import DatePicker from "@/components/shared/DatePicker";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShiftType } from "@/lib/constants";

export default function BulkShiftModal({
  open,
  onOpenChange,
  bulkStartDate,
  setBulkStartDate,
  bulkEndDate,
  setBulkEndDate,
  bulkShift,
  setBulkShift,
  excludedDays,
  toggleExcludeDay,
  daysOfWeek,
  onSubmit,
  isPending,
}) {
  const { t } = useTranslation(["provider", "common"]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-xs font-semibold">
          <CalendarRange className="h-4 w-4 me-1.5 text-primary" />
          {t("provider:availability.bulkGenerate")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle>{t("provider:availability.bulkGenerate")}</DialogTitle>
              <DialogDescription className="text-xs mt-0.5">
                {t("provider:availability.subtitle")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{t("common:dates.from")}</Label>
              <DatePicker
                value={bulkStartDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={setBulkStartDate}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{t("common:dates.to")}</Label>
              <DatePicker value={bulkEndDate} min={bulkStartDate} onChange={setBulkEndDate} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              {t("provider:availability.shiftsOffered")}
            </Label>
            <Select value={bulkShift} onValueChange={setBulkShift}>
              <SelectTrigger className="w-full h-10 text-xs">
                <SelectValue placeholder={t("provider:availability.shiftsOffered")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ShiftType.MORNING} className="text-xs">
                  {t("common:shifts.morning")}
                </SelectItem>
                <SelectItem value={ShiftType.EVENING} className="text-xs">
                  {t("common:shifts.evening")}
                </SelectItem>
                <SelectItem value={ShiftType.NIGHT} className="text-xs">
                  {t("common:shifts.night")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Exclude days */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              {t("provider:availability.excludeDays")}
            </Label>
            <div className="grid grid-cols-2 gap-2 p-3 bg-muted/20 rounded-lg border border-border/50">
              {daysOfWeek.map((d) => (
                <label
                  key={d.day}
                  className="flex items-center gap-2 text-xs text-foreground cursor-pointer"
                >
                  <Checkbox
                    checked={excludedDays.includes(d.day)}
                    onCheckedChange={() => toggleExcludeDay(d.day)}
                  />
                  <span>{d.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t("common:cancel")}
            </Button>
            <Button onClick={onSubmit} disabled={isPending}>
              {isPending ? t("common:loading") : t("common:save")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

BulkShiftModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  bulkStartDate: PropTypes.string.isRequired,
  setBulkStartDate: PropTypes.func.isRequired,
  bulkEndDate: PropTypes.string.isRequired,
  setBulkEndDate: PropTypes.func.isRequired,
  bulkShift: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  setBulkShift: PropTypes.func.isRequired,
  excludedDays: PropTypes.arrayOf(PropTypes.number).isRequired,
  toggleExcludeDay: PropTypes.func.isRequired,
  daysOfWeek: PropTypes.arrayOf(
    PropTypes.shape({
      day: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  onSubmit: PropTypes.func.isRequired,
  isPending: PropTypes.bool,
};
