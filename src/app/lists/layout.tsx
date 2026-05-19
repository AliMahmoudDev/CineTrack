import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "My Lists",
  description:
    "Organize your movies into custom lists. Create themed collections, share your picks, and manage your movie library with CineTrack's list feature.",
  alternates: {
    canonical: "/lists",
  },
  openGraph: {
    title: "My Custom Lists | CineTrack",
    description:
      "Organize your movies into custom lists. Create themed collections and manage your movie library.",
    url: "/lists",
  },
}

export default function ListsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
