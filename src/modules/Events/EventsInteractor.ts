import { P } from 'pino'
import {
  NewEvent,
  NewEventPartnership,
  NewEventSpeaker,
  NewEventTag,
  UpdateEvent,
  UpdateEventPartnership,
  UpdateEventSpeaker,
} from '../../types/DBTypes'
import HttpError from '../../utils/HttpError'
import dbErrorHandler from '../../utils/dbErrorHandler'
import { deleteFile } from '../../utils/file'
import { deleteFileCloud, uploadFiles } from '../AWS-Bucket/UploadService'
import * as Service from './EventsService'
import { ZodError, z } from 'zod'
import zParse from '../../utils/zParse'
import { sql } from 'kysely'

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

export async function createNewEventPartnership(
  id: string,
  partnership: NewEventPartnership,
  image: Express.Multer.File
) {
  try {
    const event = await Service.findEventById(id)

    if (!event) {
      throw new HttpError('Event not found', 404)
    }

    const newEventPartnership = await Service.insertNewEventPartnership({
      ...partnership,
      event_id: event.id,
      logo: image.filename,
    })

    await uploadFiles([image])

    deleteFile(image.filename)

    return newEventPartnership
  } catch (error) {
    deleteFile(image.filename)
    dbErrorHandler(error)
  }
}

export async function updateEventPartnership(
  id: string,
  partnership: UpdateEventPartnership,
  image: Express.Multer.File
) {
  try {
    const findPartnership = await Service.findEventPartnership(id)

    if (!findPartnership) {
      throw new HttpError('Event not found', 404)
    }

    const updatedEventPartnership = await Service.updateEventPartnership({
      ...partnership,
      logo: image?.filename ? image?.filename : findPartnership.logo,
    })

    if (image?.filename) {
      await uploadFiles([image])
      await deleteFileCloud(findPartnership.logo)
      deleteFile(image?.filename)
    }

    return updatedEventPartnership
  } catch (error) {
    deleteFile(image?.filename)
    dbErrorHandler(error)
  }
}

export async function removeEventPartnership(id: string) {
  const findPartnership = await Service.findEventPartnership(id)

  if (!findPartnership) {
    throw new HttpError('Event not found', 404)
  }

  await deleteFileCloud(findPartnership?.logo)

  await Service.deleteEventPartnership(id)
}

export async function createEventSpeaker(
  id: string,
  speaker: NewEventSpeaker,
  image: Express.Multer.File
) {
  try {
    const event = await Service.findEventById(id)
    if (!event) {
      throw new HttpError('Event not found', 404)
    }

    const speakerObject: NewEventSpeaker = {
      ...speaker,
      event_id: event.id,
      profile: image.filename,
    }

    const newEventSpeaker = await Service.insertEventSpeaker(speakerObject)

    await uploadFiles([image])
    return newEventSpeaker
  } catch (error) {
    deleteFile(image?.filename)
    dbErrorHandler(error)
  }
}

export async function updateEventSpeaker(
  id: string,
  speaker: UpdateEventSpeaker,
  image: Express.Multer.File
) {
  try {
    const findSpeaker = await Service.findEventSpeaker(id)

    if (!findSpeaker) {
      throw new HttpError('Speaker not found', 404)
    }

    const updatedObject: UpdateEventSpeaker = {
      ...speaker,
      profile: image?.filename ? image?.filename : findSpeaker.profile,
    }

    const updatedSpeaker = await Service.updateEventSpeaker(id, updatedObject)

    if (image?.filename) {
      await uploadFiles([image])
      deleteFile(image?.filename)
    }

    return updatedSpeaker
  } catch (error) {
    deleteFile(image?.filename)
    dbErrorHandler(error)
  }
}

export async function removeEventSpeaker(id: string) {
  const speaker = await Service.findEventSpeaker(id)

  if (!speaker) {
    throw new HttpError('Speaker not found', 404)
  }

  if (speaker.profile) {
    await deleteFileCloud(speaker.profile)
  }

  await Service.deleteEventSpeaker(id)
}

