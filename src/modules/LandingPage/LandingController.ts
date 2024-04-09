import { SessionRequest } from '../../types/AuthType'
import { Response } from 'express'
import errorHandler from '../../utils/httpErrorHandler'
import zParse from '../../utils/zParse'
import * as Interactor from './LandingInteractor'
import * as Schema from '../../schema/LandingPageSchema'
import { createAuditLog } from '../AuditLogs/AuditLogsInteractor'

export async function listLandingPageDetails(
  req: SessionRequest,
  res: Response
) {
  try {
    const { id } = req.params
    const details = await Interactor.listLandingPageDetails()
    res.status(200).json(details)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function addImage(req: SessionRequest, res: Response) {
  try {
    const { body } = await zParse(Schema.AddImage, req)
    const file = req.file

    const addImage = await Interactor.addImage(body, file)

    await createAuditLog({
      action: 'Added Image',
      section: 'Landing Page Management',
      userid: req.session.userid,
    })

    res.status(201).json({ message: 'Image successfuly added', addImage })
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

export async function deleteImage(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params

    await Interactor.deleteImage(id)

    await createAuditLog({
      action: 'Deleted Image',
      section: 'Landing Page Management',
      userid: req.session.userid,
    })

    res.status(200).json({ message: 'Image Deleted' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function removeApproach(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params

    await Interactor.removeApproach(id)

    await createAuditLog({
      action: 'Removed Approach',
      section: 'Landing Page Management',
      userid: req.session.userid,
    })

    res.status(200).json({ message: 'Approach Deleted' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function updateLanding(req: SessionRequest, res: Response) {
  try {
    const { body } = await zParse(Schema.UpdateLanding, req)

    const updateLanding = await Interactor.updateLanding(body)

    await createAuditLog({
      action: 'Updated Landing',
      section: 'Landing Page Management',
      userid: req.session.userid,
    })

    res
      .status(200)
      .json({ message: 'Updated successfully', data: updateLanding })
  } catch (error) {
    errorHandler(res, error)
  }
}

// export async function listApproach(req: SessionRequest, res: Response) {
//   try {
//     const { id } = req.params
//     const details = await Interactor.listApproach(id)
//     res.status(200).json(details)
//   } catch (error) {
//     errorHandler(res, error)
//   }
// }

export async function updateApproach(req: SessionRequest, res: Response) {
  try {
    const { body } = await zParse(Schema.UpdateApproach, req)
    const updateApproach = await Interactor.updateApproach(body)

    await createAuditLog({
      action: 'Updated Approach',
      section: 'Landing Page Management',
      userid: req.session.userid,
    })

    res
      .status(200)
      .json({ message: 'Update Successfull', data: updateApproach })
  } catch (error) {
    errorHandler(res, error)
  }
}
