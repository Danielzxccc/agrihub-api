import { NextFunction, Response } from 'express'
import { SessionRequest } from '../../types/AuthType'
import { findUser } from '../Users/UserService'
import HttpError from '../../utils/HttpError'
import { getVerificationLevel } from '../../utils/utils'

// add role login next time
export function UserGuard(role: string[]) {
  return async function AuthGuard(
    req: SessionRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userid = req.session.userid

      if (!userid) throw new HttpError('Unauthorized', 401)

      const user = await findUser(userid)
      const verificationLevel = getVerificationLevel(user.verification_level)
      if (verificationLevel !== 4) {
        throw new HttpError('Incomplete Profile Setup', 401)
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
