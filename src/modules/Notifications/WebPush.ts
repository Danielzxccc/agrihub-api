import webpush from 'web-push'
import * as dotenv from 'dotenv'
dotenv.config()

const PushService = webpush

const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY,
  privateKey: process.env.VAPID_PRIVATE_KEY,
}

PushService.setVapidDetails(
  'https://qc-agrihub.xyz',
  vapidKeys.publicKey,
  vapidKeys.privateKey
)

export default PushService
