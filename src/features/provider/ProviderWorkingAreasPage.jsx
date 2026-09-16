import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MapPin, Plus, Trash2, Building, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { getWorkingAreas, addWorkingArea, deleteWorkingArea } from "@/api/provider";
import EmptyState from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { GOVERNORATES } from "@/lib/constants";
import { handleMutationError } from "@/lib/utils";

export default function ProviderWorkingAreasPage() {
  const { t } = useTranslation(["provider", "common"]);
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [governorate, setGovernorate] = useState("Cairo");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");

  const {
    data: areas = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["provider-working-areas"],
    queryFn: getWorkingAreas,
  });

  const addMutation = useMutation({
    mutationFn: () => addWorkingArea({ governorate, city, district }),
    onSuccess: () => {
      toast.success(t("provider:workingAreas.addedToast"));
      queryClient.invalidateQueries(["provider-working-areas"]);
      setModalOpen(false);
      setCity("");
      setDistrict("");
    },
    onError: (error) => handleMutationError(error, t, "common:error"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteWorkingArea(id),
    onSuccess: () => {
      toast.success(t("provider:workingAreas.deletedToast"));
      queryClient.invalidateQueries(["provider-working-areas"]);
    },
    onError: (error) => handleMutationError(error, t, "common:error"),
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!city.trim()) {
      toast.error(t("provider:workingAreas.cityRequired"));
      return;
    }
    addMutation.mutate();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("provider:workingAreas.title")}</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("provider:workingAreas.subtitle")}
          </p>
        </div>

        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="text-xs font-semibold shadow-sm">
              <Plus className="h-4 w-4 me-1.5" />
              {t("provider:workingAreas.addArea")}
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t("provider:workingAreas.addModalTitle")}</DialogTitle>
              <DialogDescription className="text-xs mt-0.5">
                {t("provider:workingAreas.subtitle")}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleAdd} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">{t("client:profile.governorate")} *</Label>
                <Select value={governorate} onValueChange={setGovernorate}>
                  <SelectTrigger className="w-full h-10 text-xs">
                    <SelectValue placeholder={t("client:profile.governorate")} />
                  </SelectTrigger>
                  <SelectContent>
                    {GOVERNORATES.map((gov) => (
                      <SelectItem key={gov} value={gov} className="text-xs">
                        {gov}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">{t("client:profile.city")} *</Label>
                <Input
                  placeholder="e.g. Nasr City, Maadi..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">{t("client:profile.district")}</Label>
                <Input
                  placeholder="e.g. Zone 1, Degla..."
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                  {t("common:cancel")}
                </Button>
                <Button type="submit" disabled={addMutation.isPending}>
                  {addMutation.isPending ? t("common:loading") : t("common:save")}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border/70 shadow-sm bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">
            {t("provider:workingAreas.title")} ({areas.length})
          </CardTitle>
          <CardDescription className="text-xs">
            {t("provider:workingAreas.subtitle")}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-14 bg-muted/30 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : isError ? (
            <div className="py-12">
              <EmptyState
                icon={AlertCircle}
                title={t("common:error")}
                description={t("common:empty.tryAdjusting")}
                actionLabel={t("common:actions.retry")}
                onAction={() => refetch()}
              />
            </div>
          ) : areas.length === 0 ? (
            <div className="py-8">
              <EmptyState
                icon={MapPin}
                title={t("provider:workingAreas.noAreas")}
                description={t("provider:workingAreas.subtitle")}
                actionLabel={t("provider:workingAreas.addArea")}
                onAction={() => setModalOpen(true)}
              />
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
                      <span className="font-bold text-foreground">{area.city || "-"}</span>
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
                    title={t("provider:workingAreas.deleteArea")}
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
