import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import CategoryIcon from "@/components/shared/CategoryIcon";
import { Card } from "@/components/ui/card";
import { FALLBACK_CATEGORIES } from "@/lib/constants";
import { getLocalizedCategoryName } from "@/lib/utils";

export default function ClientSpecialtiesGrid({ categories = [] }) {
  const { t, i18n } = useTranslation(["client", "common"]);

  const displayCategories = categories.length > 0 ? categories : FALLBACK_CATEGORIES;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-foreground">
            {t("client:dashboard.bookBySpecialty")}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("client:dashboard.bookBySpecialtySubtitle")}
          </p>
        </div>

        <Link
          to="/app/providers"
          className="text-xs font-semibold text-primary hover:underline inline-flex items-center"
        >
          <span>{t("common:actions.view")}</span>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {displayCategories.slice(0, 6).map((cat) => {
          const name = getLocalizedCategoryName(cat, i18n.language);

          return (
            <Link
              key={cat.id || name}
              to={`/app/providers?category=${cat.id || ""}`}
              className="group block"
            >
              <Card className="h-full border-border/70 group-hover:border-primary/50 group-hover:shadow-sm transition-colors duration-200 p-4 rounded-2xl text-center bg-card flex flex-col items-center justify-center space-y-2.5">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200 flex items-center justify-center shadow-xs">
                  <CategoryIcon icon={cat.icon} name={name} className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {name}
                  </h4>
                  <span className="text-[10px] text-muted-foreground block mt-0.5">
                    {t("client:directory.viewProfile")}
                  </span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

ClientSpecialtiesGrid.propTypes = {
  categories: PropTypes.array,
};
