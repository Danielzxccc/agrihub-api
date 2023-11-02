import { Request, Response } from 'express'
import errorHandler from '../../utils/httpErrorHandler'
import * as Interactor from './ForumsInteractor'
import * as Schema from '../../schema/ForumsSchema'
import zParse from '../../utils/zParse'
import { SessionRequest } from '../../types/AuthType'

export async function createNewQuestion(req: SessionRequest, res: Response) {
  try {
    const userid = req.session.userid
    const uploadedFiles = req.files as Express.Multer.File[]
    const imagesrc = uploadedFiles.map((file) => file.filename)
    const contents = await zParse(Schema.ForumsSchema, req)
    const newQuestion = await Interactor.createNewQuestion(
      userid,
      imagesrc,
      contents.body
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
    const { answer } = req.body
    const forumid = req.params.id
    const newAnswer = await Interactor.createNewAnswer(userid, forumid, answer)
    res.status(201).json({ message: 'Answer created successfully', newAnswer })
  } catch (error) {
    errorHandler(res, error)
  }
}
