import express from "express";
import {
  startGauntlet,
  submitAnswer,
} from "../controllers/gauntletController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes here are protected and require a valid token
router.use(protect);

router.post("/start", startGauntlet);
router.post("/submit", submitAnswer);

export default router;
