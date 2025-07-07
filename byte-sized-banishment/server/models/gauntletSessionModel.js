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
    questionHistory: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
    ],
    correctStreak: { type: Number, default: 0 }, // <-- NEW FIELD
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const GauntletSession = mongoose.model(
  "GauntletSession",
  gauntletSessionSchema
);
export default GauntletSession;
