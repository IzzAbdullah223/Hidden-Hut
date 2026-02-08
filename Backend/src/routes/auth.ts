import passport from "passport";
import { Router } from "express";
import { signUpPost } from "../controllers/authController.js";

export const authRouter = Router()


authRouter.post("/signup",signUpPost)
//authRouter.post('/Login',passport.authenticate("local",{session:false}))