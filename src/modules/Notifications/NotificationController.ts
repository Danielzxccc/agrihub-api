import { Response } from 'express'
import { SessionRequest } from '../../types/AuthType'
import errorHandler from '../../utils/httpErrorHandler'
import * as Interactor from './NotificationInteractor'

export async function subscribeToNotification(
  req: SessionRequest,
  res: Response
) {
  try {
    const { userid } = req.session
    const payload = req.body

    const subscription = await Interactor.subscribeToNotification(
      userid,
      JSON.stringify(payload)
    )
    res.status(201).json({ message: 'successfully subscribe', subscription })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function emitNotification(req: SessionRequest, res: Response) {
  try {
    const { userid } = req.session

    await Interactor.emitNotification(
      userid,
      'Juicy',
      'Ana is 500km away from you'
    )
    res.status(201).json({ message: 'emitted' })
  } catch (error) {
    errorHandler(res, error)
  }
}
