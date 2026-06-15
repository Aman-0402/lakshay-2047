'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, FlaskConical } from 'lucide-react'
import { cn } from '@/lib/utils'

const HeroCanvas = dynamic(() => import('@/components/3d/HeroCanvas'), {
  ssr: false,
  loading: () => (
    <div
      className="w-full h-full"
      style={{
        background:
          'linear-gradient(135deg, #0A0A0F 0%, #111118 50%, #1A1A25 100%)',
      }}
    />
  ),
})

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-bg">
      {/* 3D canvas — full bleed background */}
      <div className="absolute inset-0 z-0">
        <HeroCanvas />
      </div>

      {/* Gradient overlay to blend canvas edges */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 0%, rgba(10,10,15,0.45) 70%, #0A0A0F 100%)',
        }}
      />

      {/* Text content */}
      <div className="relative z-20 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.p
            variants={itemVariants}
            className="text-sm font-mono tracking-[0.25em] uppercase text-accent mb-4"
          >
            Parul University · Centre of Future Skills
          </motion.p>

          <motion.h1
            variants={itemVariants}
            className="font-heading font-bold text-white leading-[1.05] mb-6"
            style={{ fontSize: 'var(--text-hero)' }}
          >
            Centre of{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #6C63FF, #00D4FF)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Future Skills
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg text-text-muted max-w-xl mx-auto mb-10 leading-relaxed"
          >
            14 world-class labs. One campus. Infinite possibilities.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/labs"
              className={cn(
                'inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-medium text-sm',
                'bg-primary text-white',
                'hover:bg-primary-dark transition-colors duration-200',
                'shadow-[0_0_24px_rgba(108,99,255,0.4)]'
              )}
            >
              <FlaskConical size={16} />
              Explore Labs
              <ArrowRight size={15} />
            </Link>

            <Link
              href="/book"
              className={cn(
                'inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-medium text-sm',
                'border border-accent/50 text-accent',
                'hover:bg-accent/10 hover:border-accent transition-all duration-200'
              )}
            >
              Book a Lab
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <span className="text-xs text-text-subtle tracking-widest uppercase">
          Scroll
        </span>
        <motion.div
          className="w-px h-8 bg-gradient-to-b from-accent/60 to-transparent"
          animate={{ scaleY: [1, 0.4, 1] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  )
}
