import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GiDevilMask } from "react-icons/gi";
import { FaScroll, FaFire } from "react-icons/fa";

const PenanceModal = ({ punishment, onAcknowledge }) => {
  if (!punishment) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="bg-gradient-to-br from-black/90 to-red-900/80 rounded-xl shadow-2xl p-6 w-full max-w-md text-center border-2 border-red-500/60 backdrop-blur-sm"
          style={{
            boxShadow: "0 0 30px rgba(220, 38, 38, 0.4)",
          }}
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: "tween", duration: 0.4, ease: "easeOut" }}
        >
          {/* Simple devil header */}
          <div className="text-5xl mb-3 text-red-500">
            <GiDevilMask />
          </div>

          <h1
            className="text-2xl font-bold text-red-400 mb-3"
            style={{
              fontFamily: "'Orbitron', monospace",
              textShadow: "0 0 10px rgba(248, 113, 113, 0.6)",
            }}
          >
            YOUR PENANCE
          </h1>

          <p
            className="text-gray-300 mb-4 text-sm"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}
          >
            You have <span className="text-red-400 font-bold">failed</span> the
            trial.
          </p>

          <div
            className="bg-black/60 border border-red-600/50 rounded-lg p-4 mb-4"
            style={{
              boxShadow: "0 0 15px rgba(220, 38, 38, 0.2)",
            }}
          >
            <div className="flex items-center justify-center mb-2">
              <FaScroll className="text-xl mr-2 text-orange-400" />
              <span
                className="text-xs text-orange-400 font-bold"
                style={{ fontFamily: "'Orbitron', monospace" }}
              >
                DEVIL'S DECREE
              </span>
            </div>
            <p
              className="text-lg font-bold text-yellow-300 mb-2 leading-tight"
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                textShadow: "0 0 8px rgba(253, 224, 71, 0.4)",
              }}
            >
              "{punishment.task}"
            </p>
            <p
              className="text-sm italic text-red-300"
              style={{ fontFamily: "'Rajdhani', sans-serif" }}
            >
              ~ {punishment.quote} ~
            </p>
          </div>

          <motion.button
            onClick={onAcknowledge}
            className="font-bold py-3 px-8 rounded-lg bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white text-lg transition-all border border-red-500/50 flex items-center gap-2 justify-center"
            style={{
              fontFamily: "'Orbitron', monospace",
              boxShadow: "0 0 15px rgba(220, 38, 38, 0.3)",
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <FaFire className="text-base" />I Accept
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PenanceModal;
