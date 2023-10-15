import { Request, Response } from 'express'
import errorHandler from '../utils/httpErrorHandler'
import * as Interactor from '../interactors/ForumsInteractor'

export async function createNewQuestion(req: Request, res: Response) {
  try {
    // userid should be from the loggedin user
    const { userid, title, question, imagesrc } = req.body
    const newQuestion = await Interactor.createNewQuestion({
      userid,
      title,
      question,
      imagesrc,
    })

    res.status(201).json(newQuestion)
  } catch (error) {
    errorHandler(res, error)
  }
}
