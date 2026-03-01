import { Router } from "express";
import { getMessages,postMessage,deleteMessage} from "../controllers/messagesController.js";
import { verifyToken } from "../controllers/authController.js";
import { upload } from "../middleware/multer.js";

export const globalRouter = Router()

globalRouter.get('/global/messages',getMessages)
globalRouter.post('/global/messages',verifyToken,upload.single('image'),postMessage)
globalRouter.delete('/global/messages',verifyToken,deleteMessage)
