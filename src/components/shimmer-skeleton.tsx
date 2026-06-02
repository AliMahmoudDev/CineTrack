// shimmer skeleton components

import { cn } from "@/lib/utils"

function ShimmerBlock({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-zinc-800/50",
        className
      )}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-zinc-700/30 to-transparent" />
    </div>
  )
}

export function MovieCardSkeleton() {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 overflow-hidden">
      <ShimmerBlock className="w-full aspect-[2/3] rounded-none" />
      <div className="p-3 space-y-2">
        <ShimmerBlock className="h-4 w-3/4" />
        <ShimmerBlock className="h-3 w-12" />
      </div>
    </div>
  )
}

export function SkeletonGrid({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {Array.from({ length: count }, (_, i) => (
        <MovieCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function HeroSkeleton() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-violet-500/10 via-zinc-950 to-zinc-950" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <ShimmerBlock className="h-20 w-20 rounded-2xl mx-auto" />
          <ShimmerBlock className="h-14 w-96 mx-auto" />
          <ShimmerBlock className="h-6 w-[500px] mx-auto" />
          <ShimmerBlock className="h-6 w-[400px] mx-auto" />
          <div className="flex items-center justify-center gap-3 pt-2">
            <ShimmerBlock className="h-11 w-44 rounded-lg" />
            <ShimmerBlock className="h-11 w-44 rounded-lg" />
          </div>
        </div>
      </div>
    </section>
  )
}

export function SectionSkeleton() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <ShimmerBlock className="h-7 w-48" />
          <ShimmerBlock className="h-4 w-72" />
        </div>
        <ShimmerBlock className="h-8 w-20 rounded-md" />
      </div>
      <SkeletonGrid count={6} />
    </section>
  )
}

export function ProfileSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-5">
          <ShimmerBlock className="h-20 w-20 rounded-full" />
          <div className="space-y-2">
            <ShimmerBlock className="h-7 w-48" />
            <ShimmerBlock className="h-4 w-36" />
            <ShimmerBlock className="h-3 w-28" />
          </div>
        </div>
        <ShimmerBlock className="h-9 w-28 rounded-md" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-5 flex items-center gap-4">
            <ShimmerBlock className="h-11 w-11 rounded-xl" />
            <div className="space-y-2">
              <ShimmerBlock className="h-7 w-12" />
              <ShimmerBlock className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-4">
        <ShimmerBlock className="h-6 w-40" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-2">
              <ShimmerBlock className="h-3 w-16" />
              <ShimmerBlock className="h-4 w-28" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function WatchlistSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 space-y-2">
        <ShimmerBlock className="h-9 w-56" />
        <ShimmerBlock className="h-4 w-32" />
      </div>
      <SkeletonGrid count={6} />
    </div>
  )
}

export function ListsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-2">
          <ShimmerBlock className="h-9 w-40" />
          <ShimmerBlock className="h-4 w-56" />
        </div>
        <ShimmerBlock className="h-9 w-32 rounded-md" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <ShimmerBlock className="h-5 w-32" />
                <ShimmerBlock className="h-3 w-48" />
              </div>
              <ShimmerBlock className="h-5 w-5 rounded" />
            </div>
            <ShimmerBlock className="h-3 w-20" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function SearchSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6 mb-10">
        <ShimmerBlock className="h-10 w-56" />
        <ShimmerBlock className="h-10 w-full max-w-2xl rounded-lg" />
      </div>
      <SkeletonGrid count={12} />
    </div>
  )
}

export function GenreFilterSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: count }, (_, i) => (
        <ShimmerBlock key={i} className="h-8 w-20 rounded-lg" />
      ))}
    </div>
  )
}

export { ShimmerBlock }
