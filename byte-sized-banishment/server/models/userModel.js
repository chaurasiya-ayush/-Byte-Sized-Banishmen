import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const activeEffectSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["blessing", "curse", null], default: null },
    name: { type: String },
    modifier: { type: Number, default: 1 },
    expiresAt: { type: Date },
  },
  { _id: false }
);

// This new schema will store progress for each sub-topic
const subTopicProgressSchema = new mongoose.Schema(
  {
    correct: { type: Number, default: 0 },
    totalAttempted: { type: Number, default: 0 },
    mastered: { type: Boolean, default: false },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "is invalid"],
    },
    password: { type: String, required: true, minlength: 6 },
    isVerified: { type: Boolean, default: false },
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },
    xpToNextLevel: { type: Number, default: 150 },
    rank: { type: String, default: "Novice" },
    correctAnswers: { type: Number, default: 0 },
    dailyStreak: { type: Number, default: 0 },
    lastLogin: { type: Date, default: Date.now },
    activeEffect: { type: activeEffectSchema, default: () => ({}) },
    // --- NEW FIELD FOR SKILL TREE ---
    // Using a Map to store progress for each sub-topic dynamically.
    // The key will be the subject+subTopic name (e.g., "JavaScript-Arrays")
    progress: {
      type: Map,
      of: subTopicProgressSchema,
      default: {},
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
const User = mongoose.model("User", userSchema);
export default User;
