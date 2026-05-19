import { Skeleton } from "@/components/ui/skeleton"

export default function MovieLoading() {
  return (
    <div>
      <div className="relative h-[40vh] md:h-[55vh] bg-zinc-900">
        <Skeleton className="absolute inset-0 bg-zinc-800/30 rounded-none" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          <Skeleton className="w-48 md:w-64 aspect-[2/3] rounded-xl bg-zinc-800/60 flex-shrink-0" />
          <div className="flex-1 space-y-5 pt-2">
            <Skeleton className="h-12 w-3/4 bg-zinc-800/60" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 bg-zinc-800/60" />
              <Skeleton className="h-6 w-20 bg-zinc-800/60" />
              <Skeleton className="h-6 w-14 bg-zinc-800/60" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-12 w-36 rounded-lg bg-zinc-800/60" />
              <Skeleton className="h-12 w-36 rounded-lg bg-zinc-800/60" />
            </div>
            <Skeleton className="h-4 w-full bg-zinc-800/60" />
            <Skeleton className="h-4 w-5/6 bg-zinc-800/60" />
            <Skeleton className="h-4 w-4/6 bg-zinc-800/60" />
          </div>
        </div>
      </div>
    </div>
  )
}
