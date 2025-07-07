import express from "express";
import { getSkillTree } from "../controllers/skillTreeController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes here are protected
router.use(protect);

router.get("/:subject", getSkillTree);

export default router;
