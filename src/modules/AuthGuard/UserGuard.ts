import { NextFunction, Response } from 'express'
import { SessionRequest } from '../../types/AuthType'
import { findUser } from '../Users/UserService'
import HttpError from '../../utils/HttpError'
import { getVerificationLevel } from '../../utils/utils'

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

      console.log(userid, 'BAKIT WALA POTA')
      if (!userid) throw new HttpError('Unauthorized', 401)

      const user = await findUser(userid)
      const verificationLevel = getVerificationLevel(user.verification_level)
      if (verificationLevel !== 4) {
        throw new HttpError('Incomplete Profile Setup', 401)
      }
      // check role authorization
      if (!allowedRoles.includes(user.role)) {
        throw new HttpError('Unauthorized User Level', 401)
      }
      next()
    } catch (error) {
      res.status(error.httpCode || 500).json({
        error: true,
        message: error.message,
        validationErrors: error.validationErrors,
      })
    }
  }
}
