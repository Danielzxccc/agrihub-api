import { UpdateUser } from '../types/DBTypes'
import { Request } from 'express'
import { Session } from 'express-session'

interface SessionData {
  userid: string
}

export interface SessionRequest extends Request {
  session: Session & Partial<SessionData>
}
