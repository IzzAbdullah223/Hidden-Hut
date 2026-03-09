import { Router } from "express";
import { getUsers,getUserFriends } from "../controllers/usersController.js";
import { getProfile } from "../controllers/profileController.js";
import { postDirectedMessage } from "../controllers/messagesController.js";
import { verifyToken } from "../controllers/authController.js";



export const chatRouter = Router()

chatRouter.get('/chats',verifyToken,getUsers)
chatRouter.get('/chats/friends',verifyToken,getUserFriends)
chatRouter.get('/chats/friend/:id',verifyToken,getProfile)
chatRouter.post('/chats/:id/messages',verifyToken,postDirectedMessage)

 