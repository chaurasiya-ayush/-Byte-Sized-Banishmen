import GauntletSession from "../models/gauntletSessionModel.js";
import User from "../models/userModel.js";
import Question from "../models/questionModel.js";
import {
  selectNextQuestion,
  getDevilDialogue,
  validateAnswer,
  findWeakestLink,
} from "../services/aiServices.js";

// --- Helper Functions ---
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

// --- Controller Functions ---

// Get available subjects
export const getSubjects = async (req, res) => {
  try {
    // Get unique subjects from the Question collection
    const subjects = await Question.distinct("subject");

    // If no subjects found in database, return default subjects
    if (!subjects || subjects.length === 0) {
      return res.json({
        success: true,
        subjects: ["JavaScript", "Python", "Data Structures"],
        message: "Using default subjects",
      });
    }

    res.json({
      success: true,
      subjects: subjects.sort(), // Sort alphabetically
      message: "Subjects retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch subjects",
      subjects: ["JavaScript", "Python", "Data Structures"], // Fallback
    });
  }
};

export const startGauntlet = async (req, res) => {
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
    console.error("Error starting gauntlet:", error);
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

    if (isCorrect) {
      session.correctStreak += 1;
      let xpGained = XP_VALUES[question.difficulty] || 10;

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
        };
      }

      user.xp += Math.round(xpGained);
      user.correctAnswers += 1;
      session.score += Math.round(xpGained);

      if (session.correctStreak === 5 && !user.activeEffect.type) {
        user.activeEffect = {
          type: "blessing",
          name: "Feverish Focus",
          modifier: 1.5,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000),
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
      if (
        session.correctStreak === 0 &&
        session.strikesLeft === 1 &&
        !user.activeEffect.type
      ) {
        user.activeEffect = {
          type: "curse",
          name: "Crippling Doubt",
          modifier: 0.5,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000),
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

export const startWeaknessDrill = async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    const weakness = findWeakestLink(user.progress);

    if (!weakness) {
      return res.status(400).json({
        message: "The Devil hasn't found your weakness yet. Play more trials!",
      });
    }

    const drillQuestions = await Question.find({
      subject: weakness.subject,
      subTopic: weakness.subTopic,
    }).limit(5);

    if (drillQuestions.length === 0) {
      return res.status(404).json({
        message: `Could not find any drill questions for ${weakness.subTopic}.`,
      });
    }

    const session = new GauntletSession({
      userId,
      subject: `Weakness Drill: ${weakness.subTopic}`,
    });

    const firstQuestion = drillQuestions[0];
    session.questionHistory.push(firstQuestion._id);
    await session.save();

    res.status(201).json({
      message: `Weakness Drill started!`,
      sessionId: session._id,
      question: firstQuestion,
      drillQuestionIds: drillQuestions.map((q) => q._id),
    });
  } catch (error) {
    console.error("Error starting weakness drill:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
