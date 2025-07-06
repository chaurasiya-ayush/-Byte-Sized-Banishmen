import Question from "../models/questionModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { executeCode } from "./codeExecutionService.js"; // <-- IMPORT

// --- Load Dialogue ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dialoguePath = path.join(__dirname, "../data/dialogueWithAudio.json");
let dialogueLines = {};
try {
  dialogueLines = JSON.parse(fs.readFileSync(dialoguePath));
} catch (error) {
  console.error("Could not read dialogueWithAudio.json.", error);
}

// --- Engine 1: Question Selector ---
async function selectNextQuestion(session, lastQuestionDifficulty) {
  const nextQuestion = await Question.findOne({
    subject: session.subject,
    difficulty: lastQuestionDifficulty,
    _id: { $nin: session.questionHistory },
  });
  return nextQuestion;
}

// --- Engine 2: Persona ---
function getDevilDialogue(trigger) {
  const lines = dialogueLines[trigger] || [];
  if (lines.length === 0) return { text: "...", audioUrl: null };
  return lines[Math.floor(Math.random() * lines.length)];
}

// --- Engine 3: Answer Validator (UPDATED) ---
async function validateAnswer(userAnswer, question) {
  if (question.type === "mcq" || question.type === "integer") {
    return {
      isCorrect: userAnswer.toString() === question.correctAnswer.toString(),
    };
  }
  if (question.type === "code") {
    // Delegate to the code execution service
    return await executeCode(userAnswer, question.subject, question.testCases);
  }
  return { isCorrect: false, feedback: "Cannot validate this question type." };
}

export { selectNextQuestion, getDevilDialogue, validateAnswer };
