import React from "react";
import { Handle, Position } from "reactflow";
import {
  FaLock,
  FaUnlock,
  FaCheckCircle,
  FaFire,
  FaCrown,
} from "react-icons/fa";
import { motion } from "framer-motion";

const CustomNode = ({ data }) => {
  const { name, status, progress } = data;

  let statusIcon, borderColor, bgColor, textColor, glowColor;

  switch (status) {
    case "mastered":
      statusIcon = <FaCrown className="text-yellow-400" />;
      borderColor = "border-yellow-500";
      bgColor = "bg-gradient-to-br from-yellow-900/80 to-orange-900/60";
      textColor = "text-yellow-200";
      glowColor = "shadow-yellow-500/25";
      break;
    case "unlocked":
      statusIcon = <FaFire className="text-orange-400" />;
      borderColor = "border-orange-500";
      bgColor = "bg-gradient-to-br from-orange-900/80 to-red-900/60";
      textColor = "text-orange-200";
      glowColor = "shadow-orange-500/25";
      break;
    case "locked":
    default:
      statusIcon = <FaLock className="text-gray-500" />;
      borderColor = "border-gray-600";
      bgColor = "bg-gradient-to-br from-gray-900/80 to-black/60";
      textColor = "text-gray-400";
      glowColor = "shadow-gray-500/10";
      break;
  }

  const progressPercentage =
    progress.total > 0 ? (progress.correct / progress.total) * 100 : 0;

  return (
    <motion.div
      className={`w-52 p-5 rounded-xl border-2 shadow-xl backdrop-blur-sm ${borderColor} ${bgColor} ${glowColor} hover:scale-105 transition-all duration-300`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
      whileHover={{
        boxShadow:
          status === "mastered"
            ? "0 0 30px rgba(251, 191, 36, 0.4)"
            : status === "unlocked"
            ? "0 0 30px rgba(249, 115, 22, 0.4)"
            : "0 0 15px rgba(107, 114, 128, 0.2)",
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-red-500 !border-2 !border-orange-400 !w-3 !h-3"
      />

      <div className="flex items-center mb-3">
        <motion.div
          className="mr-3 text-2xl"
          animate={{
            rotate: status === "unlocked" ? [0, 5, -5, 0] : 0,
            scale: status === "mastered" ? [1, 1.1, 1] : 1,
          }}
          transition={{
            duration: 2,
            repeat:
              status === "unlocked" || status === "mastered" ? Infinity : 0,
          }}
        >
          {statusIcon}
        </motion.div>
        <h3
          className={`font-bold text-lg ${textColor}`}
          style={{ fontFamily: "Orbitron, monospace" }}
        >
          {name}
        </h3>
      </div>

      <div className="mb-3">
        <p
          className="text-xs text-orange-300 mb-2"
          style={{ fontFamily: "Rajdhani, sans-serif" }}
        >
          🔥 Progress: {progress.correct} / {progress.total}
        </p>
        <div className="w-full bg-gray-800 rounded-full h-3 border border-gray-600">
          <motion.div
            className={`h-3 rounded-full ${
              status === "mastered"
                ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                : status === "unlocked"
                ? "bg-gradient-to-r from-orange-500 to-red-500"
                : "bg-gradient-to-r from-gray-600 to-gray-700"
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
        <p
          className="text-xs text-center mt-1 text-orange-200"
          style={{ fontFamily: "Rajdhani, sans-serif" }}
        >
          {progressPercentage.toFixed(0)}% Complete
        </p>
      </div>

      {status === "mastered" && (
        <motion.div
          className="text-center text-yellow-400 text-xs font-bold"
          style={{ fontFamily: "Rajdhani, sans-serif" }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          👑 MASTERED 👑
        </motion.div>
      )}

      {status === "unlocked" && (
        <motion.div
          className="text-center text-orange-400 text-xs font-bold"
          style={{ fontFamily: "Rajdhani, sans-serif" }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          🔥 AVAILABLE 🔥
        </motion.div>
      )}

      {status === "locked" && (
        <div
          className="text-center text-gray-500 text-xs font-bold"
          style={{ fontFamily: "Rajdhani, sans-serif" }}
        >
          🔒 LOCKED
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-red-500 !border-2 !border-orange-400 !w-3 !h-3"
      />
    </motion.div>
  );
};

export default CustomNode;
