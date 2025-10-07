import { Skeleton } from "@/components/ui/skeleton";

const ProductSkeleton = () => (
    <div className="max-w-sm rounded-xl border bg-card">
      <Skeleton className="aspect-video h-70 rounded-t-xl" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex gap-4 pt-3">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex gap-2 pt-4">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>
    </div>
  );
export default ProductSkeleton;