import { Router } from "express";
import { createGroup, getGroups,getGroup } from "../controllers/groupController.js";
import { verifyToken } from "../controllers/authController.js";
import { upload } from "../middleware/multer.js";

export const groupRouter = Router()

groupRouter.get('/groups',verifyToken,getGroups)
groupRouter.get('/groups/:id',verifyToken,getGroup)
groupRouter.post('/groups',verifyToken,upload.single("image"),createGroup)