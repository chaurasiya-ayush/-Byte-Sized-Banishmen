import React from "react";
import { FaHeart, FaHeartBroken } from "react-icons/fa";

const StatusBar = ({ stats }) => {
  const totalStrikes = 3;
  const hearts = Array.from({ length: totalStrikes }, (_, i) =>
    i < stats.strikesLeft ? (
      <FaHeart key={i} className="text-red-500" />
    ) : (
      <FaHeartBroken key={i} className="text-gray-600" />
    )
  );

  return (
    <div className="flex justify-between items-center bg-gray-900 p-3 rounded-lg border border-gray-700 mb-6">
      <div className="flex items-center space-x-2 text-2xl">
        <span className="font-bold text-gray-400 mr-2">Strikes:</span>
        {hearts}
      </div>
      <div className="text-lg">
        <span className="font-bold text-gray-400">Score: </span>
        <span className="text-white font-semibold">{stats.score}</span>
      </div>
    </div>
  );
};

export default StatusBar;
