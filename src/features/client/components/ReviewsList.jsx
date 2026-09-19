import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";

import RatingStars from "@/components/shared/RatingStars";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatLocalizedDate, getInitials, getMediaUrl } from "@/lib/utils";

export default function ReviewsList({ reviews = [], averageRating }) {
  const { t, i18n } = useTranslation(["client", "common"]);

  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-500 fill-current" />
            <CardTitle className="text-base font-bold">
              {t("client:profile.reviewsTitle")} ({reviews.length})
            </CardTitle>
          </div>
          <span className="text-xs font-semibold text-muted-foreground">
            {t("client:directory.rating")}:{" "}
            <strong className="text-foreground">
              {averageRating ? `${averageRating.toFixed(1)} / 5` : "—"}
            </strong>
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-xs text-muted-foreground">
            {t("client:profile.noReviews")}
          </div>
        ) : (
          reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 rounded-xl border border-border/60 bg-muted/15 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={getMediaUrl(rev.clientAvatar)} alt={rev.clientName} />
                    <AvatarFallback className="text-xs font-bold">
                      {getInitials(rev.clientName)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-semibold text-foreground">
                    {rev.clientName || t("common:roles.client")}
                  </span>
                </div>

                <RatingStars rating={rev.rating} size="h-3.5 w-3.5" />
              </div>

              <p className="text-sm text-foreground/90 leading-relaxed">{rev.comment}</p>
              <span className="text-xs text-muted-foreground block">
                {formatLocalizedDate(rev.createdAt, "dd/MM/yyyy", i18n.language)}
              </span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
