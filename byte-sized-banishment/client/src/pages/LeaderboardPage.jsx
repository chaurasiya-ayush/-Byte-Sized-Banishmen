import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaTrophy, FaUserCircle } from "react-icons/fa";
import { motion } from "framer-motion";

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/leaderboard"
        );
        if (data.success) {
          setLeaderboard(data.leaderboard);
        }
      } catch (error) {
        console.error("Failed to fetch leaderboard", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const getRankColor = (rank) => {
    if (rank === 1) return "text-yellow-400 border-yellow-400 bg-yellow-400/10";
    if (rank === 2) return "text-orange-300 border-orange-300 bg-orange-300/10";
    if (rank === 3) return "text-red-400 border-red-400 bg-red-400/10";
    return "text-gray-400 border-gray-600 bg-gray-600/10";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-red-950 to-orange-950 text-white p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
          >
            <FaTrophy className="text-6xl text-yellow-400 mx-auto mb-4 drop-shadow-lg" />
          </motion.div>
          <motion.h1
            className="text-5xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400"
            style={{
              fontFamily: "Orbitron, monospace",
              textShadow: "0 0 20px rgba(220, 38, 38, 0.5)",
            }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            🔥 League of the Damned 🔥
          </motion.h1>
          <motion.p
            className="text-orange-200 mt-4 text-lg"
            style={{ fontFamily: "Rajdhani, sans-serif" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            See who has earned the Devil's favor... or his eternal wrath 😈
          </motion.p>
          <motion.button
            onClick={() => navigate("/dashboard")}
            className="mt-6 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-lg border border-red-500 transition-all duration-300 shadow-lg hover:shadow-red-500/25"
            style={{ fontFamily: "Rajdhani, sans-serif" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ← Back to Dashboard
          </motion.button>
        </header>

        {loading ? (
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-3xl animate-pulse bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent font-bold">
              🔥 Calculating the Ranks of the Damned... 🔥
            </div>
            <div className="mt-4 flex justify-center space-x-2">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 bg-red-500 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {leaderboard.map((player, index) => {
              const isCurrentUser = player.email === currentUser?.email;
              const rank = index + 1;
              return (
                <motion.div
                  key={player._id}
                  className={`relative flex items-center p-5 rounded-xl border-2 transition-all duration-300 ${
                    isCurrentUser
                      ? "bg-gradient-to-r from-red-900/60 to-orange-900/40 border-red-500 shadow-lg shadow-red-500/25"
                      : "bg-gradient-to-r from-gray-900/80 to-gray-800/60 border-gray-600 hover:border-orange-500/50"
                  }`}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.2 },
                  }}
                >
                  {/* Rank Badge */}
                  <div
                    className={`flex items-center justify-center font-bold text-xl w-14 h-14 rounded-full border-2 mr-6 shadow-lg ${getRankColor(
                      rank
                    )}`}
                    style={{ fontFamily: "Orbitron, monospace" }}
                  >
                    {rank <= 3 ? (
                      <span className="text-2xl">
                        {rank === 1 ? "👑" : rank === 2 ? "🥈" : "🥉"}
                      </span>
                    ) : (
                      rank
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-grow">
                    <p
                      className={`font-bold text-xl ${
                        isCurrentUser ? "text-orange-300" : "text-white"
                      }`}
                      style={{ fontFamily: "Rajdhani, sans-serif" }}
                    >
                      {isCurrentUser && "👹 "}
                      {player.email}
                    </p>
                    <p
                      className="text-sm text-orange-200 capitalize"
                      style={{ fontFamily: "Rajdhani, sans-serif" }}
                    >
                      {player.rank || "Apprentice Coder"}
                    </p>
                  </div>

                  {/* Level */}
                  <div className="text-right font-mono mr-6">
                    <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-black px-3 py-1 rounded-lg">
                      <p className="font-bold text-lg">{player.level}</p>
                    </div>
                    <p className="text-xs text-orange-300 mt-1">Level</p>
                  </div>

                  {/* XP */}
                  <div className="text-right font-mono">
                    <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-3 py-1 rounded-lg">
                      <p className="font-bold text-lg">{player.xp}</p>
                    </div>
                    <p className="text-xs text-red-300 mt-1">XP</p>
                  </div>

                  {/* Current User Indicator */}
                  {isCurrentUser && (
                    <motion.div
                      className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      YOU
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
