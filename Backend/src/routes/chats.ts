import { Router } from "express";
import { getUsers } from "../controllers/usersController.js";
import { verifyToken } from "../controllers/authController.js";



export const chatRouter = Router()

chatRouter.get('/chats',verifyToken,getUsers)