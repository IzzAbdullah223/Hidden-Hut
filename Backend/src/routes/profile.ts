import   { Router } from "express";
import { verifyToken } from "../controllers/authController.js";
import { getProfile,changeProfilePicture,editProfile,changePassword,changeProfileBanner} from "../controllers/profileController.js";
import { upload } from "../middleware/multer.js";

export const profileRouter = Router()

profileRouter.get('/profile/:id',verifyToken,getProfile)
profileRouter.post('/profile/:id/picture',verifyToken,upload.single('image'),changeProfilePicture)
profileRouter.post('/profile/banner',verifyToken,upload.single('image'),changeProfileBanner)
profileRouter.post('/profile/edit/:id',editProfile)
profileRouter.post('/profile/change/password',verifyToken,changePassword)

