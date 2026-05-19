"use server"

import { discoverMovies } from "@/lib/tmdb"

// discover server action
export async function getDiscoverAction(genreId?: number, page: number = 1) {
  const data = await discoverMovies(genreId, page)
  return data
}
