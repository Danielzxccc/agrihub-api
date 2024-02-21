import { ZodError, z } from 'zod'
import { NewBlog, NewBlogTags, UpdateBlog } from '../../types/DBTypes'
import HttpError from '../../utils/HttpError'
import dbErrorHandler from '../../utils/dbErrorHandler'
import { deleteFile } from '../../utils/file'
import { deleteFileCloud, uploadFiles } from '../AWS-Bucket/UploadService'
import * as Service from './BlogsService'

export async function createDraftBlog(blog: NewBlog) {
  const newBlog = await Service.insertNewBlog(blog)

  return newBlog
}

export async function updateDraftBlog(id: string, blog: UpdateBlog) {
  const findBlog = await Service.findBlogById(id)

  if (!findBlog) {
    throw new HttpError("Can't find blog", 404)
  }

  const updatedBlog = await Service.updateBlog(id, {
    ...blog,
    updatedat: new Date(),
  })

  return updatedBlog
}

export async function removeDraftBlog(id: string) {
  const blog = await Service.findBlogById(id)

  if (!blog) {
    throw new HttpError('Blog not found', 404)
  }

  if (blog.status !== 'draft') {
    throw new HttpError("You can't delete published blogs", 401)
  }

  await Service.deleteDraftBlog(id)
}

export async function createBlogImage(id: string, image: Express.Multer.File) {
  try {
    if (!image.filename) {
      throw new HttpError('image is required', 400)
    }

    await uploadFiles([image])

    const newBlogImage = await Service.insertBlogImage({
      blog_id: id,
      image: image.filename,
    })

    deleteFile(image.filename)

    return newBlogImage
  } catch (error) {
    deleteFile(image?.filename)
    dbErrorHandler(error)
  }
}

export async function removeBlogImage(id: string) {
  const image = await Service.findBlogImage(id)

  if (!image) {
    throw new HttpError('Blog not found', 404)
  }

  await Service.deleteBlogImage(id)
  await deleteFileCloud(image.image)
}

export async function createBlogTags(id: string, tags: string[] | string) {
  const blog = await Service.findBlogById(id)

  if (!blog) {
    throw new HttpError('Learning Material Not Found', 404)
  }

  let blogTags: NewBlogTags[] | NewBlogTags

  if (Array.isArray(tags)) {
    blogTags = tags.map((item) => {
      return {
        tag_id: item,
        blog_id: id,
      }
    })
  } else {
    blogTags = {
      tag_id: tags,
      blog_id: id,
    }
  }

  const newLearningTags = await Service.inserBlogTags(blogTags)
  return newLearningTags
}

export async function deleteBlogTag(id: string) {
  const blog = await Service.findBlogTag(id)

  if (!blog) {
    throw new HttpError('Blog not found', 404)
  }

  await Service.deleteBlogTag(id)
}

export async function listDraftBlogs(
  offset: number,
  searchKey: string,
  perpage: number
) {
  const [data, total] = await Promise.all([
    Service.findDraftBlogs(offset, searchKey, perpage),
    Service.getTotalDraftBlogs(),
  ])

  return { data, total }
}

export async function viewBlog(id: string) {
  const blog = await Service.findBlogDetails(id)

  if (!blog) {
    throw new HttpError('Blog not found', 404)
  }

  return blog
}

export async function archiveBlog(id: string) {
  const blog = await Service.findBlogById(id)

  if (!blog) {
    throw new HttpError('Blog not found', 404)
  }

  await Service.updateBlog(id, { is_archived: true })
}

export async function unArchiveBlog(id: string) {
  const blog = await Service.findBlogById(id)

  if (!blog) {
    throw new HttpError('Blog not found', 404)
  }

  await Service.updateBlog(id, { is_archived: false })
}

export async function listArchivedBlogs(
  offset: number,
  searchKey: string,
  perpage: number
) {
  const [data, total] = await Promise.all([
    Service.findArchivedBlogs(offset, searchKey, perpage),
    Service.getTotalArchivedBlogs(),
  ])

  return { data, total }
}

export async function publishBlog(id: string) {
  const blog = await Service.findBlogDetails(id)

  if (!blog) {
    throw new HttpError('Blog not found', 404)
  }

  if (!blog.images.length) {
    throw new HttpError('At least one image is required.', 400)
  }

  if (!blog.tags.length) {
    throw new HttpError('At least one image is required.', 400)
  }

  const validation = z.object({
    title: z.string(),
    category: z.string(),
    content: z.string(),
    author: z.string(),
    author_title: z.string(),
  })

  try {
    await validation.parseAsync(blog)
  } catch (error) {
    if (error instanceof ZodError) {
      throw new HttpError('Incomplete Details', 400, error.errors)
    }
    throw new HttpError('Incomplete Details', 400)
  }

  await Service.updateBlog(id, { status: 'published' })
}

export async function unpublishBlog(id: string) {
  const blog = await Service.findBlogDetails(id)

  if (!blog) {
    throw new HttpError('Blog not found', 404)
  }

  await Service.updateBlog(id, { status: 'draft' })
}

export async function viewPublishedBlog(id: string) {
  const blog = await Service.findPublishedBlog(id)

  if (!blog) {
    throw new HttpError('Blog not found', 404)
  }

  return blog
}

export async function listPublishedBlogs(
  offset: number,
  searchKey: string,
  perpage: number
) {
  const [data, total] = await Promise.all([
    Service.findPublishedBlogs(offset, searchKey, perpage),
    Service.getTotalPublishedBlogs(),
  ])

  return { data, total }
}

export async function setBlogThumbnail(id: string, blog_id: string) {
  await Service.setBlogThumbnail(id, blog_id)
}
