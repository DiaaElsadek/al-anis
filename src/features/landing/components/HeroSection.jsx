import { motion } from "framer-motion";
import { Lock, MapPin, Moon, Search, ShieldCheck, Star, Sun, Sunset } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import CategoryIcon from "@/components/shared/CategoryIcon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { getLocalizedCategoryName } from "@/lib/utils";

export default function HeroSection({
  categories,
  selectedCategory,
  setSelectedCategory,
  selectedShift,
  setSelectedShift,
  locationQuery,
  setLocationQuery,
  handleConsoleSearch,
}) {
  const { t, i18n } = useTranslation(["landing", "common"]);

  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
      {/* Ambient Lighting Mesh - Subdued institutional warmth */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-primary/8 via-primary/3 to-transparent blur-[140px] rounded-full pointer-events-none -z-10"
        aria-hidden="true"
      />

      <motion.div
        className="container max-w-6xl mx-auto space-y-10"
        initial="hidden"
        animate="visible"
        variants={staggerContainer(0.12, 0.05)}
      >
        {/* Headline & Subhead with unified typography */}
        <motion.div
          className="text-center max-w-4xl mx-auto space-y-4 sm:space-y-5"
          variants={fadeInUp}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.2] sm:leading-[1.15] text-balance">
            {t("landing:hero.title")}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed text-balance">
            {t("landing:hero.description")}
          </p>
        </motion.div>

        {/* Interactive Shift Explorer & Booking Console */}
        <motion.div className="max-w-4xl mx-auto" variants={fadeInUp}>
          <Card className="border border-border/80 shadow-lg bg-card rounded-2xl p-4 sm:p-6">
            <form onSubmit={handleConsoleSearch} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Category Select */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground block">
                    {t("landing:hero.console.specialtyLabel")}
                  </Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="h-11 rounded-xl text-sm bg-background">
                      <SelectValue placeholder={t("landing:hero.console.specialtyPlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        {t("landing:hero.console.allSpecialties")}
                      </SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          <div className="flex items-center gap-2">
                            <CategoryIcon
                              icon={cat.icon}
                              name={cat.name}
                              className="h-3.5 w-3.5 text-primary shrink-0"
                            />
                            <span>{getLocalizedCategoryName(cat, i18n.language)}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Shift Select */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground block">
                    {t("landing:hero.console.shiftLabel")}
                  </Label>
                  <Select value={selectedShift} onValueChange={setSelectedShift}>
                    <SelectTrigger className="h-11 rounded-xl text-sm bg-background">
                      <SelectValue placeholder={t("landing:hero.console.shiftPlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("landing:hero.console.anyShift")}</SelectItem>
                      <SelectItem value="morning">
                        <div className="flex items-center gap-2">
                          <Sun className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                          <span>{t("landing:hero.console.shiftMorning")}</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="evening">
                        <div className="flex items-center gap-2">
                          <Sunset className="h-3.5 w-3.5 text-orange-500 shrink-0" />
                          <span>{t("landing:hero.console.shiftEvening")}</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="night">
                        <div className="flex items-center gap-2">
                          <Moon className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                          <span>{t("landing:hero.console.shiftNight")}</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Area / Location */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground block">
                    {t("landing:hero.console.locationLabel")}
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t("landing:hero.console.locationPlaceholder")}
                      value={locationQuery}
                      onChange={(e) => setLocationQuery(e.target.value)}
                      className="ps-9 h-11 rounded-xl text-sm bg-background"
                    />
                  </div>
                </div>

                {/* Search Submit */}
                <div className="flex flex-col justify-end">
                  <Button
                    type="submit"
                    className="h-11 rounded-xl text-sm font-semibold gap-2 w-full shadow-sm"
                  >
                    <Search className="h-4 w-4" />
                    <span>{t("landing:hero.console.searchButton")}</span>
                  </Button>
                </div>
              </div>

              {/* Trust Micro-Row */}
              <div className="pt-3 border-t border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-3 text-xs text-muted-foreground">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                    <span>{t("landing:hero.console.idVetted")}</span>
                  </span>
                  <span className="hidden sm:inline text-border">•</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-success shrink-0" />
                    <span>{t("landing:hero.console.escrowSafeguard")}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 font-medium text-foreground">
                  <span className="text-warm-accent font-bold flex items-center gap-1 shrink-0">
                    <Star className="h-3.5 w-3.5 fill-warm-accent text-warm-accent" /> 4.95 / 5
                  </span>
                  <span className="text-muted-foreground text-[11px] sm:text-xs">
                    {t("landing:hero.console.verifiedReviews")}
                  </span>
                </div>
              </div>
            </form>
          </Card>
        </motion.div>

        {/* Live Simulation Card Preview */}
        <motion.div className="max-w-3xl mx-auto pt-2" variants={fadeInUp}>
          <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-5">
            <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 w-full sm:w-auto">
              <div className="relative shrink-0 mt-0.5 sm:mt-0">
                <Avatar className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl border border-primary/20">
                  <AvatarImage src="https://images.unsplash.com/photo-1594824813576-809d43501a30?w=200&auto=format&fit=crop&q=80" />
                  <AvatarFallback className="rounded-xl font-bold bg-primary/10 text-primary">
                    MS
                  </AvatarFallback>
                </Avatar>
                <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-success border-2 border-background" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <h4 className="font-semibold text-sm text-foreground">
                    {t("landing:hero.simulation.name")}
                  </h4>
                  <Badge
                    variant="outline"
                    className="bg-success/10 text-success text-[10px] sm:text-[11px] border-success/30 font-medium shrink-0"
                  >
                    {t("landing:hero.simulation.availableToday")}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t("landing:hero.simulation.nextShift")}
                </p>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs mt-1 text-muted-foreground">
                  <span className="flex items-center gap-1 text-warm-accent font-semibold">
                    <Star className="h-3 w-3 fill-warm-accent text-warm-accent" /> 5.0 (148{" "}
                    {t("landing:hero.simulation.reviews")})
                  </span>
                  <span className="hidden sm:inline text-border">•</span>
                  <span className="text-primary font-semibold">
                    450 {t("landing:hero.simulation.rate")}
                  </span>
                </div>
              </div>
            </div>

            <Button size="sm" asChild className="font-medium w-full sm:w-auto shrink-0 shadow-xs">
              <Link to="/register">
                <span>{t("landing:hero.simulation.bookShift")}</span>
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Inline Stat Row (Clean metrics without decorative icon clutter) */}
        <motion.div
          className="border-y border-border/60 py-6 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center"
          variants={fadeInUp}
        >
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              {t("landing:hero.stats.shiftsCount")}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              {t("landing:hero.stats.shiftsLabel")}
            </div>
          </div>

          <div className="space-y-1 border-s border-border/40">
            <div className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              {t("landing:hero.stats.aidesCount")}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              {t("landing:hero.stats.aidesLabel")}
            </div>
          </div>

          <div className="space-y-1 border-t border-border/40 pt-4 sm:pt-0 md:border-t-0 md:border-s">
            <div className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              {t("landing:hero.stats.ratingScore")}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              {t("landing:hero.stats.ratingLabel")}
            </div>
          </div>

          <div className="space-y-1 border-t border-s border-border/40 pt-4 sm:pt-0 md:border-t-0">
            <div className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              {t("landing:hero.stats.safetyScore")}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              {t("landing:hero.stats.safetyLabel")}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
