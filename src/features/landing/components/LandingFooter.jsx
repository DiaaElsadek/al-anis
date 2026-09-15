import { Lock, MapPin, PhoneCall, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import ThemeToggle from "@/components/shared/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function LandingFooter({ isArabic }) {
  const { t } = useTranslation(["common"]);

  return (
    <footer className="border-t border-border/80 bg-card/60 py-14">
      <div className="container max-w-6xl mx-auto space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand column */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold">
                <ShieldCheck className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-foreground text-lg">
                  {t("common:brand.name")}
                </span>
                <span className="text-[10px] text-muted-foreground block -mt-0.5">
                  {t("common:brand.subtitle")}
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isArabic
                ? "المنصة الأولى المعتمدة في مصر لحجز خدمات التمريض والرعاية المنزلية بنظام الوردية مع الحماية الكاملة بالدفع الضامن."
                : "Egypt's premier shift-based marketplace connecting verified caregivers with families under 100% escrow protection."}
            </p>
            <div className="flex items-center gap-2 pt-1">
              <Badge
                variant="outline"
                className="text-[10px] text-emerald-600 border-emerald-500/20"
              >
                {isArabic ? "معتمد وموثق" : "Verified Security"}
              </Badge>
            </div>
          </div>

          {/* Quick Links For Clients */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
              {isArabic ? "للأسر والعملاء" : "For Families"}
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link
                  to="/login?redirect=/app/providers"
                  className="hover:text-foreground transition-colors"
                >
                  {isArabic ? "البحث عن مزودين" : "Find Providers"}
                </Link>
              </li>
              <li>
                <a href="#shifts" className="hover:text-foreground transition-colors">
                  {isArabic ? "مفهوم الورديات والأسعار" : "Shift System & Pricing"}
                </a>
              </li>
              <li>
                <a href="#categories" className="hover:text-foreground transition-colors">
                  {isArabic ? "التخصصات المتاحة" : "Available Specialties"}
                </a>
              </li>
              <li>
                <Link to="/register" className="hover:text-foreground transition-colors">
                  {isArabic ? "إنشاء حساب عميل" : "Create Family Account"}
                </Link>
              </li>
            </ul>
          </div>

          {/* For Providers */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
              {isArabic ? "لمزودي الرعاية" : "For Caregivers"}
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link to="/register" className="hover:text-foreground transition-colors">
                  {isArabic ? "الانضمام كمزود خدمة" : "Apply as Provider"}
                </Link>
              </li>
              <li>
                <a href="#why-alanis" className="hover:text-foreground transition-colors">
                  {isArabic ? "مزايا الدفع الضامن" : "Escrow Earnings"}
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-foreground transition-colors">
                  {isArabic ? "شروط التدقيق والاعتماد" : "Vetting Requirements"}
                </a>
              </li>
              <li>
                <Link to="/login" className="hover:text-foreground transition-colors">
                  {isArabic ? "دخول بوابة المزود" : "Provider Portal Login"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Hotline */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
              {isArabic ? "الأمان والمساعدة" : "Trust & Helpline"}
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <PhoneCall className="h-3.5 w-3.5 text-primary" />
                <span className="font-mono font-bold text-foreground">19824</span>
                <span>({isArabic ? "الخط الساخن" : "Hotline"})</span>
              </li>
              <li className="flex items-center gap-2">
                <Lock className="h-3.5 w-3.5 text-emerald-600" />
                <span>{isArabic ? "حماية الضمان 100%" : "100% Escrow Protection"}</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span>{isArabic ? "القاهرة، جمهورية مصر العربية" : "Cairo, Egypt"}</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>{t("common:footer.copyright", { year: new Date().getFullYear() })}</p>
          <div className="flex items-center gap-3">
            <LanguageSwitcher compact />
            <ThemeToggle compact />
            <span>{t("common:footer.escrowBadge")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
