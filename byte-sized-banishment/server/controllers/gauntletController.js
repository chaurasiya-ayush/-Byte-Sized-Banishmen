import GauntletSession from "../models/gauntletSessionModel.js";
import User from "../models/userModel.js";
import Question from "../models/questionModel.js";
import {
  selectNextQuestion,
  getDevilDialogue,
  validateAnswer,
} from "../services/aiServices.js";

export const startGauntlet = async (req, res) => {
  const { subject, difficulty } = req.body;
  try {
    const session = new GauntletSession({ userId: req.user._id, subject });
    const firstQuestion = await selectNextQuestion(session, difficulty);
    if (!firstQuestion)
      return res
        .status(404)
        .json({ message: `No questions found for subject: ${subject}` });
    session.questionHistory.push(firstQuestion._id);
    await session.save();
    res.status(201).json({ sessionId: session._id, question: firstQuestion });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const submitAnswer = async (req, res) => {
  const { sessionId, questionId, answer } = req.body;
  try {
    const session = await GauntletSession.findById(sessionId);
    const question = await Question.findById(questionId);
    const user = await User.findById(req.user._id);

    if (!session || session.userId.toString() !== req.user._id.toString())
      return res.status(401).json({ message: "Not authorized." });
    if (!session.isActive)
      return res.status(400).json({ message: "This session is over." });

    const { isCorrect, feedback } = await validateAnswer(answer, question); // Now async
    const trigger = isCorrect
      ? `CORRECT_ANSWER_${question.difficulty.toUpperCase()}`
      : `INCORRECT_ANSWER_${question.difficulty.toUpperCase()}`;
    const devilDialogue = getDevilDialogue(trigger);

    // Use specific feedback from code execution if available
    if (question.type === "code" && feedback) {
      devilDialogue.text = feedback;
    }

    if (isCorrect) {
      user.xp += 10;
      user.correctAnswers += 1;
      session.score += 10;
    } else {
      session.strikesLeft -= 1;
    }

    if (session.strikesLeft <= 0) {
      session.isActive = false;
      await session.save();
      await user.save();
      return res.json({
        result: "incorrect",
        feedback: getDevilDialogue("GAME_OVER"),
        isGameOver: true,
      });
    }

    const nextQuestion = await selectNextQuestion(session, question.difficulty);
    if (!nextQuestion) {
      session.isActive = false;
      await session.save();
      await user.save();
      return res.json({
        result: "correct",
        feedback: getDevilDialogue("SESSION_WIN"),
        isGameOver: true,
      });
    }

    session.questionHistory.push(nextQuestion._id);
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
    res.status(500).json({ message: "Server Error" });
  }
};
