import React from "react";
import {
  FaTimes,
  FaTrophy,
  FaClock,
  FaFire,
  FaBullseye,
  FaStar,
  FaGem,
} from "react-icons/fa";
import { GiSwordman } from "react-icons/gi";

const SessionResultsModal = ({
  isOpen,
  onClose,
  sessionSummary,
  completionReason,
  punishment,
}) => {
  if (!isOpen || !sessionSummary) return null;

  const {
    questionsCompleted,
    totalQuestions,
    correctAnswers,
    incorrectAnswers,
    finalScore,
    totalXpGained,
    maxCorrectStreak,
    accuracyRate,
    sessionDuration,
    difficultyProgression,
  } = sessionSummary;

  const isSuccess = completionReason === "completed";
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getCompletionMessage = () => {
    if (isSuccess) {
      if (accuracyRate >= 80) return "Outstanding Performance!";
      if (accuracyRate >= 60) return "Good Work!";
      return "Session Completed!";
    }
    return "Game Over!";
  };

  const getCompletionDescription = () => {
    if (isSuccess) {
      return "You've successfully completed your 15-question gauntlet session!";
    }
    return "You've lost all your strikes and must face the consequences...";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border-2 border-red-600 rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {isSuccess ? (
              <FaTrophy className="text-yellow-500 text-2xl" />
            ) : (
              <GiSwordman className="text-red-500 text-2xl" />
            )}
            <h2 className="text-2xl font-bold text-white">
              {getCompletionMessage()}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Description */}
        <p className="text-gray-300 mb-6 text-center">
          {getCompletionDescription()}
        </p>

        {/* Session Statistics */}
        <div className="space-y-4 mb-6">
          {/* Progress */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <FaBullseye className="text-blue-400" />
              Session Progress
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Questions Completed</p>
                <p className="text-white font-bold">
                  {totalQuestions === "unlimited"
                    ? questionsCompleted
                    : `${questionsCompleted}/${totalQuestions}`}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Accuracy Rate</p>
                <p
                  className={`font-bold ${
                    accuracyRate >= 70
                      ? "text-green-400"
                      : accuracyRate >= 50
                      ? "text-yellow-400"
                      : "text-red-400"
                  }`}
                >
                  {accuracyRate ? `${accuracyRate}%` : "0%"}
                </p>
              </div>
            </div>
          </div>

          {/* Answers Breakdown */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <FaStar className="text-yellow-400" />
              Answer Breakdown
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Correct Answers</p>
                <p className="text-green-400 font-bold">{correctAnswers}</p>
              </div>
              <div>
                <p className="text-gray-400">Incorrect Answers</p>
                <p className="text-red-400 font-bold">{incorrectAnswers}</p>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <FaFire className="text-orange-400" />
              Performance
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Max Streak</p>
                <p className="text-orange-400 font-bold">{maxCorrectStreak}</p>
              </div>
              <div>
                <p className="text-gray-400">Session Time</p>
                <p className="text-blue-400 font-bold flex items-center gap-1">
                  <FaClock className="text-xs" />
                  {formatTime(sessionDuration)}
                </p>
              </div>
            </div>
          </div>

          {/* Rewards */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <FaGem className="text-purple-400" />
              Rewards Earned
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Total Score</p>
                <p className="text-purple-400 font-bold">{finalScore}</p>
              </div>
              <div>
                <p className="text-gray-400">XP Gained</p>
                <p className="text-yellow-400 font-bold">+{totalXpGained}</p>
              </div>
            </div>
          </div>

          {/* Difficulty Progression */}
          {difficultyProgression && difficultyProgression.length > 0 && (
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3">
                Difficulty Journey
              </h3>
              <div className="flex flex-wrap gap-2">
                {difficultyProgression.map((diff, index) => (
                  <span
                    key={index}
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      diff === "easy"
                        ? "bg-green-600 text-white"
                        : diff === "medium"
                        ? "bg-yellow-600 text-white"
                        : "bg-red-600 text-white"
                    }`}
                  >
                    {diff}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Punishment (if failed) */}
        {!isSuccess && punishment && (
          <div className="bg-red-900 border-2 border-red-600 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-red-200 mb-2 flex items-center gap-2">
              <GiSwordman className="text-red-400" />
              Your Punishment
            </h3>
            <p className="text-red-100 text-sm">{punishment}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded transition-colors"
          >
            {isSuccess ? "Continue Studying" : "Accept Fate"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionResultsModal;
