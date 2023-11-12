import { Request, Response } from 'express'
import errorHandler from '../../utils/httpErrorHandler'
import * as Interactor from './UserInteractor'
import * as Schema from '../../schema/UserSchema'
import zParse from '../../utils/zParse'
import { SessionRequest } from '../../types/AuthType'

export async function findUserProfile(req: Request, res: Response) {
  try {
    const { params } = await zParse(Schema.UserProfile, req)
    const user = await Interactor.findUserProfile(params.username)
    res.status(200).json(user)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function updateUserProfile(req: SessionRequest, res: Response) {
  try {
    const { params, body } = await zParse(Schema.UpdateProfile, req)
    const sessionId = req.session.userid
    const avatar = req.file?.filename

    const updatedUser = await Interactor.updateUserProfile(
      params.id,
      sessionId,
      body,
      avatar
    )
    res
      .status(200)
      .json({ message: 'Profile updated successfully', user: updatedUser })
  } catch (error) {
    errorHandler(res, error)
  }
}
