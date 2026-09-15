import { ArrowRight, BadgeCheck, ChevronRight, Star } from "lucide-react";
import { Link } from "react-router-dom";

import DirectionalIcon from "@/components/shared/DirectionalIcon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getSpotlightProviders } from "@/features/landing/data";
import { formatPrice, getInitials } from "@/lib/utils";

export default function CaregiversSection({ isArabic }) {
  const spotlightProviders = getSpotlightProviders(isArabic);

  return (
    <section id="caregivers" className="py-20 bg-muted/30 border-y border-border/70">
      <div className="container max-w-6xl mx-auto space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <Badge variant="outline" className="text-xs text-primary border-primary/20">
              {isArabic ? "نخبة الكوادر" : "Audited Caregivers"}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              {isArabic
                ? "تعرف على نماذج من أطقم الرعاية المعتمدة"
                : "Meet Top Verified Care Providers"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isArabic
                ? "كل ممرض ومساعد رعاية يمر بمطابقة الهوية الجنائية ومراجعة الشهادات قبل الانضمام."
                : "Every nurse and companion passes National ID verification and syndical license audits."}
            </p>
          </div>

          <Button size="sm" asChild className="self-start sm:self-auto gap-1 shadow-sm">
            <Link to="/register">
              <span>{isArabic ? "انضم كأخصائي رعاية" : "Join as Caregiver"}</span>
              <DirectionalIcon icon={ChevronRight} className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {spotlightProviders.map((prov) => (
            <Card
              key={prov.id}
              className="border border-border/80 shadow-md bg-card rounded-2xl overflow-hidden hover:border-primary/50 transition-all"
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16 rounded-2xl border-2 border-primary/20 shrink-0">
                    <AvatarImage src={prov.avatar} alt={prov.name} />
                    <AvatarFallback className="rounded-2xl font-bold bg-primary/10 text-primary">
                      {getInitials(prov.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-sm text-foreground truncate">{prov.name}</h4>
                      <BadgeCheck className="h-4 w-4 text-primary shrink-0" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{prov.title}</p>
                    <Badge variant="secondary" className="text-[10px] mt-1">
                      {prov.badge}
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">
                      {isArabic ? "التقييم العام" : "Rating"}
                    </span>
                    <span className="font-bold text-amber-500 flex items-center gap-1 mt-0.5">
                      <Star className="h-3 w-3 fill-amber-500" /> {prov.rating} ({prov.reviewsCount}
                      )
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">
                      {isArabic ? "الورديات المنفذة" : "Completed"}
                    </span>
                    <span className="font-bold text-foreground mt-0.5 block">
                      {prov.shiftsCompleted} {isArabic ? "وردية" : "shifts"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">
                      {isArabic ? "نطاق التغطية" : "Service Area"}
                    </span>
                    <span className="text-muted-foreground mt-0.5 block truncate">
                      {prov.location}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">
                      {isArabic ? "سعر الوردية" : "Shift Rate"}
                    </span>
                    <span className="font-bold text-primary mt-0.5 block">
                      {formatPrice(prov.rate)}
                    </span>
                  </div>
                </div>

                <Button asChild className="w-full text-xs font-bold mt-2">
                  <Link to="/register">
                    <span>{isArabic ? "طلب حجز وردية" : "Book Shift with Provider"}</span>
                    <DirectionalIcon icon={ArrowRight} className="h-3.5 w-3.5 ms-1.5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
