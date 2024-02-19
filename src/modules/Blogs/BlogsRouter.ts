import { UserGuard } from '../AuthGuard/UserGuard'
import express from 'express'
import * as BlogsController from './BlogsController'
import upload from '../../config/multer'

export const BlogsRouter = express.Router()

BlogsRouter.post(
  '/create/draft',
  UserGuard(['admin', 'asst_admin']),
  BlogsController.createDraftBlog
)

BlogsRouter.put(
  '/update/draft/:id',
  UserGuard(['admin', 'asst_admin']),
  BlogsController.updateDraftBlog
)

BlogsRouter.delete(
  '/remove/draft/:id',
  UserGuard(['admin', 'asst_admin']),
  BlogsController.removeDraftBlog
)

BlogsRouter.post(
  '/create/image/:id',
  UserGuard(['admin', 'asst_admin']),
  upload.single('image'),
  BlogsController.createBlogImage
)
