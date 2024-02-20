import { Request, Response } from 'express'
import errorHandler from '../../utils/httpErrorHandler'
import zParse from '../../utils/zParse'
import * as Schema from '../../schema/FarmRequest'
import * as Interactor from './FarmRequestInteractor'
import { SessionRequest } from '../../types/AuthType'

export async function createtSeedlingRequest(
  req: SessionRequest,
  res: Response
) {
  try {
    const { body } = await zParse(Schema.NewSeedlingRequest, req)
    const { userid } = req.session
    const data = await Interactor.createtSeedlingRequest(body, userid)

    res.status(201).json({ message: 'Created Successfully', data })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function cancelSeedlingRequest(
  req: SessionRequest,
  res: Response
) {
  try {
    const { userid } = req.session
    const { id } = req.params
    await Interactor.cancelSeedlingRequest(id, userid)

    res.status(201).json({ message: 'Cancelled Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function listSeedlingRequestByFarm(
  req: SessionRequest,
  res: Response
) {
  try {
    const { userid } = req.session
    const requests = await Interactor.listSeedlingRequestByFarm(userid)

    res.status(201).json(requests)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function listAllSeedlingRequests(req: Request, res: Response) {
  try {
    const { query } = await zParse(Schema.ListSeedlingRequest, req)

    const perPage = Number(query.perpage)
    const pageNumber = Number(query.page) || 1
    const offset = (pageNumber - 1) * perPage
    const searchKey = String(query.search)
    const filterKey = query.filter

    const requests = await Interactor.listAllSeedlingRequests(
      offset,
      searchKey,
      perPage,
      filterKey
    )

    const totalPages = Math.ceil(Number(requests.total.count) / perPage)
    res.status(200).json({
      data: requests.data,
      pagination: {
        page: pageNumber,
        per_page: perPage,
        total_pages: totalPages,
        total_records: Number(requests.total.count),
      },
    })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function acceptSeedlingRequest(req: Request, res: Response) {
  try {
    const { id } = req.params
    const { body } = await zParse(Schema.AcceptSeedlingRequest, req)

    await Interactor.acceptSeedlingRequest(id, body)

    res.status(201).json({ message: 'Accepted Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function rejectSeedlingRequest(req: Request, res: Response) {
  try {
    const { id } = req.params

    await Interactor.rejectSeedlingRequest(id)

    res.status(201).json({ message: 'Rejected Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}
