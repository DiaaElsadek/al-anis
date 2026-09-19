import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  Briefcase,
  Check,
  CreditCard,
  Eye,
  EyeOff,
  Lock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import DatePicker from "@/components/shared/DatePicker";
import FileUploadField from "@/components/shared/FileUploadField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { getLocalizedCategoryName, handleMutationError } from "@/lib/utils";
import { registerProviderSchema } from "@/lib/validators";

export default function ProviderRegisterForm({ categories, onApplicationSubmitted }) {
  const { t, i18n } = useTranslation(["auth", "common"]);
  const { registerServiceProvider } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

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
      onApplicationSubmitted({
        applicationId:
          appData?.applicationId || "APP-" + Math.floor(100000 + Math.random() * 900000),
        userId: appData?.userId,
        email: variables.email,
      });
      toast.success(t("auth:register.successProvider"));
    },
    onError: (error) =>
      handleMutationError(error, t, "common:error", { id: "register-provider-error" }),
  });

  const onProviderSubmit = (data) => {
    providerMutation.mutate(data);
  };

  return (
    <form onSubmit={providerForm.handleSubmit(onProviderSubmit)} className="space-y-5">
      {/* Section 1: Personal & Contact */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 pb-1 border-b border-border/60">
          <User className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">{t("auth:register.section1")}</h3>
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
            <Controller
              control={providerForm.control}
              name="dateOfBirth"
              render={({ field }) => (
                <DatePicker
                  id="pDob"
                  value={field.value}
                  max={new Date().toISOString().split("T")[0]}
                  onChange={(val) => field.onChange(val)}
                  placeholder={t("auth:register.dateOfBirth")}
                />
              )}
            />
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
          <h3 className="text-sm font-semibold text-foreground">{t("auth:register.section2")}</h3>
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
                        <span className="flex-1">
                          {getLocalizedCategoryName(cat, i18n.language)}
                        </span>
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
            <p className="text-xs text-destructive">{providerForm.formState.errors.bio.message}</p>
          )}
        </div>
      </div>

      {/* Section 3: Document Uploads */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2 pb-1 border-b border-border/60">
          <ShieldCheck className="h-4 w-4 text-cyan-600" />
          <h3 className="text-sm font-semibold text-foreground">{t("auth:register.section3")}</h3>
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
        className="w-full h-11 text-sm font-semibold shadow-sm bg-emerald-600 hover:bg-emerald-700 text-white mt-4"
        disabled={providerMutation.isPending}
      >
        {providerMutation.isPending ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>{t("auth:register.submitting")}</span>
          </div>
        ) : (
          <span>{t("auth:register.submitProvider")}</span>
        )}
      </Button>
    </form>
  );
}
