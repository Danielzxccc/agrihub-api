import { UpdateUserNotification } from '../../types/DBTypes'
import HttpError from '../../utils/HttpError'
import {
  emitNotification,
  emitNotificationToAdmin,
} from '../Socket/SocketController'
import { findUser } from '../Users/UserService'
import * as Service from './NotificationService'
import PushService from './WebPush'

export async function subscribeToNotification(userid: string, payload: string) {
  const newSubscription = await Service.createSubscritpion({ userid, payload })
  return newSubscription
}

export async function emitPushNotification(
  userid: string,
  title: string,
  body: string,
  redirect_to = ''
) {
  const notificationPayload = {
    title,
    body,
    icon: 'https://agrihub-bucket.s3.ap-southeast-1.amazonaws.com/agrihub-logo.svg',
    data: {
      url: 'https://example.com',
    },
  }

  if (userid === 'admin') {
    emitNotificationToAdmin(body)
  } else {
    // create notification
    await Service.createNotification({
      emitted_to: userid,
      body,
      redirect_to: redirect_to,
    })

    emitNotification(userid, body)

    const subscription = await Service.findSubscription(userid)

    // if (!subscription) return

    await PushService.sendNotification(
      subscription.payload as any,
      JSON.stringify(notificationPayload)
    )
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
