import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { useTranslation } from "react-i18next";

import RatingStars from "@/components/shared/RatingStars";
import { Card, CardContent } from "@/components/ui/card";
import { getTestimonials } from "@/features/landing/data";
import { fadeInUp, staggerContainer } from "@/lib/motion";

export default function TestimonialsSection() {
  const { t } = useTranslation(["landing", "common"]);
  const testimonials = getTestimonials(t);
  const [lead, ...others] = testimonials;

  return (
    <section id="testimonials" className="py-16 md:py-24">
      <div className="container max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            {t("landing:testimonials.title")}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {t("landing:testimonials.subtitle")}
          </p>
        </div>

        <motion.div
          className="space-y-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer(0.1, 0.05)}
        >
          {/* Lead Testimonial Story */}
          {lead && (
            <motion.div variants={fadeInUp}>
              <Card className="border border-border/80 shadow-md bg-card rounded-2xl overflow-hidden">
                <CardContent className="p-6 sm:p-8 space-y-5">
                  <div className="flex items-center justify-between">
                    <RatingStars rating={lead.rating} size="h-4 w-4" />
                    <Quote className="h-8 w-8 text-primary/20" />
                  </div>

                  <blockquote className="text-lg sm:text-xl font-medium text-foreground leading-relaxed">
                    &ldquo;{lead.quote}&rdquo;
                  </blockquote>

                  <div className="pt-4 border-t border-border/50 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-bold text-sm text-foreground">{lead.author}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{lead.role}</p>
                    </div>

                    <span className="text-xs bg-muted text-foreground/80 px-2.5 py-1 rounded-md font-normal">
                      {lead.category}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Supporting Stories (2 columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {others.map((tItem, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <Card className="h-full border border-border/80 shadow-xs rounded-2xl bg-card">
                  <CardContent className="p-6 space-y-4 flex flex-col justify-between h-full">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <RatingStars rating={tItem.rating} size="h-3.5 w-3.5" />
                        <Quote className="h-5 w-5 text-primary/20" />
                      </div>
                      <blockquote className="text-sm sm:text-base text-foreground/90 leading-relaxed">
                        &ldquo;{tItem.quote}&rdquo;
                      </blockquote>
                    </div>

                    <div className="pt-4 border-t border-border/50 flex flex-wrap items-center justify-between gap-2.5">
                      <div>
                        <p className="font-bold text-xs sm:text-sm text-foreground">
                          {tItem.author}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">{tItem.role}</p>
                      </div>

                      <span className="text-[11px] bg-muted text-foreground/80 px-2.5 py-0.5 rounded-md shrink-0">
                        {tItem.category}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
