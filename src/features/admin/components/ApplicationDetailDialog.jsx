import {
  CheckCircle2,
  XCircle,
  CreditCard,
  FileText,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  X,
  File,
} from "lucide-react";
import PropTypes from "prop-types";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import StatusBadge from "@/components/shared/StatusBadge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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

const isImagePath = (path) => path && /\.(jpg|jpeg|png|webp|gif)($|\?)/i.test(path);

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
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  if (!selectedAppId) return null;

  const applicantName = selectedApp
    ? `${selectedApp.firstName || ""} ${selectedApp.lastName || ""}`.trim()
    : "";

  return (
    <>
      <Dialog open={!!selectedAppId} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
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
                  <span className="font-bold text-foreground">{applicantName || "—"}</span>
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
                <span className="font-semibold text-foreground block">
                  {t("auth:register.bio")}
                </span>
                <p className="p-3 rounded-lg bg-muted/20 border border-border/40 text-foreground leading-relaxed">
                  {selectedApp.bio || "—"}
                </p>
              </div>

              <div className="space-y-1.5">
                <span className="font-semibold text-foreground block">
                  {t("admin:applications.experience")}
                </span>
                <p className="p-3 rounded-lg bg-muted/20 border border-border/40 text-foreground leading-relaxed">
                  {selectedApp.experience || "—"}
                </p>
              </div>

              {/* Uploaded Verification Documents */}
              <div className="space-y-3 pt-2 border-t border-border/50">
                <span className="font-semibold text-foreground block text-sm">
                  {t("admin:applications.documentsTitle")}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {/* National ID Document */}
                  <div className="rounded-xl border border-border/70 p-3 bg-card/60 flex flex-col justify-between">
                    <div className="flex items-center gap-2 mb-2 font-medium text-foreground">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span>{t("admin:applications.idDocument")}</span>
                    </div>

                    {selectedApp.idDocumentPath ? (
                      <div>
                        {isImagePath(selectedApp.idDocumentPath) ? (
                          <div className="relative group rounded-lg overflow-hidden border border-border/50 mb-2">
                            <img
                              src={getMediaUrl(selectedApp.idDocumentPath)}
                              alt="National ID"
                              className="h-28 w-full object-cover cursor-pointer"
                              onClick={() => {
                                setPreviewImage(getMediaUrl(selectedApp.idDocumentPath));
                                setZoomLevel(1);
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setPreviewImage(getMediaUrl(selectedApp.idDocumentPath));
                                setZoomLevel(1);
                              }}
                              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity text-xs gap-1 font-semibold"
                            >
                              <ZoomIn className="h-4 w-4" />
                              <span>Enlarge</span>
                            </button>
                          </div>
                        ) : null}
                        <a
                          href={getMediaUrl(selectedApp.idDocumentPath)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-medium"
                        >
                          <span>{t("admin:applications.openDocument")}</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    ) : (
                      <span className="text-muted-foreground italic text-xs">No ID uploaded</span>
                    )}
                  </div>

                  {/* Professional Certificate */}
                  <div className="rounded-xl border border-border/70 p-3 bg-card/60 flex flex-col justify-between">
                    <div className="flex items-center gap-2 mb-2 font-medium text-foreground">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span>{t("admin:applications.certificate")}</span>
                    </div>

                    {selectedApp.certificatePath ? (
                      <div>
                        {isImagePath(selectedApp.certificatePath) ? (
                          <div className="relative group rounded-lg overflow-hidden border border-border/50 mb-2">
                            <img
                              src={getMediaUrl(selectedApp.certificatePath)}
                              alt="Certificate"
                              className="h-28 w-full object-cover cursor-pointer"
                              onClick={() => {
                                setPreviewImage(getMediaUrl(selectedApp.certificatePath));
                                setZoomLevel(1);
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setPreviewImage(getMediaUrl(selectedApp.certificatePath));
                                setZoomLevel(1);
                              }}
                              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity text-xs gap-1 font-semibold"
                            >
                              <ZoomIn className="h-4 w-4" />
                              <span>Enlarge</span>
                            </button>
                          </div>
                        ) : null}
                        <a
                          href={getMediaUrl(selectedApp.certificatePath)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-medium"
                        >
                          <span>{t("admin:applications.openDocument")}</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    ) : (
                      <span className="text-muted-foreground italic text-xs">No certificate</span>
                    )}
                  </div>

                  {/* CV / Resume Document (if exists) */}
                  <div className="rounded-xl border border-border/70 p-3 bg-card/60 flex flex-col justify-between">
                    <div className="flex items-center gap-2 mb-2 font-medium text-foreground">
                      <File className="h-4 w-4 text-muted-foreground" />
                      <span>{t("admin:applications.cv")}</span>
                    </div>

                    {selectedApp.cvPath ? (
                      <div>
                        {isImagePath(selectedApp.cvPath) ? (
                          <div className="relative group rounded-lg overflow-hidden border border-border/50 mb-2">
                            <img
                              src={getMediaUrl(selectedApp.cvPath)}
                              alt="CV"
                              className="h-28 w-full object-cover cursor-pointer"
                              onClick={() => {
                                setPreviewImage(getMediaUrl(selectedApp.cvPath));
                                setZoomLevel(1);
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setPreviewImage(getMediaUrl(selectedApp.cvPath));
                                setZoomLevel(1);
                              }}
                              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity text-xs gap-1 font-semibold"
                            >
                              <ZoomIn className="h-4 w-4" />
                              <span>Enlarge</span>
                            </button>
                          </div>
                        ) : null}
                        <a
                          href={getMediaUrl(selectedApp.cvPath)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-medium"
                        >
                          <span>{t("admin:applications.openDocument")}</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    ) : (
                      <span className="text-muted-foreground italic text-xs">No CV uploaded</span>
                    )}
                  </div>
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
                      onClick={() => setShowApproveConfirm(true)}
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

      {/* Approve Confirmation Dialog */}
      <AlertDialog open={showApproveConfirm} onOpenChange={setShowApproveConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("admin:applications.approveConfirm.title", { name: applicantName })}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("admin:applications.approveConfirm.description", { name: applicantName })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isApproving}>{t("common:cancel")}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              disabled={isApproving}
              onClick={(e) => {
                e.preventDefault();
                setShowApproveConfirm(false);
                onApprove(selectedApp.id);
              }}
            >
              {t("admin:applications.approveConfirm.confirmButton")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Full Resolution Image Viewer with Zoom Controls */}
      {previewImage && (
        <Dialog open={!!previewImage} onOpenChange={(open) => !open && setPreviewImage(null)}>
          <DialogContent className="max-w-4xl max-h-[95vh] p-4 flex flex-col items-center">
            <div className="w-full flex items-center justify-between pb-2 border-b border-border/50">
              <span className="font-semibold text-sm">Document Full Resolution Viewer</span>
              <div className="flex items-center gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.25))}
                  title="Zoom Out"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-xs font-mono px-1">{Math.round(zoomLevel * 100)}%</span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => setZoomLevel((z) => Math.min(3, z + 0.25))}
                  title="Zoom In"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => setZoomLevel(1)}
                  title="Reset Zoom"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => setPreviewImage(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="w-full overflow-auto max-h-[75vh] flex items-center justify-center p-4 bg-muted/20 rounded-lg">
              <img
                src={previewImage}
                alt="Document preview"
                style={{ transform: `scale(${zoomLevel})`, transition: "transform 0.15s ease" }}
                className="max-h-[70vh] object-contain rounded"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
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
