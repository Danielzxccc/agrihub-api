import { Request, Response } from 'express'
import errorHandler from '../../utils/httpErrorHandler'
import * as Interactor from './AccessInteractor'
import * as Schema from '../../schema/AccessControlSchema'
import zParse from '../../utils/zParse'

export async function createNewAdmin(req: Request, res: Response) {
  try {
    const { body } = await zParse(Schema.NewAdmin, req)
    const { email, password, access } = body

    const data = await Interactor.createNewAdmin({ email, password }, access)

    res.status(201).json({ message: 'Created Successfully', data })
  } catch (error) {
    errorHandler(res, error)
  }
}
