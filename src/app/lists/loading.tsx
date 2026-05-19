import { Skeleton } from "@/components/ui/skeleton"

export default function ListsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-2">
          <Skeleton className="h-9 w-40 bg-zinc-800/60" />
          <Skeleton className="h-4 w-56 bg-zinc-800/60" />
        </div>
        <Skeleton className="h-9 w-32 rounded-md bg-zinc-800/60" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-5 space-y-3">
            <div className="space-y-2">
              <Skeleton className="h-5 w-32 bg-zinc-800/60" />
              <Skeleton className="h-3 w-48 bg-zinc-800/60" />
            </div>
            <Skeleton className="h-3 w-20 bg-zinc-800/60" />
          </div>
        ))}
      </div>
    </div>
  )
}
