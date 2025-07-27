import React from "react";
import { FaHeart, FaStar, FaQuestionCircle } from "react-icons/fa";
import { GiLevelEndFlag } from "react-icons/gi";

const StatusBar = ({ stats, totalQuestions }) => {
  const strikes = Array.from({ length: 3 }, (_, i) => (
    <FaHeart
      key={i}
      className={`transition-all duration-300 ${
        i < stats.strikesLeft ? "text-red-500" : "text-gray-700"
      }`}
    />
  ));

  const statItems = [
    {
      icon: <FaStar className="text-yellow-400" />,
      label: "Score",
      value: stats.score,
    },
    {
      icon: <GiLevelEndFlag className="text-blue-400" />,
      label: "Level",
      value: stats.level,
    },
    {
      icon: <FaQuestionCircle className="text-gray-400" />,
      label: "Progress",
      value: `${stats.questionNum || 1} / ${totalQuestions || "??"}`,
    },
  ];

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border-r-2 border-red-500/20 p-6 flex flex-col gap-8">
      <div>
        <h3 className="font-bold text-lg text-red-400 mb-3">Strikes</h3>
        <div className="flex items-center gap-3 text-4xl">{strikes}</div>
      </div>

      <div className="flex-grow space-y-4">
        <h3 className="font-bold text-lg text-red-400 mb-3">Session Stats</h3>
        {statItems.map((item) => (
          <div
            key={item.label}
            className="bg-black/30 p-3 rounded-lg flex items-center gap-4"
          >
            <div className="text-2xl">{item.icon}</div>
            <div>
              <p className="text-sm text-gray-400">{item.label}</p>
              <p className="font-bold text-white text-xl">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusBar;
