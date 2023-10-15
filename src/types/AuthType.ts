import { User } from '../types/DBTypes'
import { Request } from 'express'
import { Session } from 'express-session'

interface SessionData {
  user: User
}

export interface SessionRequest extends Request {
  session: Session & Partial<SessionData>
}
