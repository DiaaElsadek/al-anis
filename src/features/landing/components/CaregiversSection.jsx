import { motion } from "framer-motion";
import { BadgeCheck, MapPin, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getSpotlightProviders } from "@/features/landing/data";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { formatPrice, getInitials } from "@/lib/utils";

export default function CaregiversSection() {
  const { t } = useTranslation(["landing", "common"]);
  const providers = getSpotlightProviders(t);
  const [featured, ...supporting] = providers;

  return (
    <section id="caregivers" className="py-16 md:py-24 border-y border-border/70">
      <div className="container max-w-6xl mx-auto space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              {t("landing:caregivers.title")}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
              {t("landing:caregivers.subtitle")}
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            asChild
            className="self-start sm:self-auto font-medium"
          >
            <Link to="/register">
              <span>{t("landing:caregivers.joinCta")}</span>
            </Link>
          </Button>
        </div>

        {/* Asymmetrical Layout: 1 Spotlight Featured Provider + 2 Supporting Providers */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer(0.1, 0.05)}
        >
          {/* Spotlight Card (7 cols) */}
          {featured && (
            <motion.div variants={fadeInUp} className="lg:col-span-7">
              <Card className="h-full border border-border/80 shadow-md bg-card rounded-2xl overflow-hidden hover:border-primary/40 transition-colors">
                <CardContent className="p-6 sm:p-8 flex flex-col justify-between h-full space-y-6">
                  <div className="space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <Badge className="bg-primary/10 text-primary border-primary/25 text-xs font-medium">
                        {t("landing:caregivers.spotlightBadge")}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                        {featured.location}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                      <div className="relative shrink-0">
                        <Avatar className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl border-2 border-primary/30">
                          <AvatarImage src={featured.avatar} alt={featured.name} />
                          <AvatarFallback className="rounded-2xl font-bold text-lg bg-primary/10 text-primary">
                            {getInitials(featured.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-success border-2 border-background" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg sm:text-xl font-bold text-foreground">
                            {featured.name}
                          </h3>
                          <BadgeCheck className="h-5 w-5 text-primary shrink-0" />
                        </div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {featured.title}
                        </p>
                        <div className="pt-1">
                          <span className="inline-block text-xs bg-muted text-foreground/80 px-2.5 py-1 rounded-md font-normal">
                            {featured.badge}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 border-t border-border/60">
                      <div>
                        <span className="text-xs text-muted-foreground font-medium block">
                          {t("landing:caregivers.ratingLabel")}
                        </span>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-4 w-4 fill-warm-accent text-warm-accent" />
                          <span className="text-sm font-bold text-foreground">
                            {featured.rating}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ({featured.reviewsCount})
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="text-xs text-muted-foreground font-medium block">
                          {t("landing:caregivers.completedLabel")}
                        </span>
                        <span className="text-sm font-bold text-foreground mt-1 block">
                          {featured.shiftsCompleted} {t("landing:caregivers.shiftsCount")}
                        </span>
                      </div>

                      <div>
                        <span className="text-xs text-muted-foreground font-medium block">
                          {t("landing:caregivers.availableLabel")}
                        </span>
                        <span className="text-xs font-semibold text-primary mt-1 block">
                          {featured.shiftsAvailable}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-xs text-muted-foreground font-medium block">
                        {t("landing:caregivers.rateLabel")}
                      </span>
                      <span className="text-xl font-bold text-primary">
                        {formatPrice(featured.rate)}
                      </span>
                    </div>

                    <Button
                      asChild
                      className="w-full sm:w-auto text-sm font-semibold px-6 shadow-sm"
                    >
                      <Link to="/register">
                        <span>{t("landing:caregivers.bookShift")}</span>
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Supporting Providers (5 cols stacked) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            {supporting.map((prov) => (
              <motion.div key={prov.id} variants={fadeInUp} className="flex-1">
                <Card className="h-full border border-border/80 shadow-xs bg-card rounded-2xl hover:border-primary/40 transition-colors">
                  <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-14 w-14 rounded-xl border border-primary/20 shrink-0">
                        <AvatarImage src={prov.avatar} alt={prov.name} />
                        <AvatarFallback className="rounded-xl font-bold bg-primary/10 text-primary">
                          {getInitials(prov.name)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-sm text-foreground truncate">
                            {prov.name}
                          </h4>
                          <BadgeCheck className="h-4 w-4 text-primary shrink-0" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">
                          {prov.title}
                        </p>
                        <p className="text-[11px] text-muted-foreground/80 mt-1 truncate">
                          {prov.badge}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between pt-3 border-t border-border/50 text-xs gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-warm-accent text-warm-accent" />
                        <span className="font-bold text-foreground">{prov.rating}</span>
                        <span className="text-muted-foreground">({prov.reviewsCount})</span>
                      </div>

                      <div className="text-muted-foreground">
                        <span>
                          {prov.shiftsCompleted} {t("landing:caregivers.shiftsCount")}
                        </span>
                      </div>

                      <div className="font-bold text-primary">{formatPrice(prov.rate)}</div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="w-full text-xs font-medium"
                    >
                      <Link to="/register">
                        <span>{t("landing:caregivers.viewProfileAndBook")}</span>
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
