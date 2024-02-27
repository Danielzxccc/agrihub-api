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
  NotificationController.emitPushNotification
)

NotificationRouter.get('/user', NotificationController.listUserNotifications)

NotificationRouter.put(
  '/user/read/:id',
  UserGuard(['admin', 'asst_admin', 'farm_head', 'farmer', 'member', 'user']),
  NotificationController.readUserNotifications
)

NotificationRouter.post(
  '/emit/test/:id',
  UserGuard(['admin']),
  NotificationController.testEmit
)
