import { UserGuard } from '../AuthGuard/UserGuard'
import express from 'express'
import * as BlogsController from './BlogsController'

export const BlogsRouter = express.Router()

BlogsRouter.post('/', UserGuard(['admin']), BlogsController.createBlogs)

BlogsRouter.get('/', BlogsController.listBlogs)
BlogsRouter.get('/:id', BlogsController.viewBlogs)
BlogsRouter.put('/:id', BlogsController.updateBlogs)
BlogsRouter.delete('/:id', BlogsController.removeBlogs)
