import { Request, Response } from 'express'
import errorHandler from '../../utils/httpErrorHandler'
import * as Interactor from './CmsInteractor'
import * as Schema from '../../schema//CmsSchema'
import zParse from '../../utils/zParse'
import { SessionRequest } from '../../types/AuthType'

export async function findClientDetails(req: Request, res: Response) {
  try {
    const data = await Interactor.findClientDetails()

    res.status(200).json(data)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function updateClientDetails(req: Request, res: Response) {
  try {
    const { body } = await zParse(Schema.UpdateClientDetails, req)

    await Interactor.updateClientDetails({ body })

    res.status(200).json({ message: 'Updated Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function deleteClientSocial(req: Request, res: Response) {
  try {
    const { id } = req.params

    await Interactor.deleteClientSocial(id)

    res.status(200).json({ message: 'Deleted Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function deleteClientPartner(req: Request, res: Response) {
  try {
    const { id } = req.params

    await Interactor.deleteClientPartner(id)

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
