import { Express, Request, Response } from 'express'
import { AuthRouter } from './modules/Auth/AuthRouter'
import { ForumsRouter } from './modules/Forums/ForumsRouter'
import { ArticlesRouter } from './modules/Articles/ArticlesRouter'
import { AccountRouter } from './modules/Auth/AccountRouter'
import { TagsRouter } from './modules/Tags/TagsRouter'
import { UserRouter } from './modules/Users/UserRoutes'
import upload from './config/multer'
import { multerLimitter } from './middleware/UploadMiddleware'
import path from 'path'

function routes(app: Express) {
  app.get('/healthcheck', (req: Request, res: Response) => {
    res.sendStatus(200)
  })

  app.post('/upload', upload.single('image'), (req: Request, res: Response) => {
    res.json({ data: req.file })
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
  app.use('/api/account', AccountRouter)
  app.use('/api/user', UserRouter)
  app.use('/api/forums', ForumsRouter)
  app.use('/api/tags', TagsRouter)
  app.use('/api/articles', ArticlesRouter)

  // upload error messages
  app.use(multerLimitter)
}

export default routes
