import { Router } from "express";
import { getUsers,getUserFriends } from "../controllers/usersController.js";
import { getProfile } from "../controllers/profileController.js";
import { getDirectedMessages, postDirectedMessage } from "../controllers/messagesController.js";
import { verifyToken } from "../controllers/authController.js";
import { upload } from "../middleware/multer.js";



export const chatRouter = Router()

chatRouter.get('/chats',verifyToken,getUsers)
chatRouter.get('/chats/friends',verifyToken,getUserFriends)
chatRouter.get('/chats/friend/:id',verifyToken,getProfile)
chatRouter.get(`/chats/:id/messages`,verifyToken,getDirectedMessages)
chatRouter.post('/chats/:id/messages',verifyToken,upload.single('image'),postDirectedMessage)

 