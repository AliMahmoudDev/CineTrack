import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "My Profile",
  description:
    "Manage your CineTrack profile. Update your name, favorite genres, and account settings to personalize your movie discovery experience.",
  alternates: {
    canonical: "/profile",
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
