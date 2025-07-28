import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaExclamationTriangle, FaShieldAlt, FaRunning } from "react-icons/fa";

const QuitModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md m-4 relative text-white border-2 border-red-500/50"
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.7, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <div className="text-6xl text-orange-400 text-center mb-4">
            <FaExclamationTriangle />
          </div>
          <h2 className="text-2xl font-bold text-center mb-4 text-red-400">
            Abandon Trial?
          </h2>
          <p className="text-center text-gray-300 mb-8">
            Are you sure you wish to flee? The Devil will not be pleased, and
            your progress in this session will be lost.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={onCancel}
              className="font-bold py-2 px-8 rounded-lg bg-gray-600 hover:bg-gray-500 transition-colors flex items-center gap-2"
            >
              <FaShieldAlt className="text-base" />
              Stay
            </button>
            <button
              onClick={onConfirm}
              className="font-bold py-2 px-8 rounded-lg bg-red-600 hover:bg-red-500 transition-colors flex items-center gap-2"
            >
              <FaRunning className="text-base" />
              Flee
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QuitModal;
