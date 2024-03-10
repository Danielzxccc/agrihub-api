import express, { Express } from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import path from 'path'
import { startSocket } from './modules/Socket/SocketController'
import session from 'express-session'
import { corsOptions, sessionConfig } from './config/config'
import routes from './routes'
import * as dotenv from 'dotenv'
import cors from 'cors'
import log from './utils/utils'
import swaggerDocs from './utils/swagger'
dotenv.config()

const app: Express = express()

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.set('trust proxy', 1)

app.use(session(sessionConfig))

const httpServer = createServer(app)
const io = new Server(httpServer, { cors: corsOptions })

httpServer.listen(3000, () => {
  log.info('Server is running on port 3000')
  startSocket()
  routes(app)
  swaggerDocs(app)

  // if (process.env.NODE_ENV === 'development') {
  //   const __dirname = path.resolve()
  //   app.use(express.static(path.join(__dirname, '/dist_fr')))

  //   app.get('*', (req, res) =>
  //     res.sendFile(path.resolve(__dirname, 'dist_fr', 'index.html'))
  //   )
  // } else {
  //   app.get('/', (req, res) => {
  //     res.send('API is running....')
  //   })
  // }
})

export { io }
