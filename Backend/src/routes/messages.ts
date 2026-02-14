import { Router } from "express";
import { getMessages } from "../controllers/messagesController.js";

export const messagesRouter = Router()

messagesRouter.get('/global/messages',getMessages)
//messagesRouter.post('/global/messages')