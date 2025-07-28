import { Router } from 'express';
import { loginUser, registerUser, logoutUser, updatePassword } from '../controller/auth.controller';
import { verifyUserInformation } from '../middleware/verifyUserInformation';
import { checkExistingUser } from '../middleware/existingUser';
import { verifyPassword } from '../middleware/verifyPassword';
import { authenticate } from '../middleware/userMiddleware';

const router = Router();

router.post("/Register", verifyUserInformation, checkExistingUser, verifyPassword, registerUser);
router.post("/Login", loginUser);
router.post("/logout", logoutUser);
router.patch("/password", authenticate, updatePassword);

export default router;