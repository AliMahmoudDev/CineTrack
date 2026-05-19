import Link from "next/link"
import { Film, Home, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-sm">
        <div className="h-20 w-20 rounded-full bg-violet-500/10 flex items-center justify-center mx-auto">
          <Film className="w-10 h-10 text-violet-400" />
        </div>
        <div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-violet-400 to-sky-400 bg-clip-text text-transparent">
            404
          </h1>
          <p className="text-xl font-semibold mt-2">Page Not Found</p>
          <p className="text-zinc-500 mt-2 text-sm">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <Link href="/">
            <Button className="bg-violet-500 hover:bg-violet-600 text-white gap-2">
              <Home className="w-4 h-4" /> Go Home
            </Button>
          </Link>
          <Link href="/search">
            <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800/60 gap-2">
              <Search className="w-4 h-4" /> Search
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
