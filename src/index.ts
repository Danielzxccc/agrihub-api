import express, { Express } from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { startSocket } from './controllers/SocketController'
import session from 'express-session'
import * as dotenv from 'dotenv'
import { sessionConfig } from './config/config'

// routers
import { AuthRouter } from './routers/AuthRouter'

dotenv.config()
const app: Express = express()

// session config
app.use(session(sessionConfig))

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.get('/test new runner s', (req, res) => res.send('test workflow'))
app.use('/v1/api/auth', AuthRouter)

const httpServer = createServer(app)
const io = new Server(httpServer)

startSocket()

httpServer.listen(3000, () => console.log('Server is running on port 3000'))

export { io }
