import GauntletSession from "../models/gauntletSessionModel.js";
import User from "../models/userModel.js";
import {
  selectNextQuestion,
  getDevilDialogue,
  validateAnswer,
} from "../services/aiServices.js";

// @desc    Start a new gauntlet session
// @route   POST /api/gauntlet/start
// @access  Private
export const startGauntlet = async (req, res) => {
  const { subject, difficulty } = req.body;
  const userId = req.user._id;

  try {
    // Create a new session
    const session = new GauntletSession({ userId, subject });

    // Get the first question using our AI service
    const firstQuestion = await selectNextQuestion(session, difficulty);
    if (!firstQuestion) {
      return res
        .status(404)
        .json({ message: `No questions found for subject: ${subject}` });
    }

    // Update session history and save
    session.questionHistory.push(firstQuestion._id);
    await session.save();

    res.status(201).json({
      message: "Gauntlet started!",
      sessionId: session._id,
      question: firstQuestion,
    });
  } catch (error) {
    console.error("Error starting gauntlet:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
export const submitAnswer = async (req, res) => {
  const { sessionId, questionId, answer } = req.body;
  const userId = req.user._id;

  try {
    const session = await GauntletSession.findById(sessionId);
    const question = await Question.findById(questionId);
    const user = await User.findById(userId);

    if (!session || session.userId.toString() !== userId.toString()) {
      return res
        .status(401)
        .json({ message: "Not authorized for this session." });
    }
    if (!session.isActive) {
      return res.status(400).json({ message: "This session is over." });
    }

    // --- Use AI Services ---
    const { isCorrect } = validateAnswer(answer, question);
    const trigger = isCorrect
      ? `CORRECT_ANSWER_${question.difficulty.toUpperCase()}`
      : `INCORRECT_ANSWER_${question.difficulty.toUpperCase()}`;
    const devilDialogue = getDevilDialogue(trigger);

    // --- Update Stats & Session ---
    if (isCorrect) {
      user.xp += 10; // Simplified XP logic
      user.correctAnswers += 1;
      session.score += 10;
    } else {
      session.strikesLeft -= 1;
    }

    if (session.strikesLeft <= 0) {
      session.isActive = false;
      // Game over logic
      await session.save();
      await user.save();
      return res.json({
        result: "incorrect",
        feedback: getDevilDialogue("GAME_OVER"),
        isGameOver: true,
      });
    }

    // Get the next question
    const nextQuestion = await selectNextQuestion(session, question.difficulty);
    if (!nextQuestion) {
      session.isActive = false;
      // No more questions logic
      await session.save();
      await user.save();
      return res.json({
        result: "correct",
        feedback: getDevilDialogue("SESSION_WIN"),
        isGameOver: true,
        message: "You've answered all available questions!",
      });
    }

    session.questionHistory.push(nextQuestion._id);
    session.currentQuestionIndex += 1;

    await session.save();
    await user.save();

    res.json({
      result: isCorrect ? "correct" : "incorrect",
      feedback: devilDialogue,
      nextQuestion: nextQuestion,
      updatedStats: {
        strikesLeft: session.strikesLeft,
        score: session.score,
        xp: user.xp,
      },
    });
  } catch (error) {
    console.error("Error submitting answer:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
