import { Request, Response } from 'express'
import errorHandler from '../../utils/httpErrorHandler'
import * as Schema from '../../schema/BlogsSchema'
import zParse from '../../utils/zParse'
import * as Interactor from './BlogsInteractor'
import { createAuditLog } from '../AuditLogs/AuditLogsInteractor'
import { SessionRequest } from '../../types/AuthType'

export async function createDraftBlog(req: SessionRequest, res: Response) {
  try {
    const { body } = await zParse(Schema.NewBlog, req)

    const newBlog = await Interactor.createDraftBlog(body)

    await createAuditLog({
      action: 'Created Draft Blog',
      section: 'Blogs Management',
      userid: req.session.userid,
    })

    res.status(201).json({ message: 'Created Successfully', data: newBlog })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function updateDraftBlog(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params
    const { body } = await zParse(Schema.UpdateBlog, req)

    const updatedBlog = await Interactor.updateDraftBlog(id, body)

    await createAuditLog({
      action: 'Updated Draft Blog',
      section: 'Blogs Management',
      userid: req.session.userid,
    })

    res.status(200).json({ message: 'Updated Successfuly', data: updatedBlog })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function removeDraftBlog(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params

    await Interactor.removeDraftBlog(id)

    await createAuditLog({
      action: 'Removed Draft Blog',
      section: 'Blogs Management',
      userid: req.session.userid,
    })

    res.status(200).json({ message: 'Deleted Successfuly' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function createBlogImage(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params
    await zParse(Schema.NewBlogImage, req)
    const image = req.file

    const newBlogImage = await Interactor.createBlogImage(id, image)

    await createAuditLog({
      action: 'Created Blog Imaage',
      section: 'Blogs Management',
      userid: req.session.userid,
    })

    res.status(201).json({ message: 'Created Successfuly', data: newBlogImage })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function removeBlogImage(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params

    await Interactor.removeBlogImage(id)

    await createAuditLog({
      action: 'Removed Blog Image',
      section: 'Blogs Management',
      userid: req.session.userid,
    })

    res.status(200).json({ message: 'Deleted Successfuly' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function createBlogTags(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params
    const { body } = await zParse(Schema.NewBlogTags, req)

    const newEventTags = await Interactor.createBlogTags(id, body.tags)

    await createAuditLog({
      action: 'Created Blog Tags',
      section: 'Blogs Management',
      userid: req.session.userid,
    })

    res
      .status(201)
      .json({ message: 'Created Successfully', data: newEventTags })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function deleteBlogTag(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params

    const newEventTags = await Interactor.deleteBlogTag(id)

    await createAuditLog({
      action: 'Removed Blog Tag',
      section: 'Blogs Management',
      userid: req.session.userid,
    })

    res
      .status(200)
      .json({ message: 'Deleted Successfully', data: newEventTags })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function listDraftBlogs(req: Request, res: Response) {
  try {
    const { query } = await zParse(Schema.ListDraftBlogs, req)

    const perPage = Number(query.perpage)
    const pageNumber = Number(query.page) || 1
    const offset = (pageNumber - 1) * perPage
    const searchKey = String(query.search)

    const events = await Interactor.listDraftBlogs(offset, searchKey, perPage)

    const totalPages = Math.ceil(Number(events.total.count) / perPage)
    res.status(200).json({
      data: events.data,
      pagination: {
        page: pageNumber,
        per_page: 20,
        total_pages: totalPages,
        total_records: Number(events.total.count),
      },
    })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function viewBlog(req: Request, res: Response) {
  try {
    const { id } = req.params

    const blog = await Interactor.viewBlog(id)
    res.status(200).json(blog)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function archiveBlog(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params

    await Interactor.archiveBlog(id)

    await createAuditLog({
      action: 'Archived Blog',
      section: 'Blogs Management',
      userid: req.session.userid,
    })

    res.status(200).json({ message: 'Archived Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function unArchiveBlog(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params

    await Interactor.unArchiveBlog(id)

    await createAuditLog({
      action: 'Unarchived Blog',
      section: 'Blogs Management',
      userid: req.session.userid,
    })

    res.status(200).json({ message: 'Unarchived Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function listArchivedBlogs(req: Request, res: Response) {
  try {
    const { query } = await zParse(Schema.ListDraftBlogs, req)

    const perPage = Number(query.perpage)
    const pageNumber = Number(query.page) || 1
    const offset = (pageNumber - 1) * perPage
    const searchKey = String(query.search)

    const events = await Interactor.listArchivedBlogs(
      offset,
      searchKey,
      perPage
    )

    const totalPages = Math.ceil(Number(events.total.count) / perPage)
    res.status(200).json({
      data: events.data,
      pagination: {
        page: pageNumber,
        per_page: 20,
        total_pages: totalPages,
        total_records: Number(events.total.count),
      },
    })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function listPublishedBlogs(req: Request, res: Response) {
  try {
    const { query } = await zParse(Schema.ListDraftBlogs, req)

    const perPage = Number(query.perpage)
    const pageNumber = Number(query.page) || 1
    const offset = (pageNumber - 1) * perPage
    const searchKey = String(query.search)
    const filterKey = query.filter

    const events = await Interactor.listPublishedBlogs(
      offset,
      searchKey,
      perPage,
      filterKey
    )

    const totalPages = Math.ceil(Number(events.total.count) / perPage)
    res.status(200).json({
      data: events.data,
      pagination: {
        page: pageNumber,
        per_page: 20,
        total_pages: totalPages,
        total_records: Number(events.total.count),
      },
    })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function publishBlog(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params

    await Interactor.publishBlog(id)

    await createAuditLog({
      action: 'Published Blog',
      section: 'Blogs Management',
      userid: req.session.userid,
    })

    res.status(200).json({ message: 'Published Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function unpublishBlog(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params

    await Interactor.unpublishBlog(id)

    await createAuditLog({
      action: 'Unpublished Blog',
      section: 'Blogs Management',
      userid: req.session.userid,
    })

    res.status(200).json({ message: 'Unpublished Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function viewPublishedBlog(req: Request, res: Response) {
  try {
    const { id } = req.params

    const blog = await Interactor.viewPublishedBlog(id)
    res.status(200).json(blog)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function setBlogThumbnail(req: SessionRequest, res: Response) {
  try {
    const { id, blog_id } = req.params

    await Interactor.setBlogThumbnail(id, blog_id)
    await createAuditLog({
      action: 'Set Blog Thumbnail',
      section: 'Blogs Management',
      userid: req.session.userid,
    })

    res.status(200).json({ message: 'Set Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}
