const express = require('express')
require('dotenv').config()

const router = require('./src/routes')

const cors = require('cors')

// import server for Socket.io
const http = require('http')
const { Server } = require('socket.io')

const app = express()

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000'
    }
})

// Import socket function and call it with paramater io
require('./src/socket')(io)

const port = 5000

app.use(express.json())
app.use(cors())

app.use('/api/v1/', router)
app.use('/uploads', express.static('uploads'))

server.listen(port, () => console.log(`Server running on port: ${port}`))