import { Router } from "express";
import {
  createTaskHandler,
  completeTaskHandler,
  getTaskHandler,
} from "../controllers/escrowController.js";

const router = Router();

router.post("/create-task", createTaskHandler);
router.post("/complete-task", completeTaskHandler);
router.get("/get-task/:taskId", getTaskHandler);

export default router;
