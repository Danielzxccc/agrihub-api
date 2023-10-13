// import RedisStore from 'connect-redis'
import * as dotenv from 'dotenv'
dotenv.config()
// import { createClient } from 'redis'

// let redisClient = createClient({ url: process.env.REDIS_URL })
// redisClient.connect().catch(console.error)

// let redisStore = new RedisStore({
//   client: redisClient,
//   prefix: 'myapp:',
// })

export const sessionConfig = {
  key: 'userId',
  // store: redisStore,
  secret: process.env.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
  },
}
