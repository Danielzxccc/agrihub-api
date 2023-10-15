import express, { Express } from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { startSocket } from './controllers/SocketController'
import session from 'express-session'
import { sessionConfig } from './config/config'
import routes from './routes'
import * as dotenv from 'dotenv'
import log from './utils/utils'
dotenv.config()

const app: Express = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(session(sessionConfig))

const httpServer = createServer(app)
const io = new Server(httpServer)

httpServer.listen(3000, () => {
  log.info('Server is running on port 3000')
  startSocket()
  routes(app)
})

export { io }
