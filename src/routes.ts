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
import { NotificationRouter } from './modules/Notifications/NotificationRouter'
import { LearningRouter } from './modules/LearningMaterials/LearningRouter'
import { UploaderRouter } from './modules/Uploader/UploaderRouter'

function routes(app: Express) {
  app.get('/healthcheck', (req: Request, res: Response) => {
    res.sendStatus(200)
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
  app.use('/api/notification', NotificationRouter)
  app.use('/api/learning', LearningRouter)
  app.use('/api/upload', UploaderRouter)

  // upload error messages
  app.use(multerLimitter)
}

export default routes
