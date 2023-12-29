import { Request, Response } from 'express'
import { SessionRequest } from '../../types/AuthType'
import errorHandler from '../../utils/httpErrorHandler'
import zParse from '../../utils/zParse'
import * as Interactor from './BlogsInteractor'
import * as Schema from '../../schema/BlogsSchema'

export async function createBlogs(req: SessionRequest, res: Response) {
  try {
    const { body } = await zParse(Schema.NewBlog, req)

    const newBlog = await Interactor.createBlogs(body)
    res.status(201).json({ message: 'Blog created successfully', newBlog })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function listBlogs(req: SessionRequest, res: Response) {
  try {
    const { query } = await zParse(Schema.ListBlogs, req)

    const searchKey = String(query.search)

    const blogs = await Interactor.listBlogs(searchKey)
    res.status(200).json(blogs)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function viewBlogs(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params
    const blogs = await Interactor.viewBlogs(id)
    res.status(200).json(blogs)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function updateBlogs(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params
    const { body } = await zParse(Schema.UpdateBlogs, req)

    const blogs = await Interactor.updateBlogs(id, body)
    res.status(200).json({ message: 'Update Success', blogs })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function removeBlogs(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params

    await Interactor.deleteBlogs(id)
    res.status(200).json({ message: 'Delete Success' })
  } catch (error) {
    errorHandler(res, error)
  }
}
