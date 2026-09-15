import { ArrowRight, Check, CheckCircle2, Moon, Sun, Sunset } from "lucide-react";
import { Link } from "react-router-dom";

import DirectionalIcon from "@/components/shared/DirectionalIcon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getShiftDetails } from "@/features/landing/data";
import { formatPrice } from "@/lib/utils";

export default function ShiftsSection({ isArabic }) {
  const shiftDetails = getShiftDetails(isArabic);

  return (
    <section id="shifts" className="py-20 bg-muted/30 border-y border-border/70">
      <div className="container max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge variant="outline" className="text-xs text-primary border-primary/20">
            {isArabic ? "ابتكار الأنيس" : "The Shift Advantage"}
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            {isArabic
              ? "لماذا الحجز بالوردية أفضل من عدّاد الساعات؟"
              : "Why Shift-Based Care Outperforms Hourly Meters"}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            {isArabic
              ? "وداعاً للقلق من تزايد الساعات والمفاجآت المالية. نظام الوردية يوفر وقتاً كافياً للرعاية المستمرة بسعر ثابت وشفاف مسبقاً."
              : "Say goodbye to clock-watching and runaway overtime. Standardized 8-hour shifts guarantee dedicated focus with upfront pricing."}
          </p>
        </div>

        {/* Interactive Shift Tabs */}
        <Tabs defaultValue="morning" className="w-full">
          <div className="flex justify-center">
            <TabsList className="h-12 p-1 rounded-2xl bg-card border border-border/70 shadow-xs grid grid-cols-3 max-w-md w-full">
              <TabsTrigger
                value="morning"
                className="rounded-xl text-xs font-bold gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Sun className="h-4 w-4" />
                <span>{isArabic ? "صباحية" : "Morning"}</span>
              </TabsTrigger>
              <TabsTrigger
                value="evening"
                className="rounded-xl text-xs font-bold gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Sunset className="h-4 w-4" />
                <span>{isArabic ? "مسائية" : "Evening"}</span>
              </TabsTrigger>
              <TabsTrigger
                value="night"
                className="rounded-xl text-xs font-bold gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Moon className="h-4 w-4" />
                <span>{isArabic ? "ليلية" : "Night"}</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {shiftDetails.map((shift) => (
            <TabsContent key={shift.id} value={shift.id} className="mt-8">
              <Card className="border border-border/80 shadow-md bg-card overflow-hidden">
                <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                  <div className="space-y-4 lg:col-span-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-3 rounded-2xl ${shift.bg} ${shift.color} border ${shift.border}`}
                      >
                        <shift.icon className="h-7 w-7" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-foreground">{shift.title}</h3>
                        <p className="text-xs font-semibold text-primary">{shift.time}</p>
                      </div>
                      <Badge variant="secondary" className="ms-auto text-xs">
                        {shift.badge}
                      </Badge>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                        {isArabic ? "أبرز الاستخدامات والحالات:" : "Ideal Use Cases:"}
                      </h4>
                      <p className="text-sm text-foreground/90 leading-relaxed">{shift.bestFor}</p>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                        {isArabic
                          ? "ما يشمله نطاق الوردية القياسي:"
                          : "What Is Covered In This Shift:"}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {shift.included.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-muted-foreground">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Booking Card for this shift */}
                  <div className="p-6 rounded-2xl bg-muted/30 border border-border/60 text-center space-y-4 flex flex-col justify-center">
                    <span className="text-xs font-semibold text-muted-foreground block">
                      {isArabic ? "الأسعار الرسمية المعتمدة" : "Standardized Rate"}
                    </span>
                    <div>
                      <span className="text-3xl font-extrabold text-foreground">
                        {formatPrice(shift.startingRate)}
                      </span>
                      <span className="text-xs text-muted-foreground block mt-0.5">
                        {isArabic ? "لكل وردية 8 ساعات كاملة" : "per full 8-hour shift"}
                      </span>
                    </div>

                    <div className="text-[11px] text-muted-foreground space-y-1.5 bg-card/60 p-2.5 rounded-xl border border-border/50 text-start">
                      <p className="flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>
                          {isArabic
                            ? "ضمان استرداد فوري في حال الإلغاء"
                            : "100% Escrow protected refund"}
                        </span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>
                          {isArabic ? "تدقيق جنائي للرقم القومي" : "National ID vetted caregiver"}
                        </span>
                      </p>
                    </div>

                    <Button size="lg" asChild className="w-full font-bold">
                      <Link to="/register">
                        <span>
                          {isArabic ? "احجز وردية " + shift.title : "Book " + shift.title}
                        </span>
                        <DirectionalIcon icon={ArrowRight} className="h-4 w-4 ms-1.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
