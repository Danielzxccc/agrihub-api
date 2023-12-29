import { Request, Response } from 'express'
import errorHandler from '../../utils/httpErrorHandler'
import * as Interactor from './EventsInteractor'
import * as Schema from '../../schema/EventsSchema'
import { SessionRequest } from '../../types/AuthType'
import zParse from '../../utils/zParse'
import { Session } from 'express-session'

export async function createEvent(req: SessionRequest, res: Response) {
  try {
    const userid = req.session.userid

    const { body } = await zParse(Schema.NewEvent, req)

    const newEvent = await Interactor.createEvent(userid, body)
    res.status(201).json({ message: 'Event created successfully', newEvent })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function listEvents(req: SessionRequest, res: Response) {
  try {
    const { query } = await zParse(Schema.ListEvents, req)

    const searchKey = String(query.search)

    const events = await Interactor.listEvents(searchKey)
    res.status(200).json(events)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function viewEvents(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params
    const events = await Interactor.viewEvents(id)
    res.status(200).json(events)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function updateEvent(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params
    const { body } = await zParse(Schema.UpdateEvent, req)

    const events = await Interactor.updateEvent(id, body)

    res.status(200).json({ message: 'Update Sucess', events })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function removeEvent(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params

    const events = await Interactor.deleteEvent(id)
    res.status(200).json({ message: 'Delete Success', events })
  } catch (error) {
    errorHandler(res, error)
  }
}
