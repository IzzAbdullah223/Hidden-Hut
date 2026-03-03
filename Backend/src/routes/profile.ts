import { Router } from "express";
import { verifyToken } from "../controllers/authController.js";
import { getProfile,changeProfilePicture } from "../controllers/profileController.js";
import { upload } from "../middleware/multer.js";

export const profileRouter = Router()

profileRouter.get('/profile/:id',verifyToken,getProfile)
profileRouter.post('/profile/:id',verifyToken,upload.single('image'),changeProfilePicture)