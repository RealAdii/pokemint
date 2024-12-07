import { Router } from "express";
import {
  createTask,
  completeTask,
  getTask,
} from "../controllers/escrowController";

const router = Router();

router.post("/create-task", createTask);
router.post("/complete-task", completeTask);
router.get("/get-task/:taskId", getTask);

export default router;
