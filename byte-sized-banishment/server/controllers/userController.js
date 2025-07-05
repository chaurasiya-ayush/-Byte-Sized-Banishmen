// @desc    Get all data needed for the user's dashboard
// @route   GET /api/user/dashboard
// @access  Private
export const getDashboardData = async (req, res) => {
    try {
        // The user object is attached to the request by the `protect` middleware
        const user = req.user;

        // In a real app, you would have more complex logic here.
        // For now, we'll return the user's data and add some mock data
        // for features that are not yet built.

        // MOCK DATA for features to be implemented later
        const mockData = {
            activeSession: { // For "Continue Your Battle"
                active: false, // Set to true if they have an unfinished session
                topic: "Data Structures",
                progress: "Question 5 of 15"
            },
            skillTreePreview: {
                lastMastered: "Arrays",
                nextUp: ["Linked Lists", "Stacks"]
            },
            dailyChallenge: {
                description: "The Devil demands you correctly answer 5 'Web Development' questions today.",
                reward: "A temporary Blessing of 1.5x XP"
            },
            weakestLink: "Recursion", // This would be determined by your AI
            leaderboardSnippet: [
                { rank: user.level + 1, name: "AnotherChallenger" },
                { rank: user.level, name: "You" },
                { rank: user.level - 1 > 0 ? user.level - 1 : 1, name: "YetAnother" }
            ],
            activeEffects: { // "Blessings and Curses"
                blessing: null, // e.g., "2x Points Active!"
                curse: null, // e.g., "Points Halved for 1 Hour!"
            }
        };

        res.json({
            success: true,
            // User's core stats from the database
            stats: {
                email: user.email,
                level: user.level,
                xp: user.xp,
                rank: user.rank,
                soulsClaimed: user.correctAnswers,
                devilsFavor: user.dailyStreak,
            },
            // The placeholder data for other dashboard components
            ...mockData
        });

    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
