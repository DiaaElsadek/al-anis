import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Lock, Mail, MapPin, Phone, Loader2 } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import DatePicker from "@/components/shared/DatePicker";
import FileUploadField from "@/components/shared/FileUploadField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { handleMutationError } from "@/lib/utils";
import { registerUserSchema } from "@/lib/validators";

export default function ClientRegisterForm() {
  const { t } = useTranslation(["auth", "common"]);
  const navigate = useNavigate();
  const { registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

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
    onError: (error) =>
      handleMutationError(error, t, "common:error", { id: "register-client-error" }),
  });

  const onClientSubmit = (data) => {
    clientMutation.mutate(data);
  };

  return (
    <form onSubmit={clientForm.handleSubmit(onClientSubmit)} className="space-y-4">
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
            <p className="text-xs text-destructive">{clientForm.formState.errors.email.message}</p>
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
          <Controller
            control={clientForm.control}
            name="dateOfBirth"
            render={({ field }) => (
              <DatePicker
                id="clientDob"
                value={field.value}
                max={new Date().toISOString().split("T")[0]}
                onChange={(val) => field.onChange(val)}
                placeholder={t("auth:register.dateOfBirth")}
              />
            )}
          />
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
        className="w-full h-11 text-sm font-semibold shadow-sm mt-4"
        disabled={clientMutation.isPending}
      >
        {clientMutation.isPending ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>{t("auth:register.creatingAccount")}</span>
          </div>
        ) : (
          <span>{t("auth:register.submitClient")}</span>
        )}
      </Button>
    </form>
  );
}
