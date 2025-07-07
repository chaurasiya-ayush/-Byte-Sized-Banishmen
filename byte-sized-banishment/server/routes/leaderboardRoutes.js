import express from "express";
import { getLeaderboard } from "../controllers/leaderboardController.js";

const router = express.Router();

// This is a public route, anyone can view the leaderboard
router.get("/", getLeaderboard);

export default router;
