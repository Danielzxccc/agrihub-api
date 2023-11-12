import { Express, Request, Response } from 'express'
import { AuthRouter } from './modules/Auth/AuthRouter'
import { ForumsRouter } from './modules/Forums/ForumsRouter'
import { ArticlesRouter } from './modules/Articles/ArticlesRouter'
import { AccountRouter } from './modules/Auth/AccountRouter'
import { TagsRouter } from './modules/Tags/TagsRouter'
import { UserRouter } from './modules/Users/UserRoutes'
import upload from './config/multer'
import { multerLimitter } from './middleware/UploadMiddleware'

function routes(app: Express) {
  app.get('/healthcheck', (req: Request, res: Response) => {
    res.sendStatus(200)
  })

  app.post('/upload', upload.single('image'), (req: Request, res: Response) => {
    res.json({ data: req.file })
  })

  app.use('/api/auth', AuthRouter)
  app.use('/api/account', AccountRouter)
  app.use('/api/user', UserRouter)
  app.use('/api/forums', ForumsRouter)
  app.use('/api/tags', TagsRouter)
  app.use('/api/articles', ArticlesRouter)

  // upload error messages
  app.use(multerLimitter)
}

export default routes