export async function createEventTags(id: string, tags: string[] | string) {
  const event = await Service.findEventById(id)

  if (!event) {
    throw new HttpError('Learning Material Not Found', 404)
  }

  let learningTags: NewEventTag[] | NewEventTag

  if (Array.isArray(tags)) {
    learningTags = tags.map((item) => {
      return {
        tag_id: item,
        event_id: id,
      }
    })
  } else {
    learningTags = {
      tag_id: tags,
      event_id: id,
    }
  }

  const newLearningTags = await Service.inserEventsTags(learningTags)
  return newLearningTags
}

export async function removeEventTag(id: string) {
  await Service.deleteEventTag(id)
}

export async function viewUnpublishedEvent(id: string) {
  const event = await Service.findUnpublishedEvent(id)
  if (!event) {
    throw new HttpError('Event Not Found', 404)
  }

  return event
}

export async function listDraftEvents(
  offset: number,
  searchKey: string,
  perpage: number
) {
  const [data, total] = await Promise.all([
    Service.findDraftEvents(offset, searchKey, perpage),
    Service.getTotalDraftEvents(),
  ])

  return { data, total }
}

export async function listArchivedEvents(
  offset: number,
  searchKey: string,
  perpage: number
) {
  const [data, total] = await Promise.all([
    Service.findArchivedEvents(offset, searchKey, perpage),
    Service.getTotalArchiveEvents(),
  ])

  return { data, total }
}

export async function archiveEvent(id: string) {
  const event = await Service.findUnpublishedEvent(id)
  if (!event) {
    throw new HttpError('Event Not Found', 404)
  }

  await Service.archiveEvent(id)
}

export async function unarchiveEvent(id: string) {
  const event = await Service.findUnpublishedEvent(id)
  if (!event) {
    throw new HttpError('Event Not Found', 404)
  }

  await Service.unarchiveEvent(id)
}

export async function deleteDraftEvent(id: string) {
  const event = await Service.findUnpublishedEvent(id)
  if (!event) {
    throw new HttpError('Event Not Found', 404)
  }

  if (event.status !== 'draft') {
    throw new HttpError("You can't delete published events", 401)
  }

  await Service.deleteEvent(id)
}

export async function publishEvent(id: string) {
  const event = await Service.findEventById(id)

  if (!event) {
    throw new HttpError('Event Not Found', 404)
  }

  const validation = z.object({
    banner: z.string(),
    event_start: z.date().transform((arg) => new Date(arg)),
    event_end: z.date().transform((arg) => new Date(arg)),
    location: z.string(),
    title: z.string(),
    about: z.string(),
    type: z.string(),
    guide: z.string(),
  })

  try {
    await validation.parseAsync(event)
  } catch (error) {
    if (error instanceof ZodError) {
      throw new HttpError('Incomplete Details', 400, error.errors)
    }
    throw new HttpError('Incomplete Details', 400)
  }

  // if (!event.partnership.length) {
  //   throw new HttpError('You need at least one partnership', 400)
  // }

  // if (!event.speaker.length) {
  //   throw new HttpError('You need at least one speaker', 400)
  // }

  if (event?.event_end <= new Date()) {
    throw new HttpError('Unable to publish: event end date has passed.', 400)
  }

  await Service.updateEvent(id, {
    status: 'published',
    published_date: new Date(),
  })
}

export async function unpublishEvent(id: string) {
  const event = await Service.findEventById(id)

  if (!event) {
    throw new HttpError('Event Not Found', 404)
  }

  await Service.updateEvent(id, { status: 'draft' })
}

export async function viewPublishedEvent(id: string) {
  const event = await Service.findPublishedEvent(id)
  if (!event) {
    throw new HttpError('Event Not Found', 404)
  }

  return event
}

export async function listPublishedEvents(
  offset: number,
  searchKey: string,
  perpage: number
) {
  const [data, total] = await Promise.all([
    Service.findPublishedEvents(offset, searchKey, perpage),
    Service.getTotalPublishedEvents(),
  ])

  return { data, total }
}
