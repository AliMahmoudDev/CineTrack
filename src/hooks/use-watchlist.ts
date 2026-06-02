"use client"

import { useState, useCallback, useSyncExternalStore } from "react"

// watchlist item shape
export interface WatchlistItem {
  id: number
  title: string
  posterPath: string | null
  voteAverage: number
  releaseDate: string
  addedAt: number
}

const STORAGE_KEY = "cinetrack-watchlist"

// read from localStorage
function readWatchlist(): WatchlistItem[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

// write to localStorage
function writeWatchlist(items: WatchlistItem[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function useWatchlist() {
  // hydrate from localStorage
  const emptyList: WatchlistItem[] = []
  const snapshot = useSyncExternalStore(
    (callback) => {
      window.addEventListener("storage", callback)
      return () => window.removeEventListener("storage", callback)
    },
    () => readWatchlist(),
    () => emptyList
  )

  const [items, setItems] = useState<WatchlistItem[]>(snapshot)

  const isInWatchlist = useCallback(
    (movieId: number) => items.some((i) => i.id === movieId),
    [items]
  )

  const toggleWatchlist = useCallback(
    (movieId: number, title: string, posterPath: string | null, voteAverage: number, releaseDate: string) => {
      setItems((prev) => {
        const exists = prev.find((i) => i.id === movieId)
        let next: WatchlistItem[]
        if (exists) {
          // remove
          next = prev.filter((i) => i.id !== movieId)
        } else {
          // add
          next = [
            ...prev,
            { id: movieId, title, posterPath, voteAverage, releaseDate, addedAt: Date.now() },
          ]
        }
        writeWatchlist(next)
        return next
      })
    },
    []
  )

  const removeFromWatchlist = useCallback((movieId: number) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.id !== movieId)
      writeWatchlist(next)
      return next
    })
  }, [])

  return { items, isInWatchlist, toggleWatchlist, removeFromWatchlist }
}
