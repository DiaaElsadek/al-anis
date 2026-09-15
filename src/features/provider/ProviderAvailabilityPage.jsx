import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const DAYS_OF_WEEK = [
  { day: 0, label: "Sunday" },
  { day: 1, label: "Monday" },
  { day: 2, label: "Tuesday" },
  { day: 3, label: "Wednesday" },
  { day: 4, label: "Thursday" },
  { day: 5, label: "Friday" },
  { day: 6, label: "Saturday" },
];

export default function ProviderAvailabilityPage() {
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

  const toggleExcludeDay = (dayNum) => {
    if (excludedDays.includes(dayNum)) {
      setExcludedDays(excludedDays.filter((d) => d !== dayNum));
    } else {
      setExcludedDays([...excludedDays, dayNum]);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Shift Availability Calendar</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure when you are open to take morning, evening, or night shifts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Bulk Setup Trigger */}
          <Dialog open={bulkModalOpen} onOpenChange={setBulkModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs font-semibold">
                <CalendarRange className="h-4 w-4 me-1.5 text-primary" />
                Bulk Schedule
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <DialogTitle>Bulk Shift Availability Setup</DialogTitle>
                    <DialogDescription className="text-xs mt-0.5">
                      Generate open shifts across a multi-week date range.
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Start Date</Label>
                    <Input
                      type="date"
                      value={bulkStartDate}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setBulkStartDate(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">End Date</Label>
                    <Input
                      type="date"
                      value={bulkEndDate}
                      min={bulkStartDate}
                      onChange={(e) => setBulkEndDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Available Shift</Label>
                  <select
                    value={bulkShift}
                    onChange={(e) => setBulkShift(e.target.value)}
                    className="w-full h-10 rounded-lg border border-input bg-background px-3 text-xs"
                  >
                    <option value={ShiftType.MORNING}>Morning Shift (8 AM - 4 PM)</option>
                    <option value={ShiftType.EVENING}>Evening Shift (4 PM - 12 AM)</option>
                    <option value={ShiftType.NIGHT}>Night Shift (12 AM - 8 AM)</option>
                  </select>
                </div>

                {/* Exclude days */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Days Off / Excluded Days</Label>
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
                    Cancel
                  </Button>
                  <Button
                    onClick={() => bulkMutation.mutate()}
                    disabled={bulkMutation.isPending}
                  >
                    {bulkMutation.isPending ? "Generating..." : "Apply Bulk Schedule"}
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
                Add Single Shift
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Single Day Shift</DialogTitle>
                <DialogDescription className="text-xs mt-0.5">
                  Specify an individual shift you want to mark available.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Date</Label>
                  <Input
                    type="date"
                    value={singleDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setSingleDate(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Shift Schedule</Label>
                  <select
                    value={singleShift}
                    onChange={(e) => setSingleShift(e.target.value)}
                    className="w-full h-10 rounded-lg border border-input bg-background px-3 text-xs"
                  >
                    <option value={ShiftType.MORNING}>Morning (8 AM - 4 PM)</option>
                    <option value={ShiftType.EVENING}>Evening (4 PM - 12 AM)</option>
                    <option value={ShiftType.NIGHT}>Night (12 AM - 8 AM)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Notes (Optional)</Label>
                  <Input
                    placeholder="e.g. Can do pediatric care"
                    value={singleNotes}
                    onChange={(e) => setSingleNotes(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setSingleModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => singleMutation.mutate()}
                    disabled={singleMutation.isPending}
                  >
                    {singleMutation.isPending ? "Adding..." : "Save Shift"}
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
          <CardTitle className="text-base font-bold">Configured Open Shifts ({availabilityList.length})</CardTitle>
          <CardDescription className="text-xs">
            Clients can immediately book you for these confirmed shifts.
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
              <p>No availability dates configured on your calendar yet.</p>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => setBulkModalOpen(true)}
              >
                Schedule Next 2 Weeks
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
                          {new Date(entry.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <div className="flex items-center gap-2 text-muted-foreground mt-0.5">
                          <span className="capitalize font-semibold text-teal-700">
                            {shiftName} Shift
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
                        Open for Booking
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteMutation.mutate(entry.id)}
                        disabled={deleteMutation.isPending}
                        title="Remove Shift"
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
