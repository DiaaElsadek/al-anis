import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Search } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { getActiveCategories } from "@/api/category";
import { getProviders } from "@/api/provider";
import EmptyState from "@/components/shared/EmptyState";
import Pagination from "@/components/shared/Pagination";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import DirectoryFilters from "@/features/client/components/DirectoryFilters";
import ProviderCard from "@/features/client/components/ProviderCard";
import { useDebounce } from "@/hooks/useDebounce";

export default function ProviderDirectoryPage() {
  const { t, i18n } = useTranslation(["client", "common"]);

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
    refetch,
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
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white p-8 sm:p-10 shadow-sm">
        <div className="relative z-10 max-w-2xl">
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
      <DirectoryFilters
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={(catId) => {
          setSelectedCategory(catId);
          setPage(1);
        }}
        selectedGovernorate={selectedGovernorate}
        onSelectGovernorate={(gov) => {
          setSelectedGovernorate(gov);
          setPage(1);
        }}
        onlyAvailable={onlyAvailable}
        onToggleAvailable={() => {
          setOnlyAvailable(!onlyAvailable);
          setPage(1);
        }}
        providersCount={providers.length}
        totalCount={totalCount}
        language={i18n.language}
      />

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
      ) : isError ? (
        <EmptyState
          icon={AlertCircle}
          title={t("common:error")}
          description={t("common:empty.tryAdjusting")}
          actionLabel={t("common:actions.retry")}
          onAction={() => refetch()}
        />
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
          {providers.map((p) => (
            <ProviderCard key={p.id} provider={p} language={i18n.language} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
