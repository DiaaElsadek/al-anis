import {
  Activity,
  ArrowRight,
  Lock,
  MapPin,
  Moon,
  Search,
  ShieldCheck,
  Star,
  Sun,
  Sunset,
  UserCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

import CategoryIcon from "@/components/shared/CategoryIcon";
import DirectionalIcon from "@/components/shared/DirectionalIcon";
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
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28">
      {/* Ambient Lighting Mesh */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[720px] h-[400px] bg-gradient-to-tr from-primary/20 via-teal-500/10 to-emerald-400/5 blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="container max-w-6xl mx-auto space-y-10">
        {/* Top Eyebrow Pill */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-semibold shadow-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              {isArabic
                ? "المنصة الأولى المعتمدة لحجز الورديات في مصر"
                : "Egypt's #1 Verified Shift-Based Marketplace"}
            </span>
            <span className="text-muted-foreground/60">•</span>
            <span className="text-muted-foreground font-normal">
              {isArabic ? "حماية كاملة بالدفع الضامن" : "100% Escrow Protected"}
            </span>
          </div>
        </div>

        {/* Headline & Subhead */}
        <div className="text-center max-w-4xl mx-auto space-y-5">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.12] text-balance">
            {isArabic ? "رعاية وتمريض منزلي موثوق، " : "Verified Care & Healthcare Aides, "}
            <span className="bg-gradient-to-r from-primary via-teal-500 to-emerald-400 bg-clip-text text-transparent">
              {isArabic ? "محجوز بنظام الوردية." : "Booked by Shift."}
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed text-balance">
            {isArabic
              ? "تواصل مع ممرضين، وجليسات مسنين وأطفال، وأخصائيي علاج طبيعي معتمدين برقم قومي مدقق. أسعار ثابتة لكل وردية 8 ساعات دون مفاجآت مع حماية كاملة لأموالك بالدفع الضامن."
              : "Connect with certified nurses, elderly companions, babysitters, and rehab therapists. Fixed 8-hour shift rates, zero hidden overtime, and 100% digital escrow safety."}
          </p>
        </div>

        {/* Interactive Shift Explorer & Booking Console */}
        <div className="max-w-4xl mx-auto">
          <Card className="border border-border/80 shadow-xl shadow-primary/5 bg-card/95 backdrop-blur-md rounded-3xl p-3 sm:p-5">
            <form onSubmit={handleConsoleSearch} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Category Select */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                    {isArabic ? "التخصص المطلوب" : "Specialty"}
                  </label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="h-11 rounded-xl text-xs bg-background">
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
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                    {isArabic ? "موعد الوردية" : "Shift Time"}
                  </label>
                  <Select value={selectedShift} onValueChange={setSelectedShift}>
                    <SelectTrigger className="h-11 rounded-xl text-xs bg-background">
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
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
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
                      className="ps-9 h-11 rounded-xl text-xs bg-background"
                    />
                  </div>
                </div>

                {/* Search Submit */}
                <div className="flex flex-col justify-end">
                  <Button
                    type="submit"
                    className="h-11 rounded-xl text-xs font-bold gap-2 shadow-md shadow-primary/20 w-full"
                  >
                    <Search className="h-4 w-4" />
                    <span>{isArabic ? "ابحث عن مزود معتمد" : "Search Providers"}</span>
                  </Button>
                </div>
              </div>

              {/* Trust Micro-Row */}
              <div className="pt-2 border-t border-border/50 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    <span>{isArabic ? "بطاقة رقم قومي مدققة" : "National ID Vetted"}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-emerald-600" />
                    <span>{isArabic ? "دفع ضامن إلكتروني" : "Escrow Safeguard"}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 font-medium text-foreground">
                  <span className="text-amber-500 font-bold flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-500" /> 4.95 / 5
                  </span>
                  <span className="text-muted-foreground">
                    {isArabic ? "(من أكثر من 3,800 تقييم موثق)" : "(From 3,800+ Verified Reviews)"}
                  </span>
                </div>
              </div>
            </form>
          </Card>
        </div>

        {/* Floating Live Simulation Card Preview */}
        <div className="max-w-3xl mx-auto pt-4">
          <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-card via-card/90 to-primary/5 border border-border/80 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-14 w-14 rounded-2xl border-2 border-primary/30">
                  <AvatarImage src="https://images.unsplash.com/photo-1594824813576-809d43501a30?w=200&auto=format&fit=crop&q=80" />
                  <AvatarFallback className="rounded-2xl font-bold bg-primary/10 text-primary">
                    MS
                  </AvatarFallback>
                </Avatar>
                <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-background" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-foreground">
                    {isArabic ? "أخصائية مريم سمير • تمريض منزلي" : "Mariam Samir, RN • Home Care"}
                  </h4>
                  <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] border-emerald-500/20">
                    {isArabic ? "متاحة اليوم" : "Available Today"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isArabic
                    ? "الوردية القادمة: صباحية (8:00 ص – 4:00 م)"
                    : "Next Shift: Morning (8:00 AM – 4:00 PM)"}
                </p>
                <div className="flex items-center gap-3 text-xs mt-1 text-muted-foreground">
                  <span className="flex items-center gap-1 text-amber-500 font-semibold">
                    <Star className="h-3 w-3 fill-amber-500" /> 5.0 (148{" "}
                    {isArabic ? "تقييم" : "reviews"})
                  </span>
                  <span>•</span>
                  <span className="text-primary font-bold">
                    450 {isArabic ? "ج.م / وردية 8 ساعات" : "EGP / 8-hr Shift"}
                  </span>
                </div>
              </div>
            </div>

            <Button size="sm" asChild className="font-semibold shadow-sm w-full sm:w-auto shrink-0">
              <Link to="/register">
                <span>{isArabic ? "احجز هذه الوردية" : "Book This Shift"}</span>
                <DirectionalIcon icon={ArrowRight} className="h-3.5 w-3.5 ms-1.5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* 4 Pillar Platform Metrics Counters */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          <Card className="border-border/70 shadow-xs text-center p-5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2">
              <Activity className="h-5 w-5" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              15,000+
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isArabic ? "وردية نُفذت باحترافية" : "Shifts Fulfilled"}
            </p>
          </Card>

          <Card className="border-border/70 shadow-xs text-center p-5">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto mb-2">
              <UserCheck className="h-5 w-5" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              1,250+
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isArabic ? "مزود خدمة معتمد ومدقق" : "Vetted Healthcare Aides"}
            </p>
          </Card>

          <Card className="border-border/70 shadow-xs text-center p-5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto mb-2">
              <Star className="h-5 w-5 fill-amber-500" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              4.95 / 5
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isArabic ? "متوسط تقييمات العائلات" : "Client Satisfaction Score"}
            </p>
          </Card>

          <Card className="border-border/70 shadow-xs text-center p-5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto mb-2">
              <Lock className="h-5 w-5" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              100%
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isArabic ? "حماية المدفوعات بالضمان" : "Escrow Payment Safety"}
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}
