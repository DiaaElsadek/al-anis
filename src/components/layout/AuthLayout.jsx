import { ArrowLeft, CheckCircle2, Clock, ShieldCheck, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, Outlet } from "react-router-dom";

import DirectionalIcon from "@/components/shared/DirectionalIcon";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import RatingStars from "@/components/shared/RatingStars";
import ThemeToggle from "@/components/shared/ThemeToggle";

export default function AuthLayout() {
  const { t } = useTranslation(["auth", "common"]);

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-background">
      {/* Brand Hero Panel (Desktop) */}
      <div className="relative hidden lg:flex lg:w-5/12 xl:w-1/2 flex-col justify-between overflow-hidden bg-slate-950 p-12 text-white border-e border-border/20">
        {/* Brand Header */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
              <ShieldCheck className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white">
                {t("common:brand.name")}
              </span>
              <span className="block text-[10px] font-medium text-slate-400">
                {t("common:brand.subtitle")}
              </span>
            </div>
          </Link>
        </div>

        {/* Center Hero Content */}
        <div className="relative z-10 my-auto py-10 max-w-lg">
          <h2 className="text-3xl xl:text-4xl font-bold tracking-tight leading-tight text-white mb-4">
            {t("auth:hero.headline")}
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
            {t("auth:hero.subtitle")}
          </p>

          {/* Value Prop List */}
          <div className="space-y-5 pt-2">
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-white">{t("auth:hero.benefit1Title")}</h4>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  {t("auth:hero.benefit1Desc")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-white">{t("auth:hero.benefit2Title")}</h4>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  {t("auth:hero.benefit2Desc")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-white">{t("auth:hero.benefit3Title")}</h4>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  {t("auth:hero.benefit3Desc")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Metrics */}
        <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-slate-300" />
            <span>
              <strong className="text-white font-semibold">{t("auth:hero.shiftsMetric")}</strong>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <RatingStars rating={5} size="h-3.5 w-3.5" />
            <span>
              <strong className="text-white font-semibold">{t("auth:hero.trustMetric")}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Main Form Area */}
      <div className="flex-1 flex flex-col justify-between p-4 sm:p-8 lg:p-12 overflow-y-auto bg-background">
        {/* Top bar */}
        <div className="flex items-center justify-between w-full max-w-2xl mx-auto mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <DirectionalIcon icon={ArrowLeft} className="h-4 w-4" />
            <span>{t("common:nav.backToHome")}</span>
          </Link>

          <div className="flex items-center gap-2.5">
            {/* Mobile brand header */}
            <div className="lg:hidden flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                <ShieldCheck className="h-4.5 w-4.5 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">{t("common:brand.name")}</span>
            </div>

            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-2xl mx-auto my-auto py-2">
          <Outlet />
        </div>

        {/* Bottom copyright */}
        <div className="w-full max-w-2xl mx-auto mt-8 pt-4 border-t border-border/40 text-center text-xs text-muted-foreground">
          {t("common:footer.copyright", { year: new Date().getFullYear() })}
        </div>
      </div>
    </div>
  );
}
