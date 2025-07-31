import express from "express";
import {
  startGauntlet,
  submitAnswer,
  handleTimeout,
  startWeaknessDrill,
  getSubjects,
  quitSession,
} from "../controllers/gauntletController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes here are protected
router.use(protect);

router.get("/subjects", getSubjects);
router.post("/start", startGauntlet);
router.post("/submit", submitAnswer);
router.post("/timeout", handleTimeout);
router.post("/quit", quitSession);
router.post("/start-weakness-drill", startWeaknessDrill);

export default router;
