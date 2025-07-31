import { Handle, Position } from "reactflow";
import { FaLock, FaCrown, FaStarOfLife, FaBolt } from "react-icons/fa";
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
      statusIcon = <FaBolt className="text-orange-400" />;
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
      className={`w-52 p-5 rounded-xl border-2 shadow-xl backdrop-blur-sm ${borderColor} ${bgColor} ${glowColor} transition-all duration-300`}
      initial={{ opacity: 0, scale: 0.3, y: 50, rotateX: -15 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
        rotateX: 0,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 15,
        mass: 0.8,
        delay: Math.random() * 0.3,
      }}
      whileHover={{
        scale: 1.08,
        y: -8,
        rotateY: 5,
        boxShadow:
          status === "mastered"
            ? "0 15px 40px rgba(251, 191, 36, 0.4), 0 0 25px rgba(251, 191, 36, 0.2)"
            : status === "unlocked"
            ? "0 15px 40px rgba(249, 115, 22, 0.4), 0 0 25px rgba(249, 115, 22, 0.2)"
            : "0 15px 30px rgba(107, 114, 128, 0.3), 0 0 15px rgba(107, 114, 128, 0.1)",
        transition: { type: "spring", stiffness: 400, damping: 25 },
      }}
      whileTap={{
        scale: 0.95,
        transition: { type: "spring", stiffness: 600, damping: 30 },
      }}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-red-500 !border-2 !border-orange-400 !w-3 !h-3"
        style={{
          transform: "translateZ(10px)",
        }}
      />

      <motion.div
        className="flex items-center mb-3"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
      >
        <motion.div
          className="mr-3 text-2xl"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 20,
            delay: 0.3,
          }}
          whileHover={{
            scale: 1.2,
            rotate:
              status === "unlocked" ? 15 : status === "mastered" ? -15 : 0,
            transition: { type: "spring", stiffness: 400 },
          }}
        >
          {statusIcon}
        </motion.div>
        <motion.h3
          className={`font-bold text-lg ${textColor}`}
          style={{ fontFamily: "Orbitron, monospace" }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
        >
          {name}
        </motion.h3>
      </motion.div>

      <motion.div
        className="mb-3"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 250 }}
      >
        <motion.p
          className="text-xs text-orange-300 mb-2 flex items-center gap-1"
          style={{ fontFamily: "Rajdhani, sans-serif" }}
          initial={{ x: -15, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 300 }}
        >
          <motion.span
            initial={{ rotate: -90, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ delay: 0.7, type: "spring", stiffness: 400 }}
          >
            <FaStarOfLife className="text-orange-400" />
          </motion.span>
          Progress: {progress.correct} / {progress.total}
        </motion.p>
        <div className="w-full bg-gray-800 rounded-full h-3 border border-gray-600 overflow-hidden">
          <motion.div
            className={`h-3 rounded-full ${
              status === "mastered"
                ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                : status === "unlocked"
                ? "bg-gradient-to-r from-orange-500 to-red-500"
                : "bg-gradient-to-r from-gray-600 to-gray-700"
            }`}
            initial={{ width: 0, x: "-100%" }}
            animate={{ width: `${progressPercentage}%`, x: "0%" }}
            transition={{
              delay: 0.8,
              type: "spring",
              stiffness: 100,
              damping: 20,
              duration: 1.2,
            }}
            whileHover={{
              boxShadow: "inset 0 0 10px rgba(255,255,255,0.2)",
              transition: { duration: 0.2 },
            }}
          />
        </div>
        <motion.p
          className="text-xs text-center mt-1 text-orange-200"
          style={{ fontFamily: "Rajdhani, sans-serif" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          {progressPercentage.toFixed(0)}% Complete
        </motion.p>
      </motion.div>

      {status === "mastered" && (
        <motion.div
          className="text-center text-yellow-400 text-xs font-bold flex items-center justify-center gap-1"
          style={{ fontFamily: "Rajdhani, sans-serif" }}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            delay: 1.2,
            type: "spring",
            stiffness: 300,
            damping: 15,
          }}
          whileHover={{
            scale: 1.1,
            textShadow: "0 0 8px rgba(251, 191, 36, 0.8)",
            transition: { duration: 0.2 },
          }}
        >
          <motion.span
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <FaCrown className="text-yellow-400" />
          </motion.span>
          MASTERED
          <motion.span
            animate={{
              rotate: [0, -10, 10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          >
            <FaCrown className="text-yellow-400" />
          </motion.span>
        </motion.div>
      )}

      {status === "unlocked" && (
        <motion.div
          className="text-center text-orange-400 text-xs font-bold flex items-center justify-center gap-1"
          style={{ fontFamily: "Rajdhani, sans-serif" }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2, type: "spring", stiffness: 250 }}
          whileHover={{
            scale: 1.05,
            textShadow: "0 0 8px rgba(249, 115, 22, 0.8)",
            transition: { duration: 0.2 },
          }}
        >
          <motion.span
            animate={{
              rotate: [0, 15, -15, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <FaBolt className="text-orange-400" />
          </motion.span>
          AVAILABLE
          <motion.span
            animate={{
              rotate: [0, -15, 15, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3,
            }}
          >
            <FaBolt className="text-orange-400" />
          </motion.span>
        </motion.div>
      )}

      {status === "locked" && (
        <motion.div
          className="text-center text-gray-500 text-xs font-bold flex items-center justify-center gap-1"
          style={{ fontFamily: "Rajdhani, sans-serif" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <FaLock className="text-gray-500" />
          LOCKED
        </motion.div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-red-500 !border-2 !border-orange-400 !w-3 !h-3"
        style={{
          transform: "translateZ(10px)",
        }}
      />
    </motion.div>
  );
};

export default CustomNode;
