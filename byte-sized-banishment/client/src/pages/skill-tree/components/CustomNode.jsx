import React from "react";
import { Handle, Position } from "reactflow";
import { FaLock, FaUnlock, FaCheckCircle } from "react-icons/fa";

const CustomNode = ({ data }) => {
  const { name, status, progress } = data;

  let statusIcon, borderColor, bgColor, textColor;

  switch (status) {
    case "mastered":
      statusIcon = <FaCheckCircle className="text-green-400" />;
      borderColor = "border-green-500";
      bgColor = "bg-green-900/50";
      textColor = "text-green-300";
      break;
    case "unlocked":
      statusIcon = <FaUnlock className="text-yellow-400" />;
      borderColor = "border-yellow-500";
      bgColor = "bg-yellow-900/50";
      textColor = "text-yellow-300";
      break;
    case "locked":
    default:
      statusIcon = <FaLock className="text-gray-500" />;
      borderColor = "border-gray-600";
      bgColor = "bg-gray-800/50";
      textColor = "text-gray-400";
      break;
  }

  const progressPercentage =
    progress.total > 0 ? (progress.correct / progress.total) * 100 : 0;

  return (
    <div
      className={`w-48 p-4 rounded-lg border-2 shadow-lg backdrop-blur-sm ${borderColor} ${bgColor}`}
    >
      <Handle type="target" position={Position.Top} className="!bg-gray-500" />
      <div className="flex items-center mb-2">
        <div className="mr-2 text-xl">{statusIcon}</div>
        <h3 className={`font-bold text-lg ${textColor}`}>{name}</h3>
      </div>
      <p className="text-xs text-gray-400 mb-2">
        Progress: {progress.correct} / {progress.total}
      </p>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className="bg-blue-500 h-2 rounded-full"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-gray-500"
      />
    </div>
  );
};

export default CustomNode;
