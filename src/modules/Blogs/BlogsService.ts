import { NewBlog, UpdateBlogs } from '../../types/DBTypes'
import { db } from '../../config/database'

export async function createBlog(body: NewBlog): Promise<NewBlog> {
  return await db
    .insertInto('blogs')
    .values(body)
    .returningAll()
    .executeTakeFirst()
}

export async function findBlogs(searchQuery: string) {
  let query = db
    .selectFrom('blogs')
    .selectAll()
    .orderBy('blogs.createdat', 'desc')

  if (searchQuery.length)
    query = query.where('blogs.title', 'ilike', `${searchQuery}%`)
  return await query.execute()
}

export async function viewBlogs(id: string) {
  return await db
    .selectFrom('blogs')
    .selectAll()
    .where('blogs.id', '=', id)
    .groupBy('blogs.id')
    .executeTakeFirst()
}

export async function updateBlogs(
  id: string,
  blogs: UpdateBlogs
): Promise<UpdateBlogs> {
  return await db
    .updateTable('blogs')
    .set(blogs)
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst()
}

export async function deleteBlogs(id: string) {
  return await db.deleteFrom('blogs').where('id', '=', id).execute()
}
