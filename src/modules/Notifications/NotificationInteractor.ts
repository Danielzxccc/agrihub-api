import HttpError from '../../utils/HttpError'
import { emitNotification } from '../Socket/SocketController'
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
  body: string
) {
  const notificationPayload = {
    title,
    body,
    icon: 'https://agrihub-bucket.s3.ap-southeast-1.amazonaws.com/agrihub-logo.svg',
    data: {
      url: 'https://example.com',
    },
  }

  const subscription = await Service.findSubscription(userid)

  if (!subscription) return

  // create notification
  await Service.createNotification({
    emitted_to: userid,
    body,
    redirect_to: '',
  })

  await PushService.sendNotification(
    subscription.payload as any,
    JSON.stringify(notificationPayload)
  )
  emitNotification(userid, body)
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
