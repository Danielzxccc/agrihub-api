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

BlogsRouter.delete(
  '/remove/image/:id',
  UserGuard(['admin', 'asst_admin']),
  BlogsController.removeBlogImage
)

BlogsRouter.post(
  '/create/tags/:id',
  UserGuard(['admin', 'asst_admin']),
  BlogsController.createBlogTags
)

BlogsRouter.delete(
  '/remove/tags/:id',
  UserGuard(['admin', 'asst_admin']),
  BlogsController.deleteBlogTag
)

BlogsRouter.get(
  '/draft/list',
  UserGuard(['admin', 'asst_admin']),
  BlogsController.listDraftBlogs
)

BlogsRouter.get(
  '/view/:id',
  UserGuard(['admin', 'asst_admin']),
  BlogsController.viewBlog
)

BlogsRouter.delete(
  '/archive/:id',
  UserGuard(['admin', 'asst_admin']),
  BlogsController.archiveBlog
)

BlogsRouter.put(
  '/unarchive/:id',
  UserGuard(['admin', 'asst_admin']),
  BlogsController.unArchiveBlog
)

BlogsRouter.get(
  '/archived/list',
  UserGuard(['admin', 'asst_admin']),
  BlogsController.listArchivedBlogs
)

BlogsRouter.put(
  '/publish/:id',
  UserGuard(['admin', 'asst_admin']),
  BlogsController.publishBlog
)

BlogsRouter.put(
  '/unpublish/:id',
  UserGuard(['admin', 'asst_admin']),
  BlogsController.unpublishBlog
)

BlogsRouter.get('/published/list', BlogsController.listPublishedBlogs)
BlogsRouter.get('/published/:id', BlogsController.viewPublishedBlog)

BlogsRouter.put('/thumbnail/:id/:blog_id', BlogsController.setBlogThumbnail)
