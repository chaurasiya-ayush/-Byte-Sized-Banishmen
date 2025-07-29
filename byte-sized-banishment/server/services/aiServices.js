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

// --- Engine 1: Adaptive Question Selector ---
async function selectNextQuestion(session, lastQuestion, isCorrect) {
  const difficultyOrder = ["easy", "medium", "hard"];
  const lastDifficultyIndex = difficultyOrder.indexOf(lastQuestion.difficulty);

  let nextDifficulty;
  let queryOptions = {
    subject: session.subject,
    _id: { $nin: session.questionHistory },
  };

  if (isCorrect) {
    if (lastDifficultyIndex < 2) {
      if (lastQuestion.difficulty === "medium" && session.correctStreak >= 2) {
        nextDifficulty = "hard";
      } else {
        nextDifficulty = difficultyOrder[lastDifficultyIndex + 1];
      }
    } else {
      nextDifficulty = "hard";
    }
  } else {
    if (lastDifficultyIndex > 0) {
      nextDifficulty = difficultyOrder[lastDifficultyIndex - 1];
    } else {
      nextDifficulty = "easy";
    }
    if (lastQuestion.subTopic) {
      queryOptions.subTopic = lastQuestion.subTopic;
    }
  }

  queryOptions.difficulty = nextDifficulty;
  let nextQuestion = await Question.findOne(queryOptions);

  if (!nextQuestion) {
    delete queryOptions.subTopic;
    nextQuestion = await Question.findOne(queryOptions);
  }

  if (!nextQuestion) {
    delete queryOptions.difficulty;
    nextQuestion = await Question.findOne(queryOptions);
  }

  return nextQuestion;
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
};
