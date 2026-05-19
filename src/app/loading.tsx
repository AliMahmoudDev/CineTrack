import { Skeleton } from "@/components/ui/skeleton"
import { MovieGridSkeleton } from "@/components/loading-skeletons"

export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* hero placeholder */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <Skeleton className="h-20 w-20 rounded-2xl mx-auto bg-zinc-800/60" />
            <Skeleton className="h-14 w-96 mx-auto bg-zinc-800/60" />
            <Skeleton className="h-6 w-[500px] mx-auto bg-zinc-800/60" />
          </div>
        </div>
      </div>

      {/* 3 sections: Trending, Top Rated, Popular */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-2">
              <Skeleton className="h-7 w-48 bg-zinc-800/60" />
              <Skeleton className="h-4 w-72 bg-zinc-800/60" />
            </div>
          </div>
          <MovieGridSkeleton count={6} />
        </div>
      ))}
    </div>
  )
}
