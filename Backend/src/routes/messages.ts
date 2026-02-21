import { Router } from "express";
import { getMessages,postMessage,deleteMessage } from "../controllers/messagesController.js";
import { verifyToken } from "../controllers/authController.js";

export const messagesRouter = Router()

messagesRouter.get('/global/messages',getMessages)
messagesRouter.post('/global/messages',verifyToken,postMessage)
messagesRouter.delete('/global/message',verifyToken,deleteMessage)