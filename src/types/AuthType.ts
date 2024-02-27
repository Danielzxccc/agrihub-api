import { UpdateUser } from '../types/DBTypes'
import { Request } from 'express'
import { Session } from 'express-session'
import { AdminAccessKeys } from '../modules/AuthGuard/UserGuard'

interface SessionData {
  userid: string
}

export interface SessionRequest extends Request {
  session: Session & Partial<SessionData>
  module: AdminAccessKeys
}
