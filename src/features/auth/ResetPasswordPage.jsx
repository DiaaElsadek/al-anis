import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Lock, Eye, EyeOff, Check, X, ArrowLeft, AlertCircle, Key, Loader2 } from "lucide-react";
import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

import { resetPassword } from "@/api/account";
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
import { Progress } from "@/components/ui/progress";
import { resetPasswordSchema } from "@/lib/validators";

export default function ResetPasswordPage() {
  const { t } = useTranslation(["auth", "common"]);
  const navigate = useNavigate();
  const location = useLocation();

  const initialUserId = location.state?.userId || localStorage.getItem("pendingUserId") || "";
  const registeredEmail = location.state?.email || "";

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      userId: initialUserId,
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPasswordValue = watch("newPassword") || "";

  // Password strength calculations
  const strengthChecks = useMemo(() => {
    return [
      {
        label: t("auth:resetPassword.ruleLength", { defaultValue: "At least 8 characters" }),
        valid: newPasswordValue.length >= 8,
      },
      {
        label: t("auth:resetPassword.ruleUppercase", { defaultValue: "Uppercase letter (A-Z)" }),
        valid: /[A-Z]/.test(newPasswordValue),
      },
      {
        label: t("auth:resetPassword.ruleLowercase", { defaultValue: "Lowercase letter (a-z)" }),
        valid: /[a-z]/.test(newPasswordValue),
      },
      {
        label: t("auth:resetPassword.ruleNumber", { defaultValue: "At least one number (0-9)" }),
        valid: /[0-9]/.test(newPasswordValue),
      },
      {
        label: t("auth:resetPassword.ruleSpecial", { defaultValue: "Special character (!@#$%)" }),
        valid: /[^A-Za-z0-9]/.test(newPasswordValue),
      },
    ];
  }, [newPasswordValue, t]);

  const passedCount = strengthChecks.filter((c) => c.valid).length;
  const strengthPercent = (passedCount / 5) * 100;
  const strengthColor =
    passedCount <= 2 ? "bg-destructive" : passedCount <= 4 ? "bg-amber-500" : "bg-emerald-500";
  const strengthText =
    passedCount <= 2
      ? t("auth:resetPassword.strengthWeak")
      : passedCount <= 4
        ? t("auth:resetPassword.strengthMedium")
        : t("auth:resetPassword.strengthStrong");

  const resetMutation = useMutation({
    mutationFn: (data) => resetPassword(data),
    onSuccess: () => {
      toast.success(t("auth:resetPassword.successToast"));
      localStorage.removeItem("pendingUserId");
      navigate("/login", { replace: true });
    },
    onError: (error) => {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.errors?.join(", ") ||
        error?.message ||
        "Failed to reset password. Please verify the code and try again.";
      setServerError(msg);
      toast.error(t("common:toasts.somethingWentWrong"), {
        id: "reset-password-error",
        description: msg,
      });
    },
  });

  const onSubmit = (data) => {
    setServerError("");
    resetMutation.mutate(data);
  };

  return (
    <Card className="border-border shadow-sm bg-card">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl font-bold tracking-tight">
          {t("auth:resetPassword.title")}
        </CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          {registeredEmail ? (
            <>
              {t("auth:resetPassword.subtitle")}{" "}
              <span className="font-semibold text-foreground">{registeredEmail}</span>
            </>
          ) : (
            t("auth:resetPassword.subtitle")
          )}
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
          {!initialUserId && (
            <div className="space-y-1.5">
              <Label htmlFor="userId" className="text-xs font-semibold">
                User ID <span className="text-destructive">*</span>
              </Label>
              <Input
                id="userId"
                placeholder="e.g. 3fa85f64-5717..."
                className="h-10 text-sm font-mono"
                {...register("userId")}
              />
              {errors.userId && <p className="text-xs text-destructive">{errors.userId.message}</p>}
            </div>
          )}

          {/* OTP Code */}
          <div className="space-y-1.5">
            <Label htmlFor="otp" className="text-xs font-semibold">
              {t("auth:otp.title")} <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Key className="absolute start-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="otp"
                placeholder="000000"
                maxLength={6}
                className="ps-9 h-10 font-mono tracking-widest text-base"
                {...register("otp")}
              />
            </div>
            {errors.otp && <p className="text-xs text-destructive">{errors.otp.message}</p>}
          </div>

          {/* New Password */}
          <div className="space-y-1.5">
            <Label htmlFor="newPassword" className="text-xs font-semibold">
              {t("auth:resetPassword.newPassword")} <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Lock className="absolute start-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="ps-9 pe-9 h-10"
                {...register("newPassword")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute end-3 top-3 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-xs text-destructive">{errors.newPassword.message}</p>
            )}

            {/* Password Strength Indicator */}
            {newPasswordValue && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {t("auth:resetPassword.strength", { defaultValue: "Strength" })}:
                  </span>
                  <span className="font-semibold">{strengthText}</span>
                </div>
                <Progress
                  value={strengthPercent}
                  className="h-1.5"
                  indicatorClassName={strengthColor}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                  {strengthChecks.map((check, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-1.5 text-[11px] ${
                        check.valid
                          ? "text-emerald-600 dark:text-emerald-400 font-medium"
                          : "text-muted-foreground"
                      }`}
                    >
                      {check.valid ? (
                        <Check className="h-3 w-3 shrink-0" />
                      ) : (
                        <X className="h-3 w-3 shrink-0 opacity-50" />
                      )}
                      <span>{check.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className="text-xs font-semibold">
              {t("auth:resetPassword.confirmNewPassword")}{" "}
              <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Lock className="absolute start-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="ps-9 h-10"
                {...register("confirmPassword")}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-11 text-sm font-semibold shadow-sm mt-2"
            disabled={resetMutation.isPending}
          >
            {resetMutation.isPending ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{t("common:actions.saveChanges")}...</span>
              </div>
            ) : (
              <span>{t("auth:resetPassword.resetButton")}</span>
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
