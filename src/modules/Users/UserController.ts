import { Request, Response } from 'express'
import errorHandler from '../../utils/httpErrorHandler'
import * as Interactor from './UserInteractor'
import * as Schema from '../../schema/UserSchema'
import zParse from '../../utils/zParse'

export async function findUserProfile(req: Request, res: Response) {
  try {
    const { params } = await zParse(Schema.UserProfile, req)
    const user = await Interactor.findUserProfile(params.username)
    res.status(200).json(user)
  } catch (error) {
    errorHandler(res, error)
  }
}
