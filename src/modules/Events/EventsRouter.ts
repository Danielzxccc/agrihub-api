import * as EventsController from './EventsController'
import express from 'express'
import { UserGuard } from '../AuthGuard/UserGuard'
import upload from '../../config/multer'

export const EventsRouter = express.Router()

EventsRouter.post(
  '/create/draft',
  UserGuard(['admin', 'asst_admin']),
  EventsController.createDraftEvent
)

EventsRouter.put(
  '/update/draft/:id',
  UserGuard(['admin', 'asst_admin']),
  upload.single('image'),
  EventsController.updateDraftEvent
)

EventsRouter.post(
  '/create/partnership/:id',
  UserGuard(['admin', 'asst_admin']),
  upload.single('logo'),
  EventsController.createNewEventPartnership
)

EventsRouter.put(
  '/update/partnership/:id',
  UserGuard(['admin', 'asst_admin']),
  upload.single('logo'),
  EventsController.updateEventPartnership
)

EventsRouter.delete(
  '/remove/partnership/:id',
  UserGuard(['admin', 'asst_admin']),
  EventsController.removeEventPartnership
)

EventsRouter.post(
  '/create/speaker/:id',
  UserGuard(['admin', 'asst_admin']),
  upload.single('profile'),
  EventsController.createEventSpeaker
)

EventsRouter.put(
  '/update/speaker/:id',
  UserGuard(['admin', 'asst_admin']),
  upload.single('profile'),
  EventsController.updateEventSpeaker
)

EventsRouter.delete(
  '/remove/speaker/:id',
  UserGuard(['admin', 'asst_admin']),
  EventsController.removeEventSpeaker
)

EventsRouter.post(
  '/create/tags/:id',
  UserGuard(['admin', 'asst_admin']),
  EventsController.createEventTags
)

EventsRouter.delete(
  '/remove/tags/:id',
  UserGuard(['admin', 'asst_admin']),
  EventsController.removeEventTag
)

EventsRouter.get(
  '/view/:id',
  UserGuard(['admin', 'asst_admin']),
  EventsController.viewUnpublishedEvent
)

EventsRouter.get(
  '/draft',
  UserGuard(['admin', 'asst_admin']),
  EventsController.listDraftEvents
)

EventsRouter.delete(
  '/archive/:id',
  UserGuard(['admin', 'asst_admin']),
  EventsController.archiveEvent
)

EventsRouter.put(
  '/unarchive/:id',
  UserGuard(['admin', 'asst_admin']),
  EventsController.unarchiveEvent
)

EventsRouter.get(
  '/archived/list',
  UserGuard(['admin', 'asst_admin']),
  EventsController.listArchivedEvents
)

EventsRouter.delete(
  '/delete/draft/:id',
  UserGuard(['admin', 'asst_admin']),
  EventsController.deleteDraftEvent
)

EventsRouter.put(
  '/publish/:id',
  UserGuard(['admin', 'asst_admin']),
  EventsController.publishEvent
)

EventsRouter.put(
  '/unpublish/:id',
  UserGuard(['admin', 'asst_admin']),
  EventsController.unpublishEvent
)

EventsRouter.get('/published/list', EventsController.listPublishedEvents)
EventsRouter.get('/published/:id', EventsController.viewUnpublishedEvent)
