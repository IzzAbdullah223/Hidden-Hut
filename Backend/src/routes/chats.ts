import { Router } from "express";
import { getFriends } from "../controllers/chatsController.js";



export const chatRouter = Router()

chatRouter.get('/chats/users',getFriends)