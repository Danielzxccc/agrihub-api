import { createClient, RedisClientType } from 'redis'

const REDIS_CONFIG = {
  URL: process.env.REDIS_URL,
}

export let redisClient: RedisClientType
;(async () => {
  if (!redisClient) {
    redisClient = createClient({
      url: REDIS_CONFIG.URL,
    })
  }

  await redisClient.connect()
})()

export default redisClient
