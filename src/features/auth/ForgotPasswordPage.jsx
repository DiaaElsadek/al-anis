import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { KeyRound, Mail, Phone, ArrowRight, ArrowLeft, AlertCircle } from "lucide-react";

import { forgotPasswordSchema } from "@/lib/validators";
import { forgetPassword } from "@/api/account";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function ForgotPasswordPage() {
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
      toast.success("Security verification matched!", {
        description: "A password reset code has been dispatched.",
      });
      // Store userId and navigate to reset-password
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
      toast.error("Recovery request failed", {
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
            Forgot Password?
          </CardTitle>
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <KeyRound className="h-4 w-4" />
          </div>
        </div>
        <CardDescription className="text-muted-foreground text-sm">
          Provide your registered account email and mobile number to receive a reset code
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
          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold">
              Registered Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute start-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                className="ps-9 h-10"
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <Label htmlFor="phoneNumber" className="text-xs font-semibold">
              Registered Phone Number
            </Label>
            <div className="relative">
              <Phone className="absolute start-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="phoneNumber"
                placeholder="01012345678"
                className="ps-9 h-10"
                {...register("phoneNumber")}
              />
            </div>
            {errors.phoneNumber && (
              <p className="text-xs text-destructive">{errors.phoneNumber.message}</p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full h-11 text-sm font-semibold shadow-md shadow-primary/20 hover:shadow-lg transition-all mt-2"
            disabled={forgotMutation.isPending}
          >
            {forgotMutation.isPending ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                <span>Checking account...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span>Send Reset Code</span>
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
