import { Skeleton } from "@/components/ui/skeleton"
import { MovieGridSkeleton } from "@/components/loading-skeletons"

export default function WatchlistLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 space-y-2">
        <Skeleton className="h-9 w-56 bg-zinc-800/60" />
        <Skeleton className="h-4 w-32 bg-zinc-800/60" />
      </div>
      <MovieGridSkeleton count={6} />
    </div>
  )
}
