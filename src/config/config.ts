import { SessionOptions } from 'express-session'
import expressSession from 'express-session'
import connectPgSimple from 'connect-pg-simple'
import { Pool } from 'pg'
import * as dotenv from 'dotenv'
dotenv.config()

const pgSession = connectPgSimple(expressSession)
const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export const sessionConfig: SessionOptions = {
  store: new pgSession({
    pool: pgPool,
    createTableIfMissing: true,
  }),
  secret: process.env.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  proxy: true,
  cookie: {
    domain:
      process.env.NODE_ENV === 'development' ? 'localhost' : process.env.DOMAIN,
    path: '/',
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'none',
    secure: process.env.NODE_ENV === 'production',
  },
}

// hard coded for now
export const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'https://qc-agrihub.xyz',
  'https://agrihub.vercel.app',
  'https://dev.qc-agrihub.xyz',
  'https://agrihub-frontend-fork.vercel.app',
  'https://app.qc-agrihub.xyz',
  'https://api.qc-agrihub.xyz',
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
}
