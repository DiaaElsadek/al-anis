import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  User,
  Mail,
  Phone,
  Camera,
  Shield,
  Lock,
  Calendar,
  CheckCircle2,
} from "lucide-react";

import { getUserProfile, updateProfilePicture } from "@/api/user";
import { useAuth } from "@/hooks/useAuth";
import { getMediaUrl, getInitials } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import ChangePasswordDialog from "@/features/auth/ChangePasswordDialog";

export default function ClientSettingsPage() {
  const queryClient = useQueryClient();
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);

  const { data: profile, isLoading } = useQuery({
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
      toast.success("Profile photo updated!");
      queryClient.invalidateQueries(["user-profile"]);
      if (typeof newUrl === "string") {
        updateUser({ profilePicture: newUrl });
      }
    },
    onError: (error) => {
      toast.error("Failed to upload photo", {
        description: error?.response?.data?.message || "Please select a valid image.",
      });
    },
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

  const displayName =
    activeUser?.name ||
    `${activeUser?.firstName || ""} ${activeUser?.lastName || ""}`.trim() ||
    activeUser?.email?.split("@")[0] ||
    "User";

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Account Settings</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Manage your personal profile, photo, and security preferences.
        </p>
      </div>

      {/* Profile Card */}
      <Card className="border-border/70 shadow-sm bg-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-bold">Personal Profile</CardTitle>
          <CardDescription className="text-xs">
            Your identity visible across Alanis platform bookings.
          </CardDescription>
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
                <span className="text-[10px] font-medium mt-0.5">Edit</span>
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
                {avatarMutation.isPending ? "Uploading..." : "Upload New Photo"}
              </Button>
            </div>
          </div>

          {/* User Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border/50 text-xs">
            <div className="p-3 rounded-xl bg-muted/20 border border-border/40 space-y-1">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-primary" />
                Email Address
              </span>
              <span className="font-semibold text-foreground block">{activeUser?.email}</span>
            </div>

            <div className="p-3 rounded-xl bg-muted/20 border border-border/40 space-y-1">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-primary" />
                Mobile Phone
              </span>
              <span className="font-semibold text-foreground block">
                {activeUser?.phoneNumber || activeUser?.phone || "Not specified"}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-muted/20 border border-border/40 space-y-1">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-primary" />
                Account Role
              </span>
              <span className="font-semibold text-foreground block capitalize">
                {activeUser?.role || "Client"}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-muted/20 border border-border/40 space-y-1">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                Email Verification
              </span>
              <span className="font-semibold text-emerald-600 block">Verified Account</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security & Password Card */}
      <Card className="border-border/70 shadow-sm bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">Security & Authentication</CardTitle>
          <CardDescription className="text-xs">
            Update your account password and security credentials.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-foreground">Password</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Ensure your password is at least 8 characters with numbers and symbols.
            </p>
          </div>
          <ChangePasswordDialog />
        </CardContent>
      </Card>
    </div>
  );
}
