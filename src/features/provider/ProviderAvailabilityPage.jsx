import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar as CalendarIcon, Trash2, Clock } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import {
  getAvailability,
  setAvailability,
  deleteAvailability,
  setBulkAvailability,
} from "@/api/provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import AddShiftModal from "@/features/provider/components/AddShiftModal";
import BulkShiftModal from "@/features/provider/components/BulkShiftModal";
import { ShiftType } from "@/lib/constants";
import { formatLocalizedDate, getShiftLabel, handleMutationError } from "@/lib/utils";

export default function ProviderAvailabilityPage() {
  const { t, i18n } = useTranslation(["provider", "common"]);
  const queryClient = useQueryClient();
  const [singleModalOpen, setSingleModalOpen] = useState(false);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);

  // Single date form states
  const [singleDate, setSingleDate] = useState(new Date().toISOString().split("T")[0]);
  const [singleShift, setSingleShift] = useState(ShiftType.MORNING);
  const [singleNotes, setSingleNotes] = useState("");

  // Bulk form states
  const [bulkStartDate, setBulkStartDate] = useState(new Date().toISOString().split("T")[0]);
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
    onError: (error) => handleMutationError(error, t, "common:error"),
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
    onError: (error) => handleMutationError(error, t, "common:error"),
  });

  // Delete availability mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => deleteAvailability(id),
    onSuccess: () => {
      toast.success("Shift removed from calendar.");
      queryClient.invalidateQueries(["provider-availability"]);
    },
    onError: (error) => handleMutationError(error, t, "common:error"),
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

  const toggleExcludeDay = (day) => {
    setExcludedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

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
          <BulkShiftModal
            open={bulkModalOpen}
            onOpenChange={setBulkModalOpen}
            bulkStartDate={bulkStartDate}
            setBulkStartDate={setBulkStartDate}
            bulkEndDate={bulkEndDate}
            setBulkEndDate={setBulkEndDate}
            bulkShift={bulkShift}
            setBulkShift={setBulkShift}
            excludedDays={excludedDays}
            toggleExcludeDay={toggleExcludeDay}
            daysOfWeek={DAYS_OF_WEEK}
            onSubmit={() => bulkMutation.mutate()}
            isPending={bulkMutation.isPending}
          />

          {/* Add Single Date Shift Trigger */}
          <AddShiftModal
            open={singleModalOpen}
            onOpenChange={setSingleModalOpen}
            singleDate={singleDate}
            setSingleDate={setSingleDate}
            singleShift={singleShift}
            setSingleShift={setSingleShift}
            singleNotes={singleNotes}
            setSingleNotes={setSingleNotes}
            onSubmit={() => singleMutation.mutate()}
            isPending={singleMutation.isPending}
          />
        </div>
      </div>

      {/* Availability List Table / Grid */}
      <Card className="border-border/70 shadow-sm bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">
            {t("provider:availability.openSlots")} ({availabilityList.length})
          </CardTitle>
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
                const shiftName = getShiftLabel(entry.availableShift, t, entry.shiftName);

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
                      <Badge
                        variant="outline"
                        className="text-[10px] bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
                      >
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
