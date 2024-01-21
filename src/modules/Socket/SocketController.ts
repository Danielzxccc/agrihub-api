import { io } from '../../index'

export function startSocket() {
  io.on('connection', (socket) => {
    console.log(socket.id)

    socket.on('message', (socket) => {
      console.log(socket)
      io.emit('message', 'test')
    })
  })
}

// export function emitNotification(id: string){
//   io.to(id).emit()
// }
