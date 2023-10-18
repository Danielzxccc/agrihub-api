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

// hard coded for now
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://127.0.0.1:8080',
  'https://agrihub-frontend-agrihub-web.vercel.app',
]
export const corsOptions = {
  origin: (origin: any, callback: any) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by Cors'))
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
}
