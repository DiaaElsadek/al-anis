import { FileCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import DirectionalIcon from "@/components/shared/DirectionalIcon";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export default function ApplicationSubmittedCard({ applicationSubmitted }) {
  const { t } = useTranslation(["auth", "common"]);
  const navigate = useNavigate();

  return (
    <Card className="border-border/60 shadow-xl backdrop-blur-sm bg-card/95 text-center p-6 sm:p-8">
      <div className="h-16 w-16 bg-emerald-500/10 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-5">
        <FileCheck className="h-8 w-8" />
      </div>
      <CardTitle className="text-2xl font-bold text-foreground">
        {t("auth:register.applicationReceivedTitle")}
      </CardTitle>
      <CardDescription className="text-base text-muted-foreground mt-2 max-w-md mx-auto">
        {t("auth:register.applicationReceivedDesc")}
      </CardDescription>

      <div className="my-6 p-4 rounded-xl bg-muted/50 border border-border text-start space-y-2 max-w-md mx-auto">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{t("auth:register.applicationRef")}</span>
          <span className="font-mono font-bold text-foreground">
            {applicationSubmitted.applicationId}
          </span>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{t("auth:register.email")}</span>
          <span className="font-medium text-foreground">{applicationSubmitted.email}</span>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{t("auth:register.initialStatus")}</span>
          <span className="inline-flex items-center gap-1 font-semibold text-amber-600">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            {t("auth:register.pendingAdminReview")}
          </span>
        </div>
      </div>

      <p className="text-xs text-muted-foreground max-w-md mx-auto mb-6">
        {t("auth:register.auditNotice")}
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
        {applicationSubmitted.userId && (
          <Button
            className="w-full sm:w-auto"
            onClick={() =>
              navigate("/verify-otp", {
                state: {
                  userId: applicationSubmitted.userId,
                  email: applicationSubmitted.email,
                },
              })
            }
          >
            <span>{t("auth:register.verifyEmailOtp")}</span>
            <DirectionalIcon className="h-4 w-4 ms-2" />
          </Button>
        )}
        <Button variant="outline" className="w-full sm:w-auto" onClick={() => navigate("/login")}>
          {t("auth:register.backToSignIn")}
        </Button>
      </div>
    </Card>
  );
}
