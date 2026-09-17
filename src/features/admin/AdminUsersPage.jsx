import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Users, Search, AlertCircle, Lock, Unlock } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import {
  getUsers,
  suspendUser,
  activateUser,
  suspendServiceProvider,
  activateServiceProvider,
} from "@/api/admin";
import EmptyState from "@/components/shared/EmptyState";
import Pagination from "@/components/shared/Pagination";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDebounce } from "@/hooks/useDebounce";
import { formatLocalizedDate, getInitials, getMediaUrl, handleMutationError } from "@/lib/utils";

export default function AdminUsersPage() {
  const { t, i18n } = useTranslation(["admin", "common", "auth"]);
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 400);
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [confirmAction, setConfirmAction] = useState(null);

  const {
    data: usersData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["admin-users", debouncedSearch, roleFilter, statusFilter, page],
    queryFn: () =>
      getUsers({
        Search: debouncedSearch || undefined,
        Role: roleFilter !== "all" ? roleFilter : undefined,
        Status: statusFilter !== "all" ? statusFilter : undefined,
        Page: page,
        PageSize: pageSize,
      }),
    keepPreviousData: true,
  });

  const users = usersData?.items || [];
  const totalPages = usersData?.totalPages || 1;

  // Suspend mutation
  const suspendMutation = useMutation({
    mutationFn: ({ userId, role }) => {
      if (role?.toLowerCase().includes("provider")) {
        return suspendServiceProvider(userId, "Admin manual suspension");
      }
      return suspendUser(userId);
    },
    onSuccess: (_, variables) => {
      const targetName = confirmAction?.user?.name || variables?.name || "User";
      toast.success(t("admin:users.toasts.userSuspended", { name: targetName }));
      setConfirmAction(null);
      queryClient.invalidateQueries(["admin-users"]);
    },
    onError: (error) => handleMutationError(error, t, "common:error"),
  });

  // Activate mutation
  const activateMutation = useMutation({
    mutationFn: ({ userId, role }) => {
      if (role?.toLowerCase().includes("provider")) {
        return activateServiceProvider(userId);
      }
      return activateUser(userId);
    },
    onSuccess: (_, variables) => {
      const targetName = confirmAction?.user?.name || variables?.name || "User";
      toast.success(t("admin:users.toasts.userActivated", { name: targetName }));
      setConfirmAction(null);
      queryClient.invalidateQueries(["admin-users"]);
    },
    onError: (error) => handleMutationError(error, t, "common:error"),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t("admin:users.title")}</h1>
        <p className="text-xs text-muted-foreground mt-0.5">{t("admin:users.subtitle")}</p>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-card border border-border/70 shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search className="absolute start-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("admin:users.searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="ps-9 h-9 text-xs rounded-xl"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Role Filter */}
          <Select
            value={roleFilter}
            onValueChange={(val) => {
              setRoleFilter(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[140px] h-9 text-xs">
              <SelectValue placeholder={t("admin:users.allRoles")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("admin:users.allRoles")}</SelectItem>
              <SelectItem value="User">{t("common:roles.user")}</SelectItem>
              <SelectItem value="ServiceProvider">{t("common:roles.serviceProvider")}</SelectItem>
              <SelectItem value="Admin">{t("common:roles.admin")}</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select
            value={statusFilter}
            onValueChange={(val) => {
              setStatusFilter(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[140px] h-9 text-xs">
              <SelectValue placeholder={t("admin:users.allStatuses")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("admin:users.allStatuses")}</SelectItem>
              <SelectItem value="Active">{t("common:status.active")}</SelectItem>
              <SelectItem value="Suspended">{t("common:status.suspended")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Users Table */}
      <Card className="border-border/70 shadow-sm bg-card">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          ) : isError ? (
            <div className="py-16 text-center">
              <EmptyState
                icon={AlertCircle}
                title={t("common:error")}
                description={t("common:empty.tryAdjusting")}
                actionLabel={t("common:actions.retry")}
                onAction={() => refetch()}
              />
            </div>
          ) : users.length === 0 ? (
            <div className="py-16 text-center">
              <EmptyState
                icon={Users}
                title={t("common:empty.noResults")}
                description={t("common:empty.tryAdjusting")}
              />
            </div>
          ) : (
            <Table className="text-xs text-start">
              <TableHeader className="bg-muted/20 text-muted-foreground">
                <TableRow className="border-b border-border/60">
                  <TableHead className="py-3 px-4 font-semibold text-start">
                    {t("admin:users.userCol")}
                  </TableHead>
                  <TableHead className="py-3 px-4 font-semibold text-start">
                    {t("auth:register.phoneNumber")}
                  </TableHead>
                  <TableHead className="py-3 px-4 font-semibold text-start">
                    {t("admin:users.roleCol")}
                  </TableHead>
                  <TableHead className="py-3 px-4 font-semibold text-start">
                    {t("admin:users.joinedCol")}
                  </TableHead>
                  <TableHead className="py-3 px-4 font-semibold text-center">
                    {t("admin:users.statusCol")}
                  </TableHead>
                  <TableHead className="py-3 px-4 font-semibold text-end">
                    {t("admin:users.actionsCol")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-border/40">
                {users.map((u) => {
                  const isSuspended = u.status?.toLowerCase().includes("suspend") || false;

                  const roleLabel =
                    u.role === "Admin"
                      ? t("common:roles.admin")
                      : u.role === "ServiceProvider"
                        ? t("common:roles.serviceProvider")
                        : t("common:roles.user");

                  return (
                    <TableRow key={u.id} className="hover:bg-muted/25 transition-colors">
                      <TableCell className="py-3 px-4 font-bold text-foreground">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 rounded-xl border">
                            <AvatarImage src={getMediaUrl(u.profilePicture)} alt={u.name} />
                            <AvatarFallback className="rounded-xl font-bold text-xs bg-primary/10 text-primary">
                              {getInitials(u.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{u.name || t("common:roles.user")}</span>
                        </div>
                      </TableCell>

                      <TableCell className="py-3 px-4 text-muted-foreground">
                        <div>{u.email}</div>
                        <div className="text-[11px] font-mono">{u.phone || "—"}</div>
                      </TableCell>

                      <TableCell className="py-3 px-4">
                        <Badge
                          variant="outline"
                          className={`text-[11px] font-medium ${
                            u.role === "Admin"
                              ? "bg-amber-500/10 text-amber-700 border-amber-500/20"
                              : u.role === "ServiceProvider"
                                ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
                                : "bg-primary/10 text-primary border-primary/20"
                          }`}
                        >
                          {roleLabel}
                        </Badge>
                      </TableCell>

                      <TableCell className="py-3 px-4 text-muted-foreground">
                        {u.joined ? formatLocalizedDate(u.joined, "PP", i18n.language) : "—"}
                      </TableCell>

                      <TableCell className="py-3 px-4 text-center">
                        <StatusBadge status={isSuspended ? "suspended" : "active"} />
                      </TableCell>

                      <TableCell className="py-3 px-4 text-end">
                        {isSuspended ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                            onClick={() => setConfirmAction({ type: "activate", user: u })}
                            disabled={activateMutation.isPending || suspendMutation.isPending}
                          >
                            <Unlock className="h-3 w-3 me-1" />
                            {t("admin:users.activateButton")}
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs text-destructive hover:bg-destructive/10"
                            onClick={() => setConfirmAction({ type: "suspend", user: u })}
                            disabled={activateMutation.isPending || suspendMutation.isPending}
                          >
                            <Lock className="h-3 w-3 me-1" />
                            {t("admin:users.suspendButton")}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex justify-center pt-2">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}

      {/* Consequence-specific confirmation dialog */}
      <AlertDialog open={!!confirmAction} onOpenChange={(open) => !open && setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction?.type === "suspend"
                ? t("admin:users.suspendModal.title", { name: confirmAction?.user?.name })
                : t("admin:users.activateModal.title", { name: confirmAction?.user?.name })}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction?.type === "suspend"
                ? t("admin:users.suspendModal.description", { name: confirmAction?.user?.name })
                : t("admin:users.activateModal.description", { name: confirmAction?.user?.name })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={suspendMutation.isPending || activateMutation.isPending}>
              {t("common:cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              className={
                confirmAction?.type === "suspend"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : ""
              }
              disabled={suspendMutation.isPending || activateMutation.isPending}
              onClick={(e) => {
                e.preventDefault();
                if (!confirmAction) return;
                if (confirmAction.type === "suspend") {
                  suspendMutation.mutate({
                    userId: confirmAction.user.id,
                    role: confirmAction.user.role,
                    name: confirmAction.user.name,
                  });
                } else {
                  activateMutation.mutate({
                    userId: confirmAction.user.id,
                    role: confirmAction.user.role,
                    name: confirmAction.user.name,
                  });
                }
              }}
            >
              {confirmAction?.type === "suspend"
                ? t("admin:users.suspendModal.confirmButton")
                : t("admin:users.activateModal.confirmButton")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
