import errorHandler from '../../utils/httpErrorHandler'
import * as Interactor from './ArticlesInteractor'
import { Request, Response } from 'express'
import { SessionRequest } from '../../types/AuthType'
import zParse from '../../utils/zParse'
import * as Schema from '../../schema/ArticlesSchema'
import { Session } from 'express-session'

export async function createArticle(req: Request, res: Response) {
  try {
    const contents = await zParse(Schema.ArticleSchema, req)

    const newArticle = await Interactor.createArticle(contents.body)

    res.status(201).json({ message: 'Article Added Successfully!', newArticle })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function updateArticle(req: SessionRequest, res: Response) {
  try {
    // const activeUser = req.session?.user?.id
    // const { id } = req.params
    // const contents = await zParse(Schema.ArticleSchema, req)

    // const updatedArticle = await Interactor.updateArticle(
    //   id,
    //   activeUser,
    //   contents.body
    // )

    res.status(200).json({ message: 'Article Updated Successfully!' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function deleteArticle(req: Request, res: Response) {
  try {
    const { id } = req.params
    const deletedArticle = await Interactor.deleteArticle(id)
    res
      .status(200)
      .json({ message: 'Article Removed Successfully!', deletedArticle })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function viewArticle(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params
    const articles = await Interactor.viewArticle(id)
    res.status(200).json(articles)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function listArticle(req: SessionRequest, res: Response) {
  try {
    const { query } = await zParse(Schema.ListArticle, req)
    const searchKey = String(query.search)

    const article = await Interactor.listArticle(searchKey)
    res.status(200).json(article)
  } catch (error) {
    errorHandler(res, error)
  }
}
