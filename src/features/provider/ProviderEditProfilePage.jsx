import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Camera, Save, AlertCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { getProviderProfile, updateProviderProfile } from "@/api/provider";
import EmptyState from "@/components/shared/EmptyState";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import ChangePasswordDialog from "@/features/auth/ChangePasswordDialog";
import { useAuth } from "@/hooks/useAuth";
import {
  getInitials,
  getLocalizedCategoryName,
  getMediaUrl,
  handleMutationError,
} from "@/lib/utils";

export default function ProviderEditProfilePage() {
  const { t, i18n } = useTranslation(["provider", "client", "common"]);
  const queryClient = useQueryClient();
  const { updateUser } = useAuth();
  const fileInputRef = useRef(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [selectedPhotoFile, setSelectedPhotoFile] = useState(null);

  const {
    data: profile,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["provider-profile"],
    queryFn: getProviderProfile,
  });

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      bio: "",
      experience: "",
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        bio: profile.bio || "",
        experience: profile.experience || "",
      });
    }
  }, [profile, reset]);

  const updateMutation = useMutation({
    mutationFn: (data) => {
      const formData = new FormData();
      formData.append("Bio", data.bio);
      formData.append("Experience", data.experience);
      if (selectedPhotoFile instanceof File) {
        formData.append("ProfilePicture", selectedPhotoFile);
      }
      return updateProviderProfile(formData);
    },
    onSuccess: (updated) => {
      toast.success(t("provider:editProfile.successToast"));
      queryClient.invalidateQueries(["provider-profile"]);
      queryClient.invalidateQueries(["provider-dashboard"]);
      if (updated?.profilePicture) {
        updateUser({ profilePicture: updated.profilePicture });
      }
    },
    onError: (error) => handleMutationError(error, t, "common:error"),
  });

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedPhotoFile(file);
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
    }
  };

  const onSubmit = (data) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto py-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-2xl mx-auto py-16">
        <EmptyState
          icon={AlertCircle}
          title={t("common:error")}
          description={t("common:empty.tryAdjusting")}
          actionLabel={t("common:actions.retry")}
          onAction={() => refetch()}
        />
      </div>
    );
  }

  const providerName =
    profile?.fullName ||
    `${profile?.firstName || ""} ${profile?.lastName || ""}`.trim() ||
    t("common:roles.provider");

  const displayAvatar = photoPreview || getMediaUrl(profile?.profilePicture);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t("provider:editProfile.title")}</h1>
        <p className="text-xs text-muted-foreground mt-0.5">{t("provider:editProfile.subtitle")}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="border-border/70 shadow-sm bg-card overflow-hidden">
          {/* Gradient Hero Header mirroring client-facing profile */}
          <div className="h-24 bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900" />

          <CardContent className="p-6 sm:p-8 pt-0 relative space-y-6">
            {/* Overlapping Avatar and Identity Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-12">
              <div className="flex items-end gap-4">
                <div className="relative group">
                  <Avatar className="h-24 w-24 rounded-2xl border-4 border-card shadow-md">
                    <AvatarImage src={displayAvatar} alt={providerName} />
                    <AvatarFallback className="rounded-2xl bg-primary/10 text-primary font-bold text-2xl">
                      {getInitials(providerName)}
                    </AvatarFallback>
                  </Avatar>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 rounded-2xl bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-4 border-card"
                    title={t("client:settings.uploadPhoto")}
                  >
                    <Camera className="h-5 w-5" />
                    <span className="text-[10px] font-medium mt-0.5">{t("common:edit")}</span>
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoSelect}
                  />
                </div>

                <div className="space-y-1 mb-1">
                  <h3 className="text-lg font-bold text-foreground">{providerName}</h3>
                  <p className="text-xs text-muted-foreground">{profile?.email}</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs mt-1"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {t("client:settings.uploadPhoto")}
                  </Button>
                </div>
              </div>
            </div>

            {/* Specialties read-only preview */}
            {profile?.categories?.length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-border/50">
                <Label className="text-xs font-semibold text-muted-foreground">
                  {t("auth:register.categories")}
                </Label>
                <div className="flex flex-wrap gap-1.5">
                  {profile.categories.map((c) => (
                    <Badge key={c.id} variant="secondary" className="text-xs">
                      {getLocalizedCategoryName(c, i18n.language)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Experience (Years & background) */}
            <div className="space-y-1.5 pt-2 border-t border-border/50">
              <Label htmlFor="experienceInput" className="text-xs font-semibold">
                {t("provider:editProfile.experienceLabel")}
              </Label>
              <Input
                id="experienceInput"
                placeholder="e.g. 5 years in intensive and elderly home care..."
                className="text-xs"
                {...register("experience")}
              />
            </div>

            {/* Bio (About & Description) */}
            <div className="space-y-1.5">
              <Label htmlFor="bioInput" className="text-xs font-semibold">
                {t("provider:editProfile.bioLabel")}
              </Label>
              <Textarea
                id="bioInput"
                rows={4}
                placeholder="Describe your care philosophy, background, and strengths..."
                className="text-xs resize-none leading-relaxed"
                {...register("bio")}
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={updateMutation.isPending}>
                <Save className="h-4 w-4 me-2" />
                {updateMutation.isPending
                  ? t("provider:editProfile.saving")
                  : t("provider:editProfile.saveButton")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      {/* Password Management */}
      <Card className="border-border/70 shadow-sm bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">{t("client:settings.security")}</CardTitle>
          <CardDescription className="text-xs">
            {t("client:settings.changePasswordDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-foreground">
              {t("client:settings.changePassword")}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t("client:settings.changePasswordDesc")}
            </p>
          </div>
          <ChangePasswordDialog />
        </CardContent>
      </Card>
    </div>
  );
}
