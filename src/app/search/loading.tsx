import { Skeleton } from "@/components/ui/skeleton"
import { MovieGridSkeleton } from "@/components/loading-skeletons"

export default function SearchLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6 mb-10">
        <Skeleton className="h-10 w-56 bg-zinc-800/60" />
        <Skeleton className="h-10 w-full max-w-2xl rounded-lg bg-zinc-800/60" />
      </div>
      <MovieGridSkeleton count={12} />
    </div>
  )
}
