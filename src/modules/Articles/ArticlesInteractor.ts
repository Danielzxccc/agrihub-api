import { NewArticle, UpdateArticle } from '../../types/DBTypes'
import dbErrorHandler from '../../utils/dbErrorHandler'
import * as Service from './ArticlesService'
import HttpError from '../../utils/HttpError'

export async function createArticle(article: NewArticle) {
  const newArticle = await Service.createArticles(article)
  return newArticle
}
export async function updateArticle(
  id: string,
  activeUser: string,
  article: UpdateArticle
) {
  if (!activeUser) {
    throw new HttpError('Session Expired', 401)
  }
  if (article.userid !== activeUser) {
    throw new HttpError('You are not authorized to modify this article.', 403)
  }
  const updatedArticle = await Service.updateArticles(id, article)
  if (!updatedArticle) {
    throw new HttpError('Article not found', 404)
  }
  return updatedArticle
}

export async function deleteArticle(id: string) {
  const deletedArticle = await Service.deleteArticles(id)
  if (!deletedArticle) {
    throw new HttpError('Article not found', 404)
  }
  return deletedArticle
}

export async function viewArticle(id: string) {
  const articles = await Service.viewArticle(id)

  if (!articles)
    throw new HttpError('Article does not exit or may have been removed.', 404)
  return articles
}

export async function listArticle(searchKey: string) {
  const [data] = await Promise.all([Service.findArticle(searchKey)])
  return { data }
}
