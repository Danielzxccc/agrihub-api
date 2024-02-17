import { Request, Response } from 'express'
import errorHandler from '../../utils/httpErrorHandler'
import * as Schema from '../../schema/EventsSchema'
import * as Interactor from './EventsInteractor'
import zParse from '../../utils/zParse'

export async function createDraftEvent(req: Request, res: Response) {
  try {
    const { body: event } = await zParse(Schema.NewDraftEvent, req)

    const newDraftEvent = await Interactor.createDraftEvent(event)

    res
      .status(201)
      .json({ message: 'Created Draft Successfully', data: newDraftEvent })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function updateDraftEvent(req: Request, res: Response) {
  try {
    const { id } = req.params
    const image = req.file
    const { body: event } = await zParse(Schema.UpdateDraftEvent, req)

    const newDraftEvent = await Interactor.updateDraftEvent(id, event, image)

    res
      .status(200)
      .json({ message: 'Updated Draft Successfully', data: newDraftEvent })
  } catch (error) {
    errorHandler(res, error)
  }
}
