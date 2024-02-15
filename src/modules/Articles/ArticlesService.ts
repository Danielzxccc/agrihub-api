import { NewArticle, UpdateArticle, Article } from '../../types/DBTypes'
import { db } from '../../config/database'

export async function createArticles(article: NewArticle): Promise<NewArticle> {
  return await db
    .insertInto('articles')
    .values(article)
    .returningAll()
    .executeTakeFirst()
}

export async function updateArticles(
  id: string,
  update: UpdateArticle
): Promise<UpdateArticle> {
  return await db
    .updateTable('articles')
    .set(update)
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst()
}

export async function deleteArticles(id: string) {
  return await db
    .deleteFrom('articles')
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst()
}

export async function viewArticle(id: string) {
  return await db
    .selectFrom('articles')
    .selectAll()
    .where('articles.id', '=', id)
    .groupBy('articles.id')
    .executeTakeFirst()
}

export async function findArticle(searchQuery: string) {
  let query = db
    .selectFrom('articles')
    .selectAll()
    .orderBy('articles.createdat', 'desc')

  if (searchQuery.length) {
    query = query.where('articles.title', 'ilike', `${searchQuery}%`)
    return await query.execute()
  }
}
