import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fadeInUp, staggerContainer } from "@/lib/motion";

export default function HowItWorksSection() {
  const { t } = useTranslation(["landing", "common"]);
  const [activeTab, setActiveTab] = useState("clients");

  const clientSteps = t("landing:howItWorks.clients", { returnObjects: true }) || [];
  const providerSteps = t("landing:howItWorks.providers", { returnObjects: true }) || [];
  const currentSteps = activeTab === "clients" ? clientSteps : providerSteps;

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-muted/30">
      <div className="container max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            {t("landing:howItWorks.title")}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {t("landing:howItWorks.subtitle")}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center">
            <TabsList className="h-11 rounded-xl bg-muted p-1 border border-border/70 grid grid-cols-2 max-w-md w-full">
              <TabsTrigger
                value="clients"
                className="rounded-lg text-xs sm:text-sm font-medium px-2 sm:px-6 truncate"
              >
                {t("landing:howItWorks.clientTab")}
              </TabsTrigger>
              <TabsTrigger
                value="providers"
                className="rounded-lg text-xs sm:text-sm font-medium px-2 sm:px-6 truncate"
              >
                {t("landing:howItWorks.providerTab")}
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="mt-10 sm:mt-12 relative max-w-3xl mx-auto">
            {/* Connecting Timeline Rule */}
            <div
              className="absolute start-4 sm:start-5 top-5 bottom-5 w-0.5 bg-border md:start-1/2 md:-translate-x-1/2"
              aria-hidden="true"
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={staggerContainer(0.12, 0.05)}
                className="space-y-6 sm:space-y-8 md:space-y-12"
              >
                {currentSteps.map((step, idx) => {
                  const isEven = idx % 2 === 1;

                  return (
                    <motion.div
                      key={step.num}
                      variants={fadeInUp}
                      className="relative flex flex-col md:flex-row items-start md:items-center"
                    >
                      {/* Step Number Circle */}
                      <div className="absolute start-0 md:start-1/2 md:-translate-x-1/2 top-0 md:top-1/2 md:-translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary text-primary-foreground font-bold text-xs sm:text-sm flex items-center justify-center border-2 sm:border-4 border-background shadow-xs z-10">
                        {step.num}
                      </div>

                      {/* Content Card */}
                      <div
                        className={`w-full ps-11 sm:ps-14 md:ps-0 md:w-[calc(50%-2.25rem)] ${
                          isEven ? "md:ms-auto md:text-start" : "md:me-auto md:text-start"
                        }`}
                      >
                        <Card className="border border-border/80 shadow-xs rounded-2xl bg-card hover:border-primary/30 transition-colors">
                          <CardContent className="p-4 sm:p-6 space-y-1.5 sm:space-y-2">
                            <h3 className="text-base sm:text-lg font-bold text-foreground">
                              {step.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                              {step.desc}
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </Tabs>
      </div>
    </section>
  );
}
