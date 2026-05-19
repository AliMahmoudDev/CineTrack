import { create } from "zustand"
import { persist } from "zustand/middleware"

// watchlist item
export interface WatchlistItem {
  id: number
  title: string
  posterPath: string | null
  voteAverage: number
  releaseDate: string
  addedAt: number
}

// custom list
export interface CustomList {
  id: string
  name: string
  description: string
  movies: WatchlistItem[]
  createdAt: number
}

interface CineStore {
  // watchlist
  watchlist: WatchlistItem[]
  addToWatchlist: (item: Omit<WatchlistItem, "addedAt">) => void
  removeFromWatchlist: (id: number) => void
  isInWatchlist: (id: number) => boolean

  // custom lists
  lists: CustomList[]
  createList: (name: string, description: string) => void
  deleteList: (id: string) => void
  renameList: (id: string, name: string) => void
  addMovieToList: (listId: string, movie: Omit<WatchlistItem, "addedAt">) => void
  removeMovieFromList: (listId: string, movieId: number) => void
  isMovieInList: (listId: string, movieId: number) => boolean
  isMovieInAnyList: (movieId: number) => boolean
}

export const useCineStore = create<CineStore>()(
  persist(
    (set, get) => ({
      // --- watchlist ---
      watchlist: [],

      addToWatchlist: (item) => {
        const exists = get().watchlist.find((i) => i.id === item.id)
        if (exists) return
        set((state) => ({
          watchlist: [...state.watchlist, { ...item, addedAt: Date.now() }],
        }))
      },

      removeFromWatchlist: (id) => {
        set((state) => ({
          watchlist: state.watchlist.filter((i) => i.id !== id),
        }))
      },

      isInWatchlist: (id) => {
        return get().watchlist.some((i) => i.id === id)
      },

      // --- custom lists ---
      lists: [],

      createList: (name, description = "") => {
        const id = crypto.randomUUID()
        const newList: CustomList = {
          id,
          name,
          description,
          movies: [],
          createdAt: Date.now(),
        }
        set((state) => ({ lists: [...state.lists, newList] }))
        return id
      },

      deleteList: (id) => {
        set((state) => ({
          lists: state.lists.filter((l) => l.id !== id),
        }))
      },

      renameList: (id, name) => {
        set((state) => ({
          lists: state.lists.map((l) =>
            l.id === id ? { ...l, name } : l
          ),
        }))
      },

      addMovieToList: (listId, movie) => {
        set((state) => ({
          lists: state.lists.map((l) => {
            if (l.id !== listId) return l
            // don't add duplicates
            if (l.movies.some((m) => m.id === movie.id)) return l
            return {
              ...l,
              movies: [...l.movies, { ...movie, addedAt: Date.now() }],
            }
          }),
        }))
      },

      removeMovieFromList: (listId, movieId) => {
        set((state) => ({
          lists: state.lists.map((l) => {
            if (l.id !== listId) return l
            return {
              ...l,
              movies: l.movies.filter((m) => m.id !== movieId),
            }
          }),
        }))
      },

      isMovieInList: (listId, movieId) => {
        const list = get().lists.find((l) => l.id === listId)
        return list?.movies.some((m) => m.id === movieId) ?? false
      },

      isMovieInAnyList: (movieId) => {
        return get().lists.some((l) => l.movies.some((m) => m.id === movieId))
      },
    }),
    {
      name: "cinetrack-store",
    }
  )
)
