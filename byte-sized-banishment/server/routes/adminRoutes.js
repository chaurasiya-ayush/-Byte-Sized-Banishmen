import express from "express";
import Question from "../models/questionModel.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Bulk upload questions (admin only)
router.post("/questions/bulk-upload", authenticateToken, async (req, res) => {
  try {
    const { questions } = req.body;

    // Validate questions format
    if (!Array.isArray(questions)) {
      return res.status(400).json({
        success: false,
        message: "Questions must be an array",
      });
    }

    // Validate each question has required fields
    for (const question of questions) {
      if (
        !question.subject ||
        !question.type ||
        !question.difficulty ||
        !question.prompt
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Each question must have subject, type, difficulty, and prompt",
        });
      }
    }

    // Insert questions
    const result = await Question.insertMany(questions);

    res.json({
      success: true,
      message: `Successfully uploaded ${result.length} questions`,
      insertedCount: result.length,
    });
  } catch (error) {
    console.error("Error uploading questions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload questions",
      error: error.message,
    });
  }
});

export default router;
