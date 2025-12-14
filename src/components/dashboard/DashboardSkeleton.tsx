import { Skeleton } from "@/components/ui/skeleton";

const DashboardSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 bg-muted" />
          <Skeleton className="h-4 w-40 bg-muted" />
        </div>
        <Skeleton className="h-10 w-40 bg-muted" />
      </div>

      {/* Summary cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card p-6 rounded-xl">
            <Skeleton className="h-4 w-24 mb-3 bg-muted" />
            <Skeleton className="h-8 w-32 bg-muted" />
          </div>
        ))}
      </div>

      {/* Charts skeleton */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-xl">
          <Skeleton className="h-6 w-40 mb-4 bg-muted" />
          <Skeleton className="h-64 w-full bg-muted rounded-lg" />
        </div>
        <div className="glass-card p-6 rounded-xl">
          <Skeleton className="h-6 w-40 mb-4 bg-muted" />
          <Skeleton className="h-64 w-full bg-muted rounded-lg" />
        </div>
      </div>

      {/* Table skeleton */}
      <div className="glass-card p-6 rounded-xl">
        <Skeleton className="h-6 w-48 mb-4 bg-muted" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full bg-muted" />
              <Skeleton className="h-4 flex-1 bg-muted" />
              <Skeleton className="h-4 w-24 bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
