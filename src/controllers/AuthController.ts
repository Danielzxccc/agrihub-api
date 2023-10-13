import { Request, Response } from 'express'
import errorHandler from '../utils/httpErrorHandler'
import * as Interactor from '../interactors/AuthInteractor'
import * as Schema from '../schema/AuthSchema'
import zParse from '../utils/zParse'
import { SessionRequest } from 'AuthType'

export async function authenticateUser(req: SessionRequest, res: Response) {
  try {
    await zParse(Schema.UserAuthSchema, req)
    const { username, password } = req.body

    const auth = await Interactor.authenticateUser(username, password)
    req.session.user = auth
    res.status(200).json({ message: 'User Authenticated', user: auth })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function registerUser(req: Request, res: Response) {
  try {
    await zParse(Schema.UserRegisterSchema, req)
    const { username, password, email, firstname } = req.body
    const user = await Interactor.registerUser({
      username,
      password,
      email,
      firstname,
    })
    res.status(201).json({ message: 'Registered Successfully', user })
  } catch (error) {
    errorHandler(res, error)
  }
}
