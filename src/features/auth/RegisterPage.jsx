import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import {
  User,
  Briefcase,
  Mail,
  Lock,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  FileCheck,
  Upload,
  Check,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  Eye,
  EyeOff,
} from "lucide-react";

import { registerUserSchema, registerProviderSchema } from "@/lib/validators";
import { useAuth } from "@/hooks/useAuth";
import { getCategories } from "@/api/category";
import { getLocalizedCategoryName } from "@/lib/utils";
import DirectionalIcon from "@/components/shared/DirectionalIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import FileUploadField from "@/components/shared/FileUploadField";

// Fallback categories if backend isn't loaded
const DEFAULT_CATEGORIES = [
  { id: "cat-1", name: "تمريض منزلي ورعاية كبار السن", nameEn: "Home Nursing & Elderly Care" },
  { id: "cat-2", name: "رعاية وجليسات أطفال", nameEn: "Childcare & Babysitting" },
  { id: "cat-3", name: "علاج طبيعي وتأهيل", nameEn: "Physiotherapy & Rehabilitation" },
  { id: "cat-4", name: "مساعد منزلي وتدبير", nameEn: "Home Assistance & Housekeeping" },
  { id: "cat-5", name: "دروس خصوصية وتأسيس", nameEn: "Private Tutoring" },
];

