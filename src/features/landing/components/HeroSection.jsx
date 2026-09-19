import { motion } from "framer-motion";
import { Lock, MapPin, Moon, Search, ShieldCheck, Star, Sun, Sunset } from "lucide-react";
import { Link } from "react-router-dom";

import CategoryIcon from "@/components/shared/CategoryIcon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  isArabic,
  categories,
  selectedCategory,
  setSelectedCategory,
  selectedShift,
  setSelectedShift,
  locationQuery,
  setLocationQuery,
  handleConsoleSearch,
}) {
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
            {isArabic
              ? "رعاية وتمريض منزلي موثوق، محجوز بنظام الوردية."
              : "Verified care and healthcare aides, booked by shift."}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed text-balance">
            {isArabic
              ? "تواصل مع ممرضين، وجليسات مسنين وأطفال، وأخصائيي علاج طبيعي معتمدين برقم قومي مدقق. أسعار ثابتة لكل وردية 8 ساعات دون مفاجآت مع حماية كاملة لأموالك بالدفع الضامن."
              : "Connect with certified nurses, elderly companions, babysitters, and rehab therapists. Fixed 8-hour shift rates, zero hidden overtime, and 100% digital escrow safety."}
          </p>
        </motion.div>

        {/* Interactive Shift Explorer & Booking Console */}
        <motion.div className="max-w-4xl mx-auto" variants={fadeInUp}>
          <Card className="border border-border/80 shadow-lg bg-card rounded-2xl p-4 sm:p-6">
            <form onSubmit={handleConsoleSearch} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Category Select */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground block">
                    {isArabic ? "التخصص المطلوب" : "Specialty"}
                  </label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="h-11 rounded-xl text-sm bg-background">
                      <SelectValue
                        placeholder={isArabic ? "اختر التخصص..." : "Select specialty..."}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        {isArabic ? "جميع التخصصات" : "All Specialties"}
                      </SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          <div className="flex items-center gap-2">
                            <CategoryIcon
                              icon={cat.icon}
                              name={cat.name}
                              className="h-3.5 w-3.5 text-primary shrink-0"
                            />
                            <span>{getLocalizedCategoryName(cat, isArabic ? "ar" : "en")}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Shift Select */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground block">
                    {isArabic ? "موعد الوردية" : "Shift Time"}
                  </label>
                  <Select value={selectedShift} onValueChange={setSelectedShift}>
                    <SelectTrigger className="h-11 rounded-xl text-sm bg-background">
                      <SelectValue
                        placeholder={isArabic ? "اختر موعد الوردية..." : "Select shift..."}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        {isArabic ? "كافة الورديات (24 ساعة)" : "Any Shift (24 Hours)"}
                      </SelectItem>
                      <SelectItem value="morning">
                        <div className="flex items-center gap-2">
                          <Sun className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                          <span>{isArabic ? "صباحية (8 ص – 4 م)" : "Morning (8am - 4pm)"}</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="evening">
                        <div className="flex items-center gap-2">
                          <Sunset className="h-3.5 w-3.5 text-orange-500 shrink-0" />
                          <span>{isArabic ? "مسائية (4 م – 12 ص)" : "Evening (4pm - 12am)"}</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="night">
                        <div className="flex items-center gap-2">
                          <Moon className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                          <span>{isArabic ? "ليلية (12 ص – 8 ص)" : "Night (12am - 8am)"}</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Area / Location */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground block">
                    {isArabic ? "المنطقة / المحافظة" : "Location"}
                  </label>
                  <div className="relative">
                    <MapPin className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={
                        isArabic ? "مثال: التجمع، المعادي، الشيخ زايد" : "e.g. New Cairo, Maadi"
                      }
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
                    <span>{isArabic ? "ابحث عن مزود معتمد" : "Search Providers"}</span>
                  </Button>
                </div>
              </div>

              {/* Trust Micro-Row */}
              <div className="pt-3 border-t border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-3 text-xs text-muted-foreground">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                    <span>{isArabic ? "بطاقة رقم قومي مدققة" : "National ID Vetted"}</span>
                  </span>
                  <span className="hidden sm:inline text-border">•</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-success shrink-0" />
                    <span>{isArabic ? "دفع ضامن إلكتروني" : "Escrow Safeguard"}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 font-medium text-foreground">
                  <span className="text-warm-accent font-bold flex items-center gap-1 shrink-0">
                    <Star className="h-3.5 w-3.5 fill-warm-accent text-warm-accent" /> 4.95 / 5
                  </span>
                  <span className="text-muted-foreground text-[11px] sm:text-xs">
                    {isArabic ? "(من 3,800+ تقييم موثق)" : "(From 3,800+ Verified Reviews)"}
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
                    {isArabic ? "أخصائية مريم سمير • تمريض منزلي" : "Mariam Samir, RN • Home Care"}
                  </h4>
                  <Badge
                    variant="outline"
                    className="bg-success/10 text-success text-[10px] sm:text-[11px] border-success/30 font-medium shrink-0"
                  >
                    {isArabic ? "متاحة اليوم" : "Available Today"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isArabic
                    ? "الوردية القادمة: صباحية (8:00 ص – 4:00 م)"
                    : "Next Shift: Morning (8:00 AM – 4:00 PM)"}
                </p>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs mt-1 text-muted-foreground">
                  <span className="flex items-center gap-1 text-warm-accent font-semibold">
                    <Star className="h-3 w-3 fill-warm-accent text-warm-accent" /> 5.0 (148{" "}
                    {isArabic ? "تقييم" : "reviews"})
                  </span>
                  <span className="hidden sm:inline text-border">•</span>
                  <span className="text-primary font-semibold">
                    450 {isArabic ? "ج.م / وردية 8 ساعات" : "EGP / 8-hr Shift"}
                  </span>
                </div>
              </div>
            </div>

            <Button size="sm" asChild className="font-medium w-full sm:w-auto shrink-0 shadow-xs">
              <Link to="/register">
                <span>{isArabic ? "احجز هذه الوردية" : "Book This Shift"}</span>
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
              15,000+
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              {isArabic ? "وردية نُفذت باحترافية" : "Shifts Fulfilled"}
            </div>
          </div>

          <div className="space-y-1 border-s border-border/40">
            <div className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              1,250+
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              {isArabic ? "مزود خدمة معتمد ومدقق" : "Vetted Healthcare Aides"}
            </div>
          </div>

          <div className="space-y-1 border-t border-border/40 pt-4 sm:pt-0 md:border-t-0 md:border-s">
            <div className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              4.95 / 5
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              {isArabic ? "متوسط تقييمات العائلات" : "Client Satisfaction Score"}
            </div>
          </div>

          <div className="space-y-1 border-t border-s border-border/40 pt-4 sm:pt-0 md:border-t-0">
            <div className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              100%
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              {isArabic ? "حماية المدفوعات بالضمان" : "Escrow Payment Safety"}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
