import * as dotenv from 'dotenv'
dotenv.config()

export const sessionConfig = {
  key: 'userId',
  secret: process.env.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
  },
}
