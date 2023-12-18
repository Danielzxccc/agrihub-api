import * as EventsController from './EventsController'
import express from 'express'
import { UserGuard } from '../AuthGuard/UserGuard'

export const EventsRouter = express.Router()

EventsRouter.post(
  '/',
  UserGuard(['user']),
  //upload.single('image'),
  EventsController.createEvent
)

EventsRouter.get('/', EventsController.listEvents)
EventsRouter.get('/:id', EventsController.viewEvents)
EventsRouter.put('/:id', EventsController.updateEvent)
EventsRouter.delete('/:id', EventsController.removeEvent)
