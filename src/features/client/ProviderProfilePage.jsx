import { useState } from "react";
import { useParams, useNavigate, useSearchParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Star,
  ShieldCheck,
  MapPin,
  Calendar,
  Clock,
  Briefcase,
  DollarSign,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Sparkles,
} from "lucide-react";

import { getProvider } from "@/api/provider";
import { getProviderReviews } from "@/api/reviews";
import { createRequest } from "@/api/requests";
import { createRequestSchema } from "@/lib/validators";
import { ShiftType, ShiftTypeLabels } from "@/lib/constants";
import { getMediaUrl, getInitials, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProviderProfilePage() {
  const { id: providerId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [bookingOpen, setBookingOpen] = useState(
    searchParams.get("book") === "true"
  );

  // Fetch provider details
  const { data: provider, isLoading, isError } = useQuery({
    queryKey: ["provider", providerId],
    queryFn: () => getProvider(providerId),
    enabled: !!providerId,
  });

  // Fetch reviews
  const { data: reviewsData } = useQuery({
    queryKey: ["provider-reviews", providerId],
    queryFn: () => getProviderReviews(providerId),
    enabled: !!providerId,
  });

  const reviews = reviewsData?.reviews || [];

  // Booking Form
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
      categoryId: "",
      shiftType: ShiftType.MORNING,
      date: new Date().toISOString().split("T")[0],
      address: "",
      description: "",
    },
  });

  const selectedCatId = watch("categoryId");
  const selectedShift = watch("shiftType");

  // Calculate estimated price based on shiftPrices from backend
  const matchedPrice = provider?.shiftPrices?.find(
    (p) =>
      p.categoryId === selectedCatId &&
      Number(p.shiftType) === Number(selectedShift)
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
      toast.success("Shift request submitted!", {
        description: "The provider will review your request shortly.",
      });
      setBookingOpen(false);
      queryClient.invalidateQueries(["user-requests"]);
      navigate("/app/requests");
    },
    onError: (error) => {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to send request. Please try again.";
      toast.error("Booking error", { description: msg });
    },
  });

  const onSubmitBooking = (data) => {
    requestMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto py-6">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !provider) {
    return (
      <div className="text-center py-16 max-w-md mx-auto space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
        <h2 className="text-xl font-bold">Provider Not Found</h2>
        <p className="text-sm text-muted-foreground">
          The requested service provider could not be loaded or may no longer be active.
        </p>
        <Button asChild variant="outline">
          <Link to="/app/providers">Back to Providers</Link>
        </Button>
      </div>
    );
  }

  const providerName =
    provider.fullName ||
    `${provider.firstName || ""} ${provider.lastName || ""}`.trim() ||
    "Specialist";

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Top back navigation */}
      <Link
        to="/app/providers"
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 me-2 transition-transform group-hover:-translate-x-1" />
        Back to Find Providers
      </Link>

      {/* Header Profile Hero Card */}
      <Card className="relative overflow-hidden border-border/70 shadow-lg bg-card">
        <div className="h-28 bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900" />

        <div className="p-6 sm:p-8 pt-0 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-14 mb-6">
            <div className="flex items-end gap-4">
              <Avatar className="h-28 w-28 rounded-2xl border-4 border-card shadow-md">
                <AvatarImage src={getMediaUrl(provider.avatarUrl)} alt={providerName} />
                <AvatarFallback className="rounded-2xl bg-primary/10 text-primary font-bold text-2xl">
                  {getInitials(providerName)}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1 mb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-foreground">{providerName}</h1>
                  <ShieldCheck className="h-5 w-5 text-teal-600" title="Verified Specialist" />
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center text-amber-500 font-bold">
                    <Star className="h-3.5 w-3.5 fill-current me-1" />
                    {provider.averageRating ? provider.averageRating.toFixed(1) : "New"}
                  </span>
                  <span>•</span>
                  <span>{provider.totalReviews || 0} reviews</span>
                  <span>•</span>
                  <span className="flex items-center text-emerald-600 font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5 me-1" />
                    Background Checked
                  </span>
                </div>
              </div>
            </div>

            {/* Book Shift CTA */}
            <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="w-full sm:w-auto font-semibold shadow-md shadow-primary/20 hover:shadow-lg transition-all"
                  onClick={() => {
                    if (provider.categories?.[0]?.id) {
                      setValue("categoryId", provider.categories[0].id);
                    }
                  }}
                >
                  <Calendar className="h-4 w-4 me-2" />
                  Request Shift Booking
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-primary/10 text-primary">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <DialogTitle>Book a Shift with {providerName}</DialogTitle>
                      <DialogDescription className="text-xs mt-0.5">
                        Choose your service, preferred shift time, and location.
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmitBooking)} className="space-y-4 pt-2">
                  {/* Category Selection */}
                  <div className="space-y-1.5">
                    <Label htmlFor="catSelect" className="text-xs font-semibold">
                      Service Specialty <span className="text-destructive">*</span>
                    </Label>
                    <select
                      id="catSelect"
                      className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:ring-1 focus:ring-primary outline-none"
                      {...register("categoryId")}
                    >
                      <option value="">Select service specialty...</option>
                      {provider.categories?.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    {errors.categoryId && (
                      <p className="text-xs text-destructive">{errors.categoryId.message}</p>
                    )}
                  </div>

                  {/* Shift Type (Morning, Evening, Night) */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">
                      Shift Schedule <span className="text-destructive">*</span>
                    </Label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { type: ShiftType.MORNING, label: "Morning", hours: "8 AM - 4 PM" },
                        { type: ShiftType.EVENING, label: "Evening", hours: "4 PM - 12 AM" },
                        { type: ShiftType.NIGHT, label: "Night", hours: "12 AM - 8 AM" },
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
                        Shift Date <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="reqDate"
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        {...register("date")}
                      />
                      {errors.date && (
                        <p className="text-xs text-destructive">{errors.date.message}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="reqAddress" className="text-xs font-semibold">
                        Service Address <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="reqAddress"
                        placeholder="Street, Building, Apt..."
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
                      Shift Details & Instructions <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="reqDesc"
                      rows={3}
                      placeholder="Specify patient condition, tasks needed, or specific requests..."
                      className="resize-none text-xs"
                      {...register("description")}
                    />
                    {errors.description && (
                      <p className="text-xs text-destructive">{errors.description.message}</p>
                    )}
                  </div>

                  {/* Estimated Price summary */}
                  <div className="p-3 rounded-xl bg-muted/40 border border-border flex items-center justify-between">
                    <div>
                      <span className="text-xs text-muted-foreground block">Estimated Shift Price</span>
                      <span className="text-xs font-medium text-foreground">
                        {ShiftTypeLabels[selectedShift]} Shift (8 Hours)
                      </span>
                    </div>
                    <span className="text-lg font-bold text-primary">
                      {matchedPrice ? formatPrice(matchedPrice) : "Calculated at checkout"}
                    </span>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setBookingOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={requestMutation.isPending}>
                      {requestMutation.isPending ? "Sending Request..." : "Confirm Shift Request"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Bio section */}
          <div className="space-y-2 border-t border-border/60 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              About & Care Philosophy
            </h3>
            <p className="text-sm text-foreground/90 leading-relaxed">
              {provider.bio || "No biography provided yet."}
            </p>
          </div>
        </div>
      </Card>

      {/* 2-Column Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shift Pricing Matrix */}
        <Card className="border-border/70 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-600" />
              <CardTitle className="text-base font-bold">Standard Shift Pricing</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Predictable fixed pricing per 8-hour shift in Egyptian Pounds.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {provider.shiftPrices?.length ? (
              provider.shiftPrices.map((sp, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-border/50 bg-muted/20 text-xs"
                >
                  <div>
                    <span className="font-semibold text-foreground">{sp.categoryName}</span>
                    <span className="text-muted-foreground ms-2">
                      ({sp.shiftTypeName || ShiftTypeLabels[sp.shiftType]})
                    </span>
                  </div>
                  <span className="font-bold text-primary">{formatPrice(sp.pricePerShift)}</span>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-muted-foreground bg-muted/20 rounded-lg">
                Shift pricing calculated upon booking based on category standards.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Serviced Working Areas */}
        <Card className="border-border/70 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-teal-600" />
              <CardTitle className="text-base font-bold">Service Coverage Areas</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Locations where this professional accepts shift assignments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {provider.workingAreas?.length ? (
              <div className="flex flex-wrap gap-2">
                {provider.workingAreas.map((area, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="p-1.5 px-3 text-xs bg-muted/40 font-medium"
                  >
                    <MapPin className="h-3 w-3 me-1 text-primary" />
                    {area.city ? `${area.city}, ` : ""}
                    {area.governorate}
                    {area.district ? ` (${area.district})` : ""}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">Servicing Greater Cairo & surrounding areas.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Reviews & Testimonials Section */}
      <Card className="border-border/70 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-500 fill-current" />
              <CardTitle className="text-base font-bold">Client Reviews ({reviews.length})</CardTitle>
            </div>
            <span className="text-xs font-semibold text-muted-foreground">
              Average Rating: <strong className="text-foreground">{provider.averageRating?.toFixed(1) || "5.0"} / 5</strong>
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {reviews.length === 0 ? (
            <div className="text-center py-8 text-xs text-muted-foreground">
              No reviews recorded for this provider yet. Be the first to book and share your experience!
            </div>
          ) : (
            reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-4 rounded-xl border border-border/60 bg-muted/15 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={getMediaUrl(rev.clientAvatar)} alt={rev.clientName} />
                      <AvatarFallback className="text-xs font-bold">
                        {getInitials(rev.clientName)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-semibold text-foreground">
                      {rev.clientName || "Verified Client"}
                    </span>
                  </div>

                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < rev.rating ? "fill-current" : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-foreground/85 leading-relaxed">{rev.comment}</p>
                <span className="text-[10px] text-muted-foreground block">
                  {new Date(rev.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
