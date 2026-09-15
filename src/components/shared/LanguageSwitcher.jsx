import { useTranslation } from "react-i18next";
import { Globe, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export default function LanguageSwitcher({ className, align = "end", compact = false }) {
  const { i18n, t } = useTranslation("common");
  const currentLang = i18n.language?.startsWith("ar") ? "ar" : "en";

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  const toggleLanguage = () => {
    const next = currentLang === "ar" ? "en" : "ar";
    handleLanguageChange(next);
  };

  if (compact) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleLanguage}
        className={cn(
          "h-9 px-2.5 rounded-lg text-xs font-semibold gap-1.5 hover:bg-muted/80 transition-colors",
          className
        )}
        title={t("language.toggle")}
      >
        <Globe className="h-4 w-4 text-muted-foreground" />
        <span>{currentLang === "ar" ? "English" : "العربية"}</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-9 px-2.5 rounded-lg text-xs font-semibold gap-1.5 hover:bg-muted/80 transition-colors border border-transparent hover:border-border/60",
            className
          )}
        >
          <Globe className="h-4 w-4 text-muted-foreground" />
          <span className="uppercase">{currentLang}</span>
          <span className="sr-only">{t("language.toggle")}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align={align} className="min-w-[130px] z-50">
        <DropdownMenuItem
          onClick={() => handleLanguageChange("en")}
          className="flex items-center justify-between gap-2 cursor-pointer font-medium"
        >
          <div className="flex items-center gap-2">
            <span className="h-5 w-5 rounded-md bg-muted text-foreground text-[10px] font-bold flex items-center justify-center border border-border/80">
              EN
            </span>
            <span>English</span>
          </div>
          {currentLang === "en" && <Check className="h-3.5 w-3.5 text-primary" />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleLanguageChange("ar")}
          className="flex items-center justify-between gap-2 cursor-pointer font-medium font-arabic"
        >
          <div className="flex items-center gap-2">
            <span className="h-5 w-5 rounded-md bg-muted text-foreground text-[10px] font-bold flex items-center justify-center border border-border/80">
              ع
            </span>
            <span>العربية</span>
          </div>
          {currentLang === "ar" && <Check className="h-3.5 w-3.5 text-primary" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
