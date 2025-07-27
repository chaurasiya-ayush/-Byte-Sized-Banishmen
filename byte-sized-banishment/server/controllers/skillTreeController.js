import Question from "../models/questionModel.js";
import User from "../models/userModel.js";

// @desc    Get the skill tree for a specific subject
// @route   GET /api/skill-tree/:subject
// @access  Private
export const getSkillTree = async (req, res) => {
  try {
    const { subject } = req.params;
    const user = await User.findById(req.user._id);

    // 1. Get all unique sub-topics for the given subject from the questions collection.
    // This makes the tree dynamic to the content in your database.
    const subTopics = await Question.distinct("subTopic", { subject: subject });

    // 2. Determine the status of each node (sub-topic)
    const nodes = await Promise.all(
      subTopics.map(async (subTopic) => {
        const progressKey = `${subject}-${subTopic}`;
        const userProgress = user.progress.get(progressKey);

        let status = "locked"; // Default status

        // Logic to unlock nodes. For now, we'll say all are unlocked.
        // A future implementation could require mastering 'easy' topics first.
        status = "unlocked";

        if (userProgress?.mastered) {
          status = "mastered";
        }

        // Get total questions for this sub-topic to show progress
        const totalQuestions = await Question.countDocuments({
          subject,
          subTopic,
        });

        return {
          id: progressKey,
          name: subTopic,
          status: status,
          progress: {
            correct: userProgress?.correct || 0,
            total: totalQuestions,
          },
        };
      })
    );

    // 3. Define the connections between nodes (the "tree" structure)
    // For now, we'll return a simple linear list. A real implementation
    // would have a predefined map of dependencies, e.g., "Arrays" must be
    // mastered before "Linked Lists" is unlocked.
    const edges = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      edges.push({ from: nodes[i].id, to: nodes[i + 1].id });
    }

    res.json({
      success: true,
      tree: {
        nodes,
        edges,
      },
    });
  } catch (error) {
    console.error("Error fetching skill tree:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
