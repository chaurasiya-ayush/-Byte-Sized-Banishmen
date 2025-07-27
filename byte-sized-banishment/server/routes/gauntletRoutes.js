import express from "express";
import {
  startGauntlet,
  submitAnswer,
  startWeaknessDrill,
} from "../controllers/gauntletController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes here are protected
router.use(protect);

router.post("/start", startGauntlet);
router.post("/submit", submitAnswer);
router.post("/start-weakness-drill", startWeaknessDrill); // <-- NEW ROUTE

export default router;
