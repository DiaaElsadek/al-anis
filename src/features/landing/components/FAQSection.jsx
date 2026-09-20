import { useTranslation } from "react-i18next";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { getFaqs } from "@/features/landing/data";

export default function FAQSection() {
  const { t } = useTranslation(["landing", "common"]);
  const faqs = getFaqs(t);

  return (
    <section id="faq" className="py-20 bg-muted/30 border-t border-border/70">
      <div className="container max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            {t("landing:faq.title")}
          </h2>
          <p className="text-sm text-muted-foreground">{t("landing:faq.subtitle")}</p>
        </div>

        <Card className="border border-border/80 shadow-md bg-card p-4 sm:p-6 md:p-8 rounded-2xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`faq-${idx}`}>
                <AccordionTrigger className="text-sm sm:text-base font-semibold text-foreground text-start">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>
      </div>
    </section>
  );
}
