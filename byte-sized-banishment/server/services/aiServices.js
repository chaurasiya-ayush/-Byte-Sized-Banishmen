import Question from "../models/questionModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// --- Robustly load the JSON file ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dialoguePath = path.join(__dirname, "../data/dialogueWithAudio.json");
let dialogueLines = {};
try {
  const rawData = fs.readFileSync(dialoguePath);
  dialogueLines = JSON.parse(rawData);
} catch (error) {
  console.error(
    "Could not read or parse dialogueWithAudio.json. Make sure the file exists and is valid JSON.",
    error
  );
}

// --- Engine 1: Adaptive Question Selector ---
async function selectNextQuestion(session, lastQuestionDifficulty) {
  // For now, this is a simplified version.
  // It just picks a random question of the specified difficulty.
  // A real implementation would have the complex rule-based logic.

  const nextQuestion = await Question.findOne({
    subject: session.subject,
    difficulty: lastQuestionDifficulty, // Simplified logic for now
    _id: { $nin: session.questionHistory }, // Exclude questions already asked
  });

  return nextQuestion;
}

// --- Engine 2: Dynamic Persona ---
function getDevilDialogue(trigger) {
  const possibleLines = dialogueLines[trigger];
  if (!possibleLines || possibleLines.length === 0) {
    return { text: "...", audioUrl: null }; // Default silent response
  }
  const randomIndex = Math.floor(Math.random() * possibleLines.length);
  return possibleLines[randomIndex];
}

// --- Engine 3: Answer Validator ---
function validateAnswer(userAnswer, question) {
  // This is a simplified validator. Code validation would be a separate, complex service.
  let isCorrect = false;
  if (question.type === "mcq" || question.type === "integer") {
    isCorrect = userAnswer.toString() === question.correctAnswer.toString();
  }
  // 'code' and 'description' types would require more complex validation.
  return { isCorrect };
}

export { selectNextQuestion, getDevilDialogue, validateAnswer };
