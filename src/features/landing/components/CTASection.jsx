import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Lock, PhoneCall, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import DirectionalIcon from "@/components/shared/DirectionalIcon";
import { Button } from "@/components/ui/button";
import { fadeInUp, staggerContainer } from "@/lib/motion";

export default function CTASection({ isArabic }) {
  const { t } = useTranslation(["common"]);

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="container max-w-5xl mx-auto px-4">
        <motion.div
          className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-primary to-[hsl(192,80%,16%)] dark:from-[hsl(192,75%,30%)] dark:to-[hsl(192,80%,18%)] text-primary-foreground p-8 sm:p-12 md:p-16 border border-white/15 shadow-2xl text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer(0.12, 0.05)}
        >
          {/* Subtle Ambient Glows */}
          <div
            className="absolute -top-32 left-1/2 -translate-x-1/2 w-[550px] h-[300px] bg-white/10 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-24 -end-24 w-72 h-72 rounded-full bg-warm-accent/15 blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          {/* Delicate Geometric Blueprint Pattern */}
          <svg
            className="absolute inset-0 w-full h-full text-white pointer-events-none opacity-[0.05]"
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            aria-hidden="true"
          >
            <defs>
              <pattern id="cta-grid" width="36" height="36" patternUnits="userSpaceOnUse">
                <path
                  d="M0 36L36 0M0 0l36 36"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.75"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cta-grid)" />
          </svg>

          <div className="relative z-10 space-y-7 max-w-3xl mx-auto">
            {/* Top Assurance Pill */}
            <motion.div variants={fadeInUp} className="inline-flex justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium text-white shadow-xs">
                <ShieldCheck className="h-4 w-4 text-warm-accent" />
                <span>
                  {isArabic
                    ? "حماية الضمان 100% • كوادر معتمدة بالرقم القومي"
                    : "100% Escrow Safeguarded • National ID Vetted Aides"}
                </span>
              </div>
            </motion.div>

            {/* Headline with High-Contrast Typography & Accent */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.2] text-balance">
                {isArabic ? "جاهز لحجز " : "Ready to book "}
                <span className="relative inline-block font-extrabold text-white">
                  <span className="relative z-10">
                    {isArabic ? "وردية رعاية موثوقة" : "trusted shift-based care"}
                  </span>
                  <span
                    className="absolute -bottom-1 inset-x-0 h-2.5 bg-warm-accent/30 rounded-full -z-0"
                    aria-hidden="true"
                  />
                </span>
                {isArabic ? " لأحبائك؟" : " for your family?"}
              </h2>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              variants={fadeInUp}
              className="text-white/85 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed text-balance"
            >
              {isArabic
                ? "سجل حسابك في دقيقتين. تصفح أطقم التمريض والرعاية المعتمدة، وحدد الوردية المناسبة، ودعنا نتكفل بحماية أموالك بالدفع الضامن وضمان الاستبدال الفوري."
                : "Sign up in 2 minutes. Browse vetted healthcare aides, select your 8-hour shift, and enjoy 100% escrow protection with guaranteed caregiver replacement."}
            </motion.p>

            {/* Primary & Secondary Action Buttons */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2"
            >
              <Button
                size="lg"
                asChild
                className="w-full sm:w-auto h-12 px-8 rounded-xl bg-white text-primary hover:bg-white/95 font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm sm:text-base gap-2 group"
              >
                <Link to="/register">
                  <span>{isArabic ? "احجز وردية الآن" : "Book a Caregiver Shift"}</span>
                  <DirectionalIcon
                    icon={ArrowRight}
                    className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                  />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="w-full sm:w-auto h-12 px-7 rounded-xl border-white/30 text-white hover:bg-white/10 hover:border-white/50 font-semibold text-sm sm:text-base"
              >
                <Link to="/login">{t("common:nav.signIn")}</Link>
              </Button>
            </motion.div>

            {/* Micro-Trust Pillars (Elevated Glass Cards) */}
            <motion.div
              variants={fadeInUp}
              className="pt-6 border-t border-white/15 grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-2xl mx-auto"
            >
              <div className="flex items-center justify-center sm:justify-start gap-2.5 px-3.5 py-2.5 rounded-xl bg-white/[0.07] border border-white/10 text-xs text-white">
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-warm-accent shrink-0">
                  <Lock className="h-3.5 w-3.5" />
                </div>
                <div className="text-start">
                  <div className="font-semibold text-white">
                    {isArabic ? "دفع ضامن 100%" : "100% Escrow Protection"}
                  </div>
                  <div className="text-[11px] text-white/70">
                    {isArabic ? "لا يُصرف المال إلا بعد رضاك" : "Released only upon satisfaction"}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-2.5 px-3.5 py-2.5 rounded-xl bg-white/[0.07] border border-white/10 text-xs text-white">
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-emerald-300 shrink-0">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div className="text-start">
                  <div className="font-semibold text-white">
                    {isArabic ? "فحص جنائي وتراخيص" : "Vetted National ID"}
                  </div>
                  <div className="text-[11px] text-white/70">
                    {isArabic ? "مراجعة شاملة للأوراق" : "Criminal & license audits"}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-2.5 px-3.5 py-2.5 rounded-xl bg-white/[0.07] border border-white/10 text-xs text-white">
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-warm-accent shrink-0">
                  <PhoneCall className="h-3.5 w-3.5" />
                </div>
                <div className="text-start">
                  <div className="font-semibold text-white">
                    {isArabic ? "الخط الساخن: 19824" : "Helpline: 19824"}
                  </div>
                  <div className="text-[11px] text-white/70">
                    {isArabic ? "دعم وتنسيق على مدار الساعة" : "24/7 Coordinator support"}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
