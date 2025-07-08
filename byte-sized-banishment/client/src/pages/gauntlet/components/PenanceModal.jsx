import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaExclamationTriangle } from "react-icons/fa";

const PenanceModal = ({ punishment, onAcknowledge }) => {
  if (!punishment) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-2xl text-center relative border-4 border-red-700"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
        >
          <FaExclamationTriangle className="text-6xl text-red-500 mx-auto mb-4" />
          <h1
            className="text-4xl font-black uppercase text-red-500 mb-2"
            style={{ textShadow: "0 0 10px rgba(239, 68, 68, 0.7)" }}
          >
            Your Penance
          </h1>
          <p className="text-gray-400 mb-8">
            You have failed the trial. The Devil demands retribution.
          </p>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
            <p className="text-2xl font-bold text-white mb-3">
              "{punishment.task}"
            </p>
            <p className="text-md italic text-gray-300">
              ~ {punishment.quote} ~
            </p>
          </div>

          <motion.button
            onClick={onAcknowledge}
            className="font-bold py-3 px-12 rounded-lg bg-red-600 hover:bg-red-500 text-white text-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            I Understand
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PenanceModal;
