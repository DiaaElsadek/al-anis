import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  ArrowRight,
  Shield,
  Briefcase,
  User,
  Sparkles,
  AlertCircle,
} from "lucide-react";

import { loginSchema } from "@/lib/validators";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

export default function LoginPage() {
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

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials) => login(credentials),
    onSuccess: (result) => {
      toast.success("Welcome back!", {
        description: `Signed in as ${result?.user?.email || "user"}.`,
      });
      // Redirect to original requested route or role home
      const destination = from || getHomeRoute(result?.user);
      navigate(destination, { replace: true });
    },
    onError: (error) => {
      const msg = error?.response?.data?.message || error?.message || "Invalid email or password.";
      setAuthError(msg);
      toast.error("Sign in failed", {
        id: "login-error",
        description: msg,
      });
    },
  });

  // Google Login mutation
  const googleMutation = useMutation({
    mutationFn: (idToken) => loginWithGoogle(idToken),
    onSuccess: (result) => {
      toast.success("Signed in with Google!");
      const destination = from || getHomeRoute(result?.user);
      navigate(destination, { replace: true });
    },
    onError: (error) => {
      const msg = error?.response?.data?.message || error?.message || "Google sign-in failed.";
      toast.error("Google authentication error", {
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
  const fillDemoAccount = (email, password) => {
    setValue("email", email, { shouldValidate: true });
    setValue("password", password, { shouldValidate: true });
    setAuthError("");
  };

  const handleGoogleMockLogin = () => {
    // In production, integrate with Google OAuth SDK (e.g. google.accounts.id)
    toast.info("Connecting to Google...", {
      description: "Triggering OAuth login token",
    });
    // Call google login endpoint with mock/sample token
    googleMutation.mutate("sample_google_id_token");
  };

  return (
    <Card className="border-border/60 shadow-xl shadow-teal-950/5 backdrop-blur-sm bg-card/95">
      <CardHeader className="space-y-1 pb-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Sign in to your account
          </CardTitle>
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <LogIn className="h-4 w-4" />
          </div>
        </div>
        <CardDescription className="text-muted-foreground text-sm">
          Enter your credentials to access your Alanis dashboard
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Quick Demo Fill Buttons for Testing */}
        <div className="p-3 rounded-xl bg-muted/40 border border-muted-foreground/15 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Quick Demo Accounts</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs h-8 hover:border-primary hover:text-primary transition-colors"
              onClick={() => fillDemoAccount("client@alanis.com", "ClientPass123!")}
            >
              <User className="h-3 w-3 me-1 text-teal-600" />
              Client
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs h-8 hover:border-primary hover:text-primary transition-colors"
              onClick={() => fillDemoAccount("provider@alanis.com", "ProviderPass123!")}
            >
              <Briefcase className="h-3 w-3 me-1 text-emerald-600" />
              Provider
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs h-8 hover:border-primary hover:text-primary transition-colors"
              onClick={() => fillDemoAccount("admin@alanis.com", "AdminPass123!")}
            >
              <Shield className="h-3 w-3 me-1 text-amber-600" />
              Admin
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {authError && (
          <div className="flex items-start gap-3 p-3.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium">Authentication Failed</p>
              <p className="text-xs opacity-90 mt-0.5">{authError}</p>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs font-semibold">
              Email Address
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-muted-foreground">
                <Mail className="h-4 w-4" />
              </div>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
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
                Password
              </Label>
              <Link
                to="/forgot-password"
                className="text-xs text-primary hover:underline font-medium"
              >
                Forgot password?
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
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 end-0 flex items-center pe-3 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-destructive font-medium">{errors.password.message}</p>
            )}
          </div>

          {/* Remember me option */}
          <div className="flex items-center space-x-2 pt-1">
            <Checkbox id="remember" defaultChecked />
            <label
              htmlFor="remember"
              className="text-xs text-muted-foreground font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Remember this device for 30 days
            </label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-11 text-sm font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all mt-2"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                <span>Signing in...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span>Sign In</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/70" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground font-medium">
              Or continue with
            </span>
          </div>
        </div>

        {/* Social Sign-in */}
        <Button
          type="button"
          variant="outline"
          className="w-full h-10 text-sm font-medium border-border/80 hover:bg-muted/50 transition-colors"
          onClick={handleGoogleMockLogin}
          disabled={googleMutation.isPending}
        >
          <svg className="h-4 w-4 me-2.5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              fill="#EA4335"
            />
          </svg>
          Sign in with Google
        </Button>
      </CardContent>

      <CardFooter className="pt-2 pb-6 flex justify-center border-t border-border/40">
        <p className="text-sm text-muted-foreground text-center">
          Don't have an account yet?{" "}
          <Link
            to="/register"
            className="text-primary font-semibold hover:underline transition-colors"
          >
            Create an account
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
