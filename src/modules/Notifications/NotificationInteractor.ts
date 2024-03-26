import { UpdateUserNotification } from '../../types/DBTypes'
import HttpError from '../../utils/HttpError'
import log from '../../utils/utils'
import {
  emitNotification,
  emitNotificationToAdmin,
} from '../Socket/SocketController'
import { findAllAdmins, findUser } from '../Users/UserService'
import * as Service from './NotificationService'
import PushService from './WebPush'

export async function subscribeToNotification(userid: string, payload: string) {
  const newSubscription = await Service.createSubscritpion({ userid, payload })
  return newSubscription
}

async function sendPushNotification(
  userid: string,
  title: string,
  body: string,
  redirect_to = ''
) {
  try {
    const notificationPayload = {
      title,
      body,
      icon: 'https://agrihub-bucket.s3.ap-southeast-1.amazonaws.com/agrihub-logo.svg',
      data: {
        url: 'https://example.com',
      },
    }
    await Service.createNotification({
      emitted_to: userid,
      body,
      redirect_to: redirect_to,
    })

    const asyncEmitNotif = () => {
      return new Promise((resolve) => {
        resolve(emitNotification(userid, body))
      })
    }

    await asyncEmitNotif()

    const subscription = await Service.findSubscription(userid)

    if (!subscription) return
    try {
      await PushService.sendNotification(
        subscription.payload as any,
        JSON.stringify(notificationPayload)
      )
    } catch (error) {}
  } catch (error) {
    log.warn('failed to send notification')
    console.log(error, 'NOTIF ERROR')
  }
}

export async function emitPushNotification(
  userid: string,
  title: string,
  body: string,
  redirect_to = ''
) {
  try {
    if (userid === 'admin') {
      const admins = await findAllAdmins()
      const notificationPromises = admins.map((item) =>
        sendPushNotification(item.id, title, body, redirect_to)
      )

      await Promise.all(notificationPromises)
    } else {
      await sendPushNotification(userid, title, body, redirect_to)
    }
  } catch (error) {
    log.warn('failed to send notification')
  }
}

export async function listUserNotifications(
  userid: string,
  offset: number,
  filterKey: string,
  searchKey: string,
  perpage: number
) {
  const user = await findUser(userid)
  if (!user) throw new HttpError('Unauthorized', 401)

  const [data, total] = await Promise.all([
    Service.findUserNotifications(
      userid,
      offset,
      filterKey,
      searchKey,
      perpage
    ),
    Service.getUserNotificationCount(userid),
  ])

  return { data, total }
}

export async function readUserNotifications(userid: string, id: string) {
  const user = await findUser(userid)
  const notification = await Service.findUserNotificationById(id)

  if (!notification) {
    throw new HttpError('Notification not found', 404)
  }

  if (user.id !== notification.emitted_to) {
    throw new HttpError('Unathorized', 401)
  }

  const updatedObject: UpdateUserNotification = {
    viewed: true,
  }

  await Service.updateUserNotification(id, updatedObject)
}
