import * as Interactor from './FarmProblemInteractor'
import * as Schema from '../../schema/FarmProblemSchema'
import { Request, Response } from 'express'
import errorHandler from '../../utils/httpErrorHandler'
import zParse from '../../utils/zParse'
import { SessionRequest } from '../../types/AuthType'

export async function upsertFarmProblem(req: Request, res: Response) {
  try {
    const { body } = await zParse(Schema.NewFarmProblem, req)
    const { id, problem, description, materials, common } = body

    const data = await Interactor.upsertFarmProblem(
      { id, problem, description, common },
      materials
    )

    res.status(200).json(data)
  } catch (error) {
    errorHandler(res, error)
  }
}
export async function viewFarmProblem(req: Request, res: Response) {
  try {
    const { id } = req.params

    const data = await Interactor.viewFarmProblem(id)

    res.status(200).json(data)
  } catch (error) {
    errorHandler(res, error)
  }
}
export async function archiveProblem(req: Request, res: Response) {
  try {
    const { id } = req.params

    await Interactor.archiveProblem(id)

    res.status(200).json({ message: 'Archived Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function unarchiveProblem(req: Request, res: Response) {
  try {
    const { id } = req.params

    await Interactor.unarchiveProblem(id)

    res.status(200).json({ message: 'Unarchived Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function deleteFarmProblemMaterial(req: Request, res: Response) {
  try {
    const { id } = req.params

    await Interactor.deleteFarmProblemMaterial(id)

    res.status(200).json({ message: 'Deleted Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function listFarmProblems(req: Request, res: Response) {
  try {
    const { query } = await zParse(Schema.ListFarmProblems, req)

    const perPage = Number(query.perpage)
    const pageNumber = Number(query.page) || 1
    const offset = (pageNumber - 1) * perPage
    const searchKey = String(query.search)
    const filterKey = query.filter

    const problems = await Interactor.listFarmProblems(
      offset,
      perPage,
      searchKey,
      filterKey
    )

    const totalPages = Math.ceil(Number(problems.total.count) / perPage)
    res.status(200).json({
      data: problems.data,
      pagination: {
        page: pageNumber,
        per_page: 20,
        total_pages: totalPages,
        total_records: Number(problems.total.count),
      },
    })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function listArchivedFarmProblems(req: Request, res: Response) {
  try {
    const { query } = await zParse(Schema.ListFarmProblems, req)

    const perPage = Number(query.perpage)
    const pageNumber = Number(query.page) || 1
    const offset = (pageNumber - 1) * perPage
    const searchKey = String(query.search)
    const filterKey = query.filter

    const problems = await Interactor.listArchivedFarmProblems(
      offset,
      perPage,
      searchKey,
      filterKey
    )

    const totalPages = Math.ceil(Number(problems.total.count) / perPage)
    res.status(200).json({
      data: problems.data,
      pagination: {
        page: pageNumber,
        per_page: 20,
        total_pages: totalPages,
        total_records: Number(problems.total.count),
      },
    })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function sendFarmProblemReport(
  req: SessionRequest,
  res: Response
) {
  try {
    const { userid } = req.session
    const { body } = await zParse(Schema.SendReportProblem, req)

    const data = await Interactor.sendFarmProblemReport(userid, { body })

    res.status(200).json(data)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function listCommunityFarmProblems(
  req: SessionRequest,
  res: Response
) {
  try {
    const { query } = await zParse(Schema.ListCommunityFarmProblems, req)
    const { userid } = req.session

    const perPage = Number(query.perpage)
    const pageNumber = Number(query.page) || 1
    const offset = (pageNumber - 1) * perPage
    const searchKey = String(query.search)
    const filterKey = query.filter

    const problems = await Interactor.listCommunityFarmProblems(
      userid,
      offset,
      perPage,
      searchKey,
      filterKey
    )

    const totalPages = Math.ceil(Number(problems.total.count) / perPage)
    res.status(200).json({
      data: problems.data,
      pagination: {
        page: pageNumber,
        per_page: perPage,
        total_pages: totalPages,
        total_records: Number(problems.total.count),
      },
    })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function markProblemAsResolved(req: Request, res: Response) {
  try {
    const id = req.params.id
    const { body } = await zParse(Schema.MarkProblemAsResolved, req)

    await Interactor.markProblemAsResolved(id, body.is_helpful, body.feedback)

    res.status(200).json({ message: 'Resolved Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function findReportedProblems(req: Request, res: Response) {
  try {
    const { query } = await zParse(Schema.ListCommunityFarmProblems, req)

    const perPage = Number(query.perpage)
    const pageNumber = Number(query.page) || 1
    const offset = (pageNumber - 1) * perPage
    const searchKey = String(query.search)
    const filterKey = query.filter

    const problems = await Interactor.findReportedProblems(
      offset,
      perPage,
      searchKey,
      filterKey
    )

    const totalPages = Math.ceil(Number(problems.total.count) / perPage)
    res.status(200).json({
      data: problems.data,
      pagination: {
        page: pageNumber,
        per_page: perPage,
        total_pages: totalPages,
        total_records: Number(problems.total.count),
      },
    })
  } catch (error) {
    errorHandler(res, error)
  }
}
