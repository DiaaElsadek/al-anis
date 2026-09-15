import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  DollarSign,
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  Layers,
} from "lucide-react";

import {
  getCategoriesWithPricing,
  createPricing,
  updatePricing,
  deletePricing,
  createBulkPricing,
} from "@/api/servicePricing";
import { getCategories } from "@/api/category";
import { ShiftType, ShiftTypeLabels } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminPricingPage() {
  const queryClient = useQueryClient();
  const [singleModalOpen, setSingleModalOpen] = useState(false);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [editingPricing, setEditingPricing] = useState(null);

  // Form states for single
  const [selectedCatId, setSelectedCatId] = useState("");
  const [shiftType, setShiftType] = useState(ShiftType.MORNING);
  const [price, setPrice] = useState(300);
  const [description, setDescription] = useState("");

  // Form states for bulk
  const [bulkCatId, setBulkCatId] = useState("");
  const [morningPrice, setMorningPrice] = useState(250);
  const [eveningPrice, setEveningPrice] = useState(300);
  const [nightPrice, setNightPrice] = useState(350);

  // Queries
  const { data: categoriesWithPricing = [], isLoading } = useQuery({
    queryKey: ["admin-categories-with-pricing"],
    queryFn: getCategoriesWithPricing,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: getCategories,
  });

  // Single pricing mutation
  const singleMutation = useMutation({
    mutationFn: () => {
      if (editingPricing) {
        return updatePricing(editingPricing.id, {
          pricePerShift: Number(price),
          description,
          isActive: true,
        });
      }
      return createPricing({
        categoryId: selectedCatId,
        shiftType: Number(shiftType),
        pricePerShift: Number(price),
        description,
        isActive: true,
      });
    },
    onSuccess: () => {
      toast.success(editingPricing ? "Shift price updated!" : "Shift price configured!");
      queryClient.invalidateQueries(["admin-categories-with-pricing"]);
      setSingleModalOpen(false);
      setEditingPricing(null);
    },
    onError: (error) => {
      toast.error("Pricing error", {
        description: error?.response?.data?.message || "Please check inputs.",
      });
    },
  });

  // Bulk pricing mutation
  const bulkMutation = useMutation({
    mutationFn: () =>
      createBulkPricing({
        categoryId: bulkCatId,
        pricings: [
          { shiftType: ShiftType.MORNING, pricePerShift: Number(morningPrice), description: "Morning Shift (8 AM - 4 PM)" },
          { shiftType: ShiftType.EVENING, pricePerShift: Number(eveningPrice), description: "Evening Shift (4 PM - 12 AM)" },
          { shiftType: ShiftType.NIGHT, pricePerShift: Number(nightPrice), description: "Night Shift (12 AM - 8 AM)" },
        ],
      }),
    onSuccess: () => {
      toast.success("All 3 shifts configured for category!");
      queryClient.invalidateQueries(["admin-categories-with-pricing"]);
      setBulkModalOpen(false);
    },
    onError: (error) => {
      toast.error("Bulk pricing error", {
        description: error?.response?.data?.message || "Please check inputs.",
      });
    },
  });

  // Delete pricing mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => deletePricing(id),
    onSuccess: () => {
      toast.success("Pricing deleted.");
      queryClient.invalidateQueries(["admin-categories-with-pricing"]);
    },
    onError: () => {
      toast.error("Could not delete pricing record.");
    },
  });

  const handleOpenEdit = (p, catId) => {
    setEditingPricing(p);
    setSelectedCatId(catId || p.categoryId);
    setShiftType(p.shiftType);
    setPrice(p.pricePerShift);
    setDescription(p.description || "");
    setSingleModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Shift Pricing per Category</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure standardized fixed prices per 8-hour shift (Morning, Evening, Night) for each service.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Bulk Setup Button */}
          <Dialog open={bulkModalOpen} onOpenChange={setBulkModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs font-semibold">
                <Layers className="h-4 w-4 me-1.5 text-primary" />
                Bulk Configure All 3 Shifts
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <DialogTitle>Bulk Shift Pricing Setup</DialogTitle>
                    <DialogDescription className="text-xs mt-0.5">
                      Set Morning, Evening, and Night rates for a category at once.
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Select Category *</Label>
                  <select
                    value={bulkCatId}
                    onChange={(e) => setBulkCatId(e.target.value)}
                    className="w-full h-10 rounded-lg border border-input bg-background px-3 text-xs"
                  >
                    <option value="">Choose service category...</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.nameEn || ""})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-semibold">Morning (EGP)</Label>
                    <Input
                      type="number"
                      value={morningPrice}
                      onChange={(e) => setMorningPrice(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-semibold">Evening (EGP)</Label>
                    <Input
                      type="number"
                      value={eveningPrice}
                      onChange={(e) => setEveningPrice(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-semibold">Night (EGP)</Label>
                    <Input
                      type="number"
                      value={nightPrice}
                      onChange={(e) => setNightPrice(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => setBulkModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => bulkMutation.mutate()}
                    disabled={!bulkCatId || bulkMutation.isPending}
                  >
                    {bulkMutation.isPending ? "Configuring..." : "Apply Shift Rates"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Single Shift Modal Trigger */}
          <Dialog open={singleModalOpen} onOpenChange={setSingleModalOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="text-xs font-semibold shadow-sm"
                onClick={() => {
                  setEditingPricing(null);
                  setSelectedCatId(categories[0]?.id || "");
                  setShiftType(ShiftType.MORNING);
                  setPrice(300);
                  setDescription("");
                }}
              >
                <Plus className="h-4 w-4 me-1.5" />
                Add Single Rate
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingPricing ? "Edit Shift Pricing" : "Add Shift Pricing"}
                </DialogTitle>
                <DialogDescription className="text-xs mt-0.5">
                  Set fixed EGP price for this category and shift time.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 pt-2">
                {!editingPricing && (
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Category *</Label>
                    <select
                      value={selectedCatId}
                      onChange={(e) => setSelectedCatId(e.target.value)}
                      className="w-full h-10 rounded-lg border border-input bg-background px-3 text-xs"
                    >
                      <option value="">Select category...</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {!editingPricing && (
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Shift Schedule</Label>
                    <select
                      value={shiftType}
                      onChange={(e) => setShiftType(e.target.value)}
                      className="w-full h-10 rounded-lg border border-input bg-background px-3 text-xs"
                    >
                      <option value={ShiftType.MORNING}>Morning Shift (8 AM - 4 PM)</option>
                      <option value={ShiftType.EVENING}>Evening Shift (4 PM - 12 AM)</option>
                      <option value={ShiftType.NIGHT}>Night Shift (12 AM - 8 AM)</option>
                    </select>
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Price per Shift (EGP) *</Label>
                  <Input
                    type="number"
                    min="50"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Description (Optional)</Label>
                  <Input
                    placeholder="e.g. Standard 8-hour shift rate"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => setSingleModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => singleMutation.mutate()}
                    disabled={singleMutation.isPending}
                  >
                    {singleMutation.isPending ? "Saving..." : "Save Rate"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Categories with Pricing Matrix */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      ) : categoriesWithPricing.length === 0 ? (
        <Card className="p-12 text-center border-border/70">
          <DollarSign className="h-10 w-10 text-muted-foreground/40 mx-auto mb-2" />
          <p className="text-sm font-semibold">No service pricing configured yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Click "Bulk Configure All 3 Shifts" above to configure your categories.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {categoriesWithPricing.map((item) => (
            <Card key={item.categoryId} className="border-border/70 shadow-sm bg-card overflow-hidden">
              <div className="p-4 bg-muted/20 border-b border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">{item.categoryIcon || "🩺"}</span>
                  <div>
                    <h3 className="font-bold text-sm text-foreground">
                      {item.categoryName}
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      {item.categoryDescription || "Shift service standard rates"}
                    </p>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs"
                  onClick={() => {
                    setBulkCatId(item.categoryId);
                    setBulkModalOpen(true);
                  }}
                >
                  Edit Category Shifts
                </Button>
              </div>

              <CardContent className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { shift: ShiftType.MORNING, label: "Morning", hours: "8 AM - 4 PM" },
                    { shift: ShiftType.EVENING, label: "Evening", hours: "4 PM - 12 AM" },
                    { shift: ShiftType.NIGHT, label: "Night", hours: "12 AM - 8 AM" },
                  ].map((s) => {
                    const priceRecord = item.pricing?.find(
                      (p) => Number(p.shiftType) === s.shift
                    );

                    return (
                      <div
                        key={s.shift}
                        className="p-3.5 rounded-xl border border-border/60 bg-muted/15 flex items-center justify-between"
                      >
                        <div>
                          <span className="font-bold text-xs text-foreground block">
                            {s.label} Shift
                          </span>
                          <span className="text-[10px] text-muted-foreground block">
                            {s.hours}
                          </span>
                          <span className="text-base font-extrabold text-primary block mt-1">
                            {priceRecord ? formatPrice(priceRecord.pricePerShift) : "Not set"}
                          </span>
                        </div>

                        {priceRecord && (
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-foreground"
                              onClick={() => handleOpenEdit(priceRecord, item.categoryId)}
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-destructive"
                              onClick={() => {
                                if (confirm("Remove this shift price?")) {
                                  deleteMutation.mutate(priceRecord.id);
                                }
                              }}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
