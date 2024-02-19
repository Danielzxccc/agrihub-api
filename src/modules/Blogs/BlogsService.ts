import { db } from '../../config/database'
import { NewBlog, NewBlogImage, UpdateBlog } from '../../types/DBTypes'

export async function insertNewBlog(blog: NewBlog) {
  return await db
    .insertInto('blogs')
    .values(blog)
    .returningAll()
    .executeTakeFirst()
}

export async function updateBlog(id: string, blog: UpdateBlog) {
  return await db
    .updateTable('blogs')
    .set(blog)
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst()
}

export async function findBlogById(id: string) {
  return await db
    .selectFrom('blogs')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst()
}

export async function deleteDraftBlog(id: string) {
  return await db
    .deleteFrom('blogs')
    .returningAll()
    .where('id', '=', id)
    .executeTakeFirst()
}

export async function insertBlogImage(image: NewBlogImage) {
  return await db
    .insertInto('blog_images')
    .values(image)
    .returningAll()
    .executeTakeFirst()
}

export async function deleteBlogImage(id: string) {
  return await db
    .deleteFrom('blog_images')
    .returningAll()
    .where('id', '=', id)
    .executeTakeFirst()
}

export async function findBlogImage(id: string) {
  return await db
    .selectFrom('blog_images')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst()
}
