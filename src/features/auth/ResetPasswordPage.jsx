import { useState, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Lock,
  Eye,
  EyeOff,
  Check,
  X,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Key,
  ShieldCheck,
} from "lucide-react";

import { resetPasswordSchema } from "@/lib/validators";
import { resetPassword } from "@/api/account";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const initialUserId =
    location.state?.userId || localStorage.getItem("pendingUserId") || "";
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
      { label: "At least 8 characters", valid: newPasswordValue.length >= 8 },
      { label: "Uppercase letter (A-Z)", valid: /[A-Z]/.test(newPasswordValue) },
      { label: "Lowercase letter (a-z)", valid: /[a-z]/.test(newPasswordValue) },
      { label: "At least one number (0-9)", valid: /[0-9]/.test(newPasswordValue) },
      {
        label: "Special character (!@#$%)",
        valid: /[^A-Za-z0-9]/.test(newPasswordValue),
      },
    ];
  }, [newPasswordValue]);

  const passedCount = strengthChecks.filter((c) => c.valid).length;
  const strengthPercent = (passedCount / 5) * 100;
  const strengthColor =
    passedCount <= 2
      ? "bg-destructive"
      : passedCount <= 4
      ? "bg-amber-500"
      : "bg-emerald-500";
  const strengthText =
    passedCount <= 2 ? "Weak" : passedCount <= 4 ? "Medium" : "Strong";

  const resetMutation = useMutation({
    mutationFn: (data) => resetPassword(data),
    onSuccess: () => {
      toast.success("Password reset successful!", {
        description: "You can now sign in using your new password.",
      });
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
      toast.error("Reset failed", {
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
    <Card className="border-border/60 shadow-xl shadow-teal-950/5 backdrop-blur-sm bg-card/95">
      <CardHeader className="space-y-1 pb-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Create New Password
          </CardTitle>
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <ShieldCheck className="h-4 w-4" />
          </div>
        </div>
        <CardDescription className="text-muted-foreground text-sm">
          {registeredEmail ? (
            <>
              Enter the OTP sent to{" "}
              <span className="font-semibold text-foreground">{registeredEmail}</span>{" "}
              and your new password
            </>
          ) : (
            "Enter your verification code and choose a secure new password"
          )}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {serverError && (
          <div className="flex items-start gap-3 p-3.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p className="text-xs font-medium">{serverError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* User ID (visible only if not passed from previous step) */}
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
              {errors.userId && (
                <p className="text-xs text-destructive">{errors.userId.message}</p>
              )}
            </div>
          )}

          {/* OTP Code */}
          <div className="space-y-1.5">
            <Label htmlFor="otp" className="text-xs font-semibold">
              Verification Code (OTP) <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Key className="absolute start-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="otp"
                placeholder="Enter 6-digit OTP code"
                maxLength={6}
                className="ps-9 h-10 font-mono tracking-widest text-base"
                {...register("otp")}
              />
            </div>
            {errors.otp && (
              <p className="text-xs text-destructive">{errors.otp.message}</p>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-1.5">
            <Label htmlFor="newPassword" className="text-xs font-semibold">
              New Password <span className="text-destructive">*</span>
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

            {/* Password strength meter */}
            {newPasswordValue.length > 0 && (
              <div className="pt-2 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Password strength:</span>
                  <span className="font-semibold">{strengthText}</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${strengthColor} transition-all duration-300`}
                    style={{ width: `${strengthPercent}%` }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-1 pt-1">
                  {strengthChecks.map((check, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-1.5 text-[11px] ${
                        check.valid
                          ? "text-emerald-600 font-medium"
                          : "text-muted-foreground"
                      }`}
                    >
                      {check.valid ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <X className="h-3 w-3 opacity-50" />
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
              Confirm New Password <span className="text-destructive">*</span>
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
              <p className="text-xs text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full h-11 text-sm font-semibold shadow-md shadow-primary/20 hover:shadow-lg transition-all mt-4"
            disabled={resetMutation.isPending}
          >
            {resetMutation.isPending ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                <span>Updating password...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span>Update Password</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="pt-2 pb-6 flex justify-center border-t border-border/40">
        <Link
          to="/login"
          className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5 me-1.5" />
          Back to Sign In
        </Link>
      </CardFooter>
    </Card>
  );
}
