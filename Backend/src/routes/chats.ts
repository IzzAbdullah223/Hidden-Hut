import { Router } from "express";
import { getUsers,getUserFriends } from "../controllers/usersController.js";
import { getProfile } from "../controllers/profileController.js";
import { getDirectedMessages, postDirectedMessage,getGroupMessages,postGroupMessages } from "../controllers/messagesController.js";
import { verifyToken } from "../controllers/authController.js";
import { upload } from "../middleware/multer.js";



export const chatRouter = Router()

chatRouter.get('/chats',getUsers)
chatRouter.get('/chats/friends',verifyToken,getUserFriends)
chatRouter.get('/chats/friend/:id',verifyToken,getProfile)
chatRouter.get(`/chats/:id/messages`,verifyToken,getDirectedMessages)
chatRouter.post('/chats/:id/messages',verifyToken,upload.single('image'),postDirectedMessage)
chatRouter.get('/chats/group/:id/messages',verifyToken,getGroupMessages)
chatRouter.post('/chats/group/:id/messages',verifyToken,upload.single('image'),postGroupMessages)


 