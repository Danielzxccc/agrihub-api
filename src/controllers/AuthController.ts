import { Request, Response } from 'express'
import errorHandler from '../utils/httpErrorHandler'
import * as Interactor from '../interactors/AuthInteractor'
import * as Schema from '../schema/AuthSchema'
import zParse from '../utils/zParse'

export async function authenticateUser(req: Request, res: Response) {
  try {
    await zParse(Schema.UserAuthSchema, req)
    const { username, password } = req.body

    const auth = await Interactor.authenticateUser(username, password)
    res.status(200).json({ message: 'User Authenticated', user: auth })
  } catch (error) {
    errorHandler(res, error)
  }
}
