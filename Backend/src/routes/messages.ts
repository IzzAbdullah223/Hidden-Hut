import { Router } from "express";
import { getMessages,postMessage,deleteMessage} from "../controllers/messagesController.js";
import { verifyToken } from "../controllers/authController.js";
import { upload } from "../middleware/multer.js";

export const messagesRouter = Router()

messagesRouter.get('/global/messages',getMessages)
messagesRouter.post('/global/messages',verifyToken,upload.single('image'),postMessage)
messagesRouter.delete('/global/messages',verifyToken,deleteMessage)
