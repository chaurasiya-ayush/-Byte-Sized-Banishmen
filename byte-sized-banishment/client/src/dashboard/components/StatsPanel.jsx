import React from "react";
import { FaShieldAlt, FaFistRaised, FaFire, FaCrown } from "react-icons/fa";

const StatsPanel = ({ stats }) => {
  const xpPercentage = (stats.xp / (stats.level * 100)) * 100;

  return (
    <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 shadow-lg">
      <h3 className="text-2xl font-bold text-red-500 mb-6">The Soul Mirror</h3>
      <div className="mb-6">
        <div className="flex justify-between items-end mb-1">
          <span className="font-bold text-lg">Level {stats.level}</span>
          <span className="text-sm text-gray-400">
            {stats.xp} / {stats.level * 100} XP
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div
            className="bg-red-600 h-2.5 rounded-full"
            style={{ width: `${xpPercentage}%` }}
          ></div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="bg-gray-900 p-4 rounded-lg">
          <FaCrown className="mx-auto text-yellow-500 text-3xl mb-2" />
          <p className="text-lg font-semibold">{stats.rank}</p>
          <p className="text-xs text-gray-400">Rank</p>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg">
          <FaFistRaised className="mx-auto text-green-500 text-3xl mb-2" />
          <p className="text-lg font-semibold">{stats.soulsClaimed}</p>
          <p className="text-xs text-gray-400">Souls Claimed</p>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg">
          <FaFire className="mx-auto text-orange-500 text-3xl mb-2" />
          <p className="text-lg font-semibold">{stats.devilsFavor}</p>
          <p className="text-xs text-gray-400">Devil's Favor</p>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg">
          <FaShieldAlt className="mx-auto text-blue-500 text-3xl mb-2" />
          <p className="text-lg font-semibold">None</p>
          <p className="text-xs text-gray-400">Active Blessing</p>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
