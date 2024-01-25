import { Express, Request, Response } from 'express'
import { AuthRouter } from './modules/Auth/AuthRouter'
import { ForumsRouter } from './modules/Forums/ForumsRouter'
import { ArticlesRouter } from './modules/Articles/ArticlesRouter'
import { AccountRouter } from './modules/Auth/AccountRouter'
import { TagsRouter } from './modules/Tags/TagsRouter'
import { UserRouter } from './modules/Users/UserRoutes'
import { FarmRouter } from './modules/Farm/FarmRouter'
import { EventsRouter } from './modules/Events/EventsRouter'
import { AboutRouter } from './modules/About/AboutRouter'
import { multerLimitter } from './middleware/UploadMiddleware'
import { BlogsRouter } from './modules/Blogs/BlogsRouter'
import { ReportsRouter } from './modules/Reports/ReportsRouter'
import path from 'path'
import upload from './config/multer'
import webpush from 'web-push'
import * as dotenv from 'dotenv'
dotenv.config()

const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY,
  privateKey: process.env.VAPID_PRIVATE_KEY,
}

webpush.setVapidDetails(
  'mailto:user@example.org',
  vapidKeys.publicKey,
  vapidKeys.privateKey
)

let subscriptions: PushSubscription[] = []

function routes(app: Express) {
  app.get('/healthcheck', (req: Request, res: Response) => {
    res.sendStatus(200)
  })

  app.post('/upload', upload.single('image'), (req: Request, res: Response) => {
    res.json({ data: req.file })
  })

  app.post('/subscribe', (req, res) => {
    const subscription = req.body
    subscriptions.push(subscription)

    res.status(201).json({ status: 'success' })
  })

  app.post('/send-notification', (req, res) => {
    const notificationPayload = {
      title: 'New Notification',
      body: 'This is a new notification',
      icon: 'https://some-image-url.jpg',
      data: {
        url: 'https://example.com',
      },
    }

    Promise.all(
      subscriptions.map((subscription: any) =>
        webpush.sendNotification(
          subscription,
          JSON.stringify(notificationPayload)
        )
      )
    )
      .then(() =>
        res.status(200).json({ message: 'Notification sent successfully.' })
      )
      .catch((err) => {
        console.error('Error sending notification')
        res.sendStatus(500)
      })
  })

  app.get('/image/:filename', (req, res) => {
    const imageFolderPath = path.join(__dirname, '../', 'uploads')
    const { filename } = req.params
    const imagePath = path.join(
      process.env.NODE_ENV === 'development'
        ? imageFolderPath
        : process.env.STORAGE_URL,
      filename
    )

    if (!imagePath) res.status(404).json({ message: "Can't find image" })
    // Send the image as a response
    res.sendFile(imagePath)
  })

  app.use('/api/auth', AuthRouter)
  app.use('/api/farm', FarmRouter)
  app.use('/api/reports', ReportsRouter)
  app.use('/api/account', AccountRouter)
  app.use('/api/user', UserRouter)
  app.use('/api/forums', ForumsRouter)
  app.use('/api/tags', TagsRouter)
  app.use('/api/articles', ArticlesRouter)
  app.use('/api/events', EventsRouter)
  app.use('/api/cms/about', AboutRouter)
  app.use('/api/blogs', BlogsRouter)

  // upload error messages
  app.use(multerLimitter)
}

export default routes
