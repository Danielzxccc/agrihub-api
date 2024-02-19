import { NewBlog, UpdateBlog } from '../../types/DBTypes'
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
