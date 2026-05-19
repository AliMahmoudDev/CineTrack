import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "My Watchlist",
  description:
    "Your personal movie watchlist. Keep track of movies you want to watch, mark your favorites, and never miss a film again with CineTrack.",
  alternates: {
    canonical: "/watchlist",
  },
  openGraph: {
    title: "My Watchlist | CineTrack",
    description:
      "Your personal movie watchlist. Keep track of movies you want to watch and never miss a film again.",
    url: "/watchlist",
  },
}

export default function WatchlistLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
