import { NewBlog, UpdateBlogs } from '../../types/DBTypes'
import HttpError from '../../utils/HttpError'
import * as Service from './BlogsService'

export async function createBlogs(blogs: NewBlog) {
  if (!blogs) {
    throw new HttpError('Session Expired', 401)
  }
  const newBlog = await Service.createBlog(blogs)

  return newBlog
}

export async function listBlogs(searchKey: string) {
  const [data] = await Promise.all([Service.findBlogs(searchKey)])
  return { data }
}

export async function viewBlogs(id: string) {
  const blogs = await Service.viewBlogs(id)

  if (!blogs) throw new HttpError('Blog does not exist', 404)

  return blogs
}

export async function updateBlogs(id: string, body: UpdateBlogs) {
  const blogs = await Service.updateBlogs(id, body)

  if (!blogs) throw new HttpError('Blogs not found', 400)
  return blogs
}

export async function deleteBlogs(id: string) {
  await Service.deleteBlogs(id)
}
