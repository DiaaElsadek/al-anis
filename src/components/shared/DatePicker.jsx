import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

function parseDateString(dateStr) {
  if (!dateStr) return undefined;
  if (dateStr instanceof Date) return isNaN(dateStr.getTime()) ? undefined : dateStr;
  const parts = String(dateStr).split("T")[0].split("-");
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const d = new Date(year, month, day);
    return isNaN(d.getTime()) ? undefined : d;
  }
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? undefined : parsed;
}

function formatDateString(date) {
  if (!date || isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * DatePicker — accessible popover date picker wrapping shadcn Calendar and Popover
 *
 * @param {Object} props
 * @param {string|Date} [props.value] - YYYY-MM-DD or Date
 * @param {Function} props.onChange - callback with (formattedDateStr, dateObj)
 * @param {string|Date} [props.min] - minimum selectable date
 * @param {string|Date} [props.max] - maximum selectable date
 * @param {string} [props.placeholder]
 * @param {boolean} [props.disabled]
 * @param {string} [props.className]
 * @param {string} [props.id]
 */
export default function DatePicker({
  value,
  onChange,
  min,
  max,
  placeholder,
  disabled,
  className,
  id,
}) {
  const { t, i18n } = useTranslation(["common"]);
  const [open, setOpen] = React.useState(false);

  const selectedDate = React.useMemo(() => parseDateString(value), [value]);
  const minDate = React.useMemo(() => parseDateString(min), [min]);
  const maxDate = React.useMemo(() => parseDateString(max), [max]);
  const currentLocale = i18n.language === "ar" ? ar : enUS;

  const disabledDays = React.useMemo(() => {
    const rules = [];
    if (minDate) rules.push({ before: minDate });
    if (maxDate) rules.push({ after: maxDate });
    return rules;
  }, [minDate, maxDate]);

  const handleSelect = (date) => {
    if (date) {
      const dateStr = formatDateString(date);
      onChange?.(dateStr, date);
    } else {
      onChange?.("", undefined);
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          className={cn(
            "w-full justify-start text-start font-normal h-10 px-3 text-xs bg-background",
            !selectedDate && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="me-2 h-4 w-4 text-muted-foreground shrink-0" />
          {selectedDate ? (
            format(selectedDate, "PPP", { locale: currentLocale })
          ) : (
            <span>
              {placeholder || t("common:dates.pickDate", { defaultValue: "Pick a date" })}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 z-50" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          disabled={disabledDays.length > 0 ? disabledDays : undefined}
          locale={currentLocale}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
