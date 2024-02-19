import { Request, Response } from 'express'
import errorHandler from '../../utils/httpErrorHandler'
import * as Schema from '../../schema/BlogsSchema'
import zParse from '../../utils/zParse'
import * as Interactor from './BlogsInteractor'

export async function createDraftBlog(req: Request, res: Response) {
  try {
    const { body } = await zParse(Schema.NewBlog, req)

    const newBlog = await Interactor.createDraftBlog(body)

    res.status(201).json({ message: 'Created Successfully', data: newBlog })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function updateDraftBlog(req: Request, res: Response) {
  try {
    const { id } = req.params
    const { body } = await zParse(Schema.UpdateBlog, req)

    const updatedBlog = await Interactor.updateDraftBlog(id, body)

    res.status(200).json({ message: 'Updated Successfuly', data: updatedBlog })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function removeDraftBlog(req: Request, res: Response) {
  try {
    const { id } = req.params

    await Interactor.removeDraftBlog(id)

    res.status(200).json({ message: 'Deleted Successfuly' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function createBlogImage(req: Request, res: Response) {
  try {
    const { id } = req.params
    await zParse(Schema.NewBlogImage, req)
    const image = req.file

    const newBlogImage = await Interactor.createBlogImage(id, image)

    res.status(201).json({ message: 'Created Successfuly', data: newBlogImage })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function removeBlogImage(req: Request, res: Response) {
  try {
    const { id } = req.params

    await Interactor.removeBlogImage(id)

    res.status(200).json({ message: 'Deleted Successfuly' })
  } catch (error) {
    errorHandler(res, error)
  }
}
