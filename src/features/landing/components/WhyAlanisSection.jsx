import { Check, ShieldCheck, X } from "lucide-react";
import { useTranslation } from "react-i18next";

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

export default function WhyAlanisSection() {
  const { t } = useTranslation(["landing", "common"]);
  const comparisonRows = getComparisonRows(t);

  return (
    <section id="why-alanis" className="py-20 bg-muted/40 border-y border-border/70">
      <div className="container max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {t("landing:whyAlanis.title")}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            {t("landing:whyAlanis.subtitle")}
          </p>
        </div>

        {/* Desktop / Tablet Comparison Table */}
        <div className="hidden md:block">
          <Card className="border border-border/80 shadow-md bg-card overflow-hidden rounded-2xl">
            <Table className="text-sm text-start">
              <TableHeader className="bg-muted/40 text-foreground">
                <TableRow className="border-b border-border/70">
                  <TableHead className="py-4 px-5 font-bold text-start w-1/3 text-foreground">
                    {t("landing:whyAlanis.aspectHeader")}
                  </TableHead>
                  <TableHead className="py-4 px-5 font-bold text-start bg-primary/10 text-primary border-x border-primary/20 w-1/3">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4" />
                      <span>{t("landing:whyAlanis.alanisHeader")}</span>
                    </div>
                  </TableHead>
                  <TableHead className="py-4 px-5 font-bold text-start text-muted-foreground w-1/3">
                    {t("landing:whyAlanis.traditionalHeader")}
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
                        <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
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

        {/* Mobile Stacked Comparison Cards */}
        <div className="md:hidden space-y-3.5">
          {comparisonRows.map((row, idx) => (
            <Card
              key={idx}
              className="p-4 rounded-xl border border-border/80 bg-card shadow-xs space-y-3"
            >
              <h3 className="font-bold text-sm text-foreground">{row.feature}</h3>
              <div className="space-y-2 text-xs">
                {/* Alanis */}
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-foreground font-medium flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] text-primary font-bold block mb-0.5">
                      {t("landing:whyAlanis.alanisMobileLabel")}
                    </span>
                    <span className="leading-relaxed">{row.alanis}</span>
                  </div>
                </div>

                {/* Traditional */}
                <div className="p-3 rounded-lg bg-muted/40 border border-border/50 text-muted-foreground flex items-start gap-2.5">
                  <X className="h-4 w-4 text-destructive/80 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] text-muted-foreground font-semibold block mb-0.5">
                      {t("landing:whyAlanis.traditionalMobileLabel")}
                    </span>
                    <span className="leading-relaxed">{row.traditional}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
