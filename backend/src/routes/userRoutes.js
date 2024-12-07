import { Router } from "express";
import {
  createUser,
  getUser,
  verifyUserHandler,
} from "../controllers/userController.js";

const router = Router();

router.post("/create", createUser); // Create user
router.get("/get-user/:userId", getUser); // Get user by ID
router.get("/verify-user/:userId", verifyUserHandler); // Verify user

export default router;
