import { Request, Response } from 'express'
import errorHandler from '../../utils/httpErrorHandler'
import * as Interactor from './TagsInteractor'
import * as Schema from '../../schema/TagsSchema'
import zParse from '../../utils/zParse'
export async function findTags(req: Request, res: Response) {
  try {
    const { query } = await zParse(Schema.Tags, req)
    const tags = await Interactor.findTags(query.key)

    res.status(200).json(tags)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function getTags(req: Request, res: Response) {
  try {
    const { query } = await zParse(Schema.SearchTags, req)

    const perPage = Number(query.perpage)
    const pageNumber = Number(query.page) || 1
    const offset = (pageNumber - 1) * perPage
    const searchKey = String(query.search)
    const filterKey = query.filter

    console.log(filterKey, 'test fitler')

    const tags = await Interactor.getTags(offset, filterKey, searchKey, perPage)

    const totalPages = Math.ceil(Number(tags.total.count) / perPage)
    res.status(200).json({
      tags: tags.data,
      pagination: {
        page: pageNumber,
        per_page: 20,
        total_pages: totalPages,
        total_records: Number(tags.total.count),
      },
    })
  } catch (error) {
    errorHandler(res, error)
  }
}
