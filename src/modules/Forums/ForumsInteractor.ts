import HttpError from '../../utils/HttpError'
import { NewQuestion } from '../../types/DBTypes'
import dbErrorHandler from '../../utils/dbErrorHandler'
import * as Service from './ForumsService'

export async function createNewQuestion(
  userid: string,
  imagesrc: string[],
  question: NewQuestion
) {
  if (!userid) {
    throw new HttpError('Session Expired', 401)
  }

  const content = { userid, imagesrc, ...question }
  const newQuestion = await Service.createQuestion(content)

  return newQuestion
}
