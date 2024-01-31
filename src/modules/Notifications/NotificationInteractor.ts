import * as Service from './NotificationService'
import PushService from './WebPush'

export async function subscribeToNotification(userid: string, payload: string) {
  const newSubscription = await Service.createSubscritpion({ userid, payload })
  return newSubscription
}

export async function emitNotification(
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

  await PushService.sendNotification(
    subscription.payload as any,
    JSON.stringify(notificationPayload)
  )
}
