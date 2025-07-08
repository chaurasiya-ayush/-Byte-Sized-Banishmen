import GauntletSession from "../models/gauntletSessionModel.js";
import User from "../models/userModel.js";
import Question from "../models/questionModel.js";
import {
  selectNextQuestion,
  getDevilDialogue,
  validateAnswer,
} from "../services/aiServices.js";
import fs from "fs"; // Import the file system module
import path from "path";
import { fileURLToPath } from "url";

// --- Load Penance Data ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const penancePath = path.join(__dirname, "../data/penance.json");
let penances = [];
try {
  const rawData = fs.readFileSync(penancePath);
  penances = JSON.parse(rawData);
} catch (error) {
  console.error("Could not read or parse penance.json.", error);
}

// ... (Helper functions like getRankForLevel remain the same)
const XP_VALUES = { easy: 10, medium: 25, hard: 50 };
const RANK_THRESHOLDS = {
  1: "Novice",
  5: "Code Imp",
  10: "Byte Fiend",
  20: "Code Devil",
};
const getRankForLevel = (level) => {
  let currentRank = "Novice";
  for (const threshold in RANK_THRESHOLDS) {
    if (level >= threshold) currentRank = RANK_THRESHOLDS[threshold];
  }
  return currentRank;
};

export const startGauntlet = async (req, res) => {
  // This function remains the same
  const { subject, difficulty } = req.body;
  try {
    const session = new GauntletSession({ userId: req.user._id, subject });
    const mockLastQuestion = {
      difficulty: difficulty === "easy" ? "easy" : "medium",
    };
    const firstQuestion = await selectNextQuestion(
      session,
      mockLastQuestion,
      true
    );
    if (!firstQuestion)
      return res
        .status(404)
        .json({ message: `No questions found for subject: ${subject}` });
    session.questionHistory.push(firstQuestion._id);
    await session.save();
    res.status(201).json({ sessionId: session._id, question: firstQuestion });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const submitAnswer = async (req, res) => {
  const { sessionId, questionId, answer } = req.body;
  try {
    const session = await GauntletSession.findById(sessionId);
    const question = await Question.findById(questionId);
    const user = await User.findById(req.user._id);

    if (!session || !question || !user)
      return res
        .status(404)
        .json({ message: "Session, question, or user not found." });
    if (session.userId.toString() !== req.user._id.toString())
      return res.status(401).json({ message: "Not authorized." });
    if (!session.isActive)
      return res.status(400).json({ message: "This session is over." });

    const { isCorrect } = validateAnswer(answer, question);
    let devilDialogue;

    // ... (Progress Tracking, Blessings/Curses, and XP logic remains the same)
    if (isCorrect) {
      // ...
    } else {
      session.strikesLeft -= 1;
      session.correctStreak = 0;
      // ...
    }

    // --- GAME OVER LOGIC WITH PENANCE ---
    if (session.strikesLeft <= 0) {
      session.isActive = false;
      await session.save();
      await user.save();

      // Randomly select a penance
      const randomPenance =
        penances[Math.floor(Math.random() * penances.length)];

      return res.json({
        result: "incorrect",
        feedback: getDevilDialogue("GAME_OVER"),
        isGameOver: true,
        punishment: {
          // <-- SEND THE PENANCE
          type: "penance",
          task: randomPenance.task,
          quote: randomPenance.quote,
        },
      });
    }

    if (!devilDialogue) {
      const trigger = isCorrect
        ? `CORRECT_ANSWER_${question.difficulty.toUpperCase()}`
        : `INCORRECT_ANSWER_${question.difficulty.toUpperCase()}`;
      devilDialogue = getDevilDialogue(trigger);
    }

    const nextQuestion = await selectNextQuestion(session, question, isCorrect);

    if (!nextQuestion) {
      session.isActive = false;
      await Promise.all([session.save(), user.save()]);
      return res.json({
        result: "correct",
        feedback: getDevilDialogue("SESSION_WIN"),
        isGameOver: true,
      });
    }

    session.questionHistory.push(nextQuestion._id);
    await Promise.all([session.save(), user.save()]);

    res.json({
      result: isCorrect ? "correct" : "incorrect",
      feedback: devilDialogue,
      nextQuestion: nextQuestion,
      updatedStats: {
        strikesLeft: session.strikesLeft,
        score: session.score,
        xp: user.xp,
        level: user.level,
        rank: user.rank,
        xpToNextLevel: user.xpToNextLevel,
        activeEffect: user.activeEffect,
      },
    });
  } catch (error) {
    console.error("Error submitting answer:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
