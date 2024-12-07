import express from "express";
import { config } from "dotenv";
import cors from "cors";
import userRoutes from "./src/routes/userRoutes.js";
import escrowRoutes from "./src/routes/escrowRoutes.js";

// Initialize environment variables
config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/escrow", escrowRoutes);

// Server Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
