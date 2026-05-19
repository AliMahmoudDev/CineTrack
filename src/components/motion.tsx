"use client"

import { motion, type HTMLMotionProps } from "framer-motion"
import { useEffect, useState } from "react"

// fade in from bottom - used for page content
export function FadeIn({ children, delay = 0, ...props }: { children: React.ReactNode; delay?: number } & Omit<HTMLMotionProps<"div">, "children">) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// stagger children - wrap around a list of items
export function StaggerContainer({ children, ...props }: { children: React.ReactNode } & Omit<HTMLMotionProps<"div">, "children">) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.06 } },
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// each item inside a stagger container
export function StaggerItem({ children, ...props }: { children: React.ReactNode } & Omit<HTMLMotionProps<"div">, "children">) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// scale on hover - wrap interactive elements
export function ScaleOnHover({ children, ...props }: { children: React.ReactNode } & Omit<HTMLMotionProps<"div">, "children">) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// slide in from right - for modals/sheets
export function SlideIn({ children, ...props }: { children: React.ReactNode } & Omit<HTMLMotionProps<"div">, "children">) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// hydrated fade in
export function HydratedFadeIn({ children, ...props }: { children: React.ReactNode; delay?: number } & Omit<HTMLMotionProps<"div">, "children">) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <div {...props}>{children}</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
