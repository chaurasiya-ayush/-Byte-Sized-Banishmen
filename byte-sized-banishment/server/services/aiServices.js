import Question from "../models/questionModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dialoguePath = path.join(__dirname, "../data/dialogueWithAudio.json");
let dialogueLines = {};
try {
  dialogueLines = JSON.parse(fs.readFileSync(dialoguePath));
} catch (error) {
  console.error("Could not read dialogueWithAudio.json.", error);
}

// --- Engine 1: Adaptive Question Selector (UPGRADED) ---
async function selectNextQuestion(session, lastQuestion, isCorrect) {
  const difficultyOrder = ["easy", "medium", "hard"];
  const lastDifficultyIndex = difficultyOrder.indexOf(lastQuestion.difficulty);

  let nextDifficulty;
  let queryOptions = {
    subject: session.subject,
    _id: { $nin: session.questionHistory }, // Exclude questions already asked
  };

  if (isCorrect) {
    // If correct, try to increase difficulty
    if (lastDifficultyIndex < 2) {
      // Not hard
      // If they have a streak of 2 on medium, try a hard one
      if (lastQuestion.difficulty === "medium" && session.correctStreak >= 2) {
        nextDifficulty = "hard";
      } else {
        nextDifficulty = difficultyOrder[lastDifficultyIndex + 1];
      }
    } else {
      nextDifficulty = "hard"; // Stay on hard if correct
    }
  } else {
    // Incorrect
    // If incorrect, drop difficulty and focus on the same sub-topic to reinforce
    if (lastDifficultyIndex > 0) {
      // Not easy
      nextDifficulty = difficultyOrder[lastDifficultyIndex - 1];
    } else {
      nextDifficulty = "easy"; // Stay on easy if incorrect
    }
    // Add sub-topic to the query to find a reinforcing question
    if (lastQuestion.subTopic) {
      queryOptions.subTopic = lastQuestion.subTopic;
    }
  }

  queryOptions.difficulty = nextDifficulty;

  let nextQuestion = await Question.findOne(queryOptions);

  // Fallback logic: If no specific question is found (e.g., no easy questions left for that sub-topic),
  // broaden the search by removing the sub-topic constraint.
  if (!nextQuestion) {
    delete queryOptions.subTopic;
    nextQuestion = await Question.findOne(queryOptions);
  }

  // Final fallback: If still no question, try any difficulty.
  if (!nextQuestion) {
    delete queryOptions.difficulty;
    nextQuestion = await Question.findOne(queryOptions);
  }

  return nextQuestion;
}

// --- Engine 2 & 3 (Remain the same) ---
function getDevilDialogue(trigger) {
  const lines = dialogueLines[trigger] || [];
  if (lines.length === 0) return { text: "...", audioUrl: null };
  return lines[Math.floor(Math.random() * lines.length)];
}

function validateAnswer(userAnswer, question) {
  let isCorrect = false;
  if (question.type === "mcq" || question.type === "integer") {
    isCorrect = userAnswer.toString() === question.correctAnswer.toString();
  }
  return { isCorrect };
}

export { selectNextQuestion, getDevilDialogue, validateAnswer };
