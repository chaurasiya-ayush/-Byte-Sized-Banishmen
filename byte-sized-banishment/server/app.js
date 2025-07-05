import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js"; // <-- IMPORT NEW ROUTES
import config from "./config/index.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// --- API Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes); // <-- USE NEW ROUTES

app.get("/", (req, res) => {
  res.send("Byte-Sized Banishment API is running...");
});

const PORT = config.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
