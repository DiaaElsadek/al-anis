import { Check, ShieldCheck, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {isArabic
              ? "مقارنة بين نموذج الأنيس ومكاتب الرعاية التقليدية"
              : "Alanis Platform vs Traditional Agency Care"}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            {isArabic
              ? "لماذا يفضل آلاف الأسر المصرية حجز الرعاية عبر الأنيس بدلاً من المكاتب العشوائية؟"
              : "See how our audited shift model solves the pain points of unverified informal care."}
          </p>
        </div>

        <Card className="border border-border/80 shadow-md bg-card overflow-hidden">
          <Table className="text-xs text-start">
            <TableHeader className="bg-muted/40 text-foreground">
              <TableRow className="border-b border-border/70">
                <TableHead className="py-4 px-5 font-bold text-start w-1/3 text-foreground">
                  {isArabic ? "المعيار / الجانب" : "Feature / Aspect"}
                </TableHead>
                <TableHead className="py-4 px-5 font-bold text-start bg-primary/10 text-primary border-x border-primary/20 w-1/3">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4" />
                    <span>{isArabic ? "منصة الأنيس (Alanis)" : "Alanis Platform"}</span>
                  </div>
                </TableHead>
                <TableHead className="py-4 px-5 font-bold text-start text-muted-foreground w-1/3">
                  {isArabic ? "المكاتب والوسطاء التقليديون" : "Traditional Agencies / Brokers"}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-border/50">
              {comparisonRows.map((row, idx) => (
                <TableRow key={idx} className="hover:bg-muted/20 transition-colors">
                  <TableCell className="py-4 px-5 font-semibold text-foreground">
                    {row.feature}
                  </TableCell>
                  <TableCell className="py-4 px-5 bg-primary/5 border-x border-primary/15 text-foreground font-medium">
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{row.alanis}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-5 text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <X className="h-4 w-4 text-destructive/80 shrink-0 mt-0.5" />
                      <span>{row.traditional}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </section>
  );
}
