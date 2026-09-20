import { zodResolver } from "@hookform/resolvers/zod";
import { GoogleLogin } from "@react-oauth/google";
import { useMutation } from "@tanstack/react-query";
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/lib/constants";
import { loginSchema } from "@/lib/validators";

export default function LoginPage() {
  const { t } = useTranslation(["auth", "common"]);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle, getHomeRoute } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");

  const from = location.state?.from?.pathname;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      phoneNumber: "",
    },
  });

  const resolvePostLoginRoute = (loggedUser) => {
    const homeRoute = getHomeRoute(loggedUser);
    if (!from || from === "/403" || from === "/login" || from === "/") {
      return homeRoute;
    }

    const userRole = loggedUser?.role;
    const isProviderRole =
      userRole === UserRole.SERVICE_PROVIDER || userRole?.toLowerCase() === "provider";
    const isAdminRole = userRole === UserRole.ADMIN || userRole?.toLowerCase() === "admin";
    const isClientRole =
      userRole === UserRole.USER ||
      userRole?.toLowerCase() === "user" ||
      userRole?.toLowerCase() === "client";

    // Only honour 'from' if it belongs to the logged-in user's role domain
    if (isProviderRole && from.startsWith("/provider")) return from;
    if (isAdminRole && from.startsWith("/admin")) return from;
    if (isClientRole && from.startsWith("/app")) return from;

    return homeRoute;
  };

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials) => login(credentials),
    onSuccess: (result) => {
      toast.success(t("auth:login.successToast"), {
        description: `Signed in as ${result?.user?.email || "user"}.`,
      });
      const destination = resolvePostLoginRoute(result?.user);
      navigate(destination, { replace: true });
    },
    onError: (error) => {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        t("auth:login.invalidCredentials", { defaultValue: "Invalid email or password." });
      setAuthError(msg);
      toast.error(t("common:toasts.somethingWentWrong"), {
        id: "login-error",
        description: msg,
      });
    },
  });

  // Google Login mutation
  const googleMutation = useMutation({
    mutationFn: (idToken) => loginWithGoogle(idToken),
    onSuccess: (result) => {
      toast.success(t("auth:login.signInWithGoogle"));
      const destination = resolvePostLoginRoute(result?.user);
      navigate(destination, { replace: true });
    },
    onError: (error) => {
      const msg = error?.response?.data?.message || error?.message || "Google sign-in failed.";
      toast.error(t("common:toasts.somethingWentWrong"), {
        id: "google-login-error",
        description: msg,
      });
    },
  });

  const onSubmit = (data) => {
    setAuthError("");
    loginMutation.mutate({
      email: data.email,
      password: data.password,
      phoneNumber: data.phoneNumber || "",
    });
  };

  // Demo accounts helper
  const _fillDemoAccount = (email, password) => {
    setValue("email", email, { shouldValidate: true });
    setValue("password", password, { shouldValidate: true });
  };

  return (
    <Card className="border-border shadow-sm bg-card">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight">
          {t("auth:login.title")}
        </CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          {t("auth:login.subtitle")}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Error Alert */}
        {authError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <div>
              <AlertTitle>{t("common:toasts.somethingWentWrong")}</AlertTitle>
              <AlertDescription className="text-xs opacity-90 mt-0.5">{authError}</AlertDescription>
            </div>
          </Alert>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs font-semibold">
              {t("auth:login.emailOrPhone")}
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-muted-foreground">
                <Mail className="h-4 w-4" />
              </div>
              <Input
                id="email"
                type="text"
                placeholder={t("auth:login.emailOrPhonePlaceholder")}
                className="ps-10 h-10 transition-colors focus-visible:ring-primary"
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-destructive font-medium">{errors.email.message}</p>
            )}
          </div>

          {/* Password field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-xs font-semibold">
                {t("auth:login.password")}
              </Label>
              <Link
                to="/forgot-password"
                className="text-xs text-primary hover:underline font-medium"
              >
                {t("auth:login.forgotPassword")}
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-muted-foreground">
                <Lock className="h-4 w-4" />
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="ps-10 pe-10 h-10 transition-colors focus-visible:ring-primary"
                {...register("password")}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute end-1 top-1 h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-transparent"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {errors.password && (
              <p className="text-xs text-destructive font-medium">{errors.password.message}</p>
            )}
          </div>

          {/* Remember me option */}
          <div className="flex items-center gap-2 pt-1">
            <Checkbox id="remember" defaultChecked />
            <Label
              htmlFor="remember"
              className="text-xs text-muted-foreground font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              {t("auth:login.rememberMe")}
            </Label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-11 text-sm font-semibold shadow-sm"
            loading={loginMutation.isPending}
            loadingText={t("auth:login.signingIn")}
          >
            {t("auth:login.signInButton")}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/70" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground font-medium">
              {t("auth:login.orContinueWith", { defaultValue: "Or continue with" })}
            </span>
          </div>
        </div>

        {/* Social Sign-in */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              if (credentialResponse.credential) {
                googleMutation.mutate(credentialResponse.credential);
              }
            }}
            onError={() => {
              toast.error("Google sign-in failed.");
            }}
            text="signin_with"
            width="320"
          />
        </div>
      </CardContent>

      <CardFooter className="pt-2 pb-6 flex justify-center border-t border-border/40">
        <p className="text-sm text-muted-foreground text-center">
          {t("auth:login.noAccount")}{" "}
          <Link
            to="/register"
            className="text-primary font-semibold hover:underline transition-colors"
          >
            {t("auth:login.registerNow")}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
