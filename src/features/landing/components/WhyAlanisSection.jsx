import { Check, ShieldCheck, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getComparisonRows } from "@/features/landing/data";

export default function WhyAlanisSection({ isArabic }) {
  const comparisonRows = getComparisonRows(isArabic);

  return (
    <section id="why-alanis" className="py-20 bg-muted/40 border-y border-border/70">
      <div className="container max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge variant="outline" className="text-xs text-primary border-primary/20">
            {isArabic ? "مقارنة حقيقية" : "Market Comparison"}
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            {isArabic
              ? "منصة الأنيس في مواجهة الطرق التقليدية"
              : "Alanis Platform vs Traditional Agency Care"}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            {isArabic
              ? "لماذا يفضل آلاف الأسر المصرية حجز الرعاية عبر الأنيس بدلاً من المكاتب العشوائية؟"
              : "See how our audited shift model solves the pain points of unverified informal care."}
          </p>
        </div>

        <Card className="border border-border/80 shadow-md bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead>
                <tr className="border-b border-border/70 bg-muted/40 text-foreground">
                  <th className="py-4 px-5 font-bold text-start w-1/3">
                    {isArabic ? "المعيار / الجانب" : "Feature / Aspect"}
                  </th>
                  <th className="py-4 px-5 font-bold text-start bg-primary/10 text-primary border-x border-primary/20 w-1/3">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4" />
                      <span>{isArabic ? "منصة الأنيس (Alanis)" : "Alanis Platform"}</span>
                    </div>
                  </th>
                  <th className="py-4 px-5 font-bold text-start text-muted-foreground w-1/3">
                    {isArabic ? "المكاتب والوسطاء التقليديون" : "Traditional Agencies / Brokers"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-muted/20 transition-colors">
                    <td className="py-4 px-5 font-semibold text-foreground">{row.feature}</td>
                    <td className="py-4 px-5 bg-primary/5 border-x border-primary/15 text-foreground font-medium">
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{row.alanis}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-muted-foreground">
                      <div className="flex items-start gap-2">
                        <X className="h-4 w-4 text-destructive/80 shrink-0 mt-0.5" />
                        <span>{row.traditional}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </section>
  );
}
