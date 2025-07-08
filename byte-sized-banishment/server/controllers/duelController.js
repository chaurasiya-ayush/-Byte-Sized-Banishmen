import Duel from "../models/duelModel.js";
import User from "../models/userModel.js";
import Question from "../models/questionModel.js";

// @desc    Challenge a friend to a duel
// @route   POST /api/duels/challenge
// @access  Private
export const createDuel = async (req, res) => {
  const { opponentId, subject } = req.body;
  const challengerId = req.user._id;

  try {
    const opponent = await User.findById(opponentId);
    if (!opponent)
      return res.status(404).json({ message: "Opponent not found." });

    // 1. Select 5 random questions for the duel's subject
    const duelQuestions = await Question.aggregate([
      { $match: { subject: subject } },
      { $sample: { size: 5 } },
    ]);

    if (duelQuestions.length < 5) {
      return res
        .status(400)
        .json({
          message: `Not enough questions in the '${subject}' subject to start a duel.`,
        });
    }

    const questionIds = duelQuestions.map((q) => q._id);

    // 2. Create the new duel
    const newDuel = new Duel({
      challenger: challengerId,
      opponent: opponentId,
      subject: subject,
      questions: questionIds,
    });

    await newDuel.save();

    // Here you would ideally send a notification to the opponent
    res.status(201).json({ message: "Duel challenge sent!", duel: newDuel });
  } catch (error) {
    console.error("Error creating duel:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get all active and past duels for the current user
// @route   GET /api/duels
// @access  Private
export const getDuels = async (req, res) => {
  try {
    const userId = req.user._id;
    const duels = await Duel.find({
      $or: [{ challenger: userId }, { opponent: userId }],
    })
      .populate("challenger", "username rank")
      .populate("opponent", "username rank")
      .sort({ createdAt: -1 });

    res.json({ success: true, duels });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get the details for a specific duel to start playing
// @route   GET /api/duels/:duelId
// @access  Private
export const getDuelDetails = async (req, res) => {
  try {
    const duel = await Duel.findById(req.params.duelId).populate("questions"); // Populate all question data

    if (!duel) return res.status(404).json({ message: "Duel not found." });

    // Security check: ensure the current user is part of this duel
    if (
      duel.challenger.toString() !== req.user._id.toString() &&
      duel.opponent.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "You are not part of this duel." });
    }

    res.json({ success: true, duel });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Submit a user's score for a completed duel
// @route   POST /api/duels/submit/:duelId
// @access  Private
export const submitDuelScore = async (req, res) => {
  const { score } = req.body;
  const userId = req.user._id;

  try {
    const duel = await Duel.findById(req.params.duelId);
    if (!duel) return res.status(404).json({ message: "Duel not found." });

    // Determine if the current user is the challenger or opponent
    const isChallenger = duel.challenger.toString() === userId.toString();

    if (isChallenger) {
      if (duel.challengerScore !== -1)
        return res
          .status(400)
          .json({
            message: "You have already submitted your score for this duel.",
          });
      duel.challengerScore = score;
      duel.status = "complete"; // If challenger plays second, it's now complete
    } else {
      // User is the opponent
      if (duel.opponentScore !== -1)
        return res
          .status(400)
          .json({
            message: "You have already submitted your score for this duel.",
          });
      duel.opponentScore = score;
      duel.status = "pending_challenger"; // Now waiting for the challenger
    }

    // If both players have now played, determine the winner
    if (duel.challengerScore !== -1 && duel.opponentScore !== -1) {
      duel.status = "complete";
      if (duel.challengerScore > duel.opponentScore) {
        duel.winner = duel.challenger;
      } else if (duel.opponentScore > duel.challengerScore) {
        duel.winner = duel.opponent;
      } else {
        // It's a draw, winner can remain null or handle as you see fit
      }
    }

    await duel.save();
    res.json({
      success: true,
      message: "Duel score submitted!",
      updatedDuel: duel,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
