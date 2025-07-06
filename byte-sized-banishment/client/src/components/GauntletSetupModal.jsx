import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const GauntletSetupModal = ({ showModal, setShowModal }) => {
  const [subject, setSubject] = useState("JavaScript");
  const [difficulty, setDifficulty] = useState("easy");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const subjects = ["JavaScript", "Python", "Data Structures"]; // This could be fetched from an API later

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("The Devil is preparing your trial...");

    try {
      const token = localStorage.getItem("authToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.post(
        "http://localhost:5000/api/gauntlet/start",
        { subject, difficulty },
        config
      );

      toast.success("Your trial begins!", { id: toastId });
      setShowModal(false);

      // Navigate to the gauntlet page with the initial data
      navigate("/gauntlet", { state: { sessionData: data } });
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to start the gauntlet.";
      toast.error(message, { id: toastId });
      setLoading(false);
    }
  };

  if (!showModal) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setShowModal(false)}
      >
        <motion.div
          className="bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-lg m-4 relative text-white border border-gray-700"
          initial={{ y: "-50vh", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "50vh", opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-3xl font-bold text-center mb-4 text-red-500">
            Choose Your Torment
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                className="block text-gray-400 mb-2 text-lg"
                htmlFor="subject"
              >
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
            <div className="mb-8">
              <label className="block text-gray-400 mb-3 text-lg">
                Starting Difficulty
              </label>
              <div className="grid grid-cols-3 gap-4">
                {["easy", "medium", "hard"].map((d) => (
                  <button
                    type="button"
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`py-3 rounded-lg capitalize font-semibold border-2 transition-all ${
                      difficulty === d
                        ? "bg-red-600 border-red-500"
                        : "bg-gray-700 border-gray-600 hover:border-red-500"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-white hover:bg-red-500 text-gray-900 hover:text-white font-bold py-3 rounded-lg text-lg transition-all transform hover:scale-105 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Summoning..." : "Start Trial"}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GauntletSetupModal;
