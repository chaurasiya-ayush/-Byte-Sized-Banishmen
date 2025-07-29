import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Question from "../models/questionModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dialoguePath = path.join(__dirname, "../data/dialogueWithAudio.json");
let dialogueLines = {};
try {
  dialogueLines = JSON.parse(fs.readFileSync(dialoguePath));
} catch (error) {
  console.error("Could not read dialogueWithAudio.json.", error);
}

// --- Engine 1: Enhanced Adaptive Question Selector ---
async function selectNextQuestion(session, lastQuestion, isCorrect) {
  const difficultyOrder = ["easy", "medium", "hard"];

  let nextDifficulty = session.currentDifficulty;
  let difficultyReason = "same";

  // Adaptive difficulty logic
  if (isCorrect) {
    session.correctStreak += 1;

    // Increase difficulty based on performance
    if (session.correctStreak >= 3 && nextDifficulty === "easy") {
      nextDifficulty = "medium";
      difficultyReason = "correct_streak_3";
    } else if (session.correctStreak >= 5 && nextDifficulty === "medium") {
      nextDifficulty = "hard";
      difficultyReason = "correct_streak_5";
    }
  } else {
    // Reset streak and potentially decrease difficulty
    session.correctStreak = 0;

    // Decrease difficulty if struggling
    if (session.strikesLeft <= 1 && nextDifficulty === "hard") {
      nextDifficulty = "medium";
      difficultyReason = "low_strikes_hard";
    } else if (session.strikesLeft <= 1 && nextDifficulty === "medium") {
      nextDifficulty = "easy";
      difficultyReason = "low_strikes_medium";
    }

    // Additional difficulty adjustment based on recent performance
    const recentQuestions = session.questionHistory.slice(-5);
    if (recentQuestions.length >= 3) {
      const recentIncorrect = session.incorrectAnswers;
      const totalRecent = session.correctAnswers + session.incorrectAnswers;
      const recentAccuracy = session.correctAnswers / totalRecent;

      if (recentAccuracy < 0.4 && nextDifficulty !== "easy") {
        nextDifficulty =
          difficultyOrder[
            Math.max(0, difficultyOrder.indexOf(nextDifficulty) - 1)
          ];
        difficultyReason = "low_recent_accuracy";
      }
    }
  }

  // Build query to find next question
  let queryOptions = {
    subject: session.subject,
    _id: { $nin: session.questionHistory }, // Exclude already asked questions
    difficulty: nextDifficulty,
  };

  // Try to find a question with the target difficulty
  let nextQuestion = await Question.findOne(queryOptions);

  // Fallback: try other difficulties if none found
  if (!nextQuestion) {
    delete queryOptions.difficulty;

    // Try each difficulty level
    for (const difficulty of difficultyOrder) {
      queryOptions.difficulty = difficulty;
      nextQuestion = await Question.findOne(queryOptions);
      if (nextQuestion) {
        nextDifficulty = difficulty;
        difficultyReason = "fallback_available";
        break;
      }
    }
  }

  // Final fallback: any question in subject not yet asked
  if (!nextQuestion) {
    delete queryOptions.difficulty;
    nextQuestion = await Question.findOne(queryOptions);
    if (nextQuestion) {
      nextDifficulty = nextQuestion.difficulty;
      difficultyReason = "fallback_any";
    }
  }

  // Update session difficulty tracking and add timer duration
  if (nextQuestion) {
    session.currentDifficulty = nextDifficulty;
    session.difficultyProgression.push({
      questionIndex: session.currentQuestionIndex + 1,
      difficulty: nextDifficulty,
      reason: difficultyReason,
    });

    // Add timer duration based on difficulty and question type
    nextQuestion.timerDuration = getTimerDuration(
      nextDifficulty,
      nextQuestion.type
    );
  }

  return nextQuestion;
}

// --- Timer Duration Calculator ---
function getTimerDuration(difficulty, questionType) {
  const timers = {
    easy: {
      mcq: 30, // 30 seconds
      integer: 45, // 45 seconds
      code: 60, // 1 minute
    },
    medium: {
      mcq: 45, // 45 seconds
      integer: 60, // 1 minute
      code: 180, // 3 minutes
    },
    hard: {
      mcq: 180, // 3 minutes
      integer: 300, // 5 minutes
      code: 600, // 10 minutes
    },
  };

  const duration = timers[difficulty]?.[questionType] || 30; // Default 30 seconds
  console.log(
    `[DEBUG] Timer Duration - Difficulty: ${difficulty}, Type: ${questionType}, Duration: ${duration}s`
  );
  return duration;
}

// --- Engine 2: Dynamic Persona ---
function getDevilDialogue(trigger) {
  const lines = dialogueLines[trigger] || [];
  if (lines.length === 0) return { text: "...", audioUrl: null };
  return lines[Math.floor(Math.random() * lines.length)];
}

// --- Engine 3: Simple Answer Validator ---
function validateAnswer(userAnswer, question) {
  // Note: This only handles simple cases. Code validation is handled elsewhere.
  let isCorrect = false;
  if (question.type === "mcq" || question.type === "integer") {
    isCorrect = userAnswer.toString() === question.correctAnswer.toString();
  }
  return { isCorrect };
}

// --- "WEAKEST LINK" ANALYZER (FIXED) ---
function findWeakestLink(userProgress) {
  let weakestTopicKey = null;
  let lowestScore = 1.0; // Start with a perfect score (100%)
  const MINIMUM_ATTEMPTS = 3;

  for (const [key, progress] of userProgress.entries()) {
    if (progress.totalAttempted >= MINIMUM_ATTEMPTS) {
      const successRate = progress.correct / progress.totalAttempted;
      if (successRate < lowestScore) {
        lowestScore = successRate;
        weakestTopicKey = key;
      }
    }
  }

  // If a weakness is found, return it as a formatted string
  if (weakestTopicKey) {
    const [subject, subTopic] = weakestTopicKey.split("-");
    // Return formatted string for frontend display
    return subTopic ? `${subTopic} (${subject})` : subject;
  }

  // Return null if no weakness meets the criteria
  return null;
}

export {
  selectNextQuestion,
  getDevilDialogue,
  validateAnswer,
  findWeakestLink,
  getTimerDuration,
};
