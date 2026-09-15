import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import {
  Calendar as CalendarIcon,
  Plus,
  Trash2,
  Clock,
  CheckCircle2,
  CalendarRange,
  Sparkles,
} from "lucide-react";

import {
  getAvailability,
  setAvailability,
  deleteAvailability,
  setBulkAvailability,
} from "@/api/provider";
import { ShiftType, ShiftTypeLabels } from "@/lib/constants";
import { formatLocalizedDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function ProviderAvailabilityPage() {
  const { t, i18n } = useTranslation(["provider", "common"]);
  const queryClient = useQueryClient();
  const [singleModalOpen, setSingleModalOpen] = useState(false);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);

  // Single date form states
  const [singleDate, setSingleDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [singleShift, setSingleShift] = useState(ShiftType.MORNING);
  const [singleNotes, setSingleNotes] = useState("");

  // Bulk form states
  const [bulkStartDate, setBulkStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [bulkEndDate, setBulkEndDate] = useState(
    new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0]
  );
  const [bulkShift, setBulkShift] = useState(ShiftType.MORNING);
  const [excludedDays, setExcludedDays] = useState([5]); // Friday default off

  // Query availability list
  const { data: availabilityList = [], isLoading } = useQuery({
    queryKey: ["provider-availability"],
    queryFn: () => getAvailability(),
  });

  // Single availability mutation
  const singleMutation = useMutation({
    mutationFn: () =>
      setAvailability({
        date: new Date(singleDate).toISOString(),
        isAvailable: true,
        availableShift: Number(singleShift),
        notes: singleNotes,
      }),
    onSuccess: () => {
      toast.success("Shift availability recorded!");
      queryClient.invalidateQueries(["provider-availability"]);
      setSingleModalOpen(false);
      setSingleNotes("");
    },
    onError: (error) => {
      toast.error("Failed to add shift", {
        description: error?.response?.data?.message || "Please check your dates.",
      });
    },
  });

  // Bulk availability mutation
  const bulkMutation = useMutation({
    mutationFn: () =>
      setBulkAvailability({
        startDate: new Date(bulkStartDate).toISOString(),
        endDate: new Date(bulkEndDate).toISOString(),
        isAvailable: true,
        availableShift: Number(bulkShift),
        excludeDays: excludedDays,
      }),
    onSuccess: () => {
      toast.success("Bulk availability generated for your schedule!");
      queryClient.invalidateQueries(["provider-availability"]);
      setBulkModalOpen(false);
    },
    onError: (error) => {
      toast.error("Bulk setup failed", {
        description: error?.response?.data?.message || "Please check your date range.",
      });
    },
  });

  // Delete availability mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => deleteAvailability(id),
    onSuccess: () => {
      toast.success("Shift removed from calendar.");
      queryClient.invalidateQueries(["provider-availability"]);
    },
    onError: () => {
      toast.error("Could not remove shift.");
    },
  });

  const DAYS_OF_WEEK = [
    { day: 0, label: t("common:days.sunday") },
    { day: 1, label: t("common:days.monday") },
    { day: 2, label: t("common:days.tuesday") },
    { day: 3, label: t("common:days.wednesday") },
    { day: 4, label: t("common:days.thursday") },
    { day: 5, label: t("common:days.friday") },
    { day: 6, label: t("common:days.saturday") },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("provider:availability.title")}</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("provider:availability.subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Bulk Setup Trigger */}
          <Dialog open={bulkModalOpen} onOpenChange={setBulkModalOpen}>
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
                    <Input
                      type="date"
                      value={bulkStartDate}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setBulkStartDate(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">{t("common:dates.to")}</Label>
                    <Input
                      type="date"
                      value={bulkEndDate}
                      min={bulkStartDate}
                      onChange={(e) => setBulkEndDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">{t("provider:availability.shiftsOffered")}</Label>
                  <select
                    value={bulkShift}
                    onChange={(e) => setBulkShift(e.target.value)}
                    className="w-full h-10 rounded-lg border border-input bg-background px-3 text-xs"
                  >
                    <option value={ShiftType.MORNING}>{t("common:shifts.morning")}</option>
                    <option value={ShiftType.EVENING}>{t("common:shifts.evening")}</option>
                    <option value={ShiftType.NIGHT}>{t("common:shifts.night")}</option>
                  </select>
                </div>

                {/* Exclude days */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">{t("provider:availability.excludeDays")}</Label>
                  <div className="grid grid-cols-2 gap-2 p-3 bg-muted/20 rounded-lg border border-border/50">
                    {DAYS_OF_WEEK.map((d) => (
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
                  <Button
                    variant="outline"
                    onClick={() => setBulkModalOpen(false)}
                  >
                    {t("common:cancel")}
                  </Button>
                  <Button
                    onClick={() => bulkMutation.mutate()}
                    disabled={bulkMutation.isPending}
                  >
                    {bulkMutation.isPending ? t("common:loading") : t("common:save")}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Add Single Date Shift Trigger */}
          <Dialog open={singleModalOpen} onOpenChange={setSingleModalOpen}>
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
                  <Label className="text-xs font-semibold">{t("provider:availability.selectShift")}</Label>
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
                  <Button
                    variant="outline"
                    onClick={() => setSingleModalOpen(false)}
                  >
                    {t("common:cancel")}
                  </Button>
                  <Button
                    onClick={() => singleMutation.mutate()}
                    disabled={singleMutation.isPending}
                  >
                    {singleMutation.isPending ? t("common:loading") : t("provider:availability.saveShift")}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Availability List Table / Grid */}
      <Card className="border-border/70 shadow-sm bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">{t("provider:availability.openSlots")} ({availabilityList.length})</CardTitle>
          <CardDescription className="text-xs">
            {t("provider:availability.subtitle")}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="space-y-2 py-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-12 bg-muted/30 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : availabilityList.length === 0 ? (
            <div className="text-center py-12 text-xs text-muted-foreground space-y-3">
              <CalendarIcon className="h-10 w-10 text-muted-foreground/40 mx-auto" />
              <p>{t("provider:availability.noSlots")}</p>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => setBulkModalOpen(true)}
              >
                {t("provider:availability.bulkGenerate")}
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {availabilityList.map((entry) => {
                const shiftName =
                  entry.shiftName || ShiftTypeLabels[entry.availableShift] || "Morning";

                return (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between py-3 px-1 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Clock className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="font-bold text-foreground">
                          {formatLocalizedDate(entry.date, "EEEE, dd/MM/yyyy", i18n.language)}
                        </span>
                        <div className="flex items-center gap-2 text-muted-foreground mt-0.5">
                          <span className="capitalize font-semibold text-teal-700">
                            {shiftName}
                          </span>
                          {entry.notes && (
                            <>
                              <span>•</span>
                              <span>{entry.notes}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-700 border-emerald-500/20">
                        {t("provider:dashboard.available")}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteMutation.mutate(entry.id)}
                        disabled={deleteMutation.isPending}
                        title={t("provider:availability.deleteShift")}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
