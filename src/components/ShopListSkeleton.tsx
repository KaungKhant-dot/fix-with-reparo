import { Skeleton } from "@/components/ui/skeleton";

export function ShopListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading repair shops">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card-soft flex gap-3 p-3">
          <Skeleton className="size-24 shrink-0 rounded-xl" />
          <div className="flex-1 space-y-2 py-1">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
