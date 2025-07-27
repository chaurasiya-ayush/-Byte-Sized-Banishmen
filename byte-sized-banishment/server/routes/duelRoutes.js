import express from "express";
import {
  createDuel,
  getDuels,
  getDuelDetails,
  submitDuelScore,
} from "../controllers/duelController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes here are protected
router.use(protect);

router.post("/challenge", createDuel);
router.get("/", getDuels);
router.get("/:duelId", getDuelDetails);
router.post("/submit/:duelId", submitDuelScore);

export default router;
