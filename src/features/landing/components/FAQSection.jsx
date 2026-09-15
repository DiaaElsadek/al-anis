import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getFaqs } from "@/features/landing/data";

export default function FAQSection({ isArabic }) {
  const faqs = getFaqs(isArabic);

  return (
    <section id="faq" className="py-20 bg-muted/30 border-t border-border/70">
      <div className="container max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge variant="outline" className="text-xs text-primary border-primary/20">
            {isArabic ? "إجابات واضحة" : "FAQ"}
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            {isArabic ? "الأسئلة الأكثر شيوعاً" : "Frequently Asked Questions"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isArabic
              ? "كل ما تود معرفته عن الدفع الضامن، وتدقيق المستندات، وتنسيق الورديات."
              : "Everything you need to know about escrow protection, provider audits, and shifts."}
          </p>
        </div>

        <Card className="border border-border/80 shadow-md bg-card p-6 rounded-2xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`faq-${idx}`}>
                <AccordionTrigger className="text-sm font-bold text-foreground">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-xs leading-relaxed text-muted-foreground">
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
