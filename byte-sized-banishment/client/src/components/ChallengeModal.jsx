import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";

const ChallengeModal = ({ isOpen, onClose, friend, token }) => {
  const [subject, setSubject] = useState("JavaScript");
  const [loading, setLoading] = useState(false);

  const subjects = ["JavaScript", "Python", "Data Structures"];

  const handleChallenge = async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(
        "http://localhost:5000/api/duels/challenge",
        { opponentId: friend._id, subject },
        config
      );
      toast.success(`Challenge sent to ${friend.username}!`);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send challenge.");
    } finally {
      setLoading(false);
    }
  };

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
          className="bg-gray-800 rounded-2xl p-8 w-full max-w-md m-4 relative border-2 border-red-500/50"
          initial={{ scale: 0.7 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.7 }}
        >
          <h2 className="text-2xl font-bold text-center mb-2 text-red-400">
            Challenge {friend.username}
          </h2>
          <p className="text-center text-gray-400 mb-6">
            Select a subject for your 5-question duel.
          </p>

          <div className="mb-6">
            <label className="block text-gray-400 mb-2" htmlFor="subject">
              Subject
            </label>
            <select
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {subjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={onClose}
              className="font-bold py-2 px-8 rounded-lg bg-gray-600 hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleChallenge}
              disabled={loading}
              className="font-bold py-2 px-8 rounded-lg bg-red-600 hover:bg-red-500 transition-colors disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Duel"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChallengeModal;
