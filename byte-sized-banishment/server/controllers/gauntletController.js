import GauntletSession from "../models/gauntletSessionModel.js";
import User from "../models/userModel.js";
import Question from "../models/questionModel.js";
import {
  selectNextQuestion,
  getDevilDialogue,
  validateAnswer,
  findWeakestLink,
  getTimerDuration,
} from "../services/aiServices.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Generate devilish punishments from JSON file
const generatePunishment = () => {
  try {
    // Read the penance.json file
    const penanceFilePath = path.join(__dirname, "../data/penance.json");
    const penanceData = fs.readFileSync(penanceFilePath, "utf8");
    const punishments = JSON.parse(penanceData);

    // Select a random punishment
    const randomIndex = Math.floor(Math.random() * punishments.length);
    return punishments[randomIndex];
  } catch (error) {
    console.error("Error reading penance.json:", error);
    // Fallback punishment if file reading fails
    return {
      task: "Reflect on your coding mistakes and try again with renewed determination.",
      quote:
        "Even the devil's files can sometimes be corrupted. Learn from this failure.",
    };
  }
};

// Handle timeout for questions
export const handleTimeout = async (req, res) => {
  const { sessionId, questionId } = req.body;
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

    // Treat timeout as incorrect answer
    session.incorrectAnswers += 1;
    session.strikesLeft -= 1;
    session.correctStreak = 0;
    session.currentQuestionIndex += 1;

    // Update difficulty progression
    updateDifficultyProgression(session, false);

    // Update user progress tracking for timeout (counts as incorrect)
    const progressKey = question.subTopic
      ? `${question.subject}-${question.subTopic}`
      : question.subject;

    if (!user.progress.has(progressKey)) {
      user.progress.set(progressKey, { correct: 0, totalAttempted: 0 });
    }
    const progress = user.progress.get(progressKey);
    progress.totalAttempted += 1;
    user.progress.set(progressKey, progress);

    // Generate timeout-specific devil dialogue
    const timeoutDialogue = getTimeoutDialogue(
      question.difficulty,
      question.type
    );

    // Check for session end conditions - Only strikes, no question limit
    if (session.strikesLeft <= 0) {
      session.isActive = false;
      session.sessionEndTime = new Date();
      session.completionReason = "failed";

      // Update user's max session streak if this session was better
      const user_update = await User.findById(req.user._id);
      if (
        !user_update.maxSessionStreak ||
        session.currentQuestionIndex - 1 > user_update.maxSessionStreak
      ) {
        user_update.maxSessionStreak = session.currentQuestionIndex - 1;
      }

      await Promise.all([session.save(), user_update.save()]);

      const punishment = generatePunishment();
      const sessionDuration = Math.round(
        (session.sessionEndTime - session.sessionStartTime) / 1000
      );

      return res.json({
        result: "timeout",
        feedback: timeoutDialogue,
        isGameOver: true,
        punishment: punishment,
        sessionSummary: {
          questionsCompleted: session.currentQuestionIndex - 1,
          totalQuestions: "Unlimited",
          correctAnswers: session.correctAnswers,
          incorrectAnswers: session.incorrectAnswers,
          finalScore: session.score,
          totalXpGained: session.totalXpGained,
          maxCorrectStreak: session.maxCorrectStreak,
          sessionDuration: sessionDuration,
          completionReason: "failed",
          highestDifficulty:
            session.difficultyProgression.length > 0
              ? Math.max(
                  ...session.difficultyProgression.map((d) =>
                    d.difficulty === "easy"
                      ? 1
                      : d.difficulty === "medium"
                      ? 2
                      : 3
                  )
                )
              : 1,
        },
      });
    }

    // Continue session - get next question
    const nextQuestion = await selectNextQuestion(session, question, false);

    if (!nextQuestion) {
      // If no more questions, end session gracefully
      session.isActive = false;
      session.sessionEndTime = new Date();
      session.completionReason = "completed";

      // Update user's max session streak
      const user_update = await User.findById(req.user._id);
      if (
        !user_update.maxSessionStreak ||
        session.currentQuestionIndex - 1 > user_update.maxSessionStreak
      ) {
        user_update.maxSessionStreak = session.currentQuestionIndex - 1;
      }

      await Promise.all([session.save(), user_update.save()]);

      const sessionDuration = Math.round(
        (session.sessionEndTime - session.sessionStartTime) / 1000
      );

      return res.json({
        result: "timeout",
        feedback: getDevilDialogue("SESSION_WIN"),
        isGameOver: true,
        sessionSummary: {
          questionsCompleted: session.currentQuestionIndex - 1,
          totalQuestions: "Unlimited",
          correctAnswers: session.correctAnswers,
          incorrectAnswers: session.incorrectAnswers,
          finalScore: session.score,
          totalXpGained: session.totalXpGained,
          maxCorrectStreak: session.maxCorrectStreak,
          sessionDuration: sessionDuration,
          completionReason: "completed",
          highestDifficulty:
            session.difficultyProgression.length > 0
              ? Math.max(
                  ...session.difficultyProgression.map((d) =>
                    d.difficulty === "easy"
                      ? 1
                      : d.difficulty === "medium"
                      ? 2
                      : 3
                  )
                )
              : 1,
        },
      });
    }

    session.questionHistory.push(nextQuestion._id);
    await Promise.all([session.save(), user.save()]);

    res.json({
      result: "timeout",
      feedback: timeoutDialogue,
      nextQuestion: nextQuestion,
      sessionProgress: {
        currentQuestion: session.currentQuestionIndex,
        totalQuestions: "Unlimited",
        correctAnswers: session.correctAnswers,
        incorrectAnswers: session.incorrectAnswers,
        currentDifficulty: session.currentDifficulty,
        correctStreak: session.correctStreak,
      },
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
    console.error("Error handling timeout:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Generate timeout-specific devil dialogue
const getTimeoutDialogue = (difficulty, questionType) => {
  const timeoutMessages = {
    easy: {
      mcq: "Too slow! Even a sloth could pick faster than that!",
      integer: "Time's up! Your calculations need more speed, mortal!",
      code: "Timeout! Your coding fingers are as slow as your brain!",
    },
    medium: {
      mcq: "Time expired! Speed is as important as accuracy in my realm!",
      integer: "Too sluggish! Mathematical prowess requires swift thinking!",
      code: "Code timeout! Your programming pace disappoints me greatly!",
    },
    hard: {
      mcq: "Pathetically slow! Elite minds don't hesitate this long!",
      integer: "Time's up! Advanced problems demand rapid solutions!",
      code: "Coding timeout! Four minutes should be plenty for a competent programmer!",
    },
  };

  const message =
    timeoutMessages[difficulty]?.[questionType] ||
    "Time's up! Speed up or face my wrath!";
  return { text: message, audioUrl: null };
};

// Difficulty progression logic
const updateDifficultyProgression = (session, isCorrect) => {
  const currentDifficulty = session.currentDifficulty;
  let newDifficulty = currentDifficulty;
  let difficultyChanged = false;

  if (isCorrect) {
    session.consecutiveCorrect += 1;
    session.consecutiveIncorrect = 0; // Reset incorrect streak

    // Easy -> Medium after 5 consecutive correct
    if (currentDifficulty === "easy" && session.consecutiveCorrect >= 5) {
      newDifficulty = "medium";
      difficultyChanged = true;
      session.consecutiveCorrect = 0; // Reset streak
    }
    // Medium -> Hard after 4 consecutive correct
    else if (
      currentDifficulty === "medium" &&
      session.consecutiveCorrect >= 4
    ) {
      newDifficulty = "hard";
      difficultyChanged = true;
      session.consecutiveCorrect = 0; // Reset streak
    }
  } else {
    session.consecutiveIncorrect += 1;
    session.consecutiveCorrect = 0; // Reset correct streak

    // Hard -> Medium after 1 incorrect
    if (currentDifficulty === "hard" && session.consecutiveIncorrect >= 1) {
      newDifficulty = "medium";
      difficultyChanged = true;
      session.consecutiveIncorrect = 0; // Reset streak
    }
    // Medium -> Easy after 2 consecutive incorrect
    else if (
      currentDifficulty === "medium" &&
      session.consecutiveIncorrect >= 2
    ) {
      newDifficulty = "easy";
      difficultyChanged = true;
      session.consecutiveIncorrect = 0; // Reset streak
    }
  }

  if (difficultyChanged) {
    session.currentDifficulty = newDifficulty;
    session.difficultyProgression.push({
      questionIndex: session.currentQuestionIndex,
      difficulty: newDifficulty,
      reason: isCorrect ? "promoted_for_streak" : "demoted_for_mistakes",
    });
  }

  return difficultyChanged;
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
    const session = new GauntletSession({
      userId: req.user._id,
      subject,
      currentDifficulty: difficulty || "easy",
      sessionStartTime: new Date(),
      totalQuestions: 999, // Unlimited questions
      consecutiveCorrect: 0, // Track consecutive correct answers for difficulty progression
      consecutiveIncorrect: 0, // Track consecutive incorrect answers for difficulty regression
    });

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

    // Add timer duration to first question
    firstQuestion.timerDuration = getTimerDuration(
      session.currentDifficulty,
      firstQuestion.type
    );

    session.questionHistory.push(firstQuestion._id);
    session.currentQuestionIndex = 1;
    await session.save();

    res.status(201).json({
      sessionId: session._id,
      question: firstQuestion,
      sessionInfo: {
        currentQuestion: 1,
        totalQuestions: "Unlimited",
        subject: session.subject,
        difficulty: session.currentDifficulty,
      },
    });
  } catch (error) {
    console.error("Error starting gauntlet:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const submitAnswer = async (req, res) => {
  const { sessionId, questionId, answer } = req.body;
  console.log("Submit answer request:", {
    sessionId,
    questionId,
    answer: answer?.length ? `${answer.length} chars` : answer,
  });

  try {
    const session = await GauntletSession.findById(sessionId);
    const question = await Question.findById(questionId);
    const user = await User.findById(req.user._id);

    console.log(
      "Session found:",
      !!session,
      "Question found:",
      !!question,
      "User found:",
      !!user
    );
    console.log(
      "Session active:",
      session?.isActive,
      "Session strikes:",
      session?.strikesLeft
    );

    if (!session || !question || !user)
      return res
        .status(404)
        .json({ message: "Session, question, or user not found." });
    if (session.userId.toString() !== req.user._id.toString())
      return res.status(401).json({ message: "Not authorized." });
    if (!session.isActive)
      return res.status(400).json({ message: "This session is over." });

    // Validate answer (now async for code execution)
    const validationResult = await validateAnswer(answer, question);
    const { isCorrect } = validationResult;

    let devilDialogue;
    let sessionXpGained = 0;
    let executionFeedback = null;

    // Store execution feedback for code questions
    if (question.type === "code" && validationResult.feedback) {
      executionFeedback = validationResult.feedback;
    }

    // Update session statistics
    if (isCorrect) {
      session.correctAnswers += 1;
      session.correctStreak += 1;
      session.maxCorrectStreak = Math.max(
        session.maxCorrectStreak,
        session.correctStreak
      );

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

      sessionXpGained = Math.round(xpGained);
      user.xp += sessionXpGained;
      user.correctAnswers += 1;
      session.score += sessionXpGained;
      session.totalXpGained += sessionXpGained;

      // Update user progress tracking for weakest link analysis
      const progressKey = question.subTopic
        ? `${question.subject}-${question.subTopic}`
        : question.subject;

      if (!user.progress.has(progressKey)) {
        user.progress.set(progressKey, { correct: 0, totalAttempted: 0 });
      }
      const progress = user.progress.get(progressKey);
      progress.correct += 1;
      progress.totalAttempted += 1;
      user.progress.set(progressKey, progress);

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
      session.incorrectAnswers += 1;
      session.strikesLeft -= 1;
      session.correctStreak = 0;

      // Update user progress tracking for incorrect answers
      const progressKey = question.subTopic
        ? `${question.subject}-${question.subTopic}`
        : question.subject;

      if (!user.progress.has(progressKey)) {
        user.progress.set(progressKey, { correct: 0, totalAttempted: 0 });
      }
      const progress = user.progress.get(progressKey);
      progress.totalAttempted += 1;
      user.progress.set(progressKey, progress);

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
    }

    // Update difficulty progression
    const difficultyChanged = updateDifficultyProgression(session, isCorrect);

    // Add difficulty change message to dialogue if applicable
    if (difficultyChanged && !devilDialogue) {
      if (isCorrect) {
        const newDiff = session.currentDifficulty;
        devilDialogue = {
          text: `Impressive streak! You've been promoted to ${newDiff.toUpperCase()} difficulty. Let's see if you can handle this!`,
        };
      } else {
        const newDiff = session.currentDifficulty;
        devilDialogue = {
          text: `Struggling, are we? Difficulty decreased to ${newDiff.toUpperCase()}. Even the devil shows mercy... sometimes.`,
        };
      }
    }

    if (!devilDialogue) {
      const trigger = isCorrect
        ? `CORRECT_ANSWER_${question.difficulty.toUpperCase()}`
        : `INCORRECT_ANSWER_${question.difficulty.toUpperCase()}`;
      devilDialogue = getDevilDialogue(trigger);
    }

    // Check for session end conditions
    session.currentQuestionIndex += 1;

    // Game Over - Lost all strikes (only end condition now)
    if (session.strikesLeft <= 0) {
      session.isActive = false;
      session.sessionEndTime = new Date();
      session.completionReason = "failed";

      // Update user's max session streak if this session was better
      if (
        !user.maxSessionStreak ||
        session.currentQuestionIndex - 1 > user.maxSessionStreak
      ) {
        user.maxSessionStreak = session.currentQuestionIndex - 1;
      }

      await Promise.all([session.save(), user.save()]);

      const punishment = generatePunishment();
      const sessionDuration = Math.round(
        (session.sessionEndTime - session.sessionStartTime) / 1000
      );

      return res.json({
        result: "incorrect",
        feedback: getDevilDialogue("GAME_OVER"),
        isGameOver: true,
        punishment: punishment,
        sessionSummary: {
          questionsCompleted: session.currentQuestionIndex - 1,
          totalQuestions: "Unlimited",
          correctAnswers: session.correctAnswers,
          incorrectAnswers: session.incorrectAnswers,
          finalScore: session.score,
          totalXpGained: session.totalXpGained,
          maxCorrectStreak: session.maxCorrectStreak,
          sessionDuration: sessionDuration,
          completionReason: "failed",
          highestDifficulty:
            session.difficultyProgression.length > 0
              ? Math.max(
                  ...session.difficultyProgression.map((d) =>
                    d.difficulty === "easy"
                      ? 1
                      : d.difficulty === "medium"
                      ? 2
                      : 3
                  )
                )
              : 1,
        },
      });
    }

    // Continue session - get next question (no question limit)
    const nextQuestion = await selectNextQuestion(session, question, isCorrect);

    if (!nextQuestion) {
      // No more questions available - graceful end
      session.isActive = false;
      session.sessionEndTime = new Date();
      session.completionReason = "completed";

      // Update user's max session streak
      if (
        !user.maxSessionStreak ||
        session.currentQuestionIndex - 1 > user.maxSessionStreak
      ) {
        user.maxSessionStreak = session.currentQuestionIndex - 1;
      }

      await Promise.all([session.save(), user.save()]);

      const sessionDuration = Math.round(
        (session.sessionEndTime - session.sessionStartTime) / 1000
      );

      return res.json({
        result: isCorrect ? "correct" : "incorrect",
        feedback: getDevilDialogue("SESSION_WIN"),
        isGameOver: true,
        sessionSummary: {
          questionsCompleted: session.currentQuestionIndex - 1,
          totalQuestions: "Unlimited",
          correctAnswers: session.correctAnswers,
          incorrectAnswers: session.incorrectAnswers,
          finalScore: session.score,
          totalXpGained: session.totalXpGained,
          maxCorrectStreak: session.maxCorrectStreak,
          sessionDuration: sessionDuration,
          completionReason: "completed",
          highestDifficulty:
            session.difficultyProgression.length > 0
              ? Math.max(
                  ...session.difficultyProgression.map((d) =>
                    d.difficulty === "easy"
                      ? 1
                      : d.difficulty === "medium"
                      ? 2
                      : 3
                  )
                )
              : 1,
        },
      });
    }

    session.questionHistory.push(nextQuestion._id);
    await Promise.all([session.save(), user.save()]);

    res.json({
      result: isCorrect ? "correct" : "incorrect",
      feedback: devilDialogue,
      executionFeedback: executionFeedback, // Add execution feedback for code questions
      nextQuestion: nextQuestion,
      sessionProgress: {
        currentQuestion: session.currentQuestionIndex,
        totalQuestions: "Unlimited",
        correctAnswers: session.correctAnswers,
        incorrectAnswers: session.incorrectAnswers,
        currentDifficulty: session.currentDifficulty,
        correctStreak: session.correctStreak,
        consecutiveCorrect: session.consecutiveCorrect,
        consecutiveIncorrect: session.consecutiveIncorrect,
      },
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

    const weaknessString = findWeakestLink(user.progress);

    if (!weaknessString) {
      return res.status(400).json({
        message: "The Devil hasn't found your weakness yet. Play more trials!",
      });
    }

    // Parse the weakness string back to get subject and subTopic
    // Format: "SubTopic (Subject)" or just "Subject"
    let subject, subTopic;
    const match = weaknessString.match(/^(.+?)\s*\((.+?)\)$/);
    if (match) {
      subTopic = match[1].trim();
      subject = match[2].trim();
    } else {
      subject = weaknessString;
      subTopic = null;
    }

    // Build query for drill questions
    const query = { subject };
    if (subTopic) {
      query.subTopic = subTopic;
    }

    const drillQuestions = await Question.find(query).limit(5);

    if (drillQuestions.length === 0) {
      return res.status(404).json({
        message: `Could not find any drill questions for ${weaknessString}.`,
      });
    }

    const session = new GauntletSession({
      userId,
      subject: `Weakness Drill: ${weaknessString}`,
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

// Handle voluntary session quit
export const quitSession = async (req, res) => {
  const { sessionId } = req.body;
  try {
    const session = await GauntletSession.findById(sessionId);
    const user = await User.findById(req.user._id);

    if (!session || !user)
      return res.status(404).json({ message: "Session or user not found." });

    if (session.userId.toString() !== req.user._id.toString())
      return res.status(401).json({ message: "Not authorized." });

    if (!session.isActive)
      return res.status(400).json({ message: "This session is already over." });

    // End the session
    session.isActive = false;
    session.sessionEndTime = new Date();
    session.completionReason = "abandoned";

    // Update user's max session streak if this session was better
    if (
      !user.maxSessionStreak ||
      session.currentQuestionIndex > user.maxSessionStreak
    ) {
      user.maxSessionStreak = session.currentQuestionIndex;
    }

    await Promise.all([session.save(), user.save()]);

    const sessionDuration = Math.round(
      (session.sessionEndTime - session.sessionStartTime) / 1000
    );

    res.json({
      message: "Session ended voluntarily",
      sessionSummary: {
        questionsCompleted: session.currentQuestionIndex,
        totalQuestions: "Unlimited",
        correctAnswers: session.correctAnswers,
        incorrectAnswers: session.incorrectAnswers,
        finalScore: session.score,
        totalXpGained: session.totalXpGained,
        maxCorrectStreak: session.maxCorrectStreak,
        sessionDuration: sessionDuration,
        completionReason: "abandoned",
        highestDifficulty:
          session.difficultyProgression.length > 0
            ? Math.max(
                ...session.difficultyProgression.map((d) =>
                  d.difficulty === "easy"
                    ? 1
                    : d.difficulty === "medium"
                    ? 2
                    : 3
                )
              )
            : 1,
      },
    });
  } catch (error) {
    console.error("Error quitting session:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
