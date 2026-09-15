import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MapPin, Plus, Trash2, Building, AlertCircle } from "lucide-react";

import { getWorkingAreas, addWorkingArea, deleteWorkingArea } from "@/api/provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const COMMON_GOVERNORATES = [
  "Cairo",
  "Giza",
  "Alexandria",
  "Qalyubia",
  "Dakahlia",
  "Sharqia",
  "Gharbia",
  "Menofia",
];

export default function ProviderWorkingAreasPage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [governorate, setGovernorate] = useState("Cairo");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");

  const { data: areas = [], isLoading } = useQuery({
    queryKey: ["provider-working-areas"],
    queryFn: getWorkingAreas,
  });

  const addMutation = useMutation({
    mutationFn: () => addWorkingArea({ governorate, city, district }),
    onSuccess: () => {
      toast.success("Service area added!");
      queryClient.invalidateQueries(["provider-working-areas"]);
      setModalOpen(false);
      setCity("");
      setDistrict("");
    },
    onError: (error) => {
      toast.error("Failed to add area", {
        description: error?.response?.data?.message || "Please check details.",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteWorkingArea(id),
    onSuccess: () => {
      toast.success("Service area removed.");
      queryClient.invalidateQueries(["provider-working-areas"]);
    },
    onError: () => {
      toast.error("Could not remove service area.");
    },
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!city.trim()) {
      toast.error("City or neighborhood name is required.");
      return;
    }
    addMutation.mutate();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Service Working Areas</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Define the governorates, cities, and neighborhoods where you accept shifts.
          </p>
        </div>

        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="text-xs font-semibold shadow-sm">
              <Plus className="h-4 w-4 me-1.5" />
              Add Working Area
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Service Location</DialogTitle>
              <DialogDescription className="text-xs mt-0.5">
                Add a new territory to your coverage network.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleAdd} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Governorate</Label>
                <select
                  value={governorate}
                  onChange={(e) => setGovernorate(e.target.value)}
                  className="w-full h-10 rounded-lg border border-input bg-background px-3 text-xs"
                >
                  {COMMON_GOVERNORATES.map((gov) => (
                    <option key={gov} value={gov}>
                      {gov}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">City / Municipal Area *</Label>
                <Input
                  placeholder="e.g. New Cairo / Maadi / Dokki"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">District / Zone (Optional)</Label>
                <Input
                  placeholder="e.g. 5th Settlement / Degla"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={addMutation.isPending}>
                  {addMutation.isPending ? "Adding..." : "Add Location"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border/70 shadow-sm bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">Active Service Locations ({areas.length})</CardTitle>
          <CardDescription className="text-xs">
            Clients searching in these locations will discover your profile.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-14 bg-muted/30 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : areas.length === 0 ? (
            <div className="text-center py-12 text-xs text-muted-foreground space-y-2">
              <MapPin className="h-10 w-10 text-muted-foreground/40 mx-auto" />
              <p>No working areas added yet. Clients in your city need your care!</p>
              <Button
                variant="outline"
                size="sm"
                className="text-xs mt-2"
                onClick={() => setModalOpen(true)}
              >
                Add Your First Service Area
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {areas.map((area) => (
                <div
                  key={area.id}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-border/60 bg-muted/20 hover:border-primary/40 transition-colors text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Building className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-bold text-foreground">
                        {area.city || "Urban Area"}
                      </span>
                      <span className="text-muted-foreground block text-[11px]">
                        {area.governorate}
                        {area.district ? ` • ${area.district}` : ""}
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => deleteMutation.mutate(area.id)}
                    disabled={deleteMutation.isPending}
                    title="Delete Area"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
