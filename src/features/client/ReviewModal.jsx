import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { createReview } from "@/api/reviews";
import RatingStars from "@/components/shared/RatingStars";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { handleMutationError } from "@/lib/utils";
import { createReviewSchema } from "@/lib/validators";

export default function ReviewModal({ open, onOpenChange, serviceRequestId, providerName }) {
  const { t } = useTranslation(["client", "common"]);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createReviewSchema),
    defaultValues: {
      rating: 5,
      comment: "",
    },
  });

  const selectedRating = watch("rating");

  const mutation = useMutation({
    mutationFn: (data) =>
      createReview({
        serviceRequestId,
        rating: data.rating,
        comment: data.comment,
      }),
    onSuccess: () => {
      toast.success(t("client:reviewModal.successToast"));
      queryClient.invalidateQueries(["user-requests"]);
      reset();
      onOpenChange(false);
    },
    onError: (error) => handleMutationError(error, t, "common:error"),
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Star className="h-5 w-5 fill-current" />
            </div>
            <div>
              <DialogTitle>{t("client:reviewModal.title")}</DialogTitle>
              <DialogDescription className="text-xs mt-0.5">
                {providerName
                  ? `${t("client:reviewModal.subtitle")} (${providerName})`
                  : t("client:reviewModal.subtitle")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Star selector */}
          <div className="space-y-1.5 text-center">
            <Label className="text-xs font-semibold block">
              {t("client:reviewModal.ratingLabel")}
            </Label>
            <div className="flex justify-center py-2">
              <RatingStars
                rating={selectedRating}
                interactive
                size="h-7 w-7"
                onChange={(val) => setValue("rating", val, { shouldValidate: true })}
              />
            </div>
            {errors.rating && <p className="text-xs text-destructive">{errors.rating.message}</p>}
          </div>

          {/* Comment */}
          <div className="space-y-1.5">
            <Label htmlFor="revComment" className="text-xs font-semibold">
              {t("client:reviewModal.commentLabel")}
            </Label>
            <Textarea
              id="revComment"
              rows={3}
              placeholder={t("client:reviewModal.commentPlaceholder")}
              className="text-xs resize-none"
              {...register("comment")}
            />
            {errors.comment && <p className="text-xs text-destructive">{errors.comment.message}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("common:cancel")}
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending
                ? t("client:reviewModal.submitting")
                : t("client:reviewModal.submitButton")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
