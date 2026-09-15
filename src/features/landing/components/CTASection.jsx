import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function CTASection({ isArabic }) {
  const { t } = useTranslation(["common"]);

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container max-w-4xl mx-auto">
        <div className="relative rounded-3xl bg-gradient-to-br from-primary via-teal-800 to-slate-950 p-8 sm:p-14 text-center text-white overflow-hidden shadow-2xl">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-emerald-400/20 blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
            <Badge className="bg-white/15 text-white border-white/20 text-xs px-3 py-1">
              {isArabic
                ? "انضم لأكبر مجتمع رعاية موثوق في مصر"
                : "Join Egypt's Leading Care Network"}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {isArabic
                ? "جاهز لحجز وردية رعاية مضمونة لأحبائك؟"
                : "Ready to reserve your first verified shift?"}
            </h2>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed">
              {isArabic
                ? "سجل حسابك مجاناً في دقيقتين. تصفح أطقم الرعاية والتمريض المعتمدين، وحدد الوردية، ودعنا نتكفل بحماية أموالك وراحتك."
                : "Sign up in 2 minutes. Browse vetted healthcare aides, select your 8-hour shift, and enjoy 100% escrow protected dignified care."}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <Button
                size="lg"
                asChild
                className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 font-bold shadow-xl h-12 px-8"
              >
                <Link to="/register">
                  {isArabic ? "احجز وردية الآن" : "Book a Caregiver Shift"}
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="w-full sm:w-auto border-white/40 text-white hover:bg-white/10 h-12 px-8"
              >
                <Link to="/login">{t("common:nav.signIn")}</Link>
              </Button>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-white/80">
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>{isArabic ? "بدون عمولات خفية" : "No hidden broker fees"}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>{isArabic ? "حماية الضمان 100%" : "100% Escrow guarantee"}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>{isArabic ? "دعم على مدار الساعة" : "24/7 Support line"}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
