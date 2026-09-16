import { motion } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import CategoryIcon from "@/components/shared/CategoryIcon";
import DirectionalIcon from "@/components/shared/DirectionalIcon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { formatPrice, getLocalizedCategoryName } from "@/lib/utils";

export default function CategoriesSection({ isArabic, categories }) {
  const navigate = useNavigate();

  return (
    <section id="categories" className="py-16 md:py-24">
      <div className="container max-w-6xl mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <Badge variant="outline" className="text-xs text-primary border-primary/20 font-medium">
              {isArabic ? "تخصصات الرعاية المعتمدة" : "Care Specialties"}
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              {isArabic
                ? "تخصصات الرعاية والخدمات المنزلية"
                : "Verified In-Home Healthcare & Aides"}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
              {isArabic
                ? "اختر التخصص المطلوب لاستعراض الكوادر الطبية والمساعدين المتاحين للحجز الفوري."
                : "Browse verified clinical aides, companions, and certified educators ready for booking."}
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            asChild
            className="self-start sm:self-auto gap-1 font-medium"
          >
            <Link to="/register">
              <span>{isArabic ? "استعرض كافة التخصصات" : "View All Specialties"}</span>
              <DirectionalIcon icon={ChevronRight} className="h-4 w-4" />
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
            const localizedName = getLocalizedCategoryName(cat, isArabic ? "ar" : "en");
            const desc = isArabic
              ? cat.descriptionAr || cat.description
              : cat.description || cat.descriptionAr;
            const startingPrice = cat.startingPrice || 350;

            return (
              <motion.div
                key={cat.id}
                variants={fadeInUp}
                className="w-[280px] shrink-0 sm:w-auto snap-center"
              >
                <Card
                  className="h-full border border-border/80 shadow-xs hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group rounded-2xl bg-card"
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
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {isArabic ? cat.nameEn : cat.name}
                        </p>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {desc ||
                          (isArabic
                            ? "متخصصون معتمدون جاهزون لحجز الورديات وفق جدولك."
                            : "Certified professionals ready for shift booking on your schedule.")}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-border/50 flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-muted-foreground">
                        {isArabic ? "يبدأ من" : "From"}{" "}
                        <strong className="text-foreground font-semibold">
                          {formatPrice(startingPrice)}
                        </strong>
                      </span>
                      <span className="font-medium text-primary flex items-center gap-1 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                        <span>{isArabic ? "احجز مزود" : "Explore"}</span>
                        <DirectionalIcon icon={ArrowRight} className="h-3.5 w-3.5" />
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
