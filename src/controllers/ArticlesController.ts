import errorHandler from '../utils/httpErrorHandler'
import * as Interactor from '../interactors/ArticlesInteractor'
import { Request, Response } from 'express'
import { SessionRequest } from '../types/AuthType'
import zParse from '../utils/zParse'
import * as Schema from '../schema/ArticlesSchema'

export async function createsNewArticle(req: Request, res: Response) {
  try {
    const contents = await zParse(Schema.CreateArticleSchema, req)

    const newArticle = await Interactor.createArticle(contents.body)

    res.status(201).json({ message: 'Article Added Successfully!', newArticle })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function updatesArticle(req: SessionRequest, res: Response) {
  try {
    const activeUser = req.session?.user?.id
    const { id } = req.params
    const { userid, title, body, thumbnailsrc, imagesrc } = req.body
    const updatedArticle = await Interactor.updateArticle(id, activeUser, {
      userid,
      title,
      body,
      thumbnailsrc,
      imagesrc,
    })

    res
      .status(201)
      .json({ message: 'Article Updated Successfully!', updatedArticle })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function deletesArticle(req: Request, res: Response) {
  try {
    const { id } = req.params
    const deletedArticle = await Interactor.deleteArticle(id)
    res
      .status(201)
      .json({ message: 'Article Removed Successfully!', deletedArticle })
  } catch (error) {
    errorHandler(res, error)
  }
}
