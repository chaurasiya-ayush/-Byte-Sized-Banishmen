import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// --- Sub-schemas for clarity ---
const activeEffectSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["blessing", "curse", null], default: null },
    name: { type: String },
    modifier: { type: Number, default: 1 },
    expiresAt: { type: Date },
  },
  { _id: false }
);

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
    // Using a unique username for easier searching and display
    username: { type: String, required: true, unique: true, trim: true },
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
    progress: { type: Map, of: subTopicProgressSchema, default: {} },

    // --- NEW FIELDS FOR FRIENDS SYSTEM ---
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    friendRequestsSent: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    friendRequestsReceived: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ],
  },
  { timestamps: true }
);

// --- Ensure username is set during registration ---
// (You will need to update your /controllers/authController.js register function
// to accept and save a 'username' from the request body)

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
