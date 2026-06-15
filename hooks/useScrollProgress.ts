'use client'

import { useState, useEffect } from 'react'

interface ScrollProgressResult {
  scrolled: boolean
  progress: number
}

export function useScrollProgress(): ScrollProgressResult {
  const [scrolled, setScrolled] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setScrolled(scrollY > 20)

      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight
      setProgress(maxScroll > 0 ? scrollY / maxScroll : 0)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return { scrolled, progress }
}
