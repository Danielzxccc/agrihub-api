import { Express, Request, Response } from 'express'
import { AuthRouter } from './routers/AuthRouter'
import { ForumsRouter } from './routers/ForumsRouter'
import upload from './config/multer'
import { multerLimitter } from './middleware/UploadMiddleware'

function routes(app: Express) {
  app.get('/healthcheck', (req: Request, res: Response) => {
    res.sendStatus(200)
  })

  app.post('/upload', upload.single('image'), (req: Request, res: Response) => {
    res.json({ data: req.file })
  })

  app.use('/v1/api/auth', AuthRouter)
  app.use('/v1/api/forums', ForumsRouter)

  // upload error messages
  app.use(multerLimitter)
}

export default routes
