"use server"

import { searchMovies } from "@/lib/tmdb"

// search server action
export async function searchMoviesAction(query: string, page: number = 1) {
  if (!query.trim()) return null
  const data = await searchMovies(query, page)
  return data
}
