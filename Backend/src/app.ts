import express from 'express'
import dotenv from 'dotenv';
import './config/passport.js'
import cors from 'cors'
import { authRouter } from './routes/auth.js';
import { globalRouter } from './routes/global.js';
import { chatRouter } from './routes/chats.js';
import { profileRouter } from './routes/profile.js';
import { groupRouter } from './routes/groups.js';
import {createServer} from 'http'
import {Server} from 'socket.io'


dotenv.config();
const app = express()
const httpServer = createServer(app) //wrap express with http server
export const io = new Server(httpServer, { // attach socket.io to that server, export so other files can use it
  cors: { origin: "*" }
})

io.on('connection', (socket) => {
  socket.on('join_room', (roomId: string) => {
    socket.join(roomId)
  })

  socket.on('leave_room', (roomId: string) => {
    socket.leave(roomId)
  })
})  







app.use(cors())
app.use(express.json())
app.use('/',authRouter)
app.use('/',globalRouter)
app.use('/',chatRouter)
app.use('/',profileRouter)
app.use('/',groupRouter)

const PORT = process.env.PORT || 3000

httpServer.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})