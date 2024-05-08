import { Response } from 'express'
import { SessionRequest } from '../../types/AuthType'
import * as Interactor from './AnalyticsInteractor'
import errorHandler from '../../utils/httpErrorHandler'

export async function getLatestHarvestRate(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params
    const { userid } = req.session

    const data = await Interactor.getLatestHarvestRate(id, userid)

    res.status(200).json(data)
  } catch (error) {
    errorHandler(res, error)
  }
}
