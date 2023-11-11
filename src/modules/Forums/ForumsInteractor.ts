import HttpError from '../../utils/HttpError'
import { NewQuestion, Question } from '../../types/DBTypes'
import dbErrorHandler from '../../utils/dbErrorHandler'
import * as Service from './ForumsService'
import { ForumsContent } from './../../schema/ForumsSchema'

export async function listQuestions(
  offset: number,
  searchKey: string,
  filterKey: string,
  perpage: number
) {
  const [data, total] = await Promise.all([
    Service.findQuestions(offset, searchKey, filterKey, perpage),
    Service.getTotalCount(),
  ])

  return { data, total }
}

export async function createNewQuestion(
  userid: string,
  imagesrc: string[],
  questions: ForumsContent
) {
  if (!userid) {
    throw new HttpError('Session Expired', 401)
  }
  const { title, question, tags } = questions.body
  const content = { userid, title, question, imagesrc }
  const newQuestion = await Service.createQuestion(content, tags)

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

export async function createNewComment(
  userid: string,
  answerid: string,
  comment: string
) {
  const commentData = {
    userid,
    answerid,
    comment,
  }

  // Check if the question exists
  const questionExists = await Service.checkQuestionExists(answerid)

  if (!questionExists) {
    throw new HttpError('The question does not exist or was removed', 400)
  }

  // Call the Service to create the comment
  const newComment = await Service.createComment(commentData)

  return newComment
}
