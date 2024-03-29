import { Request, Response } from 'express'
import errorHandler from '../../utils/httpErrorHandler'
import * as Interactor from './ForumsInteractor'
import * as Schema from '../../schema/ForumsSchema'
import zParse from '../../utils/zParse'
import { SessionRequest } from '../../types/AuthType'
import { ListDraftEvents } from '../../schema/EventsSchema'

export async function viewQuestion(req: SessionRequest, res: Response) {
  try {
    const ip = req.ip
    const user = req.session.userid
    const { query, params } = await zParse(Schema.ViewQuestion, req)

    const pageNumber = Number(query.page) || 1
    const perPage = 10
    const offset = (pageNumber - 1) * perPage

    const question = await Interactor.viewQuestion(
      params.id,
      offset,
      perPage,
      ip,
      user,
      query.filter
    )
    const totalPages = Math.ceil(Number(question.total.count) / perPage)
    res.status(200).json({
      question: question.data,
      pagination: {
        page: pageNumber,
        per_page: perPage,
        total_pages: totalPages,
        total_records: Number(question.total.count),
      },
    })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function listQuestions(req: SessionRequest, res: Response) {
  try {
    const { query } = await zParse(Schema.SearchForums, req)

    const perPage = Number(query.perpage)
    const pageNumber = Number(query.page) || 1
    const offset = (pageNumber - 1) * perPage
    const searchKey = String(query.search)
    const filterKey = query.filter
    const tagKey = query.tag

    const questions = await Interactor.listQuestions(
      offset,
      searchKey,
      filterKey,
      perPage,
      req.session.userid || '00',
      query.profile,
      tagKey
    )
    const totalPages = Math.ceil(Number(questions.total.count) / perPage)
    res.status(200).json({
      questions: questions.data,
      pagination: {
        page: pageNumber,
        per_page: perPage,
        total_pages: totalPages,
        total_records: Number(questions.total.count),
      },
    })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function listSavedQuestions(req: SessionRequest, res: Response) {
  try {
    const { query } = await zParse(Schema.SearchForums, req)

    const perPage = Number(query.perpage)
    const pageNumber = Number(query.page) || 1
    const offset = (pageNumber - 1) * perPage
    const searchKey = String(query.search)
    const filterKey = query.filter

    const questions = await Interactor.listSavedQuestions(
      offset,
      searchKey,
      filterKey,
      perPage,
      req.session.userid || '0'
    )
    const totalPages = Math.ceil(Number(questions.total.count) / perPage)
    res.status(200).json({
      questions: questions.data,
      pagination: {
        page: pageNumber,
        per_page: perPage,
        total_pages: totalPages,
        total_records: Number(questions.total.count),
      },
    })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function createNewQuestion(req: SessionRequest, res: Response) {
  try {
    const userid = req.session.userid
    const uploadedFiles = req.files as Express.Multer.File[]
    const imagesrc = uploadedFiles?.map((file) => file.filename) || []
    const contents = await zParse(Schema.ForumsSchema, req)
    const newQuestion = await Interactor.createNewQuestion(
      userid,
      imagesrc,
      contents,
      uploadedFiles
    )
    res
      .status(201)
      .json({ message: 'Question created successfully', newQuestion })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function voteQuestion(req: SessionRequest, res: Response) {
  try {
    const userid = req.session.userid
    const { params, body } = await zParse(Schema.VoteQuestion, req)

    const vote = await Interactor.voteQuestion(params.id, userid, body.type)

    res.status(201).json({ message: `${body.type} successfully`, vote })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function deleteVoteQuestion(req: SessionRequest, res: Response) {
  try {
    const id = req.params.id
    const { userid } = req.session

    await Interactor.deleteVoteQuestion(id, userid)

    res.status(200).json({ message: 'deleted successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function createNewAnswer(req: SessionRequest, res: Response) {
  try {
    const userid = req.session.userid
    const forumid = req.params.id
    const contents = await zParse(Schema.AnswersSchema, req)
    const { answer } = contents.body
    const newAnswer = await Interactor.createNewAnswer(userid, forumid, answer)

    res.status(201).json({ message: 'Answer created successfully', newAnswer })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function createNewComment(req: SessionRequest, res: Response) {
  try {
    // const {
    //   body: { answerid, comment },
    //   params: { id: forumid },
    // } = req

    const userid = req.session.userid

    const contents = await zParse(Schema.CommentsSchema, req)
    const { comment } = contents.body
    const { answerId } = contents.params

    // Call the Interactor to create the comment
    const newComment = await Interactor.createNewComment(
      userid,
      answerId,
      comment
    )

    res
      .status(201)
      .json({ message: 'Comment created successfully', newComment })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function voteAnswer(req: SessionRequest, res: Response) {
  try {
    const userid = req.session.userid
    const { body, params } = await zParse(Schema.VoteAnswerSchema, req)

    const vote = await Interactor.voteAnswer(params.id, userid, body)

    res.status(201).json({ message: 'Voted Answer Successfully', data: vote })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function deleteVoteAnswer(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params
    const userid = req.session.userid
    await Interactor.deleteAnswerVote(id, userid)
    res.status(200).json({ message: 'deleted Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function saveQuestion(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params
    const userid = req.session.userid
    await Interactor.saveQuestion(userid, id)

    res.status(200).json({ message: 'Saved Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function reportQuestion(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params
    const userid = req.session.userid

    const { body } = await zParse(Schema.ReportQuestion, req)

    await Interactor.reportQuestion(userid, id, body.reason)

    res.status(200).json({ message: 'Reported Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function removeSavedQuestion(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params
    const userid = req.session.userid
    await Interactor.removeSavedQuestion(userid, id)

    res.status(200).json({ message: 'Removed Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function deleteQuestion(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params
    const userid = req.session.userid
    await Interactor.deleteQuestion(userid, id)

    res.status(200).json({ message: 'Deleted Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function deleteAnswer(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params
    const userid = req.session.userid
    await Interactor.deleteAnswer(userid, id)

    res.status(200).json({ message: 'Deleted Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function deleteComment(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params
    const userid = req.session.userid
    await Interactor.deleteComment(userid, id)

    res.status(200).json({ message: 'Deleted Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function listReportedQuestions(req: Request, res: Response) {
  try {
    const { query } = await zParse(ListDraftEvents, req)

    const perPage = Number(query.perpage)
    const pageNumber = Number(query.page) || 1
    const offset = (pageNumber - 1) * perPage
    const searchKey = String(query.search)

    const events = await Interactor.listReportedQuestions(
      offset,
      searchKey,
      perPage
    )

    const totalPages = Math.ceil(Number(events.total.count) / perPage)
    res.status(200).json({
      data: events.data,
      pagination: {
        page: pageNumber,
        per_page: perPage,
        total_pages: totalPages,
        total_records: Number(events.total.count),
      },
    })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function updateAnswer(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params
    const { body } = await zParse(Schema.UpdateAnswersSchema, req)
    const userid = req.session.userid
    await Interactor.updateAnswer(userid, id, body)

    res.status(200).json({ message: 'Updated Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function updateComment(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params
    const { body } = await zParse(Schema.UpdateCommentsSchema, req)
    const userid = req.session.userid
    await Interactor.updateComment(userid, id, body)

    res.status(200).json({ message: 'Updated Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}
