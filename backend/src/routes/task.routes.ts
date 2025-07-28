import { Router } from 'express';
import { createTask, getTasks, getTaskById, updateTask, deleteTask, restoreTask, markTaskComplete, markTaskIncomplete } from '../controller/task.controller';
import { authenticate } from '../middleware/userMiddleware';

const router = Router();

router.post("/", authenticate, createTask); 
router.get("/", authenticate, getTasks);
router.get("/:id", authenticate, getTaskById);
router.patch("/:id", authenticate, updateTask);
router.delete("/:id", authenticate, deleteTask);
router.patch("/restore/:id", authenticate, restoreTask);
router.patch("/complete/:id", authenticate, markTaskComplete);
router.patch("/incomplete/:id", authenticate, markTaskIncomplete);



export default router;