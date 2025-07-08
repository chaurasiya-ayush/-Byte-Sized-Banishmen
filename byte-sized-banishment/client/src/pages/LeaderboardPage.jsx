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
          `${import.meta.env.VITE_API_URL}/api/leaderboard`
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
    if (rank === 1) return "text-yellow-400 border-yellow-400";
    if (rank === 2) return "text-gray-300 border-gray-300";
    if (rank === 3) return "text-orange-400 border-orange-400";
    return "text-gray-500 border-gray-500";
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <FaTrophy className="text-6xl text-yellow-400 mx-auto mb-4" />
          <h1
            className="text-5xl font-black uppercase text-white"
            style={{ textShadow: "0 0 15px rgba(255, 200, 0, 0.7)" }}
          >
            League of the Damned
          </h1>
          <p className="text-gray-400 mt-2">
            See who has earned the Devil's favor... or his wrath.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg"
          >
            &larr; Back to Dashboard
          </button>
        </header>

        {loading ? (
          <div className="text-center">
            <p className="text-2xl animate-pulse">Calculating the Ranks...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((player, index) => {
              const isCurrentUser = player.email === currentUser?.email;
              const rank = index + 1;
              return (
                <motion.div
                  key={player._id}
                  className={`flex items-center p-4 rounded-lg border-2 transition-all duration-300 ${
                    isCurrentUser
                      ? "bg-red-900/50 border-red-500 scale-105"
                      : "bg-gray-800/50 border-gray-700"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div
                    className={`flex items-center justify-center font-bold text-2xl w-12 h-12 rounded-full border-2 mr-4 ${getRankColor(
                      rank
                    )}`}
                  >
                    {rank}
                  </div>
                  <div className="flex-grow">
                    <p
                      className={`font-bold text-lg ${
                        isCurrentUser ? "text-red-400" : "text-white"
                      }`}
                    >
                      {player.email}
                    </p>
                    <p className="text-sm text-gray-400">{player.rank}</p>
                  </div>
                  <div className="text-right font-mono">
                    <p className="font-semibold text-lg">{player.level}</p>
                    <p className="text-xs text-gray-500">Level</p>
                  </div>
                  <div className="text-right font-mono ml-6">
                    <p className="font-semibold text-lg">{player.xp}</p>
                    <p className="text-xs text-gray-500">XP</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
