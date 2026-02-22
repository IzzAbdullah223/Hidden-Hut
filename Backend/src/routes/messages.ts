import { Router } from "express";
import { getMessages,postMessage,deleteMessage,uploadImage } from "../controllers/messagesController.js";
import { verifyToken } from "../controllers/authController.js";
import { upload } from "../middleware/multer.js";

export const messagesRouter = Router()

messagesRouter.get('/global/messages',getMessages)
messagesRouter.post('/global/messages',verifyToken,postMessage)
messagesRouter.post('/global/message/upload',verifyToken,upload.single('image'),uploadImage)
messagesRouter.delete('/global/message',verifyToken,deleteMessage)
