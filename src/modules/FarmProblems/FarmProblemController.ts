import * as Interactor from './FarmProblemInteractor'
import * as Schema from '../../schema/FarmProblemSchema'
import { Request, Response } from 'express'
import errorHandler from '../../utils/httpErrorHandler'
import zParse from '../../utils/zParse'

export async function upsertFarmProblem(req: Request, res: Response) {
  try {
    const { body } = await zParse(Schema.NewFarmProblem, req)
    const { id, problem, description, materials } = body

    const data = await Interactor.upsertFarmProblem(
      { id, problem, description },
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
