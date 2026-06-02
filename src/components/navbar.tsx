"use client"

import Link from "next/link"
import Image from "next/image"
import { useSession, signIn, signOut } from "next-auth/react"
import { Search, Bookmark, Menu, X, Film, List, LogIn, LogOut, Compass } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useCineStore } from "@/store/use-cine-store"
import { useState, useEffect, useRef } from "react"

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { data: session } = useSession()
  const clearStore = useCineStore((s) => s.clearStore)
  const saveForUser = useCineStore((s) => s.saveForUser)
  const headerRef = useRef<HTMLElement>(null)

  // close dropdown on click outside header
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (mobileOpen && headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setMobileOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [mobileOpen])

  const navLinks = [
    { href: "/", label: "Home", icon: Film },
    { href: "/search", label: "Search", icon: Search },
    { href: "/discover", label: "Discover", icon: Compass },
    { href: "/watchlist", label: "Watchlist", icon: Bookmark },
    { href: "/lists", label: "Lists", icon: List },
  ]

  return (
    <header ref={headerRef} className="fixed top-0 left-0 right-0 z-50 bg-zinc-950 border-b border-zinc-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image
              src="/cinetrack-icon.png"
              alt="CineTrack"
              width={36}
              height={36}
              className="transition-transform group-hover:scale-110"
            />
            <span className="text-lg font-bold tracking-tight">
              Cine<span className="text-violet-400">Track</span>
            </span>
          </Link>

          {/* desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant="ghost"
                    className="text-zinc-400 hover:text-white hover:bg-zinc-800/60 gap-2 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Button>
                </Link>
              )
            })}
          </nav>

          {/* right side - auth */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-zinc-400 hover:text-white gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-zinc-900 border-zinc-800">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-zinc-100">Sign Out</AlertDialogTitle>
                    <AlertDialogDescription className="text-zinc-400">
                      Are you sure you want to sign out?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700 hover:text-white">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-600 text-white hover:bg-red-700"
                      onClick={() => {
                        if (session?.user?.email) saveForUser(session.user.email)
                        clearStore()
                        signOut()
                      }}
                    >
                      Sign Out
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <Button
                size="sm"
                className="bg-violet-500 hover:bg-violet-600 text-white gap-2"
                onClick={() => signIn()}
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Button>
            )}
          </div>

          {/* mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-zinc-400 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* mobile nav dropdown */}
      <div
        className={`md:hidden border-t border-zinc-800/50 bg-black/80 backdrop-blur-md overflow-hidden transition-all duration-200 ease-in-out ${
          mobileOpen
            ? "opacity-100 translate-y-0 max-h-96"
            : "opacity-0 -translate-y-2 max-h-0 pointer-events-none"
        }`}
      >
        <div className="px-4 py-3 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors"
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            )
          })}
          {/* auth in mobile */}
          {session ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors w-full"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-zinc-900 border-zinc-800">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-zinc-100">Sign Out</AlertDialogTitle>
                  <AlertDialogDescription className="text-zinc-400">
                    Are you sure you want to sign out?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700 hover:text-white">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 text-white hover:bg-red-700"
                    onClick={() => {
                      if (session?.user?.email) saveForUser(session.user.email)
                      clearStore()
                      signOut()
                      setMobileOpen(false)
                    }}
                  >
                    Sign Out
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <button
              onClick={() => {
                signIn()
                setMobileOpen(false)
              }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 transition-colors w-full"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
