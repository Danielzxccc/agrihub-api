import { Request, Response } from 'express'
import errorHandler from '../utils/httpErrorHandler'
import * as Interactor from '../interactors/AuthInteractor'
import * as Schema from '../schema/AuthSchema'
import zParse from '../utils/zParse'
import { SessionRequest } from '../types/AuthType'

export async function authenticateUser(req: SessionRequest, res: Response) {
  try {
    const credentials = await zParse(Schema.UserAuthSchema, req)

    const { username, password } = credentials.body

    const auth = await Interactor.authenticateUser(username, password)
    delete auth.password
    req.session.user = auth
    res.status(200).json({ message: 'User Authenticated', user: auth })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function registerUser(req: Request, res: Response) {
  try {
    const newUser = await zParse(Schema.UserRegisterSchema, req)

    const user = await Interactor.registerUser(newUser.body)
    res.status(201).json({ message: 'Registered Successfully', user })
  } catch (error) {
    errorHandler(res, error)
  }
}

export function getCurrentUser(req: SessionRequest, res: Response) {
  const user = req.session.user
  delete user.password
  res.status(200).json(user)
}
