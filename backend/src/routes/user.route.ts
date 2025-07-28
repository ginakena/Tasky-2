import { Router } from "express";
import { updateUserProfile } from "../controller/auth.controller";
import { authenticate } from "../middleware/userMiddleware";

const router = Router()

router.patch("/", authenticate, updateUserProfile)

export default router