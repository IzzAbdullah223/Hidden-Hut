import passport from "passport";
import { Router } from "express";

const authRouter = Router()

authRouter.post('/Login',passport.authenticate("local",{session:false}))