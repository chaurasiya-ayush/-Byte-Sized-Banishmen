import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import gauntletRoutes from "./routes/gauntletRoutes.js";
import skillTreeRoutes from "./routes/skillTreeRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import friendRoutes from "./routes/friendRoutes.js";
import duelRoutes from "./routes/duelRoutes.js";
import config from "./config/index.js";

dotenv.config();
connectDB();
const app = express();
app.use(cors());
app.use(express.json());

// --- API Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/gauntlet", gauntletRoutes);
app.use("/api/skill-tree", skillTreeRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/duels", duelRoutes);

app.get("/", (req, res) => res.send("Byte-Sized Banishment API is running..."));
const PORT = config.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
