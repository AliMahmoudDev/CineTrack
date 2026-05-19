"use client"

import { useState } from "react"
import Link from "next/link"
import { List, Trash2, Film, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MovieCard } from "@/components/movie-card"
import { CreateListDialog } from "@/components/create-list-dialog"
import { useCineStore, type CustomList } from "@/store/use-cine-store"

// single list view
function ListView({ list, onBack }: { list: CustomList; onBack: () => void }) {
  const deleteList = useCineStore((s) => s.deleteList)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-zinc-400 gap-1">
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
          <div>
            <h2 className="text-2xl font-bold">{list.name}</h2>
            {list.description && (
              <p className="text-sm text-zinc-500 mt-0.5">{list.description}</p>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-400 hover:text-red-300 hover:bg-red-500/10 gap-1"
          onClick={() => {
            deleteList(list.id)
            onBack()
          }}
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </Button>
      </div>

      {list.movies.length === 0 ? (
        <div className="text-center py-16">
          <Film className="w-12 h-12 mx-auto text-zinc-700 mb-3" />
          <p className="text-zinc-400">No movies in this list yet</p>
          <p className="text-sm text-zinc-600 mt-1">
            add movies from any movie card or detail page
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {list.movies.map((m) => (
            <MovieCard
              key={m.id}
              id={m.id}
              title={m.title}
              posterPath={m.posterPath}
              voteAverage={m.voteAverage}
              releaseDate={m.releaseDate}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// all lists grid
function ListsGrid({ onSelect }: { onSelect: (list: CustomList) => void }) {
  const lists = useCineStore((s) => s.lists)

  if (lists.length === 0) {
    return (
      <div className="text-center py-16">
        <List className="w-12 h-12 mx-auto text-zinc-700 mb-3" />
        <p className="text-zinc-400">No custom lists yet</p>
        <p className="text-sm text-zinc-600 mt-1">
          create your first list and start organizing movies
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {lists.map((list) => (
        <button
          key={list.id}
          onClick={() => onSelect(list)}
          className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-5 text-left hover:border-violet-500/40 hover:bg-zinc-800/60 transition-all group"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold text-zinc-100 group-hover:text-violet-300 transition-colors">
                {list.name}
              </h3>
              {list.description && (
                <p className="text-sm text-zinc-500 line-clamp-2">{list.description}</p>
              )}
            </div>
            <List className="w-5 h-5 text-zinc-600 flex-shrink-0" />
          </div>
          <p className="text-xs text-zinc-600 mt-3">
            {list.movies.length} movie{list.movies.length !== 1 ? "s" : ""}
          </p>
        </button>
      ))}
    </div>
  )
}

export default function ListsPage() {
  const [selectedList, setSelectedList] = useState<CustomList | null>(null)
  const lists = useCineStore((s) => s.lists)

  // keep selected list in sync with store
  const currentList = selectedList
    ? lists.find((l) => l.id === selectedList.id) ?? null
    : null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
            <List className="w-7 h-7 text-violet-400" />
            My Lists
          </h1>
          <p className="text-zinc-500 mt-1">
            organize your movies however you want
          </p>
        </div>
        <CreateListDialog />
      </div>

      {currentList ? (
        <ListView list={currentList} onBack={() => setSelectedList(null)} />
      ) : (
        <ListsGrid onSelect={setSelectedList} />
      )}
    </div>
  )
}
