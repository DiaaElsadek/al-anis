import {
  FileCheck2,
  HeartHandshake,
  Lock,
  MapPin,
  PhoneCall,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import ThemeToggle from "@/components/shared/ThemeToggle";
import { Separator } from "@/components/ui/separator";

export default function LandingFooter() {
  const { t } = useTranslation(["landing", "common"]);

  return (
    <footer className="border-t border-border/80 bg-card/80 dark:bg-card relative overflow-hidden">
      {/* Subtle Top Accent Hairline */}
      <div
        className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      <div className="container max-w-6xl mx-auto px-4 py-12 md:py-16 space-y-12">
        {/* Top Institutional Trust Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 pb-8 sm:pb-10 border-b border-border/70">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-muted/30 border border-border/50">
            <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h5 className="font-semibold text-xs text-foreground">
                {t("landing:footer.escrowSafeguard")}
              </h5>
              <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                {t("landing:footer.escrowSubtitle")}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-muted/30 border border-border/50">
            <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
              <FileCheck2 className="h-5 w-5" />
            </div>
            <div>
              <h5 className="font-semibold text-xs text-foreground">
                {t("landing:footer.vettedAides")}
              </h5>
              <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                {t("landing:footer.vettedSubtitle")}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-muted/30 border border-border/50">
            <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
              <RefreshCw className="h-5 w-5" />
            </div>
            <div>
              <h5 className="font-semibold text-xs text-foreground">
                {t("landing:footer.replacementGuarantee")}
              </h5>
              <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                {t("landing:footer.replacementSubtitle")}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-muted/30 border border-border/50">
            <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <div>
              <h5 className="font-semibold text-xs text-foreground">
                {t("landing:footer.institutionalDignity")}
              </h5>
              <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                {t("landing:footer.institutionalSubtitle")}
              </p>
            </div>
          </div>
        </div>

        {/* Main 4 Footer Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Brand & Mission Column (4 cols) */}
          <div className="space-y-4 lg:col-span-4">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <img
                src="/favicon.svg"
                alt="Al-Anis Logo"
                className="h-9 w-9 rounded-xl shadow-xs transition-transform duration-200 group-hover:scale-105 object-contain"
              />
              <div className="flex flex-col">
                <span className="font-bold text-foreground text-lg tracking-tight">
                  {t("common:brand.name")}
                </span>
                <span className="text-[10px] font-medium text-muted-foreground">
                  {t("common:brand.subtitle")}
                </span>
              </div>
            </Link>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("landing:footer.aboutText")}
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/60 border border-border/60">
                <Lock className="h-3.5 w-3.5 text-success" />
                <span>{t("landing:footer.encryptionBadge")}</span>
              </span>
            </div>
          </div>

          {/* Quick Links For Families (3 cols) */}
          <div className="space-y-3.5 lg:col-span-3">
            <h4 className="text-sm font-semibold text-foreground">
              {t("landing:footer.forFamilies")}
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  to="/login?redirect=/app/providers"
                  className="hover:text-primary transition-colors"
                >
                  {t("landing:footer.findProviders")}
                </Link>
              </li>
              <li>
                <a href="#shifts" className="hover:text-primary transition-colors">
                  {t("landing:footer.shiftsAndPricing")}
                </a>
              </li>
              <li>
                <a href="#categories" className="hover:text-primary transition-colors">
                  {t("landing:footer.specialties")}
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-primary transition-colors">
                  {t("landing:footer.howBookingWorks")}
                </a>
              </li>
              <li>
                <Link to="/register" className="hover:text-primary transition-colors">
                  {t("landing:footer.createFamilyAccount")}
                </Link>
              </li>
            </ul>
          </div>

          {/* For Healthcare Professionals (2 cols) */}
          <div className="space-y-3.5 lg:col-span-2">
            <h4 className="text-sm font-semibold text-foreground">
              {t("landing:footer.forCaregivers")}
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/register" className="hover:text-primary transition-colors">
                  {t("landing:footer.joinAsCaregiver")}
                </Link>
              </li>
              <li>
                <a href="#why-alanis" className="hover:text-primary transition-colors">
                  {t("landing:footer.escrowPayouts")}
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-primary transition-colors">
                  {t("landing:footer.vettingRequirements")}
                </a>
              </li>
              <li>
                <Link to="/login" className="hover:text-primary transition-colors">
                  {t("landing:footer.providerLogin")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Hotline Card (3 cols) */}
          <div className="space-y-3.5 lg:col-span-3">
            <h4 className="text-sm font-semibold text-foreground">
              {t("landing:footer.helplineTitle")}
            </h4>

            {/* Elevated Hotline Card */}
            <div className="rounded-2xl bg-muted/40 border border-border/70 p-4 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <PhoneCall className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="text-[11px] font-medium text-muted-foreground block">
                    {t("landing:footer.centralHotline")}
                  </span>
                  <a
                    href="tel:19824"
                    className="font-mono text-xl font-bold text-foreground hover:text-primary transition-colors block"
                  >
                    19824
                  </a>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                {t("landing:footer.coordinationDesc")}
              </p>

              <div className="pt-2.5 border-t border-border/50 flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>{t("landing:footer.cities")}</span>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Bottom Bar: Copyright & Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>{t("common:footer.copyright", { year: new Date().getFullYear() })}</p>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <LanguageSwitcher compact />
              <ThemeToggle compact />
            </div>

            <span className="hidden sm:inline text-border">|</span>

            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-success" />
              <span>{t("common:footer.escrowBadge")}</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
