import { MapPin, Star } from "lucide-react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import DirectionalIcon from "@/components/shared/DirectionalIcon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import { getMediaUrl, getInitials, formatPrice, getLocalizedCategoryName } from "@/lib/utils";

export default function ProviderCard({ provider: p, language }) {
  const { t } = useTranslation(["client", "common"]);

  const providerName =
    p.fullName || `${p.firstName || ""} ${p.lastName || ""}`.trim() || t("common:roles.provider");
  const locationStr = p.location
    ? `${p.location.city ? p.location.city + ", " : ""}${p.location.governorate || "Egypt"}`
    : p.governorate || "Egypt";

  return (
    <Card className="group relative flex flex-col justify-between border-border/70 hover:border-primary/50 hover:shadow-xl transition-all duration-300 bg-card overflow-hidden">
      <div className="p-6 space-y-4">
        {/* Top Avatar & Name */}
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 rounded-2xl border-2 border-primary/20 shadow-sm">
            <AvatarImage src={getMediaUrl(p.avatarUrl || p.profilePicture)} alt={providerName} />
            <AvatarFallback className="rounded-2xl bg-primary/10 text-primary font-bold text-lg">
              {getInitials(providerName)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-base text-foreground truncate group-hover:text-primary transition-colors">
                {providerName}
              </h3>
            </div>

            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{locationStr}</span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1.5 mt-1.5">
              <div className="flex items-center text-amber-500 text-xs font-bold">
                <Star className="h-3.5 w-3.5 fill-current me-1" />
                {p.averageRating ? p.averageRating.toFixed(1) : t("common:new")}
              </div>
              {p.totalReviews > 0 && (
                <span className="text-[11px] text-muted-foreground">
                  {t("client:directory.reviewsCount", { count: p.totalReviews })}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Specialties / Categories chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {p.categories?.slice(0, 2).map((c) => (
            <Badge
              key={c.id || c.name}
              variant="secondary"
              className="text-[11px] font-medium bg-primary/5 text-primary border-primary/10"
            >
              {getLocalizedCategoryName(c, language)}
            </Badge>
          ))}
          {p.categories?.length > 2 && (
            <span className="text-[11px] text-muted-foreground self-center">
              +{p.categories.length - 2}
            </span>
          )}
        </div>

        {/* Availability Badge & Shift Price */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
          <div className="flex items-center gap-1.5">
            <span
              className={`h-2 w-2 rounded-full ${
                p.isAvailable ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground/40"
              }`}
            />
            <span
              className={p.isAvailable ? "text-emerald-700 font-semibold" : "text-muted-foreground"}
            >
              {p.isAvailable ? t("common:status.available") : t("common:status.busy")}
            </span>
          </div>

          <div className="text-end">
            <span className="text-[10px] text-muted-foreground block">
              {t("client:directory.baseRate")}
            </span>
            <span className="font-bold text-sm text-foreground">
              {p.hourlyRate ? formatPrice(p.hourlyRate * 8) : "-"}
            </span>
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <CardFooter className="p-4 pt-0 bg-muted/20 border-t border-border/40 flex gap-2">
        <Button variant="outline" size="sm" className="flex-1 text-xs font-semibold h-9" asChild>
          <Link to={`/app/providers/${p.id}`}>{t("client:directory.viewProfile")}</Link>
        </Button>
        <Button
          size="sm"
          className="flex-1 text-xs font-semibold h-9 shadow-sm shadow-primary/20"
          asChild
        >
          <Link to={`/app/providers/${p.id}?book=true`}>
            <span>{t("client:directory.bookShift")}</span>
            <DirectionalIcon className="h-3.5 w-3.5 ms-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

ProviderCard.propTypes = {
  provider: PropTypes.object.isRequired,
  language: PropTypes.string.isRequired,
};
