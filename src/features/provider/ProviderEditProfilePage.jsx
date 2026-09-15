import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  User,
  Briefcase,
  Camera,
  ShieldCheck,
  MapPin,
  Save,
  CheckCircle2,
} from "lucide-react";

import { getProviderProfile, updateProviderProfile } from "@/api/provider";
import { useAuth } from "@/hooks/useAuth";
import { getMediaUrl, getInitials } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import ChangePasswordDialog from "@/features/auth/ChangePasswordDialog";

export default function ProviderEditProfilePage() {
  const queryClient = useQueryClient();
  const { updateUser } = useAuth();
  const fileInputRef = useRef(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [selectedPhotoFile, setSelectedPhotoFile] = useState(null);

  const { data: profile, isLoading } = useQuery({
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
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries(["provider-profile"]);
      queryClient.invalidateQueries(["provider-dashboard"]);
      if (updated?.profilePicture) {
        updateUser({ profilePicture: updated.profilePicture });
      }
    },
    onError: (error) => {
      toast.error("Failed to update profile", {
        description: error?.response?.data?.message || "Please check inputs.",
      });
    },
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

  const providerName =
    profile?.fullName ||
    `${profile?.firstName || ""} ${profile?.lastName || ""}`.trim() ||
    "Specialist";

  const displayAvatar = photoPreview || getMediaUrl(profile?.profilePicture);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Provider Profile & Details</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Update your public profile, care introduction, experience, and photo.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="border-border/70 shadow-sm bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-bold">Public Bio & Photo</CardTitle>
            <CardDescription className="text-xs">
              This information is displayed on your verified provider profile to clients.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Avatar Row */}
            <div className="flex items-center gap-5">
              <div className="relative group">
                <Avatar className="h-20 w-20 rounded-2xl border-2 border-primary/20 shadow-sm">
                  <AvatarImage src={displayAvatar} alt={providerName} />
                  <AvatarFallback className="rounded-2xl bg-primary/10 text-primary font-bold text-xl">
                    {getInitials(providerName)}
                  </AvatarFallback>
                </Avatar>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
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
                  onChange={handlePhotoSelect}
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base font-bold text-foreground">{providerName}</h3>
                  <ShieldCheck className="h-4 w-4 text-teal-600" />
                </div>
                <p className="text-xs text-muted-foreground">{profile?.email}</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs mt-1"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Change Profile Picture
                </Button>
              </div>
            </div>

            {/* Specialties read-only preview */}
            {profile?.categories?.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <Label className="text-xs font-semibold">Registered Categories</Label>
                <div className="flex flex-wrap gap-1.5">
                  {profile.categories.map((c) => (
                    <Badge key={c.id} variant="secondary" className="text-xs">
                      {c.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Experience */}
            <div className="space-y-1.5">
              <Label htmlFor="experienceInput" className="text-xs font-semibold">
                Years & Summary of Experience
              </Label>
              <Input
                id="experienceInput"
                placeholder="e.g. 5 years in intensive nursing and elderly assistance"
                {...register("experience")}
              />
            </div>

            {/* Bio */}
            <div className="space-y-1.5">
              <Label htmlFor="bioInput" className="text-xs font-semibold">
                Professional Bio & Philosophy
              </Label>
              <Textarea
                id="bioInput"
                rows={4}
                placeholder="Share your qualifications, approach to compassionate care, and communication style..."
                className="text-xs resize-none"
                {...register("bio")}
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={updateMutation.isPending}>
                <Save className="h-4 w-4 me-2" />
                {updateMutation.isPending ? "Saving..." : "Save Profile Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      {/* Password Management */}
      <Card className="border-border/70 shadow-sm bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">Security Settings</CardTitle>
          <CardDescription className="text-xs">
            Manage your password and authentication credentials.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-foreground">Password</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Keep your account protected with a strong credentials combination.
            </p>
          </div>
          <ChangePasswordDialog />
        </CardContent>
      </Card>
    </div>
  );
}
