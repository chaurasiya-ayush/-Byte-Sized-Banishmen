import Question from "../models/questionModel.js";
import fs from "fs";
import path from "path";

// --- Robustly load the JSON file for Vercel ---
// process.cwd() gives us the root directory of the serverless function.
const dialoguePath = path.resolve(
  process.cwd(),
  "data",
  "dialogueWithAudio.json"
);
let dialogueLines = {};
try {
  const rawData = fs.readFileSync(dialoguePath, "utf-8");
  dialogueLines = JSON.parse(rawData);
} catch (error) {
  console.error(`Error reading dialogue file at path: ${dialoguePath}`, error);
  // Provide empty defaults so the app doesn't crash if the file is missing
  dialogueLines = {};
}

function findWeakestLink(userProgress) {
  let weakestTopicKey = null;
  let lowestScore = 1.0;
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
  if (weakestTopicKey) {
    const [subject, subTopic] = weakestTopicKey.split("-");
    return { subject, subTopic };
  }
  return null;
}

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
      if (lastQuestion.difficulty === "medium" && session.correctStreak >= 2)
        nextDifficulty = "hard";
      else nextDifficulty = difficultyOrder[lastDifficultyIndex + 1];
    } else nextDifficulty = "hard";
  } else {
    if (lastDifficultyIndex > 0)
      nextDifficulty = difficultyOrder[lastDifficultyIndex - 1];
    else nextDifficulty = "easy";
    if (lastQuestion.subTopic) queryOptions.subTopic = lastQuestion.subTopic;
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

export {
  selectNextQuestion,
  getDevilDialogue,
  validateAnswer,
  findWeakestLink,
};
