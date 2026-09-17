import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { createRequest } from "@/api/requests";
import DatePicker from "@/components/shared/DatePicker";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ShiftType } from "@/lib/constants";
import {
  formatPrice,
  getLocalizedCategoryName,
  getShiftLabel,
  handleMutationError,
} from "@/lib/utils";
import { createRequestSchema } from "@/lib/validators";

export default function BookingDialog({ open, onOpenChange, provider, providerId }) {
  const { t, i18n } = useTranslation(["client", "common", "auth"]);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createRequestSchema),
    defaultValues: {
      serviceProviderId: providerId,
      categoryId: provider?.categories?.[0]?.id || "",
      shiftType: ShiftType.MORNING,
      date: new Date().toISOString().split("T")[0],
      address: "",
      description: "",
    },
  });

  const selectedCatId = watch("categoryId");
  const selectedShift = watch("shiftType");
  const selectedDate = watch("date");

  // Calculate estimated price based on shiftPrices from backend
  const matchedPrice = provider?.shiftPrices?.find(
    (p) => p.categoryId === selectedCatId && Number(p.shiftType) === Number(selectedShift)
  )?.pricePerShift;

  const requestMutation = useMutation({
    mutationFn: (data) =>
      createRequest({
        providerId: providerId,
        categoryId: data.categoryId,
        shiftType: Number(data.shiftType),
        preferredDate: new Date(data.date).toISOString(),
        address: data.address,
        governorate: provider?.workingAreas?.[0]?.governorate || "Cairo",
        description: data.description,
      }),
    onSuccess: () => {
      toast.success(t("client:profile.bookShiftModal.successToast"));
      onOpenChange(false);
      queryClient.invalidateQueries(["user-requests"]);
      navigate("/app/requests");
    },
    onError: (error) => handleMutationError(error, t, "common:error"),
  });

  const onSubmitBooking = (data) => {
    requestMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="w-full sm:w-auto font-semibold shadow-md shadow-primary/20 hover:shadow-lg transition-all"
          onClick={() => {
            if (provider?.categories?.[0]?.id) {
              setValue("categoryId", provider.categories[0].id);
            }
          }}
        >
          <Calendar className="h-4 w-4 me-2" />
          {t("client:profile.requestBooking")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle>{t("client:profile.bookShiftModal.title")}</DialogTitle>
              <DialogDescription className="text-xs mt-0.5">
                {t("client:profile.bookShiftModal.subtitle")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmitBooking)} className="space-y-4 pt-2">
          {/* Category Selection */}
          <div className="space-y-1.5">
            <Label htmlFor="catSelect" className="text-xs font-semibold">
              {t("auth:register.categories")} <span className="text-destructive">*</span>
            </Label>
            <Select
              value={selectedCatId || ""}
              onValueChange={(val) => setValue("categoryId", val, { shouldValidate: true })}
            >
              <SelectTrigger id="catSelect" className="w-full h-10 text-sm">
                <SelectValue placeholder={`${t("auth:register.categories")}...`} />
              </SelectTrigger>
              <SelectContent>
                {provider?.categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {getLocalizedCategoryName(cat, i18n.language)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryId && (
              <p className="text-xs text-destructive">{errors.categoryId.message}</p>
            )}
          </div>

          {/* Shift Type (Morning, Evening, Night) */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              {t("client:profile.bookShiftModal.shiftLabel")}{" "}
              <span className="text-destructive">*</span>
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {[
                {
                  type: ShiftType.MORNING,
                  label: t("common:shifts.morning"),
                  hours: "8 AM - 4 PM",
                },
                {
                  type: ShiftType.EVENING,
                  label: t("common:shifts.evening"),
                  hours: "4 PM - 12 AM",
                },
                {
                  type: ShiftType.NIGHT,
                  label: t("common:shifts.night"),
                  hours: "12 AM - 8 AM",
                },
              ].map((s) => {
                const isSelected = Number(selectedShift) === s.type;
                return (
                  <button
                    key={s.type}
                    type="button"
                    onClick={() => setValue("shiftType", s.type)}
                    className={`p-2.5 rounded-lg border text-center transition-all ${
                      isSelected
                        ? "bg-primary/10 border-primary text-primary font-bold shadow-sm"
                        : "border-border/70 hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    <span className="block text-xs">{s.label}</span>
                    <span className="block text-[10px] opacity-70 mt-0.5">{s.hours}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date & Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="reqDate" className="text-xs font-semibold">
                {t("client:profile.bookShiftModal.dateLabel")}{" "}
                <span className="text-destructive">*</span>
              </Label>
              <DatePicker
                id="reqDate"
                value={selectedDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(val) => setValue("date", val, { shouldValidate: true })}
              />
              {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="reqAddress" className="text-xs font-semibold">
                {t("client:profile.bookShiftModal.addressLabel")}{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="reqAddress"
                placeholder={t("client:profile.bookShiftModal.addressPlaceholder")}
                {...register("address")}
              />
              {errors.address && (
                <p className="text-xs text-destructive">{errors.address.message}</p>
              )}
            </div>
          </div>

          {/* Description / Medical or task notes */}
          <div className="space-y-1.5">
            <Label htmlFor="reqDesc" className="text-xs font-semibold">
              {t("client:profile.bookShiftModal.notesLabel")}{" "}
              <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="reqDesc"
              rows={3}
              placeholder={t("client:profile.bookShiftModal.notesPlaceholder")}
              className="resize-none text-xs"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>

          {/* Estimated Price summary */}
          <div className="p-3.5 rounded-xl bg-muted/30 border border-border/70 space-y-1.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-foreground block">
                  {t("client:profile.bookShiftModal.estimatedCost")}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {getShiftLabel(selectedShift, t)} (8h)
                </span>
              </div>
              <span className="text-xl font-bold text-primary">
                {matchedPrice ? formatPrice(matchedPrice) : "-"}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground/90 border-t border-border/40 pt-1.5">
              {t("client:profile.bookShiftModal.chargeNotice")}
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("common:cancel")}
            </Button>
            <Button type="submit" disabled={requestMutation.isPending}>
              {requestMutation.isPending
                ? t("client:profile.bookShiftModal.submitting")
                : t("client:profile.bookShiftModal.submitButton")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
