import { SessionRequest } from '../../types/AuthType'
import { Response } from 'express'
import errorHandler from '../../utils/httpErrorHandler'
import zParse from '../../utils/zParse'
import * as Interactor from './LandingInteractor'
import * as Schema from '../../schema/LandingPageSchema'

export async function listLandingPageDetails(
  req: SessionRequest,
  res: Response
) {
  try {
    const { id } = req.params
    const details = await Interactor.listLandingPageDetails(id)
    res.status(200).json(details)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function listApproach(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params
    const details = await Interactor.listApproach(id)
    res.status(200).json(details)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function listImages(req: SessionRequest, res: Response) {
  try {
    const { landing_id } = req.params
    const images = await Interactor.listImages(landing_id)
    res.status(200).json(images)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function updateApproach(req: SessionRequest, res: Response) {
  try {
    const { body } = await zParse(Schema.UpdateApproach, req)
    const updateApproach = await Interactor.updateApproach(body)
    res.status(200).json({ message: 'Update Successfull', updateApproach })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function updateLanding(req: SessionRequest, res: Response) {
  try {
    const { body } = await zParse(Schema.UpdateLanding, req)

    const updateLanding = await Interactor.updateLanding(body)
    res.status(200).json({ message: 'Updated successfull', updateLanding })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function addImage(req: SessionRequest, res: Response) {
  try {
    const { body } = await zParse(Schema.AddImage, req)
    const file = req.file

    const addImage = await Interactor.addImage(body, file)
    res.status(200).json({ message: 'Image successfuly added', addImage })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function deleteImage(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params

    const deleteImage = await Interactor.deleteImage(id)

    res.status(200).json({ message: 'Image Deleted', deleteImage })
  } catch (error) {
    errorHandler(res, error)
  }
}
