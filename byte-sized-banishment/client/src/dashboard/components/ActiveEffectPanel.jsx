import React from "react";
import { useCountdown } from "../../hooks/useCountdown";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

const ActiveEffectPanel = ({ effect }) => {
  if (!effect || !effect.type) {
    return null; // Don't render anything if there's no active effect
  }

  const { minutes, seconds } = useCountdown(effect.expiresAt);
  const isBlessing = effect.type === "blessing";

  const containerClasses = isBlessing
    ? "border-green-500 bg-green-900/50 shadow-green-500/20"
    : "border-red-500 bg-red-900/50 shadow-red-500/20 animate-pulse";

  const iconClasses = isBlessing ? "text-green-400" : "text-red-400";
  const timerClasses = isBlessing
    ? "bg-green-500/20 text-green-300"
    : "bg-red-500/20 text-red-300";

  return (
    <div
      className={`border-2 rounded-2xl p-4 flex items-center space-x-4 shadow-lg ${containerClasses}`}
    >
      <div className={`text-4xl ${iconClasses}`}>
        {isBlessing ? <FaCheckCircle /> : <FaExclamationTriangle />}
      </div>
      <div className="flex-grow">
        <p className="font-bold text-lg">{effect.name}</p>
        <p className="text-sm text-gray-300">
          {isBlessing ? "XP gains are increased!" : "XP gains are reduced!"}
        </p>
      </div>
      <div className={`font-mono text-xl px-3 py-1 rounded-md ${timerClasses}`}>
        {minutes}:{seconds}
      </div>
    </div>
  );
};

export default ActiveEffectPanel;
