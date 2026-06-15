'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { LogIn } from 'lucide-react'
import { useScrollProgress } from '@/hooks/useScrollProgress'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { label: 'Labs', href: '/labs' },
  { label: 'About', href: '/about' },
  { label: 'Insights', href: '/insights' },
  { label: 'Events', href: '/events' },
  { label: 'Partners', href: '/partners' },
]

export default function Navbar() {
  const { scrolled } = useScrollProgress()

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-surface/80 backdrop-blur-md border-b border-border'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-heading font-bold text-xl tracking-tight text-white"
        >
          LAKSHAY 2047
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-text-muted hover:text-white transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link
          href="/login"
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
            'bg-primary/10 text-primary border border-primary/30',
            'hover:bg-primary hover:text-white hover:border-primary'
          )}
        >
          <LogIn size={15} />
          Sign In
        </Link>
      </div>
    </motion.nav>
  )
}
