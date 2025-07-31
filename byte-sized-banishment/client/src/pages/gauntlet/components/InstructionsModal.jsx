import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaCode,
  FaLightbulb,
  FaExclamationTriangle,
  FaCheck,
  FaPlay,
  FaKeyboard,
  FaClipboardList,
} from "react-icons/fa";
import { GiDevilMask } from "react-icons/gi";

const InstructionsModal = ({ isOpen, onClose, questionType }) => {
  if (!isOpen) return null;

  const getInstructions = () => {
    switch (questionType) {
      case "mcq":
        return {
          title: "Multiple Choice Questions",
          icon: <FaClipboardList className="text-blue-400" />,
          sections: [
            {
              title: "How it works:",
              icon: <FaLightbulb className="text-yellow-400" />,
              content: [
                "Read the question carefully",
                "Select ONE correct answer from the given options",
                "Click 'Submit Answer' to confirm your choice",
                "You cannot change your answer after submission",
              ],
            },
            {
              title: "Scoring:",
              icon: <FaCheck className="text-green-400" />,
              content: [
                "Correct answer: +10 XP (Easy), +25 XP (Medium), +50 XP (Hard)",
                "Wrong answer: Lose 1 strike",
                "Time's up: Lose 1 strike",
              ],
            },
          ],
        };

      case "integer":
        return {
          title: "Integer/Numerical Questions",
          icon: <FaKeyboard className="text-purple-400" />,
          sections: [
            {
              title: "How it works:",
              icon: <FaLightbulb className="text-yellow-400" />,
              content: [
                "Read the problem statement carefully",
                "Calculate the numerical answer",
                "Enter ONLY the number (no units, text, or symbols)",
                "For decimals, use dot (.) as decimal separator",
                "For negative numbers, include the minus sign (-)",
              ],
            },
            {
              title: "Examples:",
              icon: <FaCheck className="text-green-400" />,
              content: [
                "✅ Correct: 42, -15, 3.14, 0",
                "❌ Wrong: '42', 42px, forty-two, 3,14",
              ],
            },
          ],
        };

      case "code":
        return {
          title: "Coding Questions - Devil's Challenge",
          icon: <FaCode className="text-red-400" />,
          sections: [
            {
              title: "📝 Code Structure Requirements:",
              icon: <FaLightbulb className="text-yellow-400" />,
              content: [
                "Write your solution using the provided template",
                "For C++/Java: Read from stdin, write to stdout in main() function",
                "For Python: Use input() to read, print() to output",
                "For JavaScript: Use readline interface for input, console.log for output",
                "Look at the Input/Output examples shown below the code editor",
                "Your program should handle the exact input format specified",
              ],
            },
            {
              title: "🔍 Input/Output Format:",
              icon: <FaKeyboard className="text-cyan-400" />,
              content: [
                "Study the example input/output cases carefully",
                "Input format is EXACTLY as shown in examples",
                "Output must match the expected format precisely",
                "Pay attention to spaces, newlines, and data types",
                "For multiple inputs: read line by line or space-separated",
                "For multiple outputs: print each result as specified",
              ],
            },
            {
              title: "⚡ How Code is Evaluated:",
              icon: <FaPlay className="text-orange-400" />,
              content: [
                "Your code is executed using Judge0 API with real test cases",
                "Code must compile and produce correct output for all test cases",
                "Multiple programming languages supported (JavaScript, Python, Java, C++, etc.)",
                "Execution includes input/output testing and error checking",
                "Real-time compilation and runtime error detection",
              ],
            },
            {
              title: "🎯 Scoring System:",
              icon: <FaCheck className="text-green-400" />,
              content: [
                "All Test Cases Pass: Full XP (Easy: +10, Medium: +25, Hard: +50)",
                "Compilation Error: Lose 1 strike",
                "Runtime Error: Lose 1 strike",
                "Wrong Output: Lose 1 strike",
                "Timeout: Lose 1 strike",
              ],
            },
            {
              title: "⚠️ Important Notes:",
              icon: <FaExclamationTriangle className="text-red-400" />,
              content: [
                "Code is executed in a secure sandbox environment",
                "Your solution must handle all provided test cases",
                "Pay attention to input/output format requirements",
                "Ensure your code compiles without errors",
                "Consider edge cases and time complexity",
              ],
            },
            {
              title: "🔧 Available Languages:",
              icon: <FaCode className="text-cyan-400" />,
              content: [
                "JavaScript (Default for Data Structures/Algorithms)",
                "Python (Scientific computing, general programming)",
                "Java (Object-oriented programming)",
                "C++ (System programming, competitive coding)",
                "Choose your preferred language for DSA questions",
              ],
            },
          ],
        };

      default:
        return {
          title: "General Instructions",
          icon: <FaLightbulb className="text-yellow-400" />,
          sections: [
            {
              title: "How to play:",
              content: [
                "Answer questions to earn XP and progress",
                "You have 3 strikes - lose all and face punishment",
                "Timer varies by difficulty and question type",
                "Sessions are unlimited - play until you quit or lose all strikes",
              ],
            },
          ],
        };
    }
  };

  const instructions = getInstructions();

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-gradient-to-br from-gray-900 via-black to-red-900 border-2 border-red-600/50 rounded-xl p-6 max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
          style={{
            boxShadow: "0 0 50px rgba(220, 38, 38, 0.3)",
          }}
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6 border-b border-red-600/30 pb-4">
            <div className="flex items-center gap-3">
              <GiDevilMask className="text-3xl text-red-400" />
              <div>
                <h2
                  className="text-2xl font-bold text-red-300 flex items-center gap-2"
                  style={{ fontFamily: "'Orbitron', monospace" }}
                >
                  {instructions.icon}
                  {instructions.title}
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  Master the devil's challenges with these guidelines
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-red-400 transition-colors text-2xl"
              title="Close instructions"
            >
              <FaTimes />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {instructions.sections.map((section, index) => (
              <motion.div
                key={index}
                className="bg-black/40 border border-red-700/30 rounded-lg p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <h3
                  className="text-lg font-semibold text-orange-300 mb-3 flex items-center gap-2"
                  style={{ fontFamily: "'Orbitron', monospace" }}
                >
                  {section.icon}
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.content.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="text-gray-300 text-sm flex items-start gap-2"
                    >
                      <span className="text-red-400 mt-1 text-xs">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-red-600/30 text-center">
            <p className="text-gray-400 text-sm mb-4">
              Remember: The devil rewards those who read carefully and code
              wisely!
            </p>
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-bold py-2 px-6 rounded-lg transition-all duration-200"
              style={{ fontFamily: "'Orbitron', monospace" }}
            >
              Got it! Let's Code
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InstructionsModal;
