import express, { Express } from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import * as dotenv from 'dotenv'
import { startSocket } from './controllers/SocketController'
dotenv.config()

// routers

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer)

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use('/hello', (req, res) => {
  res.send('Tes CI/CD one las time')
})

startSocket()

httpServer.listen(3000, () => console.log('Server is running on port 3000'))

export { io }
