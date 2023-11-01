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
