import Link from "next/link"
import Image from "next/image"
import { Github, Heart, Linkedin, Globe } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    explore: [
      { label: "Trending", href: "/" },
      { label: "Top Rated", href: "/" },
      { label: "Popular", href: "/" },
      { label: "Discover", href: "/discover" },
    ],
    account: [
      { label: "My Watchlist", href: "/watchlist" },
      { label: "My Lists", href: "/lists" },
      { label: "Search", href: "/search" },
    ],

  }

  return (
    <footer className="border-t border-zinc-800/60 bg-zinc-950 mt-auto">
      {/* main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* brand column */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/cinetrack-icon.png"
                alt="CineTrack"
                width={32}
                height={32}
              />
              <span className="text-lg font-bold tracking-tight">
                Cine<span className="text-violet-400">Track</span>
              </span>
            </Link>
            <p className="text-sm text-zinc-500 leading-relaxed">
              your personal cinema companion. discover, track, and never miss a movie again.
            </p>
            {/* developer social links */}
            <div className="flex items-center gap-2">
              <a
                href="https://github.com/AliMahmoudDev"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800/60 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/ali-mahmoud-34923b3a6/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-zinc-500 hover:text-sky-400 hover:bg-zinc-800/60 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://alimahmoud-dev.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-zinc-500 hover:text-violet-400 hover:bg-zinc-800/60 transition-colors"
                aria-label="Portfolio"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* explore */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">
              Explore
            </h3>
            <ul className="space-y-2">
              {footerLinks.explore.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-500 hover:text-zinc-200 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* account */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">
              Account
            </h3>
            <ul className="space-y-2">
              {footerLinks.account.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-500 hover:text-zinc-200 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>


        </div>
      </div>

      {/* bottom bar */}
      <div className="border-t border-zinc-800/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-zinc-600">
              &copy; {currentYear} CineTrack. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <p className="text-xs text-zinc-600 flex items-center gap-1">
                Built with <Heart className="w-3 h-3 text-violet-500 fill-violet-500" /> by{" "}
                <a
                  href="https://alimahmoud-dev.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-violet-400 hover:text-violet-300 transition-colors font-medium"
                >
                  Ali Mahmoud
                </a>
              </p>
              <span className="text-zinc-800">|</span>
              <p className="text-xs text-zinc-600 flex items-center gap-1">
                Data from{" "}
                <a
                  href="https://www.themoviedb.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-400 hover:text-sky-300 transition-colors"
                >
                  TMDB
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
