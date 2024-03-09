import { NextFunction, Request, Response } from 'express'

import redisClient from '../config/redis'
import rateLimit from 'express-rate-limit'
import RedisStore from 'rate-limit-redis'

type RateLimitterRule = {
  endpoint: string
  rate_limit: {
    time: number
    limit: number
  }
}

export function rateLimiter(rule: RateLimitterRule) {
  const { rate_limit } = rule
  return rateLimit({
    // Rate limiter configuration
    windowMs: rate_limit.time * 60 * 1000, // 1 minute
    max: rate_limit.limit, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: (req: Request, res: Response) => {
      return {
        error: true,
        message: 'Too many requests',
      }
    },

    // Redis store configuration
    store: new RedisStore({
      sendCommand: (...args: string[]) => redisClient.sendCommand(args),
    }),
  })
}

export const limitter = rateLimit({
  // Rate limiter configuration
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 1, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers

  // Redis store configuration
  store: new RedisStore({
    sendCommand: (...args: string[]) => redisClient.sendCommand(args),
  }),
})
