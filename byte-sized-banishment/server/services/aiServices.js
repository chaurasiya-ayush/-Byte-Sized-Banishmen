mport Question from '../models/questionModel.js';
import fs from 'fs';
import path from 'path';

// --- Robustly load the JSON file for Vercel ---
// process.cwd() gives us the root directory of the serverless function.
const dialoguePath = path.resolve(process.cwd(), 'data', 'dialogueWithAudio.json');
let dialogueLines = {};
try {
    const rawData = fs.readFileSync(dialoguePath, 'utf-8');
    dialogueLines = JSON.parse(rawData);
} catch (error) {
    console.error(`Error reading dialogue file at path: ${dialoguePath}`, error);
    // Provide empty defaults so the app doesn't crash if the file is missing
    dialogueLines = {}; 
}


// --- The rest of the AI services file remains the same ---

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
        const [subject, subTopic] = weakestTopicKey.split('-');
        return { subject, subTopic };
    }
    return null;
}

async function selectNextQuestion(session, lastQuestion, isCorrect) {
    const difficultyOrder = ['easy', 'medium', 'hard'];
    const lastDifficultyIndex = difficultyOrder.indexOf(lastQuestion.difficulty);
    let nextDifficulty;
    let queryOptions = { subject: session.subject, _id: { $nin: session.questionHistory } };
    if (isCorrect) {
        if (lastDifficultyIndex < 2) {
            if (lastQuestion.difficulty === 'medium' && session.correctStreak >= 2) nextDifficulty = 'hard';
            else nextDifficulty = difficultyOrder[lastDifficultyIndex + 1];
        } else nextDifficulty = 'hard';
    } else {
        if (lastDifficultyIndex > 0) nextDifficulty = difficultyOrder[lastDifficultyIndex - 1];
        else nextDifficulty = 'easy';
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
    if (question.type === 'mcq' || question.type === 'integer') {
        isCorrect = (userAnswer.toString() === question.correctAnswer.toString());
    }
    return { isCorrect };
}

export { selectNextQuestion, getDevilDialogue, validateAnswer, findWeakestLink };


/* -------------------------------------------------------------------------- */
/* FILE: /controllers/gauntletController.js (FIXED FOR DEPLOYMENT)            */
/* -------------------------------------------------------------------------- */
// FIXED: Changed file reading to use an absolute path that works on Vercel.

import GauntletSession from '../models/gauntletSessionModel.js';
import User from '../models/userModel.js';
import Question from '../models/questionModel.js';
import { selectNextQuestion, getDevilDialogue, validateAnswer, findWeakestLink } from '../services/aiServices.js';
import fs from 'fs';
import path from 'path';

// --- Robustly load the Penance JSON file for Vercel ---
const penancePath = path.resolve(process.cwd(), 'data', 'penance.json');
let penances = [];
try {
    const rawData = fs.readFileSync(penancePath, 'utf-8');
    penances = JSON.parse(rawData);
} catch (error) {
    console.error(`Error reading penance file at path: ${penancePath}`, error);
}


// --- The rest of the controller file remains the same ---

const XP_VALUES = { easy: 10, medium: 25, hard: 50 };
const RANK_THRESHOLDS = { 1: 'Novice', 5: 'Code Imp', 10: 'Byte Fiend', 20: 'Code Devil' };
const getRankForLevel = (level) => {
    let currentRank = 'Novice';
    for (const threshold in RANK_THRESHOLDS) {
        if (level >= threshold) currentRank = RANK_THRESHOLDS[threshold];
    }
    return currentRank;
};

export const startGauntlet = async (req, res) => {
    // ... (no changes to this function)
};

export const startWeaknessDrill = async (req, res) => {
    // ... (no changes to this function)
};

export const submitAnswer = async (req, res) => {
    const { sessionId, questionId, answer } = req.body;
    try {
        const session = await GauntletSession.findById(sessionId);
        const question = await Question.findById(questionId);
        const user = await User.findById(req.user._id);

        if (!session || !question || !user) return res.status(404).json({ message: "Session, question, or user not found."});
        if (session.userId.toString() !== req.user._id.toString()) return res.status(401).json({ message: "Not authorized." });
        if (!session.isActive) return res.status(400).json({ message: "This session is over." });

        const { isCorrect } = validateAnswer(answer, question);
        let devilDialogue;

        // --- GAME OVER LOGIC WITH PENANCE ---
        if (session.strikesLeft <= 0) {
            session.isActive = false;
            await session.save();
            await user.save();
            
            // Randomly select a penance
            const randomPenance = penances.length > 0 ? penances[Math.floor(Math.random() * penances.length)] : { task: "Reflect on your failure.", quote: "The master has failed more times than the beginner has even tried."};

            return res.json({
                result: 'incorrect',
                feedback: getDevilDialogue("GAME_OVER"),
                isGameOver: true,
                punishment: {
                    type: 'penance',
                    task: randomPenance.task,
                    quote: randomPenance.quote
                }
            });
        }
        
        // ... (The rest of the logic is the same, no need to repeat it all here)
        
        if (!devilDialogue) {
            const trigger = isCorrect ? `CORRECT_ANSWER_${question.difficulty.toUpperCase()}` : `INCORRECT_ANSWER_${question.difficulty.toUpperCase()}`;
            devilDialogue = getDevilDialogue(trigger);
        }

        const nextQuestion = await selectNextQuestion(session, question, isCorrect);
        
        if (!nextQuestion) {
             session.isActive = false;
             await Promise.all([session.save(), user.save()]);
             return res.json({ result: 'correct', feedback: getDevilDialogue("SESSION_WIN"), isGameOver: true });
        }
        
        session.questionHistory.push(nextQuestion._id);
        await Promise.all([session.save(), user.save()]);
        
        res.json({
            result: isCorrect ? 'correct' : 'incorrect',
            feedback: devilDialogue,
            nextQuestion: nextQuestion,
            updatedStats: {
                strikesLeft: session.strikesLeft,
                score: session.score,
                xp: user.xp,
                level: user.level,
                rank: user.rank,
                xpToNextLevel: user.xpToNextLevel,
                activeEffect: user.activeEffect
            }
        });

    } catch (error) {
        console.error("Error submitting answer:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
