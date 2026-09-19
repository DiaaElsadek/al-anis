import { AnimatePresence, motion } from "framer-motion";
import { Check, CheckCircle2, Moon, Sun, Sunset } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getShiftDetails } from "@/features/landing/data";
import { fadeIn } from "@/lib/motion";
import { formatPrice } from "@/lib/utils";

export default function ShiftsSection({ isArabic }) {
  const [selectedShift, setSelectedShift] = useState("morning");
  const shiftDetails = getShiftDetails(isArabic);
  const activeShift = shiftDetails.find((s) => s.id === selectedShift) || shiftDetails[0];

  return (
    <section id="shifts" className="py-16 md:py-24 bg-muted/20 border-y border-border/70">
      <div className="container max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            {isArabic
              ? "لماذا الحجز بالوردية أفضل من عدّاد الساعات؟"
              : "Why Shift-Based Care Outperforms Hourly Meters"}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {isArabic
              ? "وداعاً للقلق من تزايد الساعات والمفاجآت المالية. نظام الوردية يوفر وقتاً كافياً للرعاية المستمرة بسعر ثابت وشفاف مسبقاً."
              : "Say goodbye to clock-watching and runaway overtime. Standardized 8-hour shifts guarantee dedicated focus with upfront pricing."}
          </p>
        </div>

        {/* Interactive Shift Tabs */}
        <Tabs value={selectedShift} onValueChange={setSelectedShift} className="w-full">
          <div className="flex justify-center">
            <TabsList className="h-12 p-1 rounded-xl bg-card border border-border/70 shadow-xs grid grid-cols-3 max-w-md w-full">
              <TabsTrigger
                value="morning"
                className="rounded-lg text-[11px] sm:text-sm font-semibold gap-1 sm:gap-1.5 px-1 sm:px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Sun className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                <span>{isArabic ? "صباحية" : "Morning"}</span>
              </TabsTrigger>
              <TabsTrigger
                value="evening"
                className="rounded-lg text-[11px] sm:text-sm font-semibold gap-1 sm:gap-1.5 px-1 sm:px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Sunset className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                <span>{isArabic ? "مسائية" : "Evening"}</span>
              </TabsTrigger>
              <TabsTrigger
                value="night"
                className="rounded-lg text-[11px] sm:text-sm font-semibold gap-1 sm:gap-1.5 px-1 sm:px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Moon className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                <span>{isArabic ? "ليلية" : "Night"}</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="mt-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeShift.id}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={fadeIn}
              >
                <Card className="border border-border/80 shadow-md bg-card overflow-hidden rounded-2xl">
                  <div className="p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-center">
                    <div className="space-y-5 lg:col-span-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <div
                          className={`p-2.5 sm:p-3 rounded-xl ${activeShift.bg} ${activeShift.color} border ${activeShift.border} shrink-0`}
                        >
                          <activeShift.icon className="h-6 w-6 sm:h-7 sm:w-7" />
                        </div>
                        <div>
                          <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                            {activeShift.title}
                          </h3>
                          <p className="text-xs sm:text-sm font-medium text-primary">
                            {activeShift.time}
                          </p>
                        </div>
                        <span className="ms-auto text-xs bg-muted text-foreground/80 px-2.5 py-1 rounded-md shrink-0">
                          {activeShift.badge}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground mb-1">
                          {isArabic ? "أبرز الاستخدامات والحالات:" : "Ideal Use Cases:"}
                        </h4>
                        <p className="text-sm text-foreground/90 leading-relaxed">
                          {activeShift.bestFor}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground mb-2">
                          {isArabic
                            ? "ما يشمله نطاق الوردية القياسي:"
                            : "What Is Covered In This Shift:"}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                          {activeShift.included.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-muted-foreground">
                              <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Booking Card for this shift */}
                    <div className="p-6 rounded-2xl bg-muted/40 border border-border/60 text-center space-y-4 flex flex-col justify-center">
                      <span className="text-xs font-medium text-muted-foreground block">
                        {isArabic ? "الأسعار الرسمية المعتمدة" : "Standardized Rate"}
                      </span>
                      <div>
                        <span className="text-3xl font-bold text-foreground">
                          {formatPrice(activeShift.startingRate)}
                        </span>
                        <span className="text-xs text-muted-foreground block mt-0.5">
                          {isArabic ? "لكل وردية 8 ساعات كاملة" : "per full 8-hour shift"}
                        </span>
                      </div>

                      <div className="text-xs text-muted-foreground space-y-2 bg-card p-3 rounded-xl border border-border/50 text-start">
                        <p className="flex items-center gap-2">
                          <Check className="h-3.5 w-3.5 text-success shrink-0" />
                          <span>
                            {isArabic
                              ? "ضمان استرداد فوري في حال الإلغاء"
                              : "100% Escrow protected refund"}
                          </span>
                        </p>
                        <p className="flex items-center gap-2">
                          <Check className="h-3.5 w-3.5 text-success shrink-0" />
                          <span>
                            {isArabic ? "تدقيق جنائي للرقم القومي" : "National ID vetted caregiver"}
                          </span>
                        </p>
                      </div>

                      <Button size="lg" asChild className="w-full font-semibold">
                        <Link to="/register">
                          <span>
                            {isArabic
                              ? "احجز وردية " + activeShift.title
                              : "Book " + activeShift.title}
                          </span>
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </Tabs>
      </div>
    </section>
  );
}
