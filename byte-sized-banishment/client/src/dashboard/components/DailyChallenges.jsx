import React from "react";
import { FaScroll, FaSkullCrossbones } from "react-icons/fa";

const DailyChallenges = ({ challenge, weakestLink }) => {
  return (
    <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 shadow-lg space-y-6">
      <h3 className="text-2xl font-bold text-red-500 border-b border-gray-700 pb-2">
        The Devil's Demands
      </h3>
      <div>
        <div className="flex items-center mb-2">
          <FaScroll className="text-yellow-400 text-2xl mr-3" />
          <h4 className="text-lg font-semibold">Daily Challenge</h4>
        </div>
        <p className="text-gray-300 text-sm">{challenge.description}</p>
        <p className="text-xs text-green-400 mt-1">
          Reward: {challenge.reward}
        </p>
      </div>
      <div>
        <div className="flex items-center mb-2">
          <FaSkullCrossbones className="text-gray-400 text-2xl mr-3" />
          <h4 className="text-lg font-semibold">Your Weakest Link</h4>
        </div>
        <p className="text-gray-300 text-sm">
          The Devil mocks your struggles with{" "}
          <span className="font-bold text-red-400">
            {weakestLink || "Nothing Yet"}
          </span>
          . Prove him wrong.
        </p>
      </div>
    </div>
  );
};

export default DailyChallenges;
