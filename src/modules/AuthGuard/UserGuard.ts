import { NextFunction, Response } from 'express'
import { SessionRequest } from '../../types/AuthType'
import { findUser } from '../Users/UserService'
import HttpError from '../../utils/HttpError'
import { getVerificationLevel } from '../../utils/utils'
import { findUserAccess } from '../AccessControl/AccessService'
import { findCommunityFarmById } from '../Farm/FarmService'

type AllowedRoles =
  | 'user'
  | 'member'
  | 'guest'
  | 'subfarm_head'
  | 'farm_head'
  | 'farmer'
  | 'asst_admin'
  | 'admin'
// add role login next time
export function UserGuard(allowedRoles: AllowedRoles[]) {
  return async function AuthGuard(
    req: SessionRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userid = req.session.userid

      if (!userid) throw new HttpError('Unauthorized', 401)

      const user = await findUser(userid)
      if (!user) throw new HttpError('Unauthorized', 401)

      if (user?.isbanned) {
        throw new HttpError('Your account has been disabled', 401)
      }

      const verificationLevel = getVerificationLevel(user.verification_level)
      if (verificationLevel !== 4) {
        throw new HttpError('Incomplete Profile Setup', 401)
      }
      // check role authorization
      if (!allowedRoles.includes(user.role)) {
        throw new HttpError('Unauthorized User Level', 401)
      }

      const module = req.module
      // check access level
      if (user.role === 'asst_admin' && module) {
        if (!user[module]) {
          throw new HttpError('Unauthorized Access', 401)
        }
      }

      next()
    } catch (error) {
      console.log(error)
      res.status(error.httpCode || 500).json({
        error: true,
        message: error.message,
        validationErrors: error.validationErrors,
      })
    }
  }
}

export type AdminAccess = {
  farms: boolean
  learning: boolean
  event: boolean
  blog: boolean
  forums: boolean
  admin: boolean
  cuai: boolean
  home: boolean
  about: boolean
  users: boolean
  privacy_policy: boolean
  terms_and_conditions: boolean
  user_feedback: boolean
  crops: boolean
  help_center: boolean
  activity_logs: boolean
}

export type AdminAccessKeys = keyof AdminAccess

export function AccessGuard(module: AdminAccessKeys) {
  return async function AuthGuard(
    req: SessionRequest,
    res: Response,
    next: NextFunction
  ) {
    req.module = module
    next()
  }
}
