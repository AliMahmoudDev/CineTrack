import { NextResponse } from "next/server"
import { discoverMovies } from "@/lib/tmdb"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const genreId = searchParams.get("genre")
  const page = parseInt(searchParams.get("page") ?? "1", 10)

  const data = await discoverMovies(genreId ? parseInt(genreId, 10) : undefined, page)

  if (!data) {
    return NextResponse.json({ error: "Failed to fetch movies" }, { status: 500 })
  }

  return NextResponse.json(data)
}
