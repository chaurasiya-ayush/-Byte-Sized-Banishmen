import dotenv from "dotenv";

// Ensure dotenv is configured
if (!process.env.MONGODB_URI) {
  dotenv.config();
}

const config = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  HOST: process.env.HOST,
  SERVICE: process.env.SERVICE,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  BASE_URL: process.env.BASE_URL,
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
  JUDGE0_API_KEY: process.env.JUDGE0_API_KEY,
  JUDGE0_API_HOST: process.env.JUDGE0_API_HOST,
};

export default config;
