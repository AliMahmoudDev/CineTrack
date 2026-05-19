import { Skeleton } from "@/components/ui/skeleton"

export default function ProfileLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center gap-5">
        <Skeleton className="h-20 w-20 rounded-full bg-zinc-800/60" />
        <div className="space-y-2">
          <Skeleton className="h-7 w-48 bg-zinc-800/60" />
          <Skeleton className="h-4 w-36 bg-zinc-800/60" />
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-5 flex items-center gap-4">
            <Skeleton className="h-11 w-11 rounded-xl bg-zinc-800/60" />
            <div className="space-y-2">
              <Skeleton className="h-7 w-12 bg-zinc-800/60" />
              <Skeleton className="h-3 w-20 bg-zinc-800/60" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
