import { Router } from "express";
import { searchUsers } from "../controllers/usersController.js";
import { verifyToken } from "../controllers/authController.js";



export const chatRouter = Router()

chatRouter.post('/chats/search',verifyToken,searchUsers)