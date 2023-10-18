const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)

import { Server } from 'socket.io'
const io = new Server(server, {
  cors: {
    origin: '*',
  },
})

type Point = { x: number; y: number }

type DrawLine = {
  prevPoint: Point | null
  currentPoint: Point
  color: string
}

io.on('connection', (socket) => {
  socket.on('client-ready', () => {
    socket.broadcast.emit('get-canvas-state')
  })

  socket.on('canvas-state', (state) => {
    socket.broadcast.emit('canvas-state-from-server', state)
  })

  socket.on('draw-line', ({ prevPoint, currentPoint, color }: DrawLine) => {
    socket.broadcast.emit('draw-line', { prevPoint, currentPoint, color })
  })

  socket.on('clear', () => io.emit('clear'))

  socket.on('fill-color', (color: string) => {
    socket.broadcast.emit('fill-color', color);
  });

  socket.on('change-size', (lineWidth: number) => {
    socket.broadcast.emit('size-changed', lineWidth);
  });

  socket.on('draw-text', ({ text, font, color, x, y }) => {
    socket.broadcast.emit('draw-text', { text, font, color, x, y });
  });

})

server.listen(3001, () => {
  console.log('✔️ Server listening on port 3001')
})
