import { Skeleton } from "@/components/ui/skeleton";

/**
 * DashboardSkeleton — shared loading skeleton for dashboard pages (D5).
 * Used by AdminDashboardPage and ProviderDashboardPage.
 *
 * @param {Object} props
 * @param {number} [props.cards=4] — number of stat card skeletons to show
 */
export default function DashboardSkeleton({ cards = 4 }) {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-48" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: cards }, (_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-72 rounded-xl" />
        <Skeleton className="h-72 rounded-xl" />
      </div>
    </div>
  );
}
