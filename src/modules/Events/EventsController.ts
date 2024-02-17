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

export async function createNewEventPartnership(req: Request, res: Response) {
  try {
    const { id } = req.params
    const image = req.file
    const { body: partnership } = await zParse(Schema.NewEventPartnership, req)

    const newDraftEvent = await Interactor.createNewEventPartnership(
      id,
      partnership,
      image
    )

    res.status(201).json({
      message: 'Created Partnership Successfully',
      data: newDraftEvent,
    })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function updateEventPartnership(req: Request, res: Response) {
  try {
    const { id } = req.params
    const image = req.file
    const { body: partnership } = await zParse(
      Schema.updateEventPartnership,
      req
    )

    const newDraftEvent = await Interactor.updateEventPartnership(
      id,
      partnership,
      image
    )

    res.status(201).json({
      message: 'Updated Partnership Successfully',
      data: newDraftEvent,
    })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function removeEventPartnership(req: Request, res: Response) {
  try {
    const { id } = req.params

    await Interactor.removeEventPartnership(id)
    res.status(200).json({ message: 'Deleted Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function createEventSpeaker(req: Request, res: Response) {
  try {
    const { id } = req.params
    const { body: speaker } = await zParse(Schema.NewEventSpearker, req)
    const image = req.file

    const newEventSpeaker = await Interactor.createEventSpeaker(
      id,
      speaker,
      image
    )
    res
      .status(201)
      .json({ message: 'Created Successfully', data: newEventSpeaker })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function updateEventSpeaker(req: Request, res: Response) {
  try {
    const { id } = req.params
    const { body: speaker } = await zParse(Schema.UpdateEventSpeaker, req)
    const image = req.file

    const newEventSpeaker = await Interactor.updateEventSpeaker(
      id,
      speaker,
      image
    )
    res
      .status(200)
      .json({ message: 'Updated Successfully', data: newEventSpeaker })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function removeEventSpeaker(req: Request, res: Response) {
  try {
    const { id } = req.params

    await Interactor.removeEventSpeaker(id)

    res.status(200).json({ message: 'Deleted Susccessfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function createEventTags(req: Request, res: Response) {
  try {
    const { id } = req.params
    const { body } = await zParse(Schema.NewEventTags, req)

    const newEventTags = await Interactor.createEventTags(id, body.tags)
    res
      .status(201)
      .json({ message: 'Created Successfully', data: newEventTags })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function removeEventTag(req: Request, res: Response) {
  try {
    const { id } = req.params

    await Interactor.removeEventTag(id)
    res.status(200).json({ message: 'Deleted Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function viewUnpublishedEvent(req: Request, res: Response) {
  try {
    const { id } = req.params

    const event = await Interactor.viewUnpublishedEvent(id)
    res.status(200).json(event)
  } catch (error) {
    errorHandler(res, error)
  }
}
