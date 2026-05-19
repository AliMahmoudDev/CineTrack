import type { MetadataRoute } from "next"

// web app manifest
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CineTrack - Discover, Track & Organize Movies",
    short_name: "CineTrack",
    description:
      "Your personal cinema companion. Discover trending movies, build watchlists, and create custom movie lists.",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#09090b",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/favicon.png",
        sizes: "any",
        type: "image/png",
      },
    ],
    categories: ["entertainment", "lifestyle"],
  }
}
