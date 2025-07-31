import express from "express";
import {
  register,
  verifyEmail,
  login,
  forgotPassword,
  verifyResetToken,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

// @route   POST /api/auth/register
router.post("/register", register);

// @route   GET /api/auth/verify/:userId/:token
router.get("/verify/:userId/:token", verifyEmail);

// @route   POST /api/auth/login
router.post("/login", login);

// @route   POST /api/auth/forgot-password
router.post("/forgot-password", forgotPassword);

// @route   GET /api/auth/verify-reset-token/:token
router.get("/verify-reset-token/:token", verifyResetToken);

// @route   POST /api/auth/reset-password
router.post("/reset-password", resetPassword);

export default router;
