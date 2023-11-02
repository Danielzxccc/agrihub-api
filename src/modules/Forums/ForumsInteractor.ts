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

export async function createNewAnswer(
  userid: string,
  forumid: string,
  answer: string
) {
  if (!userid) {
    throw new HttpError('Session Expired', 401)
  }

  // container to represent data
  const answerData = {
    userid,
    forumid,
    answer,
    isaccepted: false, // Default
  }

  const newAnswer = await Service.createAnswer(answerData)

  return newAnswer
}
