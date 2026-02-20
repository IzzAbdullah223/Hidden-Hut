import { Router } from "express";
import { getMessages,postMessage } from "../controllers/messagesController.js";
import { verifyToken } from "../controllers/authController.js";

export const messagesRouter = Router()

messagesRouter.get('/global/messages',getMessages)
messagesRouter.post('/global/messages',verifyToken,postMessage)