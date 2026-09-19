import { Search } from "lucide-react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

export default function ClientWelcomeBanner({ user, profile }) {
  const { t, i18n } = useTranslation(["client", "common"]);
  const isArabic = i18n.language === "ar";

  const activeUser = profile || user;

  const displayName =
    activeUser?.fullName ||
    activeUser?.name ||
    (activeUser?.firstName && activeUser?.lastName
      ? `${activeUser.firstName} ${activeUser.lastName}`.trim()
      : activeUser?.firstName || activeUser?.email?.split("@")[0] || t("common:roles.client"));

  // Dynamic time greeting
  const hour = new Date().getHours();
  let timeGreeting = isArabic ? "صباح الخير،" : "Good morning,";
  if (hour >= 12 && hour < 18) {
    timeGreeting = isArabic ? "مساء الخير،" : "Good afternoon,";
  } else if (hour >= 18 || hour < 5) {
    timeGreeting = isArabic ? "مساء الخير،" : "Good evening,";
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          <span className="text-muted-foreground font-medium me-2">{timeGreeting}</span>
          <span>{displayName}</span>
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          {t("client:dashboard.welcomeSubtitle")}
        </p>
      </div>

      <Button
        asChild
        size="sm"
        className="font-semibold shadow-xs shrink-0 self-start sm:self-auto"
      >
        <Link to="/app/providers">
          <Search className="h-4 w-4 me-1.5" />
          <span>{t("client:dashboard.quickBook")}</span>
        </Link>
      </Button>
    </div>
  );
}

ClientWelcomeBanner.propTypes = {
  user: PropTypes.object,
  profile: PropTypes.object,
};
