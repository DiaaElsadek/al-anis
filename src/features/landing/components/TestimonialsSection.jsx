import RatingStars from "@/components/shared/RatingStars";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getTestimonials } from "@/features/landing/data";

export default function TestimonialsSection({ isArabic }) {
  const testimonials = getTestimonials(isArabic);

  return (
    <section id="testimonials" className="py-20">
      <div className="container max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge variant="outline" className="text-xs text-primary border-primary/20">
            {isArabic ? "تجارب الأسر" : "Family Stories"}
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            {isArabic
              ? "تجارب حقيقية من عائلات ومقدمي رعاية"
              : "Real Stories from Egyptian Families"}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            {isArabic
              ? "آراء موثقة من عملاء ومقدمي رعاية اعتمدوا على نظام الوردية لراحة أحبائهم."
              : "Verified feedback from clients and professionals relying on shift-based care."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((tItem, idx) => (
            <Card key={idx} className="border border-border/80 shadow-xs rounded-2xl">
              <CardContent className="p-6 space-y-4 flex flex-col justify-between h-full">
                <div className="space-y-3">
                  <RatingStars rating={tItem.rating} size="h-4 w-4" />
                  <p className="text-xs text-foreground/90 leading-relaxed italic">
                    &ldquo;{tItem.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-3 border-t border-border/60">
                  <p className="font-bold text-xs text-foreground">{tItem.author}</p>
                  <p className="text-[11px] text-muted-foreground">{tItem.role}</p>
                  <Badge variant="secondary" className="mt-2 text-[10px]">
                    {tItem.category}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
