import express from "express";
import {
  startGauntlet,
  submitAnswer,
  startWeaknessDrill,
  getSubjects,
} from "../controllers/gauntletController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes here are protected
router.use(protect);

router.get("/subjects", getSubjects); // <-- NEW ROUTE
router.post("/start", startGauntlet);
router.post("/submit", submitAnswer);
router.post("/start-weakness-drill", startWeaknessDrill);

export default router;
