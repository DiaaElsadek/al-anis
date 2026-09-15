import { Menu, PhoneCall, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import ThemeToggle from "@/components/shared/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function LandingNav({ isArabic }) {
  const { t } = useTranslation(["common", "auth", "client"]);

  return (
    <>
      {/* Top Value Assurance Ribbon */}
      <div className="bg-muted/80 border-b border-border/60 py-1.5 px-4 text-[11px] font-medium text-muted-foreground">
        <div className="container max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold">
              <ShieldCheck className="h-3.5 w-3.5" />
              {isArabic ? "حماية الضمان 100%" : "100% Escrow Protected"}
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">
              {isArabic
                ? "فحص جنائي ورقم قومي معتمد لكافة المزودين"
                : "Criminal & National ID Vetted Providers"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <PhoneCall className="h-3 w-3 text-primary" />
              <span className="font-mono">19824</span>
              <span className="hidden md:inline">
                ({isArabic ? "دعم على مدار الساعة" : "24/7 Helpline"})
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Sticky Glassmorphic Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/85 backdrop-blur-md shadow-xs">
        <div className="container max-w-6xl mx-auto flex h-16 items-center justify-between gap-4">
          {/* Logo & Brand Identity */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-primary via-teal-600 to-emerald-400 flex items-center justify-center text-primary-foreground shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
                  {t("common:brand.name")}
                </span>
                <Badge
                  variant="outline"
                  className="text-[10px] px-1.5 py-0 h-4 font-normal text-primary border-primary/20"
                >
                  {isArabic ? "منصة مصرية" : "Egypt"}
                </Badge>
              </div>
              <span className="text-[10px] font-medium text-muted-foreground tracking-wider -mt-0.5 uppercase hidden sm:block">
                {t("common:brand.subtitle")}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-muted-foreground">
            <a href="#shifts" className="hover:text-primary transition-colors">
              {isArabic ? "نظام الورديات" : "Shift System"}
            </a>
            <a href="#categories" className="hover:text-primary transition-colors">
              {isArabic ? "التخصصات" : "Specialties"}
            </a>
            <a href="#why-alanis" className="hover:text-primary transition-colors">
              {isArabic ? "لماذا الأنيس" : "Why Alanis"}
            </a>
            <a href="#how-it-works" className="hover:text-primary transition-colors">
              {isArabic ? "كيف تعمل" : "How It Works"}
            </a>
            <a href="#caregivers" className="hover:text-primary transition-colors">
              {isArabic ? "أطقم الرعاية" : "Caregivers"}
            </a>
            <a href="#faq" className="hover:text-primary transition-colors">
              {isArabic ? "الأسئلة الشائعة" : "FAQ"}
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
              <Button
                size="sm"
                asChild
                className="text-xs font-semibold h-9 shadow-sm shadow-primary/20"
              >
                <Link to="/register">{t("common:nav.getStarted")}</Link>
              </Button>
            </div>

            {/* Mobile Navigation Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side={isArabic ? "right" : "left"}
                className="w-80 p-6 flex flex-col justify-between"
              >
                <div className="space-y-6">
                  <SheetHeader>
                    <SheetTitle className="text-start flex items-center gap-2">
                      <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold">
                        <ShieldCheck className="h-5 w-5 text-white" />
                      </div>
                      <span className="font-bold text-lg">{t("common:brand.name")}</span>
                    </SheetTitle>
                  </SheetHeader>

                  <nav className="flex flex-col gap-3 text-sm font-medium text-muted-foreground pt-4">
                    <a
                      href="#shifts"
                      className="p-2 rounded-lg hover:bg-muted/50 hover:text-foreground"
                    >
                      {isArabic ? "نظام الورديات" : "Shift System"}
                    </a>
                    <a
                      href="#categories"
                      className="p-2 rounded-lg hover:bg-muted/50 hover:text-foreground"
                    >
                      {isArabic ? "التخصصات الخدمية" : "Specialties"}
                    </a>
                    <a
                      href="#why-alanis"
                      className="p-2 rounded-lg hover:bg-muted/50 hover:text-foreground"
                    >
                      {isArabic ? "لماذا الأنيس" : "Why Alanis"}
                    </a>
                    <a
                      href="#how-it-works"
                      className="p-2 rounded-lg hover:bg-muted/50 hover:text-foreground"
                    >
                      {isArabic ? "كيف تعمل المنصة" : "How It Works"}
                    </a>
                    <a
                      href="#caregivers"
                      className="p-2 rounded-lg hover:bg-muted/50 hover:text-foreground"
                    >
                      {isArabic ? "أطقم الرعاية المعتمدة" : "Caregivers"}
                    </a>
                    <a
                      href="#faq"
                      className="p-2 rounded-lg hover:bg-muted/50 hover:text-foreground"
                    >
                      {isArabic ? "الأسئلة الشائعة" : "FAQ"}
                    </a>
                  </nav>
                </div>

                <div className="space-y-2 pt-6 border-t border-border">
                  <Button asChild className="w-full">
                    <Link to="/register">{t("common:nav.getStarted")}</Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full">
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
