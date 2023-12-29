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

export async function addImage(req: SessionRequest, res: Response) {
  try {
    const { body } = await zParse(Schema.AddImage, req)
    const file = req.file

    const addImage = await Interactor.addImage(body, file)
    res.status(200).json({ message: 'Image successfully added', addImage })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function deleteImage(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params

    const deleteImage = await Interactor.deleteImage(id)

    res.status(200).json({ message: 'Image deleted', deleteImage })
  } catch (error) {
    errorHandler(res, error)
  }
}
