import { NewEvent, UpdateEvent } from '../../types/DBTypes'
import HttpError from '../../utils/HttpError'
import dbErrorHandler from '../../utils/dbErrorHandler'
import * as Service from './EventsService'

export async function createEvent(userid: string, event: NewEvent) {
  if (!userid) {
    throw new HttpError('Session Expired', 401)
  }
  const data = { ...event, userid }

  const newEvent = await Service.createEvent(data)

  return newEvent
}

export async function listEvents(searchKey: string) {
  const [data] = await Promise.all([Service.findEvents(searchKey)])
  return { data }
}

export async function viewEvents(id: string) {
  const events = await Service.viewEvents(id)

  if (!events) throw new HttpError('Event not found', 404)

  return events
}

export async function updateEvent(id: string, body: UpdateEvent) {
  const events = await Service.updateEvents(id, body)

  if (!events) throw new HttpError('Event not found', 400)
  return events
}

export async function deleteEvent(id: string) {
  const events = await Service.deleteEvents(id)

  if (!events) throw new HttpError('Event not found', 400)
  return events
}
