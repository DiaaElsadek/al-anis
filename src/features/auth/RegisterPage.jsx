import { useQuery } from "@tanstack/react-query";
import { Briefcase, User } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { getCategories } from "@/api/category";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ApplicationSubmittedCard from "@/features/auth/components/ApplicationSubmittedCard";
import ClientRegisterForm from "@/features/auth/components/ClientRegisterForm";
import ProviderRegisterForm from "@/features/auth/components/ProviderRegisterForm";
import { FALLBACK_CATEGORIES } from "@/lib/constants";

export default function RegisterPage() {
  const { t } = useTranslation(["auth", "common"]);
  const [activeTab, setActiveTab] = useState("client");
  const [applicationSubmitted, setApplicationSubmitted] = useState(null);

  // Fetch real categories for provider registration
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const categories = categoriesData?.length ? categoriesData : FALLBACK_CATEGORIES;

  // Provider Application Success View
  if (applicationSubmitted) {
    return <ApplicationSubmittedCard applicationSubmitted={applicationSubmitted} />;
  }

  return (
    <Card className="border-border shadow-sm bg-card">
      <CardHeader className="space-y-2 pb-5">
        <CardTitle className="text-2xl font-bold tracking-tight">
          {t("auth:register.title")}
        </CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          {t("auth:register.subtitle")}
        </CardDescription>

        {/* Tab Selection */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="pt-2">
          <TabsList className="grid w-full grid-cols-2 p-1 bg-muted/60 h-11">
            <TabsTrigger
              value="client"
              className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm font-semibold text-xs sm:text-sm"
            >
              <User className="h-4 w-4 text-primary" />
              <span>{t("auth:register.clientTab")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="provider"
              className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm font-semibold text-xs sm:text-sm"
            >
              <Briefcase className="h-4 w-4 text-emerald-600" />
              <span>{t("auth:register.providerTab")}</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent className="pt-2">
        {activeTab === "client" && <ClientRegisterForm />}
        {activeTab === "provider" && (
          <ProviderRegisterForm
            categories={categories}
            onApplicationSubmitted={setApplicationSubmitted}
          />
        )}
      </CardContent>

      <CardFooter className="pt-2 pb-6 flex justify-center border-t border-border/40">
        <p className="text-sm text-muted-foreground text-center">
          {t("auth:register.alreadyHaveAccount")}{" "}
          <Link
            to="/login"
            className="text-primary font-semibold hover:underline transition-colors"
          >
            {t("auth:register.signIn")}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
