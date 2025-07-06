import React from "react";

const MCQComponent = ({ options, onAnswerSelect, selectedAnswer }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => onAnswerSelect(index.toString())}
          className={`p-4 rounded-lg text-left border-2 transition-all duration-200 ${
            selectedAnswer === index.toString()
              ? "bg-red-600 border-red-400 scale-105"
              : "bg-gray-800 border-gray-700 hover:border-red-500"
          }`}
        >
          <span className="font-mono mr-3 text-red-400">
            {String.fromCharCode(65 + index)}.
          </span>
          <span className="text-lg">{option.text}</span>
        </button>
      ))}
    </div>
  );
};

export default MCQComponent;
