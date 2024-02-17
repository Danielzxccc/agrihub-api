import { NewEvent, UpdateEvent } from '../../types/DBTypes'
import HttpError from '../../utils/HttpError'
import dbErrorHandler from '../../utils/dbErrorHandler'
import { deleteFile } from '../../utils/file'
import { deleteFileCloud, uploadFiles } from '../AWS-Bucket/UploadService'
import * as Service from './EventsService'

export async function createDraftEvent(event: NewEvent) {
  const newEvent = await Service.insertNewEvent(event)

  return newEvent
}

export async function updateDraftEvent(
  id: string,
  event: UpdateEvent,
  image: Express.Multer.File
) {
  try {
    const findEvent = await Service.findEventById(id)

    if (!findEvent) {
      throw new HttpError('Event not found', 404)
    }

    if (findEvent.banner && image.filename) {
      deleteFileCloud(findEvent.banner)
    }

    await uploadFiles([image])

    const updateObject: UpdateEvent = {
      ...event,
      banner: image.filename,
    }

    const updatedEvent = await Service.updateEvent(id, updateObject)

    deleteFile(image.filename)

    return updatedEvent
  } catch (error) {
    deleteFile(image.filename)
    dbErrorHandler(error)
  }
}
