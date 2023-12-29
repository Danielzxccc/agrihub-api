import HttpError from '../../utils/HttpError'
import { NewQuestion, NewVoteQuestion, Question } from '../../types/DBTypes'
import dbErrorHandler from '../../utils/dbErrorHandler'
import * as Service from './ForumsService'
import { ForumsContent } from './../../schema/ForumsSchema'
import {
  getObjectUrl,
  replaceAvatarsWithUrls,
  uploadFiles,
} from '../AWS-Bucket/UploadService'
import { deleteFile } from '../../utils/file'
import { viewsLimitter } from '../../middleware/ViewsLimitter'

export async function viewQuestion(
  id: string,
  offset: number,
  perPage: number,
  ip: string,
  user: string,
  filter?: 'newest' | 'top'
) {
  // view limitting logic
  const isViewed = await viewsLimitter({ id, ip, user })

  if (!isViewed) {
    await Service.incrementViews(id)
  }

  let questionId = Number(id)

  if (isNaN(questionId)) throw new HttpError('Not a valid ID', 400)

  const [data, total] = await Promise.all([
    Service.viewQuestion(id, offset, perPage, user, filter),
    Service.getTotalAnswers(id),
  ])

  if (!data) throw new HttpError('Question Not Found', 404)

  const dataWithImageSrc = data.imagesrc.map((item, _) => {
    return getObjectUrl(item)
  })

  const formattedQuestion = await replaceAvatarsWithUrls({
    ...data,
    imagesrc: dataWithImageSrc,
  })

  return { data: formattedQuestion, total }
}

export async function listQuestions(
  offset: number,
  searchKey: string,
  filterKey: string,
  perpage: number,
  userid: string,
  profile?: string
) {
  const [data, total] = await Promise.all([
    Service.findQuestions(
      offset,
      searchKey,
      filterKey,
      perpage,
      userid,
      profile
    ),
    Service.getTotalCount(profile),
  ])
  for (let question of data) {
    question.user.avatar = question.user.avatar
      ? getObjectUrl(question.user.avatar)
      : question.user.avatar
    for (let i = 0; i < question.imagesrc.length; i++) {
      question.imagesrc[i] = getObjectUrl(question.imagesrc[i])
    }
  }

  return { data, total }
}

export async function createNewQuestion(
  userid: string,
  imagesrc: string[],
  questions: ForumsContent,
  uploadedFiles: Express.Multer.File[]
) {
  try {
    if (!userid) {
      throw new HttpError('Session Expired', 401)
    }
    const { title, question, tags } = questions.body
    const content = { userid, title, question, imagesrc }
    const newQuestion = await Service.createQuestion(content, tags)

    await uploadFiles(uploadedFiles)
    for (const image of uploadedFiles) {
      deleteFile(image.filename)
    }
    return newQuestion
  } catch (error) {
    for (const image of uploadedFiles) {
      deleteFile(image.filename)
    }
    dbErrorHandler(error)
  }
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

export async function voteQuestion(
  questionid: string,
  userid: string,
  vote: string
) {
  const question = await Service.findQuestionById(questionid)

  if (!question) throw new HttpError('Question not found', 404)

  const data = await Service.voteQuestion(questionid, userid, vote)

  return data
}

export async function deleteVoteQuestion(
  id: string,
  userid: string
): Promise<void> {
  const vote = await Service.findQuestionVote(id)

  if (!vote) throw new HttpError('Vote not found', 404)

  if (vote.userid !== userid) throw new HttpError('Unauthorized', 401)
  await Service.deleteQuestionVote(id)
}

export async function voteAnswer(
  answerid: string,
  userid: string,
  vote: NewVoteQuestion
) {
  const data = { ...vote, answerid, userid }
  const votedQuestion = await Service.voteAnswer(data)
  return votedQuestion
}

export async function deleteAnswerVote(id: string, userid: string) {
  if (!userid) throw new HttpError('Unauthorized', 401)
  const vote = await Service.findAnswerVote(id)
  if (!vote) throw new HttpError('Already Deleted', 400)

  if (vote.userid !== userid) throw new HttpError('Unauthorized', 401)

  await Service.deleteAnswerVote(id)
}
