import { Response } from 'express'
import { SessionRequest } from '../../types/AuthType'
import errorHandler from '../../utils/httpErrorHandler'
import * as Interactor from './NotificationInteractor'
import zParse from '../../utils/zParse'
import * as Schema from '../../schema/NotificationSchema'

export async function subscribeToNotification(
  req: SessionRequest,
  res: Response
) {
  try {
    const { userid } = req.session
    const payload = req.body

    const subscription = await Interactor.subscribeToNotification(
      userid,
      JSON.stringify(payload)
    )
    res.status(201).json({ message: 'successfully subscribe', subscription })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function emitPushNotification(req: SessionRequest, res: Response) {
  try {
    const { userid } = req.session

    await Interactor.emitPushNotification(
      userid,
      'Juicy',
      'Ana is 500km away from you'
    )
    res.status(201).json({ message: 'emitted' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function listUserNotifications(
  req: SessionRequest,
  res: Response
) {
  try {
    const { userid } = req.session

    const { query } = await zParse(Schema.ListUserNotifications, req)

    const perPage = Number(query.perpage)
    const pageNumber = Number(query.page) || 1
    const offset = (pageNumber - 1) * perPage
    const searchKey = String(query.search)
    const filterKey = query.filter

    const notifications = await Interactor.listUserNotifications(
      userid,
      offset,
      filterKey,
      searchKey,
      perPage
    )
    const totalPages = Math.ceil(Number(notifications.total.count) / perPage)
    res.status(200).json({
      notifications: notifications.data,
      pagination: {
        page: pageNumber,
        per_page: 20,
        total_pages: totalPages,
        total_records: Number(notifications.total.count),
      },
    })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function readUserNotifications(
  req: SessionRequest,
  res: Response
) {
  try {
    const { userid } = req.session
    const { id } = req.params

    await Interactor.readUserNotifications(userid, id)
    res.status(200).json({ message: 'Read successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function testEmit(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params

    await Interactor.emitPushNotification(
      id,
      'THIS IS A TEST NOTIF',
      'TEST NOTIFICATION'
    )

    res.status(200).json({ message: 'success' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function markAllAsRead(req: SessionRequest, res: Response) {
  try {
    const { userid } = req.session

    await Interactor.markAllAsRead(userid)

    res.status(200).json({ message: 'success' })
  } catch (error) {
    errorHandler(res, error)
  }
}
