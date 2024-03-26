import { Request, Response } from 'express'
import errorHandler from '../../utils/httpErrorHandler'
import * as Schema from '../../schema/EventsSchema'
import * as Interactor from './EventsInteractor'
import zParse from '../../utils/zParse'
import { SessionRequest } from '../../types/AuthType'
import { createAuditLog } from '../AuditLogs/AuditLogsInteractor'

export async function createDraftEvent(req: SessionRequest, res: Response) {
  try {
    const { body: event } = await zParse(Schema.NewDraftEvent, req)

    const newDraftEvent = await Interactor.createDraftEvent(event)

    await createAuditLog({
      action: 'Created Draft Event',
      section: 'Event Material Management',
      userid: req.session.userid,
    })

    res
      .status(201)
      .json({ message: 'Created Draft Successfully', data: newDraftEvent })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function updateDraftEvent(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params
    const image = req.file
    const { body: event } = await zParse(Schema.UpdateDraftEvent, req)

    const newDraftEvent = await Interactor.updateDraftEvent(id, event, image)

    await createAuditLog({
      action: 'Updated Event Draft',
      section: 'Event Material Management',
      userid: req.session.userid,
    })

    res
      .status(200)
      .json({ message: 'Updated Draft Successfully', data: newDraftEvent })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function createNewEventPartnership(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params
    const image = req.file
    const { body: partnership } = await zParse(Schema.NewEventPartnership, req)

    const newDraftEvent = await Interactor.createNewEventPartnership(
      id,
      partnership,
      image
    )

    await createAuditLog({
      action: 'Created New Event Partnership',
      section: 'Event Material Management',
      userid: req.session.userid,
    })

    res.status(201).json({
      message: 'Created Partnership Successfully',
      data: newDraftEvent,
    })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function updateEventPartnership(req: SessionRequest, res: Response) {
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

    await createAuditLog({
      action: 'Updated Event Partnership',
      section: 'Event Material Management',
      userid: req.session.userid,
    })

    res.status(201).json({
      message: 'Updated Partnership Successfully',
      data: newDraftEvent,
    })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function removeEventPartnership(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params

    await Interactor.removeEventPartnership(id)

    await createAuditLog({
      action: 'Removed Event Partnership',
      section: 'Event Material Management',
      userid: req.session.userid,
    })

    res.status(200).json({ message: 'Deleted Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function createEventSpeaker(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params
    const { body: speaker } = await zParse(Schema.NewEventSpearker, req)
    const image = req.file

    const newEventSpeaker = await Interactor.createEventSpeaker(
      id,
      speaker,
      image
    )

    await createAuditLog({
      action: 'Created New Event Speaker',
      section: 'Event Material Management',
      userid: req.session.userid,
    })

    res
      .status(201)
      .json({ message: 'Created Successfully', data: newEventSpeaker })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function updateEventSpeaker(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params
    const { body: speaker } = await zParse(Schema.UpdateEventSpeaker, req)
    const image = req.file

    const newEventSpeaker = await Interactor.updateEventSpeaker(
      id,
      speaker,
      image
    )

    await createAuditLog({
      action: 'Updated Event Speaker',
      section: 'Event Material Management',
      userid: req.session.userid,
    })

    res
      .status(200)
      .json({ message: 'Updated Successfully', data: newEventSpeaker })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function removeEventSpeaker(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params

    await Interactor.removeEventSpeaker(id)

    await createAuditLog({
      action: 'Removed Event Speaker',
      section: 'Event Material Management',
      userid: req.session.userid,
    })

    res.status(200).json({ message: 'Deleted Susccessfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function createEventTags(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params
    const { body } = await zParse(Schema.NewEventTags, req)

    const newEventTags = await Interactor.createEventTags(id, body.tags)

    await createAuditLog({
      action: 'Created Event Tags',
      section: 'Event Material Management',
      userid: req.session.userid,
    })

    res
      .status(201)
      .json({ message: 'Created Successfully', data: newEventTags })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function removeEventTag(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params

    await Interactor.removeEventTag(id)

    await createAuditLog({
      action: 'Deleted Event Tags',
      section: 'Event Material Management',
      userid: req.session.userid,
    })

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

export async function listDraftEvents(req: Request, res: Response) {
  try {
    const { query } = await zParse(Schema.ListDraftEvents, req)

    const perPage = Number(query.perpage)
    const pageNumber = Number(query.page) || 1
    const offset = (pageNumber - 1) * perPage
    const searchKey = String(query.search)

    const events = await Interactor.listDraftEvents(offset, searchKey, perPage)

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

export async function listArchivedEvents(req: Request, res: Response) {
  try {
    const { query } = await zParse(Schema.ListDraftEvents, req)

    const perPage = Number(query.perpage)
    const pageNumber = Number(query.page) || 1
    const offset = (pageNumber - 1) * perPage
    const searchKey = String(query.search)

    const events = await Interactor.listArchivedEvents(
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

export async function archiveEvent(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params

    await Interactor.archiveEvent(id)

    await createAuditLog({
      action: 'Archived Event',
      section: 'Event Material Management',
      userid: req.session.userid,
    })

    res.status(200).json({ message: 'Archived Successfuilly' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function unarchiveEvent(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params

    await Interactor.unarchiveEvent(id)

    await createAuditLog({
      action: 'Unarchived Event',
      section: 'Event Material Management',
      userid: req.session.userid,
    })

    res.status(200).json({ message: 'Unarchived Successfuilly' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function deleteDraftEvent(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params
    await Interactor.deleteDraftEvent(id)

    await createAuditLog({
      action: 'Deleted Event Draft',
      section: 'Event Material Management',
      userid: req.session.userid,
    })

    res.status(200).json({ message: 'Deleted Successfuilly' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function publishEvent(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params
    await Interactor.publishEvent(id)

    await createAuditLog({
      action: 'Published Event',
      section: 'Event Material Management',
      userid: req.session.userid,
    })

    res.status(200).json({ message: 'Published Successfuilly' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function unpublishEvent(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params
    await Interactor.unpublishEvent(id)

    await createAuditLog({
      action: 'Unpablished Event',
      section: 'Event Material Management',
      userid: req.session.userid,
    })

    res.status(200).json({ message: 'Unpublished Successfuilly' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function viewPublishedEvent(req: Request, res: Response) {
  try {
    const { id } = req.params

    const event = await Interactor.viewPublishedEvent(id)
    res.status(200).json(event)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function listPublishedEvents(req: Request, res: Response) {
  try {
    const { query } = await zParse(Schema.ListPublishedEvents, req)

    console.log('test')
    const perPage = Number(query.perpage)
    const pageNumber = Number(query.page) || 1
    const offset = (pageNumber - 1) * perPage
    const searchKey = String(query.search)
    const filterKey = query.filter

    const events = await Interactor.listPublishedEvents(
      offset,
      searchKey,
      perPage,
      filterKey
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
