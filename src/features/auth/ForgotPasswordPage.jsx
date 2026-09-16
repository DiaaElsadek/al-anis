import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { KeyRound, Mail, Phone, ArrowRight, ArrowLeft, AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { forgetPassword } from "@/api/account";
import DirectionalIcon from "@/components/shared/DirectionalIcon";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPasswordSchema } from "@/lib/validators";

export default function ForgotPasswordPage() {
  const { t } = useTranslation(["auth", "common"]);
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
      phoneNumber: "",
    },
  });

  const forgotMutation = useMutation({
    mutationFn: (data) => forgetPassword(data),
    onSuccess: (result, variables) => {
      const returnedUserId = result?.userId || result?.data?.userId;
      toast.success(
        t("auth:otp.codeResent", { defaultValue: "A password reset code has been dispatched." })
      );
      if (returnedUserId) {
        localStorage.setItem("pendingUserId", returnedUserId);
      }
      navigate("/reset-password", {
        state: {
          userId: returnedUserId,
          email: variables.email,
        },
      });
    },
    onError: (error) => {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.errors?.join(", ") ||
        error?.message ||
        "No matching account found with this email and phone number.";
      setServerError(msg);
      toast.error(t("common:toasts.somethingWentWrong"), {
        id: "forgot-password-error",
        description: msg,
      });
    },
  });

  const onSubmit = (data) => {
    setServerError("");
    forgotMutation.mutate(data);
  };

  return (
    <Card className="border-border/60 shadow-xl shadow-teal-950/5 backdrop-blur-sm bg-card/95">
      <CardHeader className="space-y-1 pb-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold tracking-tight">
            {t("auth:forgotPassword.title")}
          </CardTitle>
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <KeyRound className="h-4 w-4" />
          </div>
        </div>
        <CardDescription className="text-muted-foreground text-sm">
          {t("auth:forgotPassword.subtitle")}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {serverError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs font-medium">{serverError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold">
              {t("auth:register.email")}
            </Label>
            <div className="relative">
              <Mail className="absolute start-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder={t("auth:register.emailPlaceholder")}
                className="ps-9 h-10 text-sm"
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-destructive font-medium">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <Label htmlFor="phoneNumber" className="text-xs font-semibold">
              {t("auth:register.phoneNumber")}
            </Label>
            <div className="relative">
              <Phone className="absolute start-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="phoneNumber"
                type="tel"
                placeholder={t("auth:register.phoneNumberPlaceholder")}
                className="ps-9 h-10 text-sm"
                {...register("phoneNumber")}
              />
            </div>
            {errors.phoneNumber && (
              <p className="text-xs text-destructive font-medium">{errors.phoneNumber.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-11 text-sm font-semibold shadow-md shadow-primary/20 hover:shadow-lg transition-all mt-2"
            disabled={forgotMutation.isPending}
          >
            {forgotMutation.isPending ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{t("auth:forgotPassword.sending")}</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span>{t("auth:forgotPassword.sendOtpButton")}</span>
                <DirectionalIcon icon={ArrowRight} className="h-4 w-4" />
              </div>
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="pt-2 pb-6 flex justify-center border-t border-border/40">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <DirectionalIcon icon={ArrowLeft} className="h-3.5 w-3.5" />
          <span>
            {t("common:actions.cancel")} & {t("common:nav.signIn")}
          </span>
        </Link>
      </CardFooter>
    </Card>
  );
}
