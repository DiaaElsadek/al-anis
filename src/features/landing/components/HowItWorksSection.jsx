import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fadeInUp, staggerContainer } from "@/lib/motion";

export default function HowItWorksSection({ isArabic }) {
  const [activeTab, setActiveTab] = useState("clients");

  const clientSteps = [
    {
      num: 1,
      title: isArabic ? "ابحث واختر الوردية" : "Select Shift & Caregiver",
      desc: isArabic
        ? "تصفح أطقم التمريض والرعاية المعتمدة، واطلع على تقييمات العملاء وجدول الورديات المتاح، وحدد موعدك."
        : "Filter audited caregivers by specialty, read verified client reviews, and choose your preferred 8-hour shift.",
    },
    {
      num: 2,
      title: isArabic ? "سداد إلكتروني بحساب الضمان" : "Secure Escrow Checkout",
      desc: isArabic
        ? "ادفع بأمان عبر بطاقتك. يحتفظ حساب الضمان بالمبلغ كاملاً، ولا يُحوّل للمزود إلا بعد إتمام الوردية ورضاك."
        : "Pay safely online. Your funds remain 100% safeguarded in platform escrow until the shift is completed satisfactorily.",
    },
    {
      num: 3,
      title: isArabic ? "تنفيذ الوردية والتقييم" : "Care Delivered & Review",
      desc: isArabic
        ? "نسق التعليمات عبر المحادثة الفورية. بعد اكتمال الوردية، أكد الاستلام وانشر تقييمك لمساعدة باقي الأسر."
        : "Coordinate instructions via real-time chat. Once care is delivered, confirm completion and leave your review.",
    },
  ];

  const providerSteps = [
    {
      num: 1,
      title: isArabic ? "سجل وارفع شهاداتك" : "Apply & Submit Credentials",
      desc: isArabic
        ? "سجل حسابك مجاناً وارفع صورة الرقم القومي وتراخيص مزاولة المهنة لمراجعتها من فريق الامتثال."
        : "Create your free provider account and upload your National ID and healthcare certificates for audit.",
    },
    {
      num: 2,
      title: isArabic ? "حدد جدول وردياتك ومناطقك" : "Set Availability & Areas",
      desc: isArabic
        ? "اختر الأيام والورديات (صباحية، مسائية، ليلية) والمناطق الجغرافية التي ترغب في العمل بها بكل حرية."
        : "Choose open shift slots (Morning, Evening, Night) and geographical neighborhoods that match your schedule.",
    },
    {
      num: 3,
      title: isArabic ? "نفذ الوردية واستلم أرباحك" : "Fulfill Shifts & Instant Payout",
      desc: isArabic
        ? "استقبل طلبات الحجز المباشرة، ونفذ الرعاية باحترافية، واستلم مستحقاتك فوراً من حساب الضمان دون تأخير."
        : "Receive direct booking alerts, deliver compassionate care, and receive guaranteed instant escrow payouts.",
    },
  ];

  const currentSteps = activeTab === "clients" ? clientSteps : providerSteps;

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-muted/30">
      <div className="container max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge variant="outline" className="text-xs text-primary border-primary/20 font-medium">
            {isArabic ? "خطوات واضحة" : "Simple Progression"}
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            {isArabic ? "كيف تعمل المنصة في 3 خطوات" : "How Alanis Works in 3 Clear Steps"}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {isArabic
              ? "تجربة مصممة لتوفير أعلى درجات السلاسة والاطمئنان سواء كنت تطلب الرعاية أو تقدمها."
              : "Designed for absolute transparency whether you are booking care for family or offering your skills."}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center">
            <TabsList className="h-11 rounded-xl bg-muted p-1 border border-border/70">
              <TabsTrigger
                value="clients"
                className="rounded-lg text-xs sm:text-sm font-medium px-5 sm:px-7"
              >
                {isArabic ? "للعملاء والأسر" : "For Families & Clients"}
              </TabsTrigger>
              <TabsTrigger
                value="providers"
                className="rounded-lg text-xs sm:text-sm font-medium px-5 sm:px-7"
              >
                {isArabic ? "لمزودي الخدمة والأطقم الطبية" : "For Healthcare Aides"}
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="mt-12 relative max-w-3xl mx-auto">
            {/* Connecting Timeline Rule */}
            <div
              className="absolute start-5 top-5 bottom-5 w-0.5 bg-border md:start-1/2 md:-translate-x-1/2"
              aria-hidden="true"
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={staggerContainer(0.12, 0.05)}
                className="space-y-8 md:space-y-12"
              >
                {currentSteps.map((step, idx) => {
                  const isEven = idx % 2 === 1;

                  return (
                    <motion.div
                      key={step.num}
                      variants={fadeInUp}
                      className="relative flex flex-col md:flex-row items-start md:items-center"
                    >
                      {/* Step Number Circle */}
                      <div className="absolute start-0 md:start-1/2 md:-translate-x-1/2 top-0 md:top-1/2 md:-translate-y-1/2 w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center border-4 border-background shadow-xs z-10">
                        {step.num}
                      </div>

                      {/* Content Card */}
                      <div
                        className={`w-full ps-14 md:ps-0 md:w-[calc(50%-2.25rem)] ${
                          isEven ? "md:ms-auto md:text-start" : "md:me-auto md:text-start"
                        }`}
                      >
                        <Card className="border border-border/80 shadow-xs rounded-2xl bg-card hover:border-primary/30 transition-colors">
                          <CardContent className="p-5 sm:p-6 space-y-2">
                            <span className="text-xs font-semibold text-primary">
                              {isArabic ? `المرحلة 0${step.num}` : `Step 0${step.num}`}
                            </span>
                            <h3 className="text-base sm:text-lg font-bold text-foreground">
                              {step.title}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {step.desc}
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </Tabs>
      </div>
    </section>
  );
}
