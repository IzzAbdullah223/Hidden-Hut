import { Router } from "express";
import { getProfile } from "../controllers/profileController.js";

export const profileRouter = Router()

profileRouter.get('/profile/:id',getProfile)