import { Response } from 'express'
import { SessionRequest } from '../../types/AuthType'
import errorHandler from '../../utils/httpErrorHandler'
import zParse from '../../utils/zParse'
import * as Schema from '../../schema/CommunityFarmSchema'
import * as Interactor from './CommunityInteractor'

export async function createNewFarmQuestion(
  req: SessionRequest,
  res: Response
) {
  try {
    const { body } = await zParse(Schema.FarmQuestion, req)
    const { userid } = req.session

    await Interactor.createNewFarmQuestion(userid, { body })

    res.status(200).json({ message: 'Created Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function findFarmQuestions(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params

    const data = await Interactor.findFarmQuestions(id)

    res.status(200).json(data)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function deleteFarmQuestion(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params
    const { userid } = req.session

    await Interactor.deleteFarmQuestion(userid, id)

    res.status(200).json({ message: 'Deleted Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}
