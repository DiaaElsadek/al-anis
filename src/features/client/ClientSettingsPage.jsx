import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Mail, Phone, Camera, Shield, CheckCircle2, AlertCircle } from "lucide-react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { getUserProfile, updateProfilePicture } from "@/api/user";
import EmptyState from "@/components/shared/EmptyState";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ChangePasswordDialog from "@/features/auth/ChangePasswordDialog";
import { useAuth } from "@/hooks/useAuth";
import { getMediaUrl, getInitials, handleMutationError } from "@/lib/utils";

export default function ClientSettingsPage() {
  const { t } = useTranslation(["client", "common"]);
  const queryClient = useQueryClient();
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);

  const {
    data: profile,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["user-profile"],
    queryFn: getUserProfile,
  });

  const activeUser = profile || user;

  // Update profile picture mutation
  const avatarMutation = useMutation({
    mutationFn: (file) => {
      const formData = new FormData();
      formData.append("ProfilePicture", file);
      return updateProfilePicture(formData);
    },
    onSuccess: (newUrl) => {
      toast.success(t("client:settings.photoUpdatedToast"));
      queryClient.invalidateQueries(["user-profile"]);
      if (typeof newUrl === "string") {
        updateUser({ profilePicture: newUrl });
      }
    },
    onError: (error) => handleMutationError(error, t, "common:error"),
  });

  const handleAvatarSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      avatarMutation.mutate(file);
    }
  };

  if (isLoading && !user) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto py-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError && !user) {
    return (
      <EmptyState
        icon={AlertCircle}
        title={t("common:error")}
        description={t("common:empty.tryAdjusting")}
        actionLabel={t("common:actions.retry")}
        onAction={() => refetch()}
      />
    );
  }

  const displayName =
    activeUser?.name ||
    `${activeUser?.firstName || ""} ${activeUser?.lastName || ""}`.trim() ||
    activeUser?.email?.split("@")[0] ||
    t("common:roles.client");

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t("client:settings.title")}</h1>
        <p className="text-xs text-muted-foreground mt-0.5">{t("client:settings.subtitle")}</p>
      </div>

      {/* Profile Card */}
      <Card className="border-border/70 shadow-sm bg-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-bold">
            {t("client:settings.personalDetails")}
          </CardTitle>
          <CardDescription className="text-xs">{t("client:settings.subtitle")}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Avatar row */}
          <div className="flex items-center gap-5">
            <div className="relative group">
              <Avatar className="h-20 w-20 rounded-2xl border-2 border-primary/20 shadow-sm">
                <AvatarImage src={getMediaUrl(activeUser?.profilePicture)} alt={displayName} />
                <AvatarFallback className="rounded-2xl bg-primary/10 text-primary font-bold text-xl">
                  {getInitials(displayName)}
                </AvatarFallback>
              </Avatar>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarMutation.isPending}
                className="absolute inset-0 rounded-2xl bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                title="Change Photo"
              >
                <Camera className="h-5 w-5" />
                <span className="text-[10px] font-medium mt-0.5">{t("common:edit")}</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarSelect}
              />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">{displayName}</h3>
              <p className="text-xs text-muted-foreground">{activeUser?.email}</p>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs mt-1"
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarMutation.isPending}
              >
                {avatarMutation.isPending ? t("common:loading") : t("client:settings.uploadPhoto")}
              </Button>
            </div>
          </div>

          {/* User Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border/50 text-xs">
            <div className="p-3 rounded-xl bg-muted/20 border border-border/40 space-y-1">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-primary" />
                {t("client:settings.email")}
              </span>
              <span className="font-semibold text-foreground block">{activeUser?.email}</span>
            </div>

            <div className="p-3 rounded-xl bg-muted/20 border border-border/40 space-y-1">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-primary" />
                {t("client:settings.phone")}
              </span>
              <span className="font-semibold text-foreground block">
                {activeUser?.phoneNumber || activeUser?.phone || "-"}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-muted/20 border border-border/40 space-y-1">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-primary" />
                {t("common:roles.client")}
              </span>
              <span className="font-semibold text-foreground block capitalize">
                {activeUser?.role || t("common:roles.client")}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-muted/20 border border-border/40 space-y-1">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                {t("client:profile.nationalIdVerified")}
              </span>
              <span className="font-semibold text-emerald-600 block">
                {t("client:directory.verified")}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security & Password Card */}
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
