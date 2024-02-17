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
