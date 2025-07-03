import express from "express";
import { register, verifyEmail, login } from "../controllers/authController.js";

const router = express.Router();

// @route   POST /api/auth/register
router.post("/register", register);

// @route   GET /api/auth/verify/:userId/:token
router.get("/verify/:userId/:token", verifyEmail);

// @route   POST /api/auth/login
router.post("/login", login);

export default router;
