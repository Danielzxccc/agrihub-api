import { NextFunction, Request, Response } from 'express'

import redisClient from '../config/redis'

type RateLimitterRule = {
  endpoint: string
  rate_limit: {
    time: number
    limit: number
  }
}

export function rateLimiter(rule: RateLimitterRule) {
  const { endpoint, rate_limit } = rule
  return async (req: Request, res: Response, next: NextFunction) => {
    const ipAddress = req.ip
    const redisId = `${endpoint}/${ipAddress}`

    const requests = await redisClient.incr(redisId)

    if (requests === 1) {
      await redisClient.expire(redisId, rate_limit.time)
    }

    if (requests > rate_limit.limit) {
      return res.status(429).json({
        error: true,
        message: 'too many requests',
      })
    }
    next()
  }
}
