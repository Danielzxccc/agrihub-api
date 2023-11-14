import { Request, Response } from 'express'
import errorHandler from '../../utils/httpErrorHandler'
import * as Interactor from './ForumsInteractor'
import * as Schema from '../../schema/ForumsSchema'
import zParse from '../../utils/zParse'
import { SessionRequest } from '../../types/AuthType'

export async function viewQuestion(req: SessionRequest, res: Response) {
  try {
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

    const questions = await Interactor.listQuestions(
      offset,
      searchKey,
      filterKey,
      perPage
    )
    const totalPages = Math.ceil(Number(questions.total.count) / perPage)
    res.status(200).json({
      questions: questions.data,
      pagination: {
        page: pageNumber,
        per_page: 20,
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
      contents
    )
    res
      .status(201)
      .json({ message: 'Question created successfully', newQuestion })
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
