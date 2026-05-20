import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AuthProvider } from "@/components/auth-provider"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

// viewport export
export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

// root metadata
export const metadata: Metadata = {
  title: {
    default: "CineTrack - Discover, Track & Organize Movies",
    template: "%s | CineTrack",
  },
  description:
    "CineTrack is your personal cinema companion. Discover trending movies, build watchlists, create custom lists, and never lose track of what to watch next. Powered by TMDB.",
  keywords: [
    "movies",
    "movie tracker",
    "watchlist",
    "movie discovery",
    "TMDB",
    "film tracker",
    "cinema",
    "movie lists",
    "trending movies",
    "top rated movies",
    "CineTrack",
  ],
  authors: [{ name: "Ali Mahmoud", url: "https://alimahmoud-dev.vercel.app/" }],
  creator: "Ali Mahmoud",
  publisher: "Ali Mahmoud",

  // icons
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },

  // url
  metadataBase: new URL("https://cinetrack.vercel.app"),
  alternates: {
    canonical: "/",
  },

  // open graph
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cinetrack.vercel.app",
    siteName: "CineTrack",
    title: "CineTrack - Discover, Track & Organize Movies",
    description:
      "Your personal cinema companion. Discover trending movies, build watchlists, and create custom lists. Powered by TMDB.",
    images: [
      {
        url: "/cinetrack-logo-full.png",
        width: 1200,
        height: 630,
        alt: "CineTrack - Personal Film Companion",
      },
    ],
  },

  // twitter
  twitter: {
    card: "summary_large_image",
    title: "CineTrack - Discover, Track & Organize Movies",
    description:
      "Your personal cinema companion. Discover trending movies, build watchlists, and create custom lists.",
    images: ["/cinetrack-logo-full.png"],
    creator: "@AliMahmoudDev",
  },

  // robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // category
  category: "entertainment",

  // other
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-950 text-zinc-100 min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <Navbar />
          <main className="pt-16 flex-1">
            {children}
          </main>
          <Footer />
          <Toaster richColors position="top-center" />
        </AuthProvider>
      </body>
    </html>
  )
}
