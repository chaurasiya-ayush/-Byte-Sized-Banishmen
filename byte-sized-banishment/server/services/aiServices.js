import Question from '../models/questionModel.js';
// This is the new, more robust way to import JSON files for Vercel.
import dialogueLines from '../data/dialogueWithAudio.json' with { type: 'json' };

/**
 * Finds the user's weakest sub-topic based on performance history.
 * @param {Map} userProgress - The user's progress map from the user model.
 * @returns {Object|null} - An object with { subject, subTopic } or null if no weakness is found.
 */
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
    
    if (weakestTopicKey) {
        const [subject, subTopic] = weakestTopicKey.split('-');
        return { subject, subTopic };
    }

    return null;
}

/**
 * Selects the next question based on adaptive difficulty logic.
 * @param {Object} session - The current gauntlet session.
 * @param {Object} lastQuestion - The question the user just answered.
 * @param {boolean} isCorrect - Whether the last answer was correct.
 * @returns {Promise<Object|null>} - The next question document or null.
 */
async function selectNextQuestion(session, lastQuestion, isCorrect) {
    const difficultyOrder = ['easy', 'medium', 'hard'];
    const lastDifficultyIndex = difficultyOrder.indexOf(lastQuestion.difficulty);
    let nextDifficulty;
    let queryOptions = { subject: session.subject, _id: { $nin: session.questionHistory } };

    if (isCorrect) {
        if (lastDifficultyIndex < 2) {
            if (lastQuestion.difficulty === 'medium' && session.correctStreak >= 2) {
                nextDifficulty = 'hard';
            } else {
                nextDifficulty = difficultyOrder[lastDifficultyIndex + 1];
            }
        } else {
            nextDifficulty = 'hard';
        }
    } else {
        if (lastDifficultyIndex > 0) {
            nextDifficulty = difficultyOrder[lastDifficultyIndex - 1];
        } else {
            nextDifficulty = 'easy';
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

/**
 * Retrieves a random dialogue line based on a game event trigger.
 * @param {string} trigger - The event trigger (e.g., 'CORRECT_ANSWER_EASY').
 * @returns {Object} - An object with { text, audioUrl }.
 */
function getDevilDialogue(trigger) {
    const lines = dialogueLines[trigger] || [];
    if (lines.length === 0) return { text: "...", audioUrl: null };
    return lines[Math.floor(Math.random() * lines.length)];
}

/**
 * Validates simple answers (MCQ, Integer).
 * @param {string} userAnswer - The user's submitted answer.
 * @param {Object} question - The question document.
 * @returns {Object} - An object with { isCorrect: boolean }.
 */
function validateAnswer(userAnswer, question) {
    let isCorrect = false;
    if (question.type === 'mcq' || question.type === 'integer') {
        isCorrect = (userAnswer.toString() === question.correctAnswer.toString());
    }
    // Note: 'code' validation is handled by a separate service.
    return { isCorrect };
}

export { selectNextQuestion, getDevilDialogue, validateAnswer, findWeakestLink };