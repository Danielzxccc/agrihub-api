import { UserGuard } from '../AuthGuard/UserGuard'
import * as NotificationController from './NotificationController'
import express from 'express'

export const NotificationRouter = express.Router()

NotificationRouter.post(
  '/subscribe',
  UserGuard([
    'admin',
    'asst_admin',
    'farm_head',
    'farmer',
    'guest',
    'member',
    'user',
  ]),
  NotificationController.subscribeToNotification
)

NotificationRouter.post(
  '/emit',
  UserGuard([
    'admin',
    'asst_admin',
    'farm_head',
    'farmer',
    'guest',
    'member',
    'user',
  ]),
  NotificationController.emitNotification
)
