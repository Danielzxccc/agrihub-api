import { Request, Response } from 'express'
import errorHandler from '../../utils/httpErrorHandler'
import * as Interactor from './CmsInteractor'
import * as Schema from '../../schema//CmsSchema'
import zParse from '../../utils/zParse'
import { SessionRequest } from '../../types/AuthType'
import { UpdateAboutUs } from '../../schema/AboutSchema'
import { deleteFile } from '../../utils/file'
import { createAuditLog } from '../AuditLogs/AuditLogsInteractor'

export async function findClientDetails(req: Request, res: Response) {
  try {
    const data = await Interactor.findClientDetails()

    res.status(200).json(data)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function updateClientDetails(req: SessionRequest, res: Response) {
  try {
    const { body } = await zParse(Schema.UpdateClientDetails, req)

    await Interactor.updateClientDetails({ body })

    await createAuditLog({
      action: 'Updated Client Details',
      section: 'CMS',
      userid: req.session.userid,
    })

    res.status(200).json({ message: 'Updated Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function deleteClientSocial(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params

    await Interactor.deleteClientSocial(id)

    await createAuditLog({
      action: 'Deleted Client Social',
      section: 'CMS',
      userid: req.session.userid,
    })

    res.status(200).json({ message: 'Deleted Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function deleteClientPartner(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params

    await Interactor.deleteClientPartner(id)

    await createAuditLog({
      action: 'Deleted Client Partner',
      section: 'CMS',
      userid: req.session.userid,
    })

    res.status(200).json({ message: 'Deleted Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function deleteClientMember(req: Request, res: Response) {
  try {
    const { id } = req.params

    await Interactor.deleteClientMember(id)

    res.status(200).json({ message: 'Deleted Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function createUserFeedback(req: SessionRequest, res: Response) {
  try {
    const { userid } = req.session
    const { body } = await zParse(Schema.NewUserFeedback, req)

    const data = await Interactor.createUserFeedback({ ...body, userid })

    await createAuditLog({
      action: 'Created User Feedback',
      section: 'CMS',
      userid: req.session.userid,
    })

    res.status(201).json({ message: 'Created New Feedback', data })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function listUserFeedbacks(req: Request, res: Response) {
  try {
    const { query } = await zParse(Schema.ListUserFeedbacks, req)

    const perPage = Number(query.perpage)
    const pageNumber = Number(query.page) || 1
    const offset = (pageNumber - 1) * perPage
    const searchKey = String(query.search)

    const events = await Interactor.listUserFeedbacks(
      offset,
      searchKey,
      perPage
    )

    const totalPages = Math.ceil(Number(events.total.count) / perPage)
    res.status(200).json({
      data: events.data,
      pagination: {
        page: pageNumber,
        per_page: perPage,
        total_pages: totalPages,
        total_records: Number(events.total.count),
      },
    })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function viewUserFeedback(req: Request, res: Response) {
  try {
    const { id } = req.params

    const data = await Interactor.viewUserFeedback(id)

    res.status(200).json(data)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function getVisionStatistics(req: SessionRequest, res: Response) {
  try {
    const data = await Interactor.getVisionStatistics()

    res.status(200).json(data)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function updateAboutUs(req: SessionRequest, res: Response) {
  try {
    const { body } = await zParse(UpdateAboutUs, req)
    // const data = await Interactor.updateAboutUs()
    const banner = (
      req.files as { [fieldname: string]: Express.Multer.File[] }
    )?.['banner']?.[0]

    const city_image = (
      req.files as { [fieldname: string]: Express.Multer.File[] }
    )?.['city_image']?.[0]

    const president_image = (
      req.files as { [fieldname: string]: Express.Multer.File[] }
    )?.['president_image']?.[0]

    const qcu_logo = (
      req.files as { [fieldname: string]: Express.Multer.File[] }
    )?.['qcu_logo']?.[0]

    const agrihub_user_logo = (
      req.files as { [fieldname: string]: Express.Multer.File[] }
    )?.['agrihub_user_logo']?.[0]

    await Interactor.updateAboutUs({
      banner,
      city_image,
      president_image,
      agrihub_user_logo,
      qcu_logo,
      data: { body },
    })

    await createAuditLog({
      action: 'Updated About Us',
      section: 'CMS',
      userid: req.session.userid,
    })

    res.status(200).json({ message: 'Updated Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function viewAboutUs(req: SessionRequest, res: Response) {
  try {
    const data = await Interactor.viewAboutUs()

    res.status(200).json(data)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function createAboutCarouselImage(
  req: SessionRequest,
  res: Response
) {
  try {
    await zParse(Schema.CreateNewCarouselItem, req)

    const file = req.file

    await Interactor.createAboutCarouselImage(file)

    await createAuditLog({
      action: 'Created About Carousel Image',
      section: 'CMS',
      userid: req.session.userid,
    })

    res.status(200).json({ message: 'Added Successfully' })
  } catch (error) {
    deleteFile(req.file?.filename)
    errorHandler(res, error)
  }
}

export async function deleteAboutCarouselImage(
  req: SessionRequest,
  res: Response
) {
  try {
    const { id } = req.params

    await Interactor.deleteAboutCarouselImage(id)

    await createAuditLog({
      action: 'Deleted About Carousel Image',
      section: 'CMS',
      userid: req.session.userid,
    })

    res.status(200).json({ message: 'Deleted Successfully' })
  } catch (error) {
    deleteFile(req.file?.filename)
    errorHandler(res, error)
  }
}
