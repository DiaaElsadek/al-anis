import { useQuery } from "@tanstack/react-query";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams, useSearchParams } from "react-router-dom";

import { getProvider } from "@/api/provider";
import { getProviderReviews } from "@/api/reviews";
import DirectionalIcon from "@/components/shared/DirectionalIcon";
import EmptyState from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import BookingDialog from "@/features/client/components/BookingDialog";
import ProviderInfoSection from "@/features/client/components/ProviderInfoSection";
import ReviewsList from "@/features/client/components/ReviewsList";

export default function ProviderProfilePage() {
  const { t } = useTranslation(["client", "common"]);
  const { id: providerId } = useParams();
  const [searchParams] = useSearchParams();

  const [bookingOpen, setBookingOpen] = useState(searchParams.get("book") === "true");

  // Fetch provider details
  const {
    data: provider,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["provider", providerId],
    queryFn: () => getProvider(providerId),
    enabled: !!providerId,
  });

  // Fetch reviews
  const { data: reviewsData } = useQuery({
    queryKey: ["provider-reviews", providerId],
    queryFn: () => getProviderReviews(providerId),
    enabled: !!providerId,
  });

  const reviews = reviewsData?.reviews || [];

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto py-6">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !provider) {
    return (
      <EmptyState
        icon={AlertCircle}
        title={t("client:directory.noProvidersTitle")}
        description={t("client:directory.noProvidersDesc")}
        action={
          <Button asChild variant="outline">
            <Link to="/app/providers">{t("common:back")}</Link>
          </Button>
        }
      />
    );
  }

  const providerName =
    provider.fullName ||
    `${provider.firstName || ""} ${provider.lastName || ""}`.trim() ||
    t("common:roles.provider");

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Top back navigation */}
      <Link
        to="/app/providers"
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <DirectionalIcon icon={ArrowLeft} className="h-4 w-4 me-2" />
        <span>{t("common:back")}</span>
      </Link>

      {/* Provider Header, Bio, and 2-Column Details */}
      <ProviderInfoSection provider={provider} providerName={providerName}>
        <BookingDialog
          open={bookingOpen}
          onOpenChange={setBookingOpen}
          provider={provider}
          providerId={providerId}
        />
      </ProviderInfoSection>

      {/* Reviews & Testimonials Section */}
      <ReviewsList reviews={reviews} averageRating={provider.averageRating} />
    </div>
  );
}
