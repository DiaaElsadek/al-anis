import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  Search,
  MapPin,
  Star,
  ShieldCheck,
  Calendar,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";

import { getProviders } from "@/api/provider";
import { getActiveCategories } from "@/api/category";
import { useDebounce } from "@/hooks/useDebounce";
import { getMediaUrl, getInitials, formatPrice, getLocalizedCategoryName } from "@/lib/utils";
import DirectionalIcon from "@/components/shared/DirectionalIcon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/shared/EmptyState";
import Pagination from "@/components/shared/Pagination";

const GOVERNORATES = [
  "Cairo",
  "Giza",
  "Alexandria",
  "Dakahlia",
  "Sharqia",
  "Qalyubia",
  "Gharbia",
  "Menofia",
];

export default function ProviderDirectoryPage() {
  const { t, i18n } = useTranslation(["client", "common"]);
  const navigate = useNavigate();

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 400);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedGovernorate, setSelectedGovernorate] = useState("all");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 9;

  // Categories query
  const { data: categories = [] } = useQuery({
    queryKey: ["active-categories"],
    queryFn: getActiveCategories,
    staleTime: 10 * 60 * 1000,
  });

  // Providers query
  const {
    data: providerData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "providers",
      debouncedSearch,
      selectedCategory,
      selectedGovernorate,
      onlyAvailable,
      page,
    ],
    queryFn: () =>
      getProviders({
        Search: debouncedSearch || undefined,
        CategoryId: selectedCategory !== "all" ? selectedCategory : undefined,
        Governorate: selectedGovernorate !== "all" ? selectedGovernorate : undefined,
        Available: onlyAvailable ? true : undefined,
        Page: page,
        PageSize: pageSize,
      }),
    keepPreviousData: true,
  });

  const providers = providerData?.items || [];
  const totalPages = providerData?.totalPages || 1;
  const totalCount = providerData?.totalCount || 0;

  return (
    <div className="space-y-8">
      {/* Hero Search Header */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white p-8 sm:p-10 shadow-lg shadow-teal-950/10">
        <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-teal-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-200 text-xs font-semibold mb-4">
            <Sparkles className="h-3.5 w-3.5 text-teal-300" />
            <span>{t("client:directory.verified")}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {t("client:directory.title")}
          </h1>
          <p className="text-teal-100/80 text-sm sm:text-base mt-2">
            {t("client:directory.subtitle")}
          </p>

          {/* Search Input Bar */}
          <div className="mt-6 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute start-3.5 top-3.5 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder={t("client:directory.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="ps-11 h-12 bg-white text-foreground placeholder:text-muted-foreground shadow-sm rounded-xl text-sm border-0 focus-visible:ring-2 focus-visible:ring-teal-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-card rounded-xl border border-border/80 p-4 shadow-sm space-y-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            size="sm"
            className="rounded-full text-xs font-semibold h-8"
            onClick={() => {
              setSelectedCategory("all");
              setPage(1);
            }}
          >
            {t("client:directory.allCategories")}
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "outline"}
              size="sm"
              className="rounded-full text-xs font-medium h-8 whitespace-nowrap"
              onClick={() => {
                setSelectedCategory(cat.id);
                setPage(1);
              }}
            >
              {cat.icon && <span className="me-1.5">{cat.icon}</span>}
              {getLocalizedCategoryName(cat, i18n.language)}
            </Button>
          ))}
        </div>

        {/* Secondary Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/60">
          <div className="flex flex-wrap items-center gap-3">
            {/* Governorate Select */}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              <select
                value={selectedGovernorate}
                onChange={(e) => {
                  setSelectedGovernorate(e.target.value);
                  setPage(1);
                }}
                className="h-8 rounded-lg border border-input bg-background px-2.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="all">{t("client:directory.allGovernorates")}</option>
                {GOVERNORATES.map((gov) => (
                  <option key={gov} value={gov}>
                    {gov}
                  </option>
                ))}
              </select>
            </div>

            {/* Availability Toggle */}
            <button
              type="button"
              onClick={() => {
                setOnlyAvailable(!onlyAvailable);
                setPage(1);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                onlyAvailable
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 font-semibold"
                  : "border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              <CheckCircle2
                className={`h-3.5 w-3.5 ${
                  onlyAvailable ? "text-emerald-600" : "text-muted-foreground"
                }`}
              />
              {t("client:directory.availableOnly")}
            </button>
          </div>

          <div className="text-xs text-muted-foreground">
            {t("common:pagination.showing", {
              from: providers.length > 0 ? 1 : 0,
              to: providers.length,
              total: totalCount,
            })}
          </div>
        </div>
      </div>

      {/* Provider Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-6 space-y-4">
              <div className="flex gap-4">
                <Skeleton className="h-16 w-16 rounded-2xl" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </Card>
          ))}
        </div>
      ) : providers.length === 0 ? (
        <EmptyState
          icon={Search}
          title={t("client:directory.noProvidersTitle")}
          description={t("client:directory.noProvidersDesc")}
          actionLabel={t("common:clear")}
          onAction={() => {
            setSearchTerm("");
            setSelectedCategory("all");
            setSelectedGovernorate("all");
            setOnlyAvailable(false);
            setPage(1);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((p) => {
            const providerName = p.fullName || `${p.firstName || ""} ${p.lastName || ""}`.trim() || t("common:roles.provider");
            const locationStr = p.location
              ? `${p.location.city ? p.location.city + ", " : ""}${p.location.governorate || "Egypt"}`
              : p.governorate || "Egypt";

            return (
              <Card
                key={p.id}
                className="group relative flex flex-col justify-between border-border/70 hover:border-primary/50 hover:shadow-xl transition-all duration-300 bg-card overflow-hidden"
              >
                <div className="p-6 space-y-4">
                  {/* Top Avatar & Name */}
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16 rounded-2xl border-2 border-primary/20 shadow-sm">
                      <AvatarImage src={getMediaUrl(p.avatarUrl || p.profilePicture)} alt={providerName} />
                      <AvatarFallback className="rounded-2xl bg-primary/10 text-primary font-bold text-lg">
                        {getInitials(providerName)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-base text-foreground truncate group-hover:text-primary transition-colors">
                          {providerName}
                        </h3>
                        <ShieldCheck className="h-4 w-4 text-teal-600 flex-shrink-0" title={t("client:directory.verified")} />
                      </div>

                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{locationStr}</span>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <div className="flex items-center text-amber-500 text-xs font-bold">
                          <Star className="h-3.5 w-3.5 fill-current me-1" />
                          {p.averageRating ? p.averageRating.toFixed(1) : t("common:new")}
                        </div>
                        {p.totalReviews > 0 && (
                          <span className="text-[11px] text-muted-foreground">
                            {t("client:directory.reviewsCount", { count: p.totalReviews })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Specialties / Categories chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {p.categories?.slice(0, 2).map((c) => (
                      <Badge
                        key={c.id || c.name}
                        variant="secondary"
                        className="text-[11px] font-medium bg-primary/5 text-primary border-primary/10"
                      >
                        {getLocalizedCategoryName(c, i18n.language)}
                      </Badge>
                    ))}
                    {p.categories?.length > 2 && (
                      <span className="text-[11px] text-muted-foreground self-center">
                        +{p.categories.length - 2}
                      </span>
                    )}
                  </div>

                  {/* Availability Badge & Shift Price */}
                  <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          p.isAvailable ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground/40"
                        }`}
                      />
                      <span className={p.isAvailable ? "text-emerald-700 font-semibold" : "text-muted-foreground"}>
                        {p.isAvailable ? t("common:status.available") : t("common:status.busy")}
                      </span>
                    </div>

                    <div className="text-end">
                      <span className="text-[10px] text-muted-foreground block">{t("client:directory.baseRate")}</span>
                      <span className="font-bold text-sm text-foreground">
                        {p.hourlyRate ? formatPrice(p.hourlyRate * 8) : "-"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <CardFooter className="p-4 pt-0 bg-muted/20 border-t border-border/40 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs font-semibold h-9"
                    asChild
                  >
                    <Link to={`/app/providers/${p.id}`}>
                      {t("client:directory.viewProfile")}
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 text-xs font-semibold h-9 shadow-sm shadow-primary/20"
                    asChild
                  >
                    <Link to={`/app/providers/${p.id}?book=true`}>
                      <span>{t("client:directory.bookShift")}</span>
                      <DirectionalIcon className="h-3.5 w-3.5 ms-1" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center pt-4">
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
