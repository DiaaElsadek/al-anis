"use client";

import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { CalendarDays, ChevronDownIcon, X } from "lucide-react";
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
 * Enhanced DatePicker Component
 *
 * Provides a modern, accessible, and intuitive date picker built with shadcn/ui.
 * Includes localized formatting, fast month/year dropdowns, quick actions (Today, Clear),
 * and clean animated trigger interactions.
 */
export function DatePicker({
  value,
  date: controlledDate,
  onChange,
  onSelect,
  min,
  max,
  placeholder,
  disabled,
  clearable = true,
  className,
  id,
  calendarProps,
  ...props
}) {
  const { t, i18n } = useTranslation(["common"]);
  const [open, setOpen] = React.useState(false);

  const activeDate = React.useMemo(() => {
    if (controlledDate !== undefined) {
      return parseDateString(controlledDate);
    }
    return parseDateString(value);
  }, [controlledDate, value]);

  const minDate = React.useMemo(() => parseDateString(min), [min]);
  const maxDate = React.useMemo(() => parseDateString(max), [max]);
  const currentLocale = i18n?.language === "ar" ? ar : enUS;

  const disabledDays = React.useMemo(() => {
    const rules = [];
    if (minDate) rules.push({ before: minDate });
    if (maxDate) rules.push({ after: maxDate });
    return rules;
  }, [minDate, maxDate]);

  const isTodaySelectable = React.useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (minDate) {
      const minD = new Date(minDate);
      minD.setHours(0, 0, 0, 0);
      if (today < minD) return false;
    }
    if (maxDate) {
      const maxD = new Date(maxDate);
      maxD.setHours(23, 59, 59, 999);
      if (today > maxD) return false;
    }
    return true;
  }, [minDate, maxDate]);

  const handleSelect = (selected) => {
    if (selected) {
      const dateStr = formatDateString(selected);
      onChange?.(dateStr, selected);
      onSelect?.(selected);
    } else {
      onChange?.("", undefined);
      onSelect?.(undefined);
    }
  };

  const handleDayClick = (selected) => {
    handleSelect(selected);
    if (selected) {
      setOpen(false);
    }
  };

  const startMonth = minDate || new Date(1920, 0);
  const endMonth = maxDate || new Date(new Date().getFullYear() + 10, 11);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          data-empty={!activeDate}
          data-state={open ? "open" : "closed"}
          className={cn(
            "group w-full justify-between text-start font-normal h-10 px-3 text-xs sm:text-sm bg-background/90",
            "border-input/80 hover:border-primary/50 hover:bg-accent/40",
            "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20",
            "data-[state=open]:border-primary data-[state=open]:ring-2 data-[state=open]:ring-primary/15",
            "data-[empty=true]:text-muted-foreground transition-all shadow-xs",
            className
          )}
          disabled={disabled}
          {...props}
        >
          <div className="flex items-center min-w-0 flex-1 truncate">
            <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground/80 group-hover:text-primary transition-colors me-2.5" />
            <span className={cn("truncate", activeDate && "font-medium text-foreground")}>
              {activeDate ? (
                format(activeDate, "PPP", { locale: currentLocale })
              ) : (
                <span>
                  {placeholder || t("common:dates.pickDate", { defaultValue: "Pick a date" })}
                </span>
              )}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0 ms-2">
            {clearable && activeDate && !disabled && (
              <span
                role="button"
                tabIndex={0}
                aria-label={t("common:actions.clear", { defaultValue: "Clear date" })}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(undefined);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.stopPropagation();
                    handleSelect(undefined);
                  }
                }}
                className="h-5 w-5 rounded-full hover:bg-muted-foreground/15 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-3 w-3" />
              </span>
            )}
            <ChevronDownIcon
              className="h-4 w-4 shrink-0 text-muted-foreground/60 transition-transform duration-200 group-data-[state=open]:rotate-180"
              data-icon="inline-end"
            />
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-auto p-0 z-50 rounded-xl border border-border/70 bg-popover/95 backdrop-blur-md shadow-xl shadow-black/10 overflow-hidden"
        align="start"
      >
        {/* Header Preview Bar */}
        <div className="px-4 py-3 bg-muted/40 border-b border-border/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <CalendarDays className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-muted-foreground truncate">
                {placeholder || t("common:dates.pickDate", { defaultValue: "Selected date" })}
              </p>
              <p className="text-xs font-semibold text-foreground truncate">
                {activeDate
                  ? format(activeDate, "EEEE, d MMMM yyyy", { locale: currentLocale })
                  : t("common:dates.noDateSelected", { defaultValue: "No date selected" })}
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Calendar with Month/Year dropdown navigation */}
        <div className="p-1">
          <Calendar
            mode="single"
            selected={activeDate}
            onSelect={handleDayClick}
            defaultMonth={activeDate || (maxDate ? maxDate : new Date())}
            startMonth={startMonth}
            endMonth={endMonth}
            captionLayout="dropdown"
            disabled={disabledDays.length > 0 ? disabledDays : undefined}
            locale={currentLocale}
            initialFocus
            {...calendarProps}
          />
        </div>

        {/* Footer with Quick Shortcuts */}
        <div className="px-3 py-2 bg-muted/25 border-t border-border/60 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1">
            {isTodaySelectable && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 px-2.5 text-xs font-medium text-primary hover:text-primary hover:bg-primary/10"
                onClick={() => {
                  handleSelect(new Date());
                  setOpen(false);
                }}
              >
                {t("common:today", { defaultValue: "Today" })}
              </Button>
            )}
            {activeDate && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                onClick={() => handleSelect(undefined)}
              >
                {t("common:actions.clear", { defaultValue: "Clear" })}
              </Button>
            )}
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="h-7 px-3 text-xs font-medium ms-auto"
            onClick={() => setOpen(false)}
          >
            {t("common:actions.close", { defaultValue: "Done" })}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function DatePickerDemo() {
  const [date, setDate] = React.useState();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!date}
          className="w-[212px] justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
        >
          {date ? format(date, "PPP") : <span>Pick a date</span>}
          <ChevronDownIcon className="h-4 w-4 shrink-0 opacity-50" data-icon="inline-end" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={date} onSelect={setDate} defaultMonth={date} />
      </PopoverContent>
    </Popover>
  );
}

export default DatePicker;
