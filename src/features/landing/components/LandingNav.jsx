import { Menu, PhoneCall, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import ThemeToggle from "@/components/shared/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function LandingNav() {
  const { t, i18n } = useTranslation(["landing", "common"]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isRtl = i18n.language?.startsWith("ar");

  return (
    <>
      {/* Top Value Assurance Ribbon */}
      <div className="bg-muted/60 border-b border-border/50 py-1.5 px-3 sm:px-4 text-[11px] sm:text-xs text-muted-foreground">
        <div className="container max-w-6xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 truncate">
            <span className="inline-flex items-center gap-1.5 text-success font-medium shrink-0">
              <ShieldCheck className="h-3.5 w-3.5" />
              {t("landing:nav.escrowRibbon")}
            </span>
            <span className="hidden sm:inline text-muted-foreground/40 shrink-0">•</span>
            <span className="hidden sm:inline truncate">{t("landing:nav.vettedRibbon")}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="flex items-center gap-1.5 font-medium">
              <PhoneCall className="h-3 w-3 text-primary" />
              <span className="font-mono">19824</span>
              <span className="hidden md:inline text-muted-foreground">
                ({t("landing:nav.helplineHours")})
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/90 backdrop-blur-md shadow-xs">
        <div className="container max-w-6xl mx-auto flex h-16 items-center justify-between gap-3 sm:gap-4">
          {/* Logo & Brand Identity */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <img
              src="/favicon.svg"
              alt="Al-Anis Logo"
              className="h-9 w-9 rounded-xl shadow-xs transition-transform duration-200 group-hover:scale-105 object-contain"
            />
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-foreground">
                {t("common:brand.name")}
              </span>
              <span className="text-[10px] font-medium text-muted-foreground hidden sm:block">
                {t("common:brand.subtitle")}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#shifts" className="hover:text-primary transition-colors">
              {t("landing:nav.shifts")}
            </a>
            <a href="#categories" className="hover:text-primary transition-colors">
              {t("landing:nav.categories")}
            </a>
            <a href="#why-alanis" className="hover:text-primary transition-colors">
              {t("landing:nav.whyAlanis")}
            </a>
            <a href="#how-it-works" className="hover:text-primary transition-colors">
              {t("landing:nav.howItWorks")}
            </a>
            <a href="#caregivers" className="hover:text-primary transition-colors">
              {t("landing:nav.caregivers")}
            </a>
            <a href="#faq" className="hover:text-primary transition-colors">
              {t("landing:nav.faq")}
            </a>
          </nav>

          {/* Action Cluster */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <LanguageSwitcher />
            <ThemeToggle />

            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild className="text-xs font-medium h-9">
                <Link to="/login">{t("common:nav.signIn")}</Link>
              </Button>
              <Button size="sm" asChild className="text-xs font-semibold h-9 shadow-xs">
                <Link to="/register">{t("common:nav.getStarted")}</Link>
              </Button>
            </div>

            {/* Mobile Navigation Sheet */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side={isRtl ? "right" : "left"}
                className="w-[290px] sm:w-80 p-5 sm:p-6 flex flex-col justify-between"
              >
                <div className="space-y-6">
                  <SheetHeader>
                    <SheetTitle className="text-start flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold">
                        <ShieldCheck className="h-4.5 w-4.5 text-primary-foreground" />
                      </div>
                      <span className="font-bold text-lg">{t("common:brand.name")}</span>
                    </SheetTitle>
                  </SheetHeader>

                  <nav className="flex flex-col gap-1.5 text-sm font-medium text-muted-foreground pt-4">
                    <a
                      href="#shifts"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2.5 rounded-lg hover:bg-muted hover:text-foreground transition-colors"
                    >
                      {t("landing:nav.shifts")}
                    </a>
                    <a
                      href="#categories"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2.5 rounded-lg hover:bg-muted hover:text-foreground transition-colors"
                    >
                      {t("landing:nav.categoriesMobile")}
                    </a>
                    <a
                      href="#why-alanis"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2.5 rounded-lg hover:bg-muted hover:text-foreground transition-colors"
                    >
                      {t("landing:nav.whyAlanis")}
                    </a>
                    <a
                      href="#how-it-works"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2.5 rounded-lg hover:bg-muted hover:text-foreground transition-colors"
                    >
                      {t("landing:nav.howItWorksMobile")}
                    </a>
                    <a
                      href="#caregivers"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2.5 rounded-lg hover:bg-muted hover:text-foreground transition-colors"
                    >
                      {t("landing:nav.caregiversMobile")}
                    </a>
                    <a
                      href="#faq"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2.5 rounded-lg hover:bg-muted hover:text-foreground transition-colors"
                    >
                      {t("landing:nav.faq")}
                    </a>
                  </nav>
                </div>

                <div className="space-y-2 pt-6 border-t border-border">
                  <Button asChild className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                    <Link to="/register">{t("common:nav.getStarted")}</Link>
                  </Button>
                  <Button
                    variant="outline"
                    asChild
                    className="w-full"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Link to="/login">{t("common:nav.signIn")}</Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}
