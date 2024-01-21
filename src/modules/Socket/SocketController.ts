import { io } from '../../index'

export function startSocket() {
  io.on('connection', (socket) => {
    console.log(socket.id)

    socket.on('message', (socket) => {
      console.log(socket)
      io.emit('message', 'test')
    })

    socket.on('join_room', (socket) => {
      console.log(socket)
      io.emit('join_room', 'joined room')
    })
  })
}

export function emitNotification(id: string, payload: string) {
  io.emit(id, payload)
}

export function emitNotificationToAdmin() {
  io.emit('admin', 'tangina mo admin')
}
