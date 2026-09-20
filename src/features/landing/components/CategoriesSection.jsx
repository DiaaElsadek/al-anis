import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

import CategoryIcon from "@/components/shared/CategoryIcon";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import {
  formatPrice,
  getLocalizedCategoryDescription,
  getLocalizedCategoryName,
} from "@/lib/utils";

export default function CategoriesSection({ categories }) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(["landing", "common"]);

  return (
    <section id="categories" className="py-16 md:py-24">
      <div className="container max-w-6xl mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              {t("landing:categories.title")}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
              {t("landing:categories.subtitle")}
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            asChild
            className="self-start sm:self-auto font-medium"
          >
            <Link to="/register">
              <span>{t("landing:categories.viewAll")}</span>
            </Link>
          </Button>
        </div>

        {/* Mobile Horizontal Scroll Strip / Desktop Responsive Grid */}
        <motion.div
          className="flex overflow-x-auto pb-4 pt-1 sm:pb-0 gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer(0.08, 0.05)}
        >
          {categories.map((cat) => {
            const localizedName = getLocalizedCategoryName(cat, i18n.language);
            const secondaryName = i18n.language?.startsWith("ar") ? cat.nameEn : cat.name;
            const desc = getLocalizedCategoryDescription(cat, i18n.language);
            const startingPrice = cat.startingPrice || 350;

            return (
              <motion.div
                key={cat.id}
                variants={fadeInUp}
                className="w-[280px] shrink-0 sm:w-auto snap-center"
              >
                <Card
                  className="h-full border border-border/80 shadow-xs hover:border-primary/40 transition-colors duration-200 cursor-pointer group rounded-2xl bg-card"
                  onClick={() => navigate(`/login?redirect=/app/providers&cat=${cat.id}`)}
                >
                  <CardContent className="p-5 sm:p-6 flex flex-col justify-between h-full space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-11 h-11 rounded-xl bg-primary/8 text-primary flex items-center justify-center transition-colors group-hover:bg-primary/12">
                          <CategoryIcon icon={cat.icon} name={cat.name} className="h-5 w-5" />
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors">
                          {localizedName}
                        </h3>
                        {secondaryName && (
                          <p className="text-xs text-muted-foreground mt-0.5">{secondaryName}</p>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {desc || t("landing:categories.defaultDesc")}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-border/50 flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-muted-foreground">
                        {t("landing:categories.fromPrice")}{" "}
                        <strong className="text-foreground font-semibold">
                          {formatPrice(startingPrice)}
                        </strong>
                      </span>
                      <span className="font-medium text-primary">
                        <span>{t("landing:categories.bookProvider")}</span>
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
