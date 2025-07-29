import mongoose from "mongoose";

const gauntletSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    subject: { type: String, required: true },
    strikesLeft: { type: Number, default: 3 },
    score: { type: Number, default: 0 },
    currentQuestionIndex: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 15 }, // Fixed session length
    questionHistory: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
    ],
    correctAnswers: { type: Number, default: 0 }, // Track correct answers
    incorrectAnswers: { type: Number, default: 0 }, // Track incorrect answers
    correctStreak: { type: Number, default: 0 },
    maxCorrectStreak: { type: Number, default: 0 }, // Best streak in session
    totalXpGained: { type: Number, default: 0 }, // Total XP earned this session
    currentDifficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
    },
    difficultyProgression: [
      {
        // Track difficulty changes
        questionIndex: Number,
        difficulty: String,
        reason: String, // 'correct_streak', 'incorrect_answer', 'adaptive'
      },
    ],
    sessionStartTime: { type: Date, default: Date.now },
    sessionEndTime: { type: Date },
    completionReason: {
      type: String,
      enum: ["completed", "failed", "abandoned"],
      default: null,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const GauntletSession = mongoose.model(
  "GauntletSession",
  gauntletSessionSchema
);
export default GauntletSession;
