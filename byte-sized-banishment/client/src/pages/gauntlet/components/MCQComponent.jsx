import React from "react";
import { motion } from "framer-motion";

const MCQComponent = ({ options, onAnswerSelect, selectedAnswer }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {options.map((option, index) => (
        <motion.button
          key={index}
          onClick={() => onAnswerSelect(index.toString())}
          className={`p-4 rounded-lg text-left border-2 transition-all duration-200 relative overflow-hidden ${
            selectedAnswer === index.toString()
              ? "bg-gradient-to-r from-red-600 to-orange-500 border-red-400 text-white shadow-lg"
              : "bg-gradient-to-r from-black/60 to-red-900/20 border-red-700/50 hover:border-red-400 hover:from-red-900/30 hover:to-orange-900/20"
          }`}
          style={{
            boxShadow:
              selectedAnswer === index.toString()
                ? "0 0 25px rgba(220, 38, 38, 0.5)"
                : "0 0 10px rgba(220, 38, 38, 0.1)",
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          {/* Option letter with devilish styling */}
          <span
            className={`font-mono mr-3 text-xl font-bold ${
              selectedAnswer === index.toString()
                ? "text-yellow-300"
                : "text-orange-400"
            }`}
            style={{
              fontFamily: "'Orbitron', monospace",
              textShadow: "0 0 10px rgba(251, 191, 36, 0.7)",
            }}
          >
            {String.fromCharCode(65 + index)}.
          </span>

          {/* Option text */}
          <span
            className={`text-lg ${
              selectedAnswer === index.toString()
                ? "text-white"
                : "text-gray-200"
            }`}
            style={{ fontFamily: "'Rajdhani', sans-serif" }}
          >
            {option.text}
          </span>

          {/* Selected indicator */}
          {selectedAnswer === index.toString() && (
            <motion.div
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-2xl"
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              🔥
            </motion.div>
          )}
        </motion.button>
      ))}
    </div>
  );
};

export default MCQComponent;
