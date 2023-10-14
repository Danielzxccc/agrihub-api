import express, { Express } from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { startSocket } from './controllers/SocketController'
import session from 'express-session'
import { sessionConfig } from './config/config'
import * as dotenv from 'dotenv'
dotenv.config()

// routers
import { AuthRouter } from './routers/AuthRouter'
import { ForumsRouter } from './routers/ForumsRouter'

// middleware
import { multerLimitter } from './middleware/UploadMiddleware'

const app: Express = express()

// session config
app.use(session(sessionConfig))

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Error handling middleware for Multer size limit
app.use(multerLimitter)

app.get('/', (req, res) => {
  res.send('hello world')
})

app.use('/v1/api/auth', AuthRouter)
app.use('/v1/api/forums', ForumsRouter)

const httpServer = createServer(app)
const io = new Server(httpServer)

startSocket()

httpServer.listen(3000, () => console.log('Server is running on port 3000'))

export { io }
