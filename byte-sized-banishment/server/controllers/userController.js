import User from "../models/userModel.js";
import { findWeakestLink } from "../services/aiServices.js"; // <-- IMPORT NEW FUNCTION

export const getDashboardData = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Clear expired effect on dashboard load
    if (
      user.activeEffect &&
      user.activeEffect.type &&
      user.activeEffect.expiresAt < new Date()
    ) {
      user.activeEffect = {
        type: null,
        name: null,
        modifier: 1,
        expiresAt: null,
      };
      await user.save();
    }

    // --- Use the AI service to get the REAL weakest link ---
    const weakestLink = findWeakestLink(user.progress);

    // Mock data for features still in development
    const mockData = {
      activeSession: {
        active: false,
        topic: "Data Structures",
        progress: "Question 5 of 15",
      },
      skillTreePreview: {
        lastMastered: "Arrays",
        nextUp: ["Linked Lists", "Stacks"],
      },
      dailyChallenge: {
        description: "Answer 5 'Web Development' questions.",
        reward: "A temporary Blessing",
      },
      leaderboardSnippet: [
        { rank: user.level + 1, name: "Rival" },
        { rank: user.level, name: "You" },
        { rank: user.level - 1 > 0 ? user.level - 1 : 1, name: "Challenger" },
      ],
    };

    res.json({
      success: true,
      stats: {
        email: user.email,
        level: user.level,
        xp: user.xp,
        xpToNextLevel: user.xpToNextLevel,
        rank: user.rank,
        soulsClaimed: user.correctAnswers,
        devilsFavor: user.dailyStreak,
        activeEffect: user.activeEffect,
      },
      weakestLink: weakestLink, // <-- SEND REAL DATA
      ...mockData,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
