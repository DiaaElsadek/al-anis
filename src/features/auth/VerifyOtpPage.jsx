import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ShieldCheck, ArrowRight, RefreshCw, AlertCircle, ArrowLeft, Mail } from "lucide-react";

import { verifyOtp, resendOtp } from "@/api/account";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function VerifyOtpPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve userId & email passed from registration or forgot password
  const initialUserId = location.state?.userId || localStorage.getItem("pendingUserId") || "";
  const registeredEmail = location.state?.email || "";

  const [userId, setUserId] = useState(initialUserId);
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(60);
  const [errorMessage, setErrorMessage] = useState("");
  const inputRefs = useRef([]);

  // Auto focus first digit input
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Timer countdown for resend button
  useEffect(() => {
    if (countdown <= 0) return;
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  // Handle digit inputs
  const handleDigitChange = (index, value) => {
    if (value.length > 1) {
      // Handle paste of whole code
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

    // Auto advance to next box
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

  // Verify OTP Mutation
  const verifyMutation = useMutation({
    mutationFn: () => verifyOtp({ userId, otp: otpCode }),
    onSuccess: () => {
      toast.success("Verification successful!", {
        description: "Your account is verified. You can now sign in.",
      });
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
      toast.error("Verification failed", {
        id: "verify-otp-error",
        description: msg,
      });
    },
  });

  // Resend OTP Mutation
  const resendMutation = useMutation({
    mutationFn: () => resendOtp(userId),
    onSuccess: () => {
      toast.success("New code sent!", {
        id: "resend-otp-success",
        description: "Please check your email inbox and spam folder.",
      });
      setCountdown(60);
      setErrorMessage("");
    },
    onError: (error) => {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.errors?.join(", ") ||
        error?.message ||
        "Failed to resend code. Please try again later.";
      toast.error("Resend failed", {
        id: "resend-otp-error",
        description: msg,
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userId.trim()) {
      setErrorMessage("User ID is required to verify the code.");
      return;
    }
    if (otpCode.length < 4) {
      setErrorMessage("Please enter the complete verification code.");
      return;
    }
    setErrorMessage("");
    verifyMutation.mutate();
  };

  return (
    <Card className="border-border/60 shadow-xl shadow-teal-950/5 backdrop-blur-sm bg-card/95">
      <CardHeader className="text-center space-y-2 pb-6">
        <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2 shadow-sm">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">
          Verify Your Account
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground max-w-sm mx-auto">
          {registeredEmail ? (
            <>
              Enter the 6-digit code sent to{" "}
              <span className="font-semibold text-foreground">{registeredEmail}</span>
            </>
          ) : (
            "Enter the 6-digit verification code sent to your registered email address"
          )}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {errorMessage && (
          <div className="flex items-start gap-3 p-3.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p className="text-xs font-medium">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Fallback User ID input if navigated without route state */}
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

          {/* 6-Digit PIN Code Boxes */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold block text-center">
              Verification Code (OTP)
            </Label>
            <div className="flex justify-center gap-2 sm:gap-3">
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
                  className="h-13 w-11 sm:h-14 sm:w-12 text-center text-xl font-mono font-bold rounded-xl border-2 border-input bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                />
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-11 text-sm font-semibold shadow-md shadow-primary/20 hover:shadow-lg transition-all"
            disabled={verifyMutation.isPending || otpCode.length < 4}
          >
            {verifyMutation.isPending ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                <span>Verifying code...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span>Confirm Verification</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            )}
          </Button>
        </form>

        {/* Resend Code Section */}
        <div className="pt-2 text-center space-y-2 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            Didn't receive the email code?
          </p>
          {countdown > 0 ? (
            <p className="text-xs font-medium text-muted-foreground">
              Resend available in <span className="text-primary font-bold">{countdown}s</span>
            </p>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-xs font-semibold text-primary hover:text-primary/90 hover:bg-primary/10"
              onClick={() => resendMutation.mutate()}
              disabled={resendMutation.isPending}
            >
              <RefreshCw className={`h-3.5 w-3.5 me-1.5 ${resendMutation.isPending ? "animate-spin" : ""}`} />
              Resend Verification Code
            </Button>
          )}
        </div>
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
