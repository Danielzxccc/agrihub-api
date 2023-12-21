import { Response } from 'express'
import { SessionRequest } from '../../types/AuthType'
import * as Interactor from './AboutInteractor'
import zParse from '../../utils/zParse'
import * as Schema from '../../schema/AboutSchema'
import errorHandler from '../../utils/httpErrorHandler'

export async function updateAbout(req: SessionRequest, res: Response) {
  try {
    const { body } = await zParse(Schema.UpdateAbout, req)

    const updateAbout = await Interactor.updateAbout(body)
    res.status(200).json({ message: 'Update Sucessful', updateAbout })
  } catch (error) {
    errorHandler(res, error)
  }
}
