import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Search Movies",
  description:
    "Search thousands of movies by title. Find detailed information, ratings, and add any film to your watchlist or custom lists on CineTrack.",
  alternates: {
    canonical: "/search",
  },
  openGraph: {
    title: "Search Movies | CineTrack",
    description:
      "Search thousands of movies by title. Find detailed info, ratings, and add films to your watchlist.",
    url: "/search",
  },
}

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
