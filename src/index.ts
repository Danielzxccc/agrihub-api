import express, { Express } from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { startSocket } from './controllers/SocketController'
import session from 'express-session'
import * as dotenv from 'dotenv'
import { sessionConfig } from './config/config'

// routers
import { AuthRouter } from './routers/AuthRouter'
import { SessionRequest } from 'AuthType'

dotenv.config()
const app: Express = express()

// session config
app.use(session(sessionConfig))

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.get('/test', (req: SessionRequest, res) => {
  if (!req.session.user) return res.send('no no no')
  res.send(req.session.user)
})

app.use('/v1/api/auth', AuthRouter)

const httpServer = createServer(app)
const io = new Server(httpServer)

startSocket()

httpServer.listen(3000, () => console.log('Server is running on port 3000'))

export { io }
