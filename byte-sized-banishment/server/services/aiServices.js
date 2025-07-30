import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Question from "../models/questionModel.js";
import { executeCode } from "./codeExecutionService.js";

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

// --- Engine 3: Enhanced Answer Validator with Judge0 Integration ---
async function validateAnswer(userAnswer, question) {
  let isCorrect = false;

  if (question.type === "mcq" || question.type === "integer") {
    isCorrect = userAnswer.toString() === question.correctAnswer.toString();
    return { isCorrect };
  } else if (question.type === "code") {
    // Use Judge0 API for actual code execution
    return await validateCodeAnswer(userAnswer, question);
  }

  return { isCorrect };
}

// Code validation using Judge0 API
async function validateCodeAnswer(userCode, question) {
  if (!userCode || userCode.trim() === "") {
    return {
      isCorrect: false,
      feedback: "No code provided",
    };
  }

  // Check if question has test cases
  if (!question.testCases || question.testCases.length === 0) {
    console.warn("No test cases provided for code question:", question._id);
    // Fallback to pattern matching if no test cases
    return fallbackCodeValidation(userCode, question);
  }

  // Extract language from user's code or question context
  const language = detectLanguageFromCode(userCode, question);

  try {
    // Use the Judge0 execution service
    const executionResult = await executeCode(
      userCode,
      language,
      question.testCases
    );

    return {
      isCorrect: executionResult.isCorrect,
      feedback: executionResult.feedback,
      executionDetails: executionResult,
    };
  } catch (error) {
    console.error("Error executing code:", error);

    // Fallback to pattern matching if execution fails
    console.log("Falling back to pattern matching validation");
    return fallbackCodeValidation(userCode, question);
  }
}

// Detect programming language from code content
function detectLanguageFromCode(userCode, question) {
  const code = userCode.toLowerCase();

  // Check for language-specific patterns
  if (
    code.includes("def ") ||
    code.includes("import ") ||
    code.includes("print(")
  ) {
    return "python";
  }
  if (
    code.includes("function ") ||
    code.includes("console.log") ||
    code.includes("let ") ||
    code.includes("const ")
  ) {
    return "javascript";
  }
  if (
    code.includes("public class") ||
    code.includes("System.out.print") ||
    code.includes("public static void main")
  ) {
    return "java";
  }
  if (
    code.includes("#include") ||
    code.includes("cout <<") ||
    code.includes("std::")
  ) {
    return "cpp";
  }
  if (
    code.includes("#include") &&
    (code.includes("printf") || code.includes("scanf"))
  ) {
    return "c";
  }
  if (code.includes("using System") || code.includes("Console.Write")) {
    return "csharp";
  }

  // Default fallback based on question subject
  if (question.subject) {
    const subject = question.subject.toLowerCase();
    if (subject.includes("python")) return "python";
    if (subject.includes("java")) return "java";
    if (subject.includes("c++") || subject.includes("cpp")) return "cpp";
    if (subject.includes("javascript") || subject.includes("js"))
      return "javascript";
  }

  // Ultimate fallback
  return "javascript";
}

// Fallback validation when Judge0 execution fails
function fallbackCodeValidation(userCode, question) {
  console.log("Using fallback code validation");

  if (!question.correctAnswer) {
    return {
      isCorrect: false,
      feedback: "No expected solution available for comparison",
    };
  }

  // Calculate similarity score
  const similarityScore = calculateCodeSimilarity(
    userCode,
    question.correctAnswer,
    question
  );
  const isCorrect = similarityScore >= 0.7; // 70% similarity threshold

  return {
    isCorrect,
    feedback: isCorrect
      ? `Code structure matches expected solution (${Math.round(
          similarityScore * 100
        )}% similarity)`
      : `Code doesn't match expected solution (${Math.round(
          similarityScore * 100
        )}% similarity). Try reviewing the logic and structure.`,
    similarityScore,
  };
}

// Calculate similarity between user code and expected solution
function calculateCodeSimilarity(userCode, expectedSolution, question) {
  let score = 0;
  let totalChecks = 0;

  // Normalize both code snippets
  const normalizeCode = (code) => {
    return code
      .toLowerCase()
      .replace(/\s+/g, " ") // Replace multiple spaces with single space
      .replace(/[{}();]/g, "") // Remove common punctuation
      .trim();
  };

  const userNormalized = normalizeCode(userCode);
  const expectedNormalized = normalizeCode(expectedSolution);

  // 1. Check for function/method structure (weight: 0.3)
  totalChecks++;
  const functionPatterns = [
    /function\s+\w+/,
    /def\s+\w+/,
    /public\s+\w+\s+\w+/,
    /\w+\s*\([^)]*\)/,
  ];

  const userHasFunction = functionPatterns.some((pattern) =>
    pattern.test(userCode)
  );
  const expectedHasFunction = functionPatterns.some((pattern) =>
    pattern.test(expectedSolution)
  );

  if (userHasFunction && expectedHasFunction) {
    score += 0.3;
  }

  // 2. Check for key programming keywords (weight: 0.2)
  totalChecks++;
  const programmingKeywords = [
    "return",
    "if",
    "else",
    "for",
    "while",
    "function",
    "def",
    "class",
    "var",
    "let",
    "const",
    "int",
    "string",
    "array",
    "list",
    "dict",
  ];

  const userKeywords = programmingKeywords.filter((keyword) =>
    userNormalized.includes(keyword)
  );
  const expectedKeywords = programmingKeywords.filter((keyword) =>
    expectedNormalized.includes(keyword)
  );

  const keywordSimilarity =
    userKeywords.length > 0
      ? userKeywords.filter((k) => expectedKeywords.includes(k)).length /
        expectedKeywords.length
      : 0;
  score += keywordSimilarity * 0.2;

  // 3. Check for variable/function naming similarity (weight: 0.2)
  totalChecks++;
  const extractNames = (code) => {
    const matches = code.match(/\b[a-zA-Z_$][a-zA-Z0-9_$]*\b/g) || [];
    return [...new Set(matches)]; // Remove duplicates
  };

  const userNames = extractNames(userCode);
  const expectedNames = extractNames(expectedSolution);

  if (expectedNames.length > 0) {
    const nameMatches = userNames.filter((name) =>
      expectedNames.includes(name)
    ).length;
    score += (nameMatches / expectedNames.length) * 0.2;
  }

  // 4. Check for algorithm logic patterns (weight: 0.3)
  totalChecks++;
  const logicPatterns = [
    /for.*in/,
    /for.*range/,
    /for.*length/,
    /for.*size/,
    /while.*true/,
    /while.*false/,
    /while.*\w+/,
    /if.*==/,
    /if.*!=/,
    /if.*>/,
    /if.*</,
    /return.*\+/,
    /return.*-/,
    /return.*\*/,
    /return.*\//,
  ];

  const userLogicMatches = logicPatterns.filter((pattern) =>
    pattern.test(userNormalized)
  );
  const expectedLogicMatches = logicPatterns.filter((pattern) =>
    pattern.test(expectedNormalized)
  );

  if (expectedLogicMatches.length > 0) {
    const logicSimilarity =
      userLogicMatches.filter((pattern) =>
        expectedLogicMatches.includes(pattern)
      ).length / expectedLogicMatches.length;
    score += logicSimilarity * 0.3;
  }

  return Math.min(score, 1.0); // Cap at 1.0
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
