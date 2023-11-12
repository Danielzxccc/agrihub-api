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

export async function getNewForums(req: Request, res: Response) {
  try {
    const offset = req.query.offset ? Number(req.query.offset) : 0
    const newForums = await Interactor.getNewForums(offset)
    res.status(200).json(newForums)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function getPopularForums(req: Request, res: Response) {
  try {
    const popularForums = await Interactor.getPopularForums()
    res.status(200).json(popularForums)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
