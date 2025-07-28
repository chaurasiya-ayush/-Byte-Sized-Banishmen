import React from "react";
import {
  FaHeart,
  FaStar,
  FaQuestionCircle,
  FaChartLine,
  FaFire,
  FaBolt,
  FaBullseye,
  FaCrown,
} from "react-icons/fa";
import { GiDevilMask } from "react-icons/gi";

const StatusBar = ({ stats, currentQuestion }) => {
  // Calculate session progress (based on questions answered)
  const questionsAnswered = stats.questionNum || 1;
  const currentStreak = stats.correctStreak || 0;
  const sessionDuration = stats.sessionTime || "00:00";

  const statItems = [
    {
      icon: <FaStar className="text-yellow-400" />,
      label: "Score",
      value: stats.score || 0,
      iconComponent: FaStar,
    },
    {
      icon: <FaFire className="text-orange-400" />,
      label: "Level",
      value: stats.level || 1,
      iconComponent: FaFire,
    },
    {
      icon: <FaQuestionCircle className="text-red-400" />,
      label: "Questions",
      value: `${questionsAnswered} answered`,
      iconComponent: FaQuestionCircle,
    },
    {
      icon: <FaBolt className="text-green-400" />,
      label: "Streak",
      value: `${currentStreak} correct`,
      iconComponent: FaBolt,
    },
  ];

  return (
    <div className="bg-gradient-to-b from-black/60 to-red-900/20 backdrop-blur-sm border-r-2 border-red-500/40 p-4 flex flex-col h-full overflow-hidden">
      {/* Devilish Header */}
      <div className="text-center border-b border-red-500/30 pb-3 mb-4 flex-shrink-0">
        <div className="text-3xl mb-1 text-red-500">
          <GiDevilMask />
        </div>
        <h2
          className="text-lg font-bold text-red-400"
          style={{ fontFamily: "'Orbitron', monospace" }}
        >
          TRIAL STATUS
        </h2>
      </div>

      {/* Session Stats - Scrollable */}
      <div className="flex-grow overflow-y-auto mb-4">
        <h3
          className="font-bold text-sm text-orange-400 mb-3 flex items-center gap-2"
          style={{ fontFamily: "'Orbitron', monospace" }}
        >
          <FaChartLine className="text-orange-400" />
          SESSION STATS
        </h3>
        <div className="space-y-2">
          {statItems.map((item) => (
            <div
              key={item.label}
              className="bg-gradient-to-r from-black/50 to-red-900/20 p-3 rounded-lg flex items-center gap-3 border border-red-700/30 hover:border-red-500/50 transition-all"
              style={{
                boxShadow: "0 0 10px rgba(220, 38, 38, 0.1)",
              }}
            >
              <div className="text-xl flex-shrink-0">
                <item.iconComponent
                  className={`${
                    item.label === "Score"
                      ? "text-yellow-400"
                      : item.label === "Level"
                      ? "text-orange-400"
                      : item.label === "Questions"
                      ? "text-red-400"
                      : "text-green-400"
                  }`}
                />
              </div>
              <div className="flex-grow min-w-0">
                <p
                  className="text-xs text-gray-300 font-mono truncate"
                  style={{ fontFamily: "'Orbitron', monospace" }}
                >
                  {item.label}
                </p>
                <p
                  className="font-bold text-yellow-300 text-sm truncate"
                  style={{
                    fontFamily: "'Orbitron', monospace",
                    textShadow: "0 0 8px rgba(253, 224, 71, 0.5)",
                  }}
                >
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Question Info - Fixed at bottom */}
      <div className="flex-shrink-0 space-y-2">
        {currentQuestion && (
          <div className="bg-gradient-to-r from-orange-900/40 to-red-900/40 p-3 rounded-lg border border-orange-500/50">
            <h3
              className="font-bold text-xs text-orange-400 mb-2 flex items-center gap-2"
              style={{ fontFamily: "'Orbitron', monospace" }}
            >
              <FaBullseye className="text-orange-400" />
              CURRENT CHALLENGE
            </h3>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-300">Subject:</span>
                <span
                  className="text-orange-300 font-bold text-xs truncate ml-2"
                  style={{ fontFamily: "'Orbitron', monospace" }}
                >
                  {currentQuestion.subject}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-300">Difficulty:</span>
                <span
                  className={`text-xs font-bold capitalize px-2 py-1 rounded ${
                    currentQuestion.difficulty === "hard"
                      ? "bg-red-600 text-white"
                      : currentQuestion.difficulty === "medium"
                      ? "bg-orange-500 text-white"
                      : "bg-yellow-500 text-black"
                  }`}
                >
                  {currentQuestion.difficulty}
                </span>
              </div>
              <div className="text-center pt-1">
                <div
                  className="text-xs text-yellow-300 flex items-center justify-center gap-1"
                  style={{ fontFamily: "'Orbitron', monospace" }}
                >
                  XP:{" "}
                  {currentQuestion.difficulty === "hard"
                    ? "50"
                    : currentQuestion.difficulty === "medium"
                    ? "25"
                    : "10"}{" "}
                  <FaFire className="text-orange-400 text-xs" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Devil Rank Display */}
        <div className="bg-gradient-to-r from-red-900/40 to-orange-900/40 p-3 rounded-lg border border-red-500/50 text-center">
          <div className="text-lg mb-1 text-yellow-400">
            <FaCrown />
          </div>
          <p
            className="text-xs text-gray-300"
            style={{ fontFamily: "'Orbitron', monospace" }}
          >
            CURRENT RANK
          </p>
          <p
            className="font-bold text-sm text-yellow-400 truncate"
            style={{
              fontFamily: "'Orbitron', monospace",
              textShadow: "0 0 8px rgba(251, 191, 36, 0.7)",
            }}
          >
            {stats.rank || "NOVICE"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
