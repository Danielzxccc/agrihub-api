import { createClient, RedisClientType } from 'redis'
import log from '../utils/utils'

const REDIS_CONFIG = {
  URL: process.env.REDIS_URL,
  CONNECT_TIMEOUT: 5000, // Timeout value in milliseconds
}

export let redisClient: RedisClientType
;(async () => {
  if (!redisClient) {
    redisClient = createClient({
      url: REDIS_CONFIG.URL,
    })
    redisClient.on('error', (err) => {
      if (err.code === 'CONNECTION_BROKEN') {
        console.error('Connection to Redis timed out.')
        // Handle the timeout error as needed
      }
    })
  }

  try {
    await redisClient.connect()
  } catch (error) {
    log.error('Redis Failed')
  }
})()

export default redisClient
