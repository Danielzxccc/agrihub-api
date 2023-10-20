import { NewArticle, UpdateArticle } from '../types/DBTypes'
import dbErrorHandler from '../utils/dbErrorHandler'
import * as Service from '../service/ArticlesService'
import HttpError from '../utils/HttpError'

export async function createArticle(article: NewArticle) {
  try {
    const newArticle = await Service.createArticles(article)
    if (!newArticle) {
      throw new HttpError('Failed to create the article', 400)
    }
    return newArticle
  } catch (error) {
    dbErrorHandler(error)
  }
}
export async function updateArticle(
  id: string,
  activeUser: string,
  article: UpdateArticle
) {
  try {
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
  } catch (error) {
    dbErrorHandler(error)
  }
}

export async function deleteArticle(id: string) {
  try {
    const deletedArticle = await Service.deleteArticles(id)
    if (!deletedArticle) {
      throw new HttpError('Article not found', 400)
    }
    return deletedArticle
  } catch (error) {
    dbErrorHandler(error)
  }
}
