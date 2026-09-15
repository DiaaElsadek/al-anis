import { CheckCircle2, DollarSign, MapPin, ShieldCheck, Star } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice, getInitials, getMediaUrl, getShiftLabel } from "@/lib/utils";

export default function ProviderInfoSection({ provider, providerName, children }) {
  const { t } = useTranslation(["client", "common"]);

  return (
    <>
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
                  <ShieldCheck
                    className="h-5 w-5 text-teal-600"
                    title={t("client:directory.verified")}
                  />
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center text-amber-500 font-bold">
                    <Star className="h-3.5 w-3.5 fill-current me-1" />
                    {provider.averageRating ? provider.averageRating.toFixed(1) : t("common:new")}
                  </span>
                  <span>•</span>
                  <span>
                    {t("client:directory.reviewsCount", { count: provider.totalReviews || 0 })}
                  </span>
                  <span>•</span>
                  <span className="flex items-center text-emerald-600 font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5 me-1" />
                    {t("client:profile.nationalIdVerified")}
                  </span>
                </div>
              </div>
            </div>

            {/* Book Shift CTA / Dialog */}
            {children}
          </div>

          {/* Bio section */}
          <div className="space-y-2 border-t border-border/60 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {t("client:profile.about")}
            </h3>
            <p className="text-sm text-foreground/90 leading-relaxed">{provider.bio || "-"}</p>
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
              <CardTitle className="text-base font-bold">
                {t("client:profile.shiftPricing")}
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              {t("client:profile.shiftPricingSubtitle")}
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
                      ({getShiftLabel(sp.shiftType, t, sp.shiftTypeName)})
                    </span>
                  </div>
                  <span className="font-bold text-primary">{formatPrice(sp.pricePerShift)}</span>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-muted-foreground bg-muted/20 rounded-lg">
                -
              </div>
            )}
          </CardContent>
        </Card>

        {/* Serviced Working Areas */}
        <Card className="border-border/70 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-teal-600" />
              <CardTitle className="text-base font-bold">
                {t("client:profile.workingAreas")}
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              {t("client:profile.shiftPricingSubtitle")}
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
              <p className="text-xs text-muted-foreground">-</p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
