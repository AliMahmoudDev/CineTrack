import { Skeleton } from "@/components/ui/skeleton"

// Movie card skeleton - بسيط وخفيف
export function MovieCardSkeleton() {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 overflow-hidden">
      <Skeleton className="w-full aspect-[2/3] rounded-none bg-zinc-800/60" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-3/4 bg-zinc-800/60" />
        <Skeleton className="h-3 w-12 bg-zinc-800/60" />
      </div>
    </div>
  )
}

// Grid of movie card skeletons
export function MovieGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {Array.from({ length: count }, (_, i) => (
        <MovieCardSkeleton key={i} />
      ))}
    </div>
  )
}
