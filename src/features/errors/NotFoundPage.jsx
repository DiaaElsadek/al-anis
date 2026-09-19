import { Home, ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import DirectionalIcon from "@/components/shared/DirectionalIcon";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  const { t } = useTranslation(["errors", "common"]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 p-8">
        <div className="space-y-2">
          <h1 className="text-8xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-semibold text-foreground">{t("errors:pageNotFound")}</h2>
          <p className="text-muted-foreground max-w-md mx-auto">{t("errors:pageNotFoundDesc")}</p>
        </div>
        <div className="flex items-center justify-center gap-4">
          <Button variant="outline" onClick={() => window.history.back()}>
            <DirectionalIcon icon={ArrowLeft} className="h-4 w-4 me-2" />
            {t("errors:goBack")}
          </Button>
          <Button asChild>
            <Link to="/">
              <Home className="h-4 w-4 me-2" />
              {t("common:nav.home")}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
