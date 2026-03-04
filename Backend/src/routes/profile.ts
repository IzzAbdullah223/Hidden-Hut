import   { Router } from "express";
import { verifyToken } from "../controllers/authController.js";
import { getProfile,changeProfilePicture,editProfile,changePassword } from "../controllers/profileController.js";
import { upload } from "../middleware/multer.js";

export const profileRouter = Router()

profileRouter.get('/profile/:id',verifyToken,getProfile)
profileRouter.post('/profile/:id/picture',verifyToken,upload.single('image'),changeProfilePicture)
profileRouter.post('/profile/edit/:id',editProfile)
profileRouter.post('/profile/change/password/:id',changePassword)