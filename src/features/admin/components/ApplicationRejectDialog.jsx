import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

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

export default function ApplicationRejectDialog({
  open,
  onOpenChange,
  rejectionReason,
  onReasonChange,
  onConfirm,
  isRejecting,
}) {
  const { t } = useTranslation(["admin", "common"]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("admin:applications.rejectModal.title")}</DialogTitle>
          <DialogDescription className="text-xs mt-0.5">
            {t("admin:applications.rejectModal.subtitle")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              {t("admin:applications.rejectModal.reasonLabel")} *
            </Label>
            <Textarea
              placeholder={t("admin:applications.rejectModal.reasonPlaceholder")}
              rows={3}
              className="text-xs resize-none"
              value={rejectionReason}
              onChange={(e) => onReasonChange(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t("common:actions.cancel")}
            </Button>
            <Button
              variant="destructive"
              disabled={!rejectionReason.trim() || isRejecting}
              onClick={onConfirm}
            >
              {isRejecting
                ? t("admin:applications.rejecting")
                : t("admin:applications.rejectModal.confirmButton")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

ApplicationRejectDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  rejectionReason: PropTypes.string.isRequired,
  onReasonChange: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  isRejecting: PropTypes.bool,
};
