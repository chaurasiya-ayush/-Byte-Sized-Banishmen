import GauntletSession from "../models/gauntletSessionModel.js";
import User from "../models/userModel.js";
import Question from "../models/questionModel.js";
import {
  selectNextQuestion,
  getDevilDialogue,
  validateAnswer,
} from "../services/aiServices.js";

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

    if (!session || session.userId.toString() !== req.user._id.toString())
      return res.status(401).json({ message: "Not authorized." });
    if (!session.isActive)
      return res.status(400).json({ message: "This session is over." });

    const { isCorrect } = validateAnswer(answer, question);
    let devilDialogue;

    // --- START of Blessings & Curses Logic ---
    if (isCorrect) {
      session.correctStreak += 1;
      let xpGained = XP_VALUES[question.difficulty] || 10;

      // 1. Check for and apply active effect
      if (
        user.activeEffect &&
        user.activeEffect.type &&
        user.activeEffect.expiresAt > new Date()
      ) {
        xpGained *= user.activeEffect.modifier;
      } else if (
        user.activeEffect &&
        user.activeEffect.type &&
        user.activeEffect.expiresAt <= new Date()
      ) {
        user.activeEffect = {
          type: null,
          name: null,
          modifier: 1,
          expiresAt: null,
        }; // Clear expired effect
      }

      user.xp += Math.round(xpGained);
      user.correctAnswers += 1;
      session.score += Math.round(xpGained);

      // 2. Check for new Blessing trigger
      if (session.correctStreak === 5 && !user.activeEffect.type) {
        user.activeEffect = {
          type: "blessing",
          name: "Feverish Focus",
          modifier: 1.5, // 1.5x XP
          expiresAt: new Date(Date.now() + 5 * 60 * 1000), // Expires in 5 minutes
        };
        devilDialogue = {
          text: "A 5-win streak... Impressive. You've been blessed with Feverish Focus, granting 1.5x XP for 5 minutes.",
        };
      }

      if (user.xp >= user.xpToNextLevel) {
        user.level += 1;
        user.xp -= user.xpToNextLevel;
        user.xpToNextLevel = user.level * 150;
        user.rank = getRankForLevel(user.level);
        devilDialogue = {
          text: `You've reached Level ${user.level}! Your new rank is ${user.rank}. Don't get cocky.`,
        };
      }
    } else {
      session.strikesLeft -= 1;
      // 3. Check for new Curse trigger
      if (
        session.correctStreak === 0 &&
        session.strikesLeft === 1 &&
        !user.activeEffect.type
      ) {
        user.activeEffect = {
          type: "curse",
          name: "Crippling Doubt",
          modifier: 0.5, // Half XP
          expiresAt: new Date(Date.now() + 5 * 60 * 1000), // Expires in 5 minutes
        };
        devilDialogue = {
          text: "You're faltering. You've been cursed with Crippling Doubt! Your XP gains are halved for 5 minutes.",
        };
      }
      session.correctStreak = 0;
    }

    if (!devilDialogue) {
      const trigger = isCorrect
        ? `CORRECT_ANSWER_${question.difficulty.toUpperCase()}`
        : `INCORRECT_ANSWER_${question.difficulty.toUpperCase()}`;
      devilDialogue = getDevilDialogue(trigger);
    }
    // --- END of Blessings & Curses Logic ---

    if (session.strikesLeft <= 0) {
      session.isActive = false;
      await Promise.all([session.save(), user.save()]);
      return res.json({
        result: "incorrect",
        feedback: getDevilDialogue("GAME_OVER"),
        isGameOver: true,
      });
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
