import { Skeleton } from "@/components/ui/skeleton"
import { MovieGridSkeleton } from "@/components/loading-skeletons"

export default function DiscoverLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="space-y-4">
        <Skeleton className="h-10 w-56 bg-zinc-800/60" />
        <Skeleton className="h-5 w-80 bg-zinc-800/60" />
      </div>
      {/* genre filter placeholder */}
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 10 }, (_, i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-lg bg-zinc-800/60" />
        ))}
      </div>
      <MovieGridSkeleton count={18} />
    </div>
  )
}
