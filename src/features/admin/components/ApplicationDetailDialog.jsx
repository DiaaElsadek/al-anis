import { CheckCircle2, XCircle, CreditCard, FileText, ExternalLink } from "lucide-react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import StatusBadge from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { getMediaUrl } from "@/lib/utils";

export default function ApplicationDetailDialog({
  selectedAppId,
  selectedApp,
  detailLoading,
  onClose,
  onOpenReject,
  onApprove,
  isApproving,
}) {
  const { t } = useTranslation(["admin", "common", "auth", "client"]);

  if (!selectedAppId) return null;

  return (
    <Dialog open={!!selectedAppId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{t("admin:applications.drawerTitle")}</DialogTitle>
            {selectedApp && <StatusBadge status={selectedApp.status} />}
          </div>
          <DialogDescription className="text-xs">
            {t("admin:applications.drawerSubtitle")}
          </DialogDescription>
        </DialogHeader>

        {detailLoading || !selectedApp ? (
          <div className="space-y-3 py-6">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          <div className="space-y-4 pt-2 text-xs">
            {/* Personal grid */}
            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-muted/25 border border-border/50">
              <div>
                <span className="text-muted-foreground block text-[11px]">
                  {t("auth:register.fullName")}
                </span>
                <span className="font-bold text-foreground">
                  {selectedApp.firstName} {selectedApp.lastName}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">
                  {t("admin:applications.nationalId")}
                </span>
                <span className="font-mono font-bold text-foreground">
                  {selectedApp.nationalId || "—"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">
                  {t("auth:login.emailLabel")}
                </span>
                <span className="text-foreground">{selectedApp.userEmail}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">
                  {t("auth:register.phoneNumber")}
                </span>
                <span className="text-foreground font-mono">{selectedApp.phoneNumber}</span>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground block text-[11px]">
                  {t("client:profile.address")}
                </span>
                <span className="text-foreground">{selectedApp.address || "—"}</span>
              </div>
            </div>

            {/* Professional summary */}
            <div className="space-y-1.5">
              <span className="font-semibold text-foreground block">{t("auth:register.bio")}</span>
              <p className="p-3 rounded-lg bg-muted/20 border border-border/40 text-foreground leading-relaxed">
                {selectedApp.bio || "—"}
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="font-semibold text-foreground block">
                {t("admin:applications.experience")}
              </span>
              <p className="p-3 rounded-lg bg-muted/20 border border-border/40 text-foreground leading-relaxed">
                {selectedApp.experience}
              </p>
            </div>

            {/* Uploaded Verification Documents */}
            <div className="space-y-2 pt-2 border-t border-border/50">
              <span className="font-semibold text-foreground block">
                {t("admin:applications.documentsTitle")}
              </span>
              <div className="grid grid-cols-2 gap-3">
                {selectedApp.idDocumentPath ? (
                  <a
                    href={getMediaUrl(selectedApp.idDocumentPath)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 p-3 rounded-lg border border-border/70 hover:bg-muted/40 transition-colors text-primary font-semibold"
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>{t("admin:applications.idDocument")}</span>
                    <ExternalLink className="h-3 w-3 ms-auto opacity-70" />
                  </a>
                ) : (
                  <span className="text-muted-foreground italic">No ID uploaded</span>
                )}

                {selectedApp.certificatePath ? (
                  <a
                    href={getMediaUrl(selectedApp.certificatePath)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 p-3 rounded-lg border border-border/70 hover:bg-muted/40 transition-colors text-teal-700 dark:text-teal-400 font-semibold"
                  >
                    <FileText className="h-4 w-4" />
                    <span>{t("admin:applications.certificate")}</span>
                    <ExternalLink className="h-3 w-3 ms-auto opacity-70" />
                  </a>
                ) : (
                  <span className="text-muted-foreground italic">No certificate</span>
                )}
              </div>
            </div>

            {/* Audit Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t border-border/60">
              <Button variant="outline" onClick={onClose}>
                {t("common:actions.close")}
              </Button>

              {selectedApp.status === 0 && (
                <>
                  <Button variant="destructive" onClick={onOpenReject} disabled={isApproving}>
                    <XCircle className="h-4 w-4 me-1.5" />
                    {t("admin:applications.rejectButton")}
                  </Button>

                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                    onClick={() => onApprove(selectedApp.id)}
                    disabled={isApproving}
                  >
                    <CheckCircle2 className="h-4 w-4 me-1.5" />
                    {isApproving
                      ? t("admin:applications.approving")
                      : t("admin:applications.approveButton")}
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

ApplicationDetailDialog.propTypes = {
  selectedAppId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  selectedApp: PropTypes.object,
  detailLoading: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onOpenReject: PropTypes.func.isRequired,
  onApprove: PropTypes.func.isRequired,
  isApproving: PropTypes.bool,
};
