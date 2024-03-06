import { Request, Response } from 'express'
import errorHandler from '../../utils/httpErrorHandler'
import * as Interactor from './CmsInteractor'

export async function findClientDetails(req: Request, res: Response) {
  try {
    const data = await Interactor.findClientDetails()

    res.status(200).json(data)
  } catch (error) {
    errorHandler(res, error)
  }
}
