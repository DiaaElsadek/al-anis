import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Lock, Eye, EyeOff, ShieldCheck, ArrowRight } from "lucide-react";

import { changePasswordSchema } from "@/lib/validators";
import { changePassword } from "@/api/account";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ChangePasswordDialog({ trigger }) {
  const [open, setOpen] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data) => changePassword(data),
    onSuccess: () => {
      toast.success("Password changed successfully!");
      reset();
      setOpen(false);
    },
    onError: (error) => {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.errors?.join(", ") ||
        error?.message ||
        "Failed to change password. Ensure your current password is correct.";
      toast.error("Error changing password", {
        id: "change-password-error",
        description: msg,
      });
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Lock className="h-4 w-4 me-2" />
            Change Password
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle>Change Account Password</DialogTitle>
              <DialogDescription className="text-xs mt-1">
                Enter your current password and choose a secure new one.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Current Password */}
          <div className="space-y-1.5">
            <Label htmlFor="currPass" className="text-xs font-semibold">
              Current Password
            </Label>
            <Input
              id="currPass"
              type={showPass ? "text" : "password"}
              placeholder="••••••••"
              {...register("currentPassword")}
            />
            {errors.currentPassword && (
              <p className="text-xs text-destructive">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-1.5">
            <Label htmlFor="newPass" className="text-xs font-semibold">
              New Password
            </Label>
            <div className="relative">
              <Input
                id="newPass"
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                className="pe-9"
                {...register("newPassword")}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute end-3 top-2.5 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-xs text-destructive">{errors.newPassword.message}</p>
            )}
          </div>

          {/* Confirm New Password */}
          <div className="space-y-1.5">
            <Label htmlFor="confNewPass" className="text-xs font-semibold">
              Confirm New Password
            </Label>
            <Input
              id="confNewPass"
              type={showPass ? "text" : "password"}
              placeholder="••••••••"
              {...register("confirmNewPassword")}
            />
            {errors.confirmNewPassword && (
              <p className="text-xs text-destructive">
                {errors.confirmNewPassword.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Updating..." : "Save New Password"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
