import { motion } from "framer-motion";
import { CheckCircle2, Lock, PhoneCall } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { fadeInUp, staggerContainer } from "@/lib/motion";

export default function CTASection() {
  const { t } = useTranslation(["landing", "common"]);

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="container max-w-5xl mx-auto px-4">
        <motion.div
          className="relative rounded-3xl overflow-hidden bg-primary text-primary-foreground p-6 sm:p-12 md:p-16 border border-white/15 shadow-xl text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer(0.12, 0.05)}
        >
          {/* Subtle Blueprint Pattern */}
          <svg
            className="absolute inset-0 w-full h-full text-white pointer-events-none opacity-[0.04]"
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

          <div className="relative z-10 space-y-5 sm:space-y-6 max-w-3xl mx-auto">
            {/* Headline with Clear Typography */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.2] text-balance">
                {t("landing:cta.title")}
              </h2>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              variants={fadeInUp}
              className="text-white/90 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed text-balance"
            >
              {t("landing:cta.subtitle")}
            </motion.p>

            {/* Primary & Secondary Action Buttons */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
            >
              <Button
                size="lg"
                asChild
                className="w-full sm:w-auto h-12 px-8 rounded-xl bg-white text-primary hover:bg-white/95 font-bold shadow-md transition-colors text-sm sm:text-base"
              >
                <Link to="/register">
                  <span>{t("landing:cta.bookShift")}</span>
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
              className="pt-6 border-t border-white/15 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto"
            >
              <div className="flex items-center justify-start gap-2.5 px-3.5 py-2.5 rounded-xl bg-white/[0.07] border border-white/10 text-xs text-white">
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-warm-accent shrink-0">
                  <Lock className="h-3.5 w-3.5" />
                </div>
                <div className="text-start">
                  <div className="font-semibold text-white">{t("landing:cta.escrowTitle")}</div>
                  <div className="text-[11px] text-white/70">{t("landing:cta.escrowSubtitle")}</div>
                </div>
              </div>

              <div className="flex items-center justify-start gap-2.5 px-3.5 py-2.5 rounded-xl bg-white/[0.07] border border-white/10 text-xs text-white">
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-emerald-300 shrink-0">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div className="text-start">
                  <div className="font-semibold text-white">{t("landing:cta.vettingTitle")}</div>
                  <div className="text-[11px] text-white/70">
                    {t("landing:cta.vettingSubtitle")}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-start gap-2.5 px-3.5 py-2.5 rounded-xl bg-white/[0.07] border border-white/10 text-xs text-white">
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-warm-accent shrink-0">
                  <PhoneCall className="h-3.5 w-3.5" />
                </div>
                <div className="text-start">
                  <div className="font-semibold text-white">{t("landing:cta.helplineTitle")}</div>
                  <div className="text-[11px] text-white/70">
                    {t("landing:cta.helplineSubtitle")}
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
