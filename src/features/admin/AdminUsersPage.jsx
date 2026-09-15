import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Users,
  Search,
  Shield,
  Briefcase,
  User,
  Power,
  AlertCircle,
  CheckCircle2,
  Lock,
  Unlock,
} from "lucide-react";

import {
  getUsers,
  suspendUser,
  activateUser,
  suspendServiceProvider,
  activateServiceProvider,
} from "@/api/admin";
import { useDebounce } from "@/hooks/useDebounce";
import { getMediaUrl, getInitials, formatLocalizedDate } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import Pagination from "@/components/shared/Pagination";
import EmptyState from "@/components/shared/EmptyState";

export default function AdminUsersPage() {
  const { t, i18n } = useTranslation(["admin", "common", "auth"]);
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 400);
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data: usersData, isLoading } = useQuery({
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
    onSuccess: () => {
      toast.success("User account suspended.");
      queryClient.invalidateQueries(["admin-users"]);
    },
    onError: (error) => {
      toast.error("Action error", {
        description: error?.response?.data?.message || "Could not suspend account.",
      });
    },
  });

  // Activate mutation
  const activateMutation = useMutation({
    mutationFn: ({ userId, role }) => {
      if (role?.toLowerCase().includes("provider")) {
        return activateServiceProvider(userId);
      }
      return activateUser(userId);
    },
    onSuccess: () => {
      toast.success("User account activated!");
      queryClient.invalidateQueries(["admin-users"]);
    },
    onError: (error) => {
      toast.error("Action error", {
        description: error?.response?.data?.message || "Could not activate account.",
      });
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t("admin:users.title")}</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          {t("admin:users.subtitle")}
        </p>
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
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="h-9 rounded-lg border border-input bg-background px-3 text-xs text-foreground focus:ring-1 focus:ring-primary"
          >
            <option value="all">{t("admin:users.allRoles")}</option>
            <option value="User">{t("common:roles.user")}</option>
            <option value="ServiceProvider">{t("common:roles.serviceProvider")}</option>
            <option value="Admin">{t("common:roles.admin")}</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="h-9 rounded-lg border border-input bg-background px-3 text-xs text-foreground focus:ring-1 focus:ring-primary"
          >
            <option value="all">{t("admin:users.allStatuses")}</option>
            <option value="Active">{t("common:status.active")}</option>
            <option value="Suspended">{t("common:status.suspended")}</option>
          </select>
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
          ) : users.length === 0 ? (
            <div className="py-16 text-center">
              <EmptyState
                icon={Users}
                title={t("common:empty.noResults")}
                description={t("common:empty.tryAdjusting")}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/20 text-muted-foreground">
                    <th className="py-3 px-4 font-semibold text-start">{t("admin:users.userCol")}</th>
                    <th className="py-3 px-4 font-semibold text-start">{t("auth:register.phoneNumber")}</th>
                    <th className="py-3 px-4 font-semibold text-start">{t("admin:users.roleCol")}</th>
                    <th className="py-3 px-4 font-semibold text-start">{t("admin:users.joinedCol")}</th>
                    <th className="py-3 px-4 font-semibold text-center">{t("admin:users.statusCol")}</th>
                    <th className="py-3 px-4 font-semibold text-end">{t("admin:users.actionsCol")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {users.map((u) => {
                    const isSuspended =
                      u.status?.toLowerCase().includes("suspend") || false;

                    const roleLabel =
                      u.role === "Admin"
                        ? t("common:roles.admin")
                        : u.role === "ServiceProvider"
                        ? t("common:roles.serviceProvider")
                        : t("common:roles.user");

                    return (
                      <tr key={u.id} className="hover:bg-muted/25 transition-colors">
                        <td className="py-3 px-4 font-bold text-foreground">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 rounded-xl border">
                              <AvatarImage src={getMediaUrl(u.profilePicture)} alt={u.name} />
                              <AvatarFallback className="rounded-xl font-bold text-xs bg-primary/10 text-primary">
                                {getInitials(u.name)}
                              </AvatarFallback>
                            </Avatar>
                            <span>{u.name || t("common:roles.user")}</span>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-muted-foreground">
                          <div>{u.email}</div>
                          <div className="text-[11px] font-mono">{u.phone || "—"}</div>
                        </td>

                        <td className="py-3 px-4">
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
                        </td>

                        <td className="py-3 px-4 text-muted-foreground">
                          {u.joined ? formatLocalizedDate(u.joined, "PP", i18n.language) : "—"}
                        </td>

                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1.5 font-semibold text-xs ${
                              isSuspended ? "text-destructive" : "text-emerald-600"
                            }`}
                          >
                            <span
                              className={`h-2 w-2 rounded-full ${
                                isSuspended ? "bg-destructive" : "bg-emerald-500"
                              }`}
                            />
                            {isSuspended ? t("common:status.suspended") : t("common:status.active")}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-end">
                          {isSuspended ? (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                              onClick={() =>
                                activateMutation.mutate({ userId: u.id, role: u.role })
                              }
                              disabled={activateMutation.isPending}
                            >
                              <Unlock className="h-3 w-3 me-1" />
                              {t("admin:users.activateButton")}
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs text-destructive hover:bg-destructive/10"
                              onClick={() =>
                                suspendMutation.mutate({ userId: u.id, role: u.role })
                              }
                              disabled={suspendMutation.isPending}
                            >
                              <Lock className="h-3 w-3 me-1" />
                              {t("admin:users.suspendButton")}
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex justify-center pt-2">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
