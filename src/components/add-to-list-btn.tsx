"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ListPlus, ListChecks, Plus, ArrowLeft, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { useCineStore } from "@/store/use-cine-store"
import { useSession } from "next-auth/react"

// add to list button
interface AddToListBtnProps {
  movieId: number
  movieTitle: string
  moviePoster: string | null
  movieRating: number
  movieDate: string
}

export function AddToListBtn({
  movieId,
  movieTitle,
  moviePoster,
  movieRating,
  movieDate,
}: AddToListBtnProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [newListName, setNewListName] = useState("")
  const lists = useCineStore((s) => s.lists)
  const addMovieToList = useCineStore((s) => s.addMovieToList)
  const removeMovieFromList = useCineStore((s) => s.removeMovieFromList)
  const isMovieInList = useCineStore((s) => s.isMovieInList)
  const isMovieInAnyList = useCineStore((s) => s.isMovieInAnyList)
  const createList = useCineStore((s) => s.createList)

  const inAnyList = isMovieInAnyList(movieId)

  const handleOpenChange = (nextOpen: boolean) => {
    if (!session) {
      router.push("/auth/signin")
      return
    }
    setOpen(nextOpen)
    if (!nextOpen) {
      setShowCreate(false)
      setNewListName("")
    }
  }

  const handleToggle = (listId: string, inList: boolean) => {
    if (inList) {
      removeMovieFromList(listId, movieId)
    } else {
      addMovieToList(listId, {
        id: movieId,
        title: movieTitle,
        posterPath: moviePoster,
        voteAverage: movieRating,
        releaseDate: movieDate,
      })
    }
    setOpen(false)
  }

  const handleCreateList = () => {
    if (!newListName.trim()) return
    const listId = createList(newListName.trim())
    addMovieToList(listId, {
      id: movieId,
      title: movieTitle,
      posterPath: moviePoster,
      voteAverage: movieRating,
      releaseDate: movieDate,
    })
    setNewListName("")
    setShowCreate(false)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`absolute bottom-2 right-2 h-7 w-7 rounded-full backdrop-blur-sm transition-colors ${
            inAnyList && session
              ? "bg-violet-500/30 text-violet-400 hover:bg-violet-500/50"
              : "bg-black/60 text-zinc-400 hover:text-white hover:bg-black/80"
          }`}
        >
          {inAnyList && session ? <ListChecks className="w-3.5 h-3.5" /> : <ListPlus className="w-3.5 h-3.5" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-56 bg-zinc-900 border-zinc-800 p-2"
        align="end"
      >
        {showCreate ? (
          <div className="space-y-2">
            <button
              className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors mb-1"
              onClick={() => setShowCreate(false)}
            >
              <ArrowLeft className="w-3 h-3" />
              Back
            </button>
            <Input
              placeholder="List name..."
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateList()}
              className="bg-zinc-800 border-zinc-700 text-zinc-100 text-sm h-8"
              autoFocus
            />
            <Button
              onClick={handleCreateList}
              disabled={!newListName.trim()}
              size="sm"
              className="w-full bg-violet-500 hover:bg-violet-600 text-white gap-1"
            >
              <Plus className="w-3 h-3" />
              Create & Add
            </Button>
          </div>
        ) : (
          <div className="space-y-1">
            {lists.length === 0 && (
              <p className="text-xs text-zinc-500 text-center py-1">
                no lists yet
              </p>
            )}
            {lists.map((list) => {
              const inList = isMovieInList(list.id, movieId)
              return (
                <button
                  key={list.id}
                  onClick={() => handleToggle(list.id, inList)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center justify-between transition-colors ${
                    inList
                      ? "text-emerald-400 hover:bg-red-500/10 hover:text-red-400"
                      : "text-zinc-300 hover:bg-zinc-800"
                  }`}
                >
                  <span className="truncate">{list.name}</span>
                  {inList ? (
                    <X className="w-3.5 h-3.5 flex-shrink-0" />
                  ) : (
                    <Plus className="w-3.5 h-3.5 flex-shrink-0 opacity-40" />
                  )}
                </button>
              )
            })}
            <button
              className="w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-2 text-violet-400 hover:bg-zinc-800 transition-colors"
              onClick={() => setShowCreate(true)}
            >
              <Plus className="w-3.5 h-3.5" />
              New List
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
