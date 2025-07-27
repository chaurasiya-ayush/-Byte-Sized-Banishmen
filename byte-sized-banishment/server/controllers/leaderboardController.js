import User from "../models/userModel.js";

// @desc    Get the top players for the leaderboard
// @route   GET /api/leaderboard
// @access  Public
export const getLeaderboard = async (req, res) => {
  try {
    // Find users, sort them by level then by XP (both descending)
    // Limit to the top 50 players to keep the query fast
    // Select only the fields we want to make public
    const topPlayers = await User.find({})
      .sort({ level: -1, xp: -1 })
      .limit(50)
      .select("email level xp rank");

    res.json({
      success: true,
      leaderboard: topPlayers,
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
