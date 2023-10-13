import express, { Express } from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { startSocket } from './controllers/SocketController'
import session from 'express-session'
import * as dotenv from 'dotenv'
import { sessionConfig } from './config/config'
import path from 'path'

// routers
import { AuthRouter } from './routers/AuthRouter'
import upload from './config/multer'

dotenv.config()
const app: Express = express()

// session config
app.use(session(sessionConfig))

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.post('/upload', upload.single('image'), (req, res) => {
  res.json({ data: req.file })
})
app.get('/images/:filename', (req, res) => {
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

app.use('/v1/api/auth', AuthRouter)

const httpServer = createServer(app)
const io = new Server(httpServer)

startSocket()

httpServer.listen(3000, () => console.log('Server is running on port 3000'))

export { io }
