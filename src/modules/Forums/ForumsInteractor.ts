import HttpError from '../../utils/HttpError'
import {
  NewQuestion,
  NewVoteQuestion,
  Question,
  UpdateAnswer,
  UpdateComment,
} from '../../types/DBTypes'
import dbErrorHandler from '../../utils/dbErrorHandler'
import * as Service from './ForumsService'
import { ForumsContent, UpdateForumsContent } from './../../schema/ForumsSchema'
import {
  deleteFileCloud,
  getObjectUrl,
  replaceAvatarsWithUrls,
  uploadFiles,
} from '../AWS-Bucket/UploadService'
import { deleteFile } from '../../utils/file'
import { viewsLimitter } from '../../middleware/ViewsLimitter'
import { findUser } from '../Users/UserService'
import { emitPushNotification } from '../Notifications/NotificationInteractor'

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
  profile?: string,
  tag?: string
) {
  const [data, total] = await Promise.all([
    Service.findQuestions(
      offset,
      searchKey,
      filterKey,
      perpage,
      userid,
      profile,
      tag
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

export async function listSavedQuestions(
  offset: number,
  searchKey: string,
  filterKey: string,
  perpage: number,
  userid: string
) {
  const user = await findUser(userid)

  if (!user) throw new HttpError('Unauthorized', 401)

  const [data, total] = await Promise.all([
    Service.findSavedQuestions(offset, searchKey, filterKey, perpage, userid),
    Service.getTotalSavedQuestion(userid),
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

export async function updateQuestion(
  id: string,
  userid: string,
  imagesrc: string[],
  questions: UpdateForumsContent,
  uploadedFiles: Express.Multer.File[]
) {
  try {
    const findQueston = await Service.findQuestionById(id)

    if (!findQueston) {
      throw new HttpError('Question not found', 404)
    }

    if (!userid) {
      throw new HttpError('Session Expired', 401)
    }

    if (findQueston.userid !== userid) {
      throw new HttpError('Unauthorized', 404)
    }

    const { title, question, tags } = questions.body
    const content = {
      id,
      title,
      question,
      imagesrc,
    }

    const findExistingTags = await Service.findQuestionTags(id)

    let deletedTags: string[] = []
    if (findExistingTags.length) {
      const existingTags = findExistingTags.map((item) => item.tagid)

      const tagsToCompare = tags?.length ? tags : []

      deletedTags = existingTags.filter(
        (element) => !tagsToCompare.includes(element)
      )
    }
    let deletedImages: string[] = []
    if (findQueston.imagesrc.length) {
      const existingImages = findQueston.imagesrc
      const imagesToCompare = imagesrc?.length ? imagesrc : []
      deletedImages = existingImages.filter(
        (element) => !imagesToCompare.includes(element)
      )

      for (const image of deletedImages) {
        await deleteFileCloud(image)
      }
    }

    const newQuestion = await Service.updateQuestion(
      id,
      content,
      tags,
      deletedTags
    )

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
  const question = await Service.findQuestionById(forumid)
  const user = await findUser(question.userid)

  if (!question) {
    throw new HttpError('The question does not exist or was removed', 400)
  }
  // container to represent data
  const answerData = {
    userid,
    forumid,
    answer,
    isaccepted: false, // Default
  }

  const newAnswer = await Service.createAnswer(answerData)

  if (question.userid !== newAnswer.userid) {
    await emitPushNotification(
      question.userid,
      `Your question received an answer`,
      `Your question about ${question.title} have received new answer`,
      `/forum/question/${user.username}/${question.id}`
    )
  }

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

  const user = await findUser(userid)

  // Check if the question exists
  const questionExists = await Service.checkQuestionExists(answerid)

  if (!questionExists) {
    throw new HttpError('The question does not exist or was removed', 400)
  }

  // Call the Service to create the comment
  const newComment = await Service.createComment(commentData)

  await emitPushNotification(
    questionExists.userid,
    `Your answer received a reply`,
    `Your answer received a new reply`,
    `/forum/question/${user.username}/${questionExists.forumid}`
  )
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

  const user = await findUser(question.userid)

  if (user.id !== question.userid) {
    await emitPushNotification(
      question.userid,
      `Your question received an ${vote}`,
      `Your question about ${question.title} have received new ${vote}`,
      `/forum/question/${user.username}/${question.id}`
    )
  }

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
  const answer = await Service.findAnswer(answerid)

  if (!answer) {
    throw new HttpError('Answer Not Found', 404)
  }

  const question = await Service.findQuestionById(answer.forumid)
  const user = await findUser(question.userid)

  await emitPushNotification(
    answer.userid,
    `Your answer received an ${vote.type}!`,
    `Your answer about ${answer.answer} have received new upvote`,
    `/forum/question/${user.username}/${answer.forumid}`
  )

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

export async function saveQuestion(userid: string, forumid: string) {
  const user = await findUser(userid)

  if (!user) throw new HttpError('Unauthorized', 401)

  const question = await Service.findQuestionById(forumid)
  if (!question) {
    throw new HttpError('Question Not Found', 404)
  }

  await Service.saveQuestion(userid, forumid)
}

export async function reportQuestion(
  userid: string,
  forumid: string,
  reason: string
) {
  const user = await findUser(userid)

  if (!user) throw new HttpError('Unauthorized', 401)

  if (!reason) throw new HttpError('Reason is required', 400)

  const question = await Service.reportQuestion(userid, forumid, reason)

  if (!question) {
    throw new HttpError('Question Not Found', 404)
  }

  await emitPushNotification(
    'admin',
    `Reported Question`,
    `There's a new reported question`,
    `/admin/forum/questions`
  )
}

export async function removeSavedQuestion(userid: string, id: string) {
  const savedQuestion = await Service.findSavedQuestion(id)

  if (!savedQuestion) {
    throw new HttpError('Question Not Found', 404)
  }

  if (savedQuestion?.userid !== userid) {
    throw new HttpError('Unauthorized', 401)
  }

  await Service.unsaveQuestion(id)
}

export async function deleteQuestion(userid: string, id: string) {
  const user = await findUser(userid)

  if (!user) throw new HttpError('Unauthorized', 401)

  const question = await Service.findQuestionById(id)

  if (!question) throw new HttpError('Question Not Found', 404)

  if (question?.userid !== userid) {
    const isAdmin = user.role === 'admin' || user.role === 'asst_admin'
    if (!isAdmin) {
      throw new HttpError('Unauthorized', 401)
    }
  }

  for (const image of question.imagesrc) {
    await deleteFileCloud(image || '')
  }

  await Service.deleteQuestion(id)
}

export async function deleteAnswer(userid: string, id: string) {
  const user = await findUser(userid)

  if (!user) throw new HttpError('Unauthorized', 401)

  const answer = await Service.findAnswer(id)

  if (answer?.userid !== userid) {
    throw new HttpError('Unauthorized s', 401)
  }

  await Service.deleteAnswer(id)
}

export async function deleteComment(userid: string, id: string) {
  const user = await findUser(userid)

  if (!user) throw new HttpError('Unauthorized', 401)

  const answer = await Service.findComment(id)

  if (answer?.userid !== userid) {
    throw new HttpError('Unauthorized s', 401)
  }

  await Service.deleteComment(id)
}

export async function listReportedQuestions(
  offset: number,
  searchKey: string,
  perpage: number
) {
  const [data, total] = await Promise.all([
    Service.findReportedQuestions(offset, searchKey, perpage),
    Service.getTotalReportedQuestions(searchKey),
  ])

  return { data, total }
}

export async function updateAnswer(
  userid: string,
  id: string,
  answer: UpdateAnswer
) {
  const user = await findUser(userid)

  if (!user) {
    throw new HttpError('Unauthorized', 401)
  }
  const findAnswer = await Service.findAnswer(id)

  if (!findAnswer) {
    throw new HttpError('Answer not found', 404)
  }

  if (user.id !== findAnswer.userid) {
    throw new HttpError('Unauthorized', 401)
  }

  const updatedAnwer = await Service.updateAnswer(id, answer)

  return updatedAnwer
}

export async function updateComment(
  userid: string,
  id: string,
  comment: UpdateComment
) {
  const user = await findUser(userid)

  if (!user) {
    throw new HttpError('Unauthorized', 401)
  }

  const findComment = await Service.findComment(id)

  if (!findComment) {
    throw new HttpError('Comment not found', 404)
  }

  if (user.id !== findComment.userid) {
    throw new HttpError('Unauthorized', 401)
  }

  const updatedAnwer = await Service.updateComment(id, comment)

  return updatedAnwer
}