export default function RegisterPage() {
  const { t, i18n } = useTranslation(["auth", "common"]);
  const navigate = useNavigate();
  const { registerUser, registerServiceProvider } = useAuth();
  const [activeTab, setActiveTab] = useState("client");
  const [showPassword, setShowPassword] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(null);

  // Fetch real categories for provider registration
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const categories = categoriesData?.length ? categoriesData : DEFAULT_CATEGORIES;

  // -------------------------------------------------------------
  // 1. Client Registration Form
  // -------------------------------------------------------------
  const clientForm = useForm({
    resolver: zodResolver(registerUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      address: "",
      dateOfBirth: "",
      profilePicture: null,
    },
  });

  const clientMutation = useMutation({
    mutationFn: async (data) => {
      const formData = new FormData();
      formData.append("FirstName", data.firstName);
      formData.append("LastName", data.lastName);
      formData.append("Email", data.email);
      formData.append("PhoneNumber", data.phoneNumber);
      formData.append("Password", data.password);
      formData.append("ConfirmPassword", data.confirmPassword);
      formData.append("Address", data.address);
      formData.append("DateOfBirth", new Date(data.dateOfBirth).toISOString());
      if (data.profilePicture instanceof File) {
        formData.append("ProfilePicture", data.profilePicture);
      }
      return registerUser(formData);
    },
    onSuccess: (result, variables) => {
      toast.success(t("auth:register.successClient"), {
        description: t("auth:otp.subtitle"),
      });
      const userId = result?.data?.id || result?.id || result?.userId;
      navigate("/verify-otp", {
        state: { userId, email: variables.email },
      });
    },
    onError: (error) => {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.errors?.join(", ") ||
        error?.message ||
        t("common:error");
      toast.error(t("common:error"), {
        id: "register-client-error",
        description: msg,
      });
    },
  });

  const onClientSubmit = (data) => {
    clientMutation.mutate(data);
  };

  // -------------------------------------------------------------
  // 2. Service Provider Registration Form
  // -------------------------------------------------------------
  const providerForm = useForm({
    resolver: zodResolver(registerProviderSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      address: "",
      dateOfBirth: "",
      bio: "",
      nationalId: "",
      experience: "",
      hourlyRate: 150,
      selectedCategoryIds: [],
      idDocument: null,
      certificate: null,
      cv: null,
    },
  });

  const providerMutation = useMutation({
    mutationFn: async (data) => {
      const formData = new FormData();
      formData.append("FirstName", data.firstName);
      formData.append("LastName", data.lastName);
      formData.append("Email", data.email);
      formData.append("PhoneNumber", data.phoneNumber);
      formData.append("Password", data.password);
      formData.append("ConfirmPassword", data.confirmPassword);
      formData.append("Address", data.address);
      formData.append("DateOfBirth", new Date(data.dateOfBirth).toISOString());
      formData.append("Bio", data.bio);
      formData.append("NationalId", data.nationalId);
      formData.append("Experience", data.experience);
      formData.append("HourlyRate", data.hourlyRate);

      // Selected category IDs
      data.selectedCategoryIds.forEach((catId) => {
        formData.append("SelectedCategoryIds", catId);
      });

      // Binary files
      if (data.idDocument instanceof File) {
        formData.append("IdDocument", data.idDocument);
      }
      if (data.certificate instanceof File) {
        formData.append("Certificate", data.certificate);
      }
      if (data.cv instanceof File) {
        formData.append("CV", data.cv);
      }

      return registerServiceProvider(formData);
    },
    onSuccess: (result, variables) => {
      const appData = result?.data || result;
      setApplicationSubmitted({
        applicationId: appData?.applicationId || "APP-" + Math.floor(100000 + Math.random() * 900000),
        userId: appData?.userId,
        email: variables.email,
      });
      toast.success(t("auth:register.successProvider"));
    },
    onError: (error) => {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.errors?.join(", ") ||
        error?.message ||
        t("common:error");
      toast.error(t("common:error"), {
        id: "register-provider-error",
        description: msg,
      });
    },
  });

  const onProviderSubmit = (data) => {
    providerMutation.mutate(data);
  };

  // Provider Application Success View
  if (applicationSubmitted) {
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
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => navigate("/login")}
          >
            {t("auth:register.backToSignIn")}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-border/60 shadow-xl shadow-teal-950/5 backdrop-blur-sm bg-card/95">
      <CardHeader className="space-y-2 pb-5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold tracking-tight">
            {t("auth:register.title")}
          </CardTitle>
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Sparkles className="h-4 w-4" />
          </div>
        </div>
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
        {/* ========================================================= */}
        {/* CLIENT REGISTRATION FORM                                   */}
        {/* ========================================================= */}
        {activeTab === "client" && (
          <form
            onSubmit={clientForm.handleSubmit(onClientSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* First Name */}
              <div className="space-y-1.5">
                <Label htmlFor="firstName" className="text-xs font-semibold">
                  {t("auth:register.firstName")} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="firstName"
                  placeholder={t("auth:register.firstNamePlaceholder")}
                  className="h-10"
                  {...clientForm.register("firstName")}
                />
                {clientForm.formState.errors.firstName && (
                  <p className="text-xs text-destructive">
                    {clientForm.formState.errors.firstName.message}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-1.5">
                <Label htmlFor="lastName" className="text-xs font-semibold">
                  {t("auth:register.lastName")} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="lastName"
                  placeholder={t("auth:register.lastNamePlaceholder")}
                  className="h-10"
                  {...clientForm.register("lastName")}
                />
                {clientForm.formState.errors.lastName && (
                  <p className="text-xs text-destructive">
                    {clientForm.formState.errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="clientEmail" className="text-xs font-semibold">
                  {t("auth:register.email")} <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute start-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="clientEmail"
                    type="email"
                    placeholder={t("auth:register.emailPlaceholder")}
                    className="ps-9 h-10"
                    {...clientForm.register("email")}
                  />
                </div>
                {clientForm.formState.errors.email && (
                  <p className="text-xs text-destructive">
                    {clientForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <Label htmlFor="clientPhone" className="text-xs font-semibold">
                  {t("auth:register.phoneNumber")} <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute start-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="clientPhone"
                    placeholder={t("auth:register.phoneNumberPlaceholder")}
                    className="ps-9 h-10"
                    {...clientForm.register("phoneNumber")}
                  />
                </div>
                {clientForm.formState.errors.phoneNumber && (
                  <p className="text-xs text-destructive">
                    {clientForm.formState.errors.phoneNumber.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Address */}
              <div className="space-y-1.5">
                <Label htmlFor="clientAddress" className="text-xs font-semibold">
                  {t("auth:register.address")} <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <MapPin className="absolute start-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="clientAddress"
                    placeholder={t("auth:register.addressPlaceholder")}
                    className="ps-9 h-10"
                    {...clientForm.register("address")}
                  />
                </div>
                {clientForm.formState.errors.address && (
                  <p className="text-xs text-destructive">
                    {clientForm.formState.errors.address.message}
                  </p>
                )}
              </div>

              {/* Date of Birth */}
              <div className="space-y-1.5">
                <Label htmlFor="clientDob" className="text-xs font-semibold">
                  {t("auth:register.dateOfBirth")} <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Calendar className="absolute start-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="clientDob"
                    type="date"
                    className="ps-9 h-10"
                    {...clientForm.register("dateOfBirth")}
                  />
                </div>
                {clientForm.formState.errors.dateOfBirth && (
                  <p className="text-xs text-destructive">
                    {clientForm.formState.errors.dateOfBirth.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Password */}
              <div className="space-y-1.5">
                <Label htmlFor="clientPass" className="text-xs font-semibold">
                  {t("auth:register.password")} <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute start-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="clientPass"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="ps-9 pe-9 h-10"
                    {...clientForm.register("password")}
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
                {clientForm.formState.errors.password && (
                  <p className="text-xs text-destructive">
                    {clientForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <Label htmlFor="clientConfirmPass" className="text-xs font-semibold">
                  {t("auth:register.confirmPassword")} <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute start-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="clientConfirmPass"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="ps-9 h-10"
                    {...clientForm.register("confirmPassword")}
                  />
                </div>
                {clientForm.formState.errors.confirmPassword && (
                  <p className="text-xs text-destructive">
                    {clientForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            {/* Profile Picture Upload (Optional) */}
            <div className="pt-1">
              <Controller
                control={clientForm.control}
                name="profilePicture"
                render={({ field, fieldState }) => (
                  <FileUploadField
                    name="profilePicture"
                    label={t("auth:register.profilePicture")}
                    accept="image/*"
                    value={field.value}
                    onChange={field.onChange}
                    error={fieldState.error?.message}
                  />
                )}
              />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-11 text-sm font-semibold shadow-md shadow-primary/20 hover:shadow-lg transition-all mt-4"
              disabled={clientMutation.isPending}
            >
              {clientMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  <span>{t("auth:register.creatingAccount")}</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>{t("auth:register.submitClient")}</span>
                  <DirectionalIcon className="h-4 w-4" />
                </div>
              )}
            </Button>
          </form>
        )}

        {/* ========================================================= */}
        {/* SERVICE PROVIDER REGISTRATION FORM                         */}
        {/* ========================================================= */}
        {activeTab === "provider" && (
          <form
            onSubmit={providerForm.handleSubmit(onProviderSubmit)}
            className="space-y-5"
          >
            {/* Section 1: Personal & Contact */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-1 border-b border-border/60">
                <User className="h-4 w-4 text-primary" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  {t("auth:register.section1")}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="pFirstName" className="text-xs font-semibold">
                    {t("auth:register.firstName")} <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="pFirstName"
                    placeholder={t("auth:register.firstNamePlaceholder")}
                    className="h-10"
                    {...providerForm.register("firstName")}
                  />
                  {providerForm.formState.errors.firstName && (
                    <p className="text-xs text-destructive">
                      {providerForm.formState.errors.firstName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="pLastName" className="text-xs font-semibold">
                    {t("auth:register.lastName")} <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="pLastName"
                    placeholder={t("auth:register.lastNamePlaceholder")}
                    className="h-10"
                    {...providerForm.register("lastName")}
                  />
                  {providerForm.formState.errors.lastName && (
                    <p className="text-xs text-destructive">
                      {providerForm.formState.errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="pEmail" className="text-xs font-semibold">
                    {t("auth:register.email")} <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute start-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="pEmail"
                      type="email"
                      placeholder={t("auth:register.emailPlaceholder")}
                      className="ps-9 h-10"
                      {...providerForm.register("email")}
                    />
                  </div>
                  {providerForm.formState.errors.email && (
                    <p className="text-xs text-destructive">
                      {providerForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="pPhone" className="text-xs font-semibold">
                    {t("auth:register.phoneNumber")} <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Phone className="absolute start-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="pPhone"
                      placeholder={t("auth:register.phoneNumberPlaceholder")}
                      className="ps-9 h-10"
                      {...providerForm.register("phoneNumber")}
                    />
                  </div>
                  {providerForm.formState.errors.phoneNumber && (
                    <p className="text-xs text-destructive">
                      {providerForm.formState.errors.phoneNumber.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="pAddress" className="text-xs font-semibold">
                    {t("auth:register.address")} <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute start-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="pAddress"
                      placeholder={t("auth:register.addressPlaceholder")}
                      className="ps-9 h-10"
                      {...providerForm.register("address")}
                    />
                  </div>
                  {providerForm.formState.errors.address && (
                    <p className="text-xs text-destructive">
                      {providerForm.formState.errors.address.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="pDob" className="text-xs font-semibold">
                    {t("auth:register.dateOfBirth")} <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute start-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="pDob"
                      type="date"
                      className="ps-9 h-10"
                      {...providerForm.register("dateOfBirth")}
                    />
                  </div>
                  {providerForm.formState.errors.dateOfBirth && (
                    <p className="text-xs text-destructive">
                      {providerForm.formState.errors.dateOfBirth.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="pPass" className="text-xs font-semibold">
                    {t("auth:register.password")} <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Lock className="absolute start-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="pPass"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="ps-9 pe-9 h-10"
                      {...providerForm.register("password")}
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
                  {providerForm.formState.errors.password && (
                    <p className="text-xs text-destructive">
                      {providerForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="pConfirmPass" className="text-xs font-semibold">
                    {t("auth:register.confirmPassword")} <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Lock className="absolute start-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="pConfirmPass"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="ps-9 h-10"
                      {...providerForm.register("confirmPassword")}
                    />
                  </div>
                  {providerForm.formState.errors.confirmPassword && (
                    <p className="text-xs text-destructive">
                      {providerForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Professional Profile */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 pb-1 border-b border-border/60">
                <Briefcase className="h-4 w-4 text-emerald-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  {t("auth:register.section2")}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* National ID */}
                <div className="space-y-1.5">
                  <Label htmlFor="pNationalId" className="text-xs font-semibold">
                    {t("auth:register.nationalId")} <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <CreditCard className="absolute start-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="pNationalId"
                      placeholder={t("auth:register.nationalIdPlaceholder")}
                      maxLength={14}
                      className="ps-9 h-10 font-mono"
                      {...providerForm.register("nationalId")}
                    />
                  </div>
                  {providerForm.formState.errors.nationalId && (
                    <p className="text-xs text-destructive">
                      {providerForm.formState.errors.nationalId.message}
                    </p>
                  )}
                </div>

                {/* Hourly / Base Rate */}
                <div className="space-y-1.5">
                  <Label htmlFor="pHourlyRate" className="text-xs font-semibold">
                    {t("auth:register.hourlyRate")} <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="pHourlyRate"
                    type="number"
                    min="50"
                    step="10"
                    placeholder="150"
                    className="h-10"
                    {...providerForm.register("hourlyRate")}
                  />
                  {providerForm.formState.errors.hourlyRate && (
                    <p className="text-xs text-destructive">
                      {providerForm.formState.errors.hourlyRate.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Service Categories Multi-select */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">
                  {t("auth:register.categories")} <span className="text-destructive">*</span>
                </Label>
                <Controller
                  control={providerForm.control}
                  name="selectedCategoryIds"
                  render={({ field }) => {
                    const selected = field.value || [];
                    const toggleCategory = (catId) => {
                      if (selected.includes(catId)) {
                        field.onChange(selected.filter((id) => id !== catId));
                      } else {
                        field.onChange([...selected, catId]);
                      }
                    };

                    return (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 rounded-lg border border-border bg-muted/20">
                        {categories.map((cat) => {
                          const isChecked = selected.includes(cat.id);
                          return (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => toggleCategory(cat.id)}
                              className={`flex items-start gap-2.5 p-2 rounded-md text-start text-xs transition-colors border ${
                                isChecked
                                  ? "bg-primary/10 border-primary text-primary font-semibold"
                                  : "border-border/60 hover:bg-muted text-muted-foreground"
                              }`}
                            >
                              <div
                                className={`h-4 w-4 rounded mt-0.5 flex items-center justify-center border transition-colors ${
                                  isChecked
                                    ? "bg-primary border-primary text-primary-foreground"
                                    : "border-muted-foreground/40 bg-background"
                                }`}
                              >
                                {isChecked && <Check className="h-3 w-3" />}
                              </div>
                              <span className="flex-1">{getLocalizedCategoryName(cat, i18n.language)}</span>
                            </button>
                          );
                        })}
                      </div>
                    );
                  }}
                />
                {providerForm.formState.errors.selectedCategoryIds && (
                  <p className="text-xs text-destructive">
                    {providerForm.formState.errors.selectedCategoryIds.message}
                  </p>
                )}
              </div>

              {/* Experience */}
              <div className="space-y-1.5">
                <Label htmlFor="pExperience" className="text-xs font-semibold">
                  {t("auth:register.experienceYears")} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="pExperience"
                  placeholder="e.g. 5 years in intensive care and elderly home nursing"
                  className="h-10"
                  {...providerForm.register("experience")}
                />
                {providerForm.formState.errors.experience && (
                  <p className="text-xs text-destructive">
                    {providerForm.formState.errors.experience.message}
                  </p>
                )}
              </div>

              {/* Bio */}
              <div className="space-y-1.5">
                <Label htmlFor="pBio" className="text-xs font-semibold">
                  {t("auth:register.bio")} <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="pBio"
                  rows={3}
                  placeholder={t("auth:register.bioPlaceholder")}
                  className="resize-none"
                  {...providerForm.register("bio")}
                />
                {providerForm.formState.errors.bio && (
                  <p className="text-xs text-destructive">
                    {providerForm.formState.errors.bio.message}
                  </p>
                )}
              </div>
            </div>

            {/* Section 3: Document Uploads */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 pb-1 border-b border-border/60">
                <ShieldCheck className="h-4 w-4 text-cyan-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  {t("auth:register.section3")}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* ID Document (Required) */}
                <Controller
                  control={providerForm.control}
                  name="idDocument"
                  render={({ field, fieldState }) => (
                    <FileUploadField
                      name="idDocument"
                      label={t("auth:register.documents.idDocument")}
                      required
                      accept=".pdf,.jpg,.jpeg,.png"
                      value={field.value}
                      onChange={field.onChange}
                      error={fieldState.error?.message}
                    />
                  )}
                />

                {/* Certificate (Optional) */}
                <Controller
                  control={providerForm.control}
                  name="certificate"
                  render={({ field, fieldState }) => (
                    <FileUploadField
                      name="certificate"
                      label={t("auth:register.documents.certificate")}
                      accept=".pdf,.jpg,.jpeg,.png"
                      value={field.value}
                      onChange={field.onChange}
                      error={fieldState.error?.message}
                    />
                  )}
                />

                {/* CV / Resume (Optional) */}
                <Controller
                  control={providerForm.control}
                  name="cv"
                  render={({ field, fieldState }) => (
                    <FileUploadField
                      name="cv"
                      label={t("auth:register.documents.cv")}
                      accept=".pdf,.doc,.docx"
                      value={field.value}
                      onChange={field.onChange}
                      error={fieldState.error?.message}
                    />
                  )}
                />
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-11 text-sm font-semibold shadow-md shadow-emerald-900/20 bg-emerald-600 hover:bg-emerald-700 text-white transition-all mt-4"
              disabled={providerMutation.isPending}
            >
              {providerMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{t("auth:register.submitting")}</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>{t("auth:register.submitProvider")}</span>
                  <DirectionalIcon className="h-4 w-4" />
                </div>
              )}
            </Button>
          </form>
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
