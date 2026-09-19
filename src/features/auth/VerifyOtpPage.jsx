import { useMutation } from "@tanstack/react-query";
import { RefreshCw, AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

import { verifyOtp, resendOtp } from "@/api/account";
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

export default function VerifyOtpPage() {
  const { t } = useTranslation(["auth", "common"]);
  const navigate = useNavigate();
  const location = useLocation();

  const initialUserId = location.state?.userId || localStorage.getItem("pendingUserId") || "";
  const registeredEmail = location.state?.email || "";

  const [userId, setUserId] = useState(initialUserId);
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(60);
  const [errorMessage, setErrorMessage] = useState("");
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  const handleDigitChange = (index, value) => {
    if (value.length > 1) {
      const pastedDigits = value.replace(/\D/g, "").slice(0, 6).split("");
      const newDigits = [...digits];
      pastedDigits.forEach((digit, i) => {
        newDigits[i] = digit;
      });
      setDigits(newDigits);
      const nextIndex = Math.min(pastedDigits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const singleChar = value.replace(/\D/g, "");
    const newDigits = [...digits];
    newDigits[index] = singleChar;
    setDigits(newDigits);

    if (singleChar && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const otpCode = digits.join("");

  const verifyMutation = useMutation({
    mutationFn: () => verifyOtp({ userId, otp: otpCode }),
    onSuccess: () => {
      toast.success(t("auth:otp.verifySuccess", { defaultValue: "Verification successful!" }));
      localStorage.removeItem("pendingUserId");
      navigate("/login", { replace: true });
    },
    onError: (error) => {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.errors?.join(", ") ||
        error?.message ||
        "Invalid or expired verification code.";
      setErrorMessage(msg);
      toast.error(t("common:toasts.somethingWentWrong"), {
        id: "verify-otp-error",
        description: msg,
      });
    },
  });

  const resendMutation = useMutation({
    mutationFn: () => resendOtp(userId),
    onSuccess: () => {
      toast.success(t("auth:otp.codeResent"));
      setCountdown(60);
      setErrorMessage("");
    },
    onError: (error) => {
      const msg = error?.response?.data?.message || error?.message || "Could not resend OTP code.";
      toast.error(t("common:toasts.somethingWentWrong"), {
        description: msg,
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userId) {
      setErrorMessage("Missing User Account ID. Please re-enter your ID.");
      return;
    }
    if (otpCode.length < 4) {
      setErrorMessage("Please enter all verification digits.");
      return;
    }
    setErrorMessage("");
    verifyMutation.mutate();
  };

  return (
    <Card className="border-border shadow-sm bg-card">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight">
          {t("auth:otp.title")}
        </CardTitle>
        <CardDescription className="text-muted-foreground text-sm max-w-sm mx-auto">
          {registeredEmail ? (
            <>
              {t("auth:otp.subtitle")}{" "}
              <span className="font-semibold text-foreground">{registeredEmail}</span>
            </>
          ) : (
            t("auth:otp.subtitle")
          )}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {errorMessage && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs font-medium">{errorMessage}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!initialUserId && (
            <div className="space-y-1.5">
              <Label htmlFor="userId" className="text-xs font-semibold">
                User ID / Account Identifier
              </Label>
              <Input
                id="userId"
                placeholder="Enter your User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="h-10 text-sm font-mono"
              />
            </div>
          )}

          {/* 6-Digit PIN Code Boxes (explicitly dir="ltr" so digit sequence stays 1-6) */}
          <div className="space-y-2">
            <div className="flex justify-center gap-2 sm:gap-3" dir="ltr">
              {digits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={digit}
                  onChange={(e) => handleDigitChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="h-12 w-10 sm:h-14 sm:w-12 text-center text-xl font-mono font-bold rounded-xl border-2 border-input bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                />
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-11 text-sm font-semibold shadow-sm"
            disabled={verifyMutation.isPending || otpCode.length < 4}
          >
            {verifyMutation.isPending ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{t("auth:otp.verifying")}</span>
              </div>
            ) : (
              <span>{t("auth:otp.verifyButton")}</span>
            )}
          </Button>
        </form>

        <div className="text-center pt-2">
          {countdown > 0 ? (
            <p className="text-xs text-muted-foreground">
              {t("auth:otp.resendIn", { seconds: countdown })}
            </p>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-xs font-semibold text-primary hover:text-primary/90 h-8 gap-1.5"
              onClick={() => resendMutation.mutate()}
              disabled={resendMutation.isPending}
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${resendMutation.isPending ? "animate-spin" : ""}`}
              />
              <span>{t("auth:otp.resendCode")}</span>
            </Button>
          )}
        </div>
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
