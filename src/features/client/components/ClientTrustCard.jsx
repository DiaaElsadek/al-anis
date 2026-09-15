import { ShieldCheck, Lock, Headphones, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Card } from "@/components/ui/card";

export default function ClientTrustCard() {
  const { t, i18n } = useTranslation(["client", "common"]);
  const isArabic = i18n.language === "ar";

  const trustFeatures = [
    {
      icon: ShieldCheck,
      title: "100% ID Verified",
      titleAr: "هويات معتمدة وموثقة",
      desc: "Criminal background audited",
      descAr: "تدقيق أمني وسجل جنائي",
    },
    {
      icon: Lock,
      title: "Escrow Protection",
      titleAr: "حماية الضمان المالي",
      desc: "Funds held until shift completes",
      descAr: "أموالك بأمان حتى اكتمال الوردية",
    },
    {
      icon: Headphones,
      title: "24/7 Priority Support",
      titleAr: "دعم فني على مدار الساعة",
      desc: "Instant client care assistance",
      descAr: "مساعدة فورية طوال أيام الأسبوع",
    },
  ];

  return (
    <Card className="border-border/70 bg-muted/20 p-6 sm:p-8 rounded-3xl overflow-hidden relative shadow-xs">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 text-xs font-semibold">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>{isArabic ? "ضمان الأنيس للعميل" : "Alanis Client Guarantee"}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-foreground">
            {t("client:dashboard.trustTitle")}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {t("client:dashboard.trustDesc")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full lg:w-auto">
          {trustFeatures.map((feat, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-card border border-border/60 shadow-xs flex items-center gap-3"
            >
              <div className="h-10 w-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                <feat.icon className="h-5 w-5" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-foreground">
                  {isArabic ? feat.titleAr : feat.title}
                </h5>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {isArabic ? feat.descAr : feat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
