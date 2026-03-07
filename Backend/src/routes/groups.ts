import { Router } from "express";
import { getGroups } from "../controllers/groupController.js";
import { verifyToken } from "../controllers/authController.js";

export const groupRouter = Router()

groupRouter.get('/groups',verifyToken,getGroups)