import React from "react";
import { FaFistRaised, FaFire, FaCrown } from "react-icons/fa";
import { GiLevelEndFlag } from "react-icons/gi";

const StatsPanel = ({ stats }) => {
  // Calculate the XP percentage for the progress bar
  const xpPercentage =
    stats.xpToNextLevel > 0 ? (stats.xp / stats.xpToNextLevel) * 100 : 0;

  return (
    <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 shadow-lg">
      <h3 className="text-2xl font-bold text-red-500 mb-6">The Soul Mirror</h3>

      {/* Level and XP Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-end mb-1 font-mono">
          <span className="font-bold text-lg text-green-400">
            Level {stats.level}
          </span>
          <span className="text-sm text-gray-400">
            {stats.xp} / {stats.xpToNextLevel} XP
          </span>
        </div>
        <div className="w-full bg-gray-900 rounded-full h-4 border-2 border-gray-700">
          <div
            className="bg-gradient-to-r from-yellow-500 to-orange-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${xpPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Core Stats Grid */}
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="bg-gray-900 p-4 rounded-lg">
          <FaCrown className="mx-auto text-yellow-400 text-3xl mb-2" />
          <p className="text-lg font-semibold">{stats.rank}</p>
          <p className="text-xs text-gray-400">Rank</p>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg">
          <FaFistRaised className="mx-auto text-green-400 text-3xl mb-2" />
          <p className="text-lg font-semibold">{stats.soulsClaimed}</p>
          <p className="text-xs text-gray-400">Souls Claimed</p>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg">
          <FaFire className="mx-auto text-orange-400 text-3xl mb-2" />
          <p className="text-lg font-semibold">{stats.devilsFavor}</p>
          <p className="text-xs text-gray-400">Devil's Favor</p>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg">
          <GiLevelEndFlag className="mx-auto text-blue-400 text-3xl mb-2" />
          <p className="text-lg font-semibold">{stats.level}</p>
          <p className="text-xs text-gray-400">Current Level</p>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
