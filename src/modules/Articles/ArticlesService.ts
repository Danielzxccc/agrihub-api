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
