import { Router } from "express";
import { createUser, getUser } from "../controllers/userController.js";

const router = Router();

router.post("/create", createUser); // Create user
router.get("/:userId", getUser); // Get user by ID

export default router;