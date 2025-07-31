import React, { useState, useEffect } from "react";
import { FaClock, FaExclamationTriangle } from "react-icons/fa";
import { motion } from "framer-motion";

const QuestionTimer = ({
  duration,
  onTimeout,
  isActive = true,
  questionId,
  difficulty,
  questionType,
  startTime, // Add startTime prop to calculate elapsed time
}) => {
  const [timeLeft, setTimeLeft] = useState(() => {
    // Calculate remaining time based on start time if provided
    if (startTime) {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = duration - elapsed;
      return Math.max(0, remaining);
    }
    return duration;
  });
  const [isWarning, setIsWarning] = useState(false);
  const [isDanger, setIsDanger] = useState(false);

  useEffect(() => {
    // Calculate remaining time based on start time if provided
    if (startTime) {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = duration - elapsed;
      const calculatedTimeLeft = Math.max(0, remaining);
      setTimeLeft(calculatedTimeLeft);

      // If time has already expired, trigger timeout immediately
      if (calculatedTimeLeft <= 0) {
        setTimeout(() => onTimeout(), 100); // Small delay to ensure component is ready
      }
    } else {
      setTimeLeft(duration);
    }
    setIsWarning(false);
    setIsDanger(false);
  }, [duration, questionId, startTime, onTimeout]);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;

        // Set warning states
        if (newTime <= duration * 0.25) {
          setIsDanger(true);
          setIsWarning(false);
        } else if (newTime <= duration * 0.5) {
          setIsWarning(true);
        }

        // Handle timeout
        if (newTime <= 0) {
          onTimeout();
          return 0;
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, timeLeft, duration, onTimeout]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimerColor = () => {
    if (isDanger) return "text-red-400 border-red-500";
    if (isWarning) return "text-yellow-400 border-yellow-500";
    return "text-green-400 border-green-500";
  };

  const getTimerBg = () => {
    if (isDanger) return "bg-red-900/20";
    if (isWarning) return "bg-yellow-900/20";
    return "bg-green-900/20";
  };

  const getProgressColor = () => {
    if (isDanger) return "from-red-500 to-red-600";
    if (isWarning) return "from-yellow-500 to-orange-500";
    return "from-green-500 to-blue-500";
  };

  const progressPercent = (timeLeft / duration) * 100;

  if (!isActive) return null;

  return (
    <motion.div
      className={`fixed top-4 right-4 z-30 ${getTimerBg()} backdrop-blur-sm border-2 ${getTimerColor()} p-3 rounded-lg shadow-lg`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: isDanger ? [1, 1.05, 1] : 1,
      }}
      transition={{
        duration: isDanger ? 0.5 : 0.3,
        repeat: isDanger ? Infinity : 0,
      }}
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {isDanger ? (
            <FaExclamationTriangle
              className={`${
                getTimerColor().split(" ")[0]
              } text-lg animate-pulse`}
            />
          ) : (
            <FaClock className={`${getTimerColor().split(" ")[0]} text-lg`} />
          )}
          <span
            className={`font-bold text-lg ${getTimerColor().split(" ")[0]}`}
            style={{ fontFamily: "'Orbitron', monospace" }}
          >
            {formatTime(timeLeft)}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${getProgressColor()}`}
            initial={{ width: "100%" }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question type indicator */}
      <div className="text-xs text-gray-400 mt-1 text-center">
        <span className="capitalize">{difficulty}</span> •{" "}
        <span className="uppercase">{questionType}</span>
      </div>
    </motion.div>
  );
};

export default QuestionTimer;
