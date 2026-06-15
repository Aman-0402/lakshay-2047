import { Ratelimit } from '@upstash/ratelimit'
import { redis } from './redis'

// Returns null when Redis isn't configured — callers must handle null gracefully
export const bookingRateLimit: Ratelimit | null = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '1 h'),
      prefix: 'lakshay:booking',
    })
  : null
