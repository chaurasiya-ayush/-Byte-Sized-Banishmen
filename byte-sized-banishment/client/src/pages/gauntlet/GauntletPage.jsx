import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHeart,
  FaChartLine,
  FaEye,
  FaEyeSlash,
  FaStar,
  FaFire,
  FaBolt,
  FaSkull,
  FaRunning,
  FaCode,
  FaPaperPlane,
  FaExclamationTriangle,
} from "react-icons/fa";
import { HiChartBar } from "react-icons/hi";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { GiDevilMask } from "react-icons/gi";

import DevilDialogue from "./components/DevilDialogue";
import StatusBar from "./components/StatusBar";
import AnswerZone from "./components/AnswerZone";
import QuitModal from "./components/QuitModal";
import PenanceModal from "./components/PenanceModal"; // <-- IMPORT NEW COMPONENT

const GauntletPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [session, setSession] = useState(location.state?.sessionData);
  const [currentQuestion, setCurrentQuestion] = useState(
    location.state?.sessionData?.question
  );
  const [userAnswer, setUserAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [stats, setStats] = useState({
    strikesLeft: 3,
    score: 0,
    level: 1,
    rank: "Novice",
    questionNum: 1,
    correctStreak: 0,
    sessionTime: "00:00",
  });
  const [isQuitModalOpen, setQuitModalOpen] = useState(false);
  const [activePenance, setActivePenance] = useState(null); // <-- NEW STATE FOR PUNISHMENT
  const [isStatusBarOpen, setIsStatusBarOpen] = useState(() => {
    // Load from localStorage, default to false (hidden)
    const saved = localStorage.getItem("gauntlet-status-bar-open");
    return saved ? JSON.parse(saved) : false;
  }); // <-- NEW STATE FOR STATUS BAR TOGGLE

  useEffect(() => {
    if (!session) {
      toast.error("You must start a gauntlet from the dashboard first!");
      navigate("/dashboard");
    }
  }, [session, navigate]);

  // Persist status bar state to localStorage
  useEffect(() => {
    localStorage.setItem(
      "gauntlet-status-bar-open",
      JSON.stringify(isStatusBarOpen)
    );
  }, [isStatusBarOpen]);

  useEffect(() => {
    if (currentQuestion) {
      if (currentQuestion.type === "code") {
        // Let the CodeEditorComponent handle the default template based on subject
        // No need to set a default here as the editor will use its own language-specific template
        setUserAnswer("");
      } else {
        setUserAnswer("");
      }
    }
  }, [currentQuestion]);

  const handleSubmit = async () => {
    if (userAnswer === "") {
      toast("You must provide an answer.", {
        icon: <FaExclamationTriangle className="text-yellow-400" />,
        style: {
          background: "#1f2937",
          color: "#f3f4f6",
          border: "1px solid #374151",
        },
      });
      return;
    }
    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const payload = {
        sessionId: session.sessionId,
        questionId: currentQuestion._id,
        answer: userAnswer,
      };
      const { data } = await axios.post(
        "http://localhost:5000/api/gauntlet/submit",
        payload,
        config
      );

      setFeedback(data.feedback);

      if (data.isGameOver) {
        // --- PENANCE LOGIC ---
        if (data.punishment) {
          setActivePenance(data.punishment); // Show the modal
        } else {
          toast.error(
            data.feedback?.text || "The Devil has claimed your soul!",
            { duration: 5000 }
          );
          navigate("/dashboard");
        }
        return;
      }

      // ... (rest of the toast and state update logic remains the same)
      const toastOptions = {
        duration: 2000,
        position: "bottom-center",
        style: {
          background: "#1f2937",
          color: "#f3f4f6",
          border: "1px solid #374151",
        },
      };
      if (data.feedback.text.includes("Level")) {
        toast.success(data.feedback.text, {
          ...toastOptions,
          duration: 4000,
          icon: "🎉",
        });
      } else if (data.result === "correct") {
        toast.success("Correct Answer!", {
          ...toastOptions,
          style: {
            ...toastOptions.style,
            border: "1px solid #16a34a",
          },
        });
      } else {
        toast.error("Incorrect Answer!", {
          ...toastOptions,
          style: {
            ...toastOptions.style,
            border: "1px solid #dc2626",
          },
        });
      }
      setCurrentQuestion(data.nextQuestion);
      setStats((prev) => ({
        ...data.updatedStats,
        questionNum: prev.questionNum + 1,
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleQuit = () => {
    toast("You have fled the trial.", {
      icon: <FaRunning className="text-orange-400" />,
      style: {
        background: "#1f2937",
        color: "#f3f4f6",
        border: "1px solid #374151",
      },
    });
    navigate("/dashboard");
  };

  const handleAcknowledgePenance = () => {
    setActivePenance(null);
    navigate("/dashboard");
  };

  if (!currentQuestion) {
    return (
      <div className="bg-gradient-to-br from-gray-950 to-red-900 text-white min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse text-red-400">
            <GiDevilMask />
          </div>
          <p
            className="text-2xl font-bold text-red-400"
            style={{ fontFamily: "'Orbitron', monospace" }}
          >
            Loading trial...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <QuitModal
        isOpen={isQuitModalOpen}
        onConfirm={handleQuit}
        onCancel={() => setQuitModalOpen(false)}
      />
      <PenanceModal
        punishment={activePenance}
        onAcknowledge={handleAcknowledgePenance}
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-red-900 text-white flex relative overflow-hidden">
        {/* Devilish Background Effects */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            background:
              "radial-gradient(ellipse at 30% 70%, rgba(124,25,25,0.4), transparent 70%)",
            zIndex: 1,
          }}
        />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-red-800/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-orange-700/10 rounded-full blur-2xl pointer-events-none" />

        {/* Content with higher z-index */}
        <div className="relative z-10 w-full flex">
          {/* Status Bar Toggle Button */}
          <motion.button
            onClick={() => setIsStatusBarOpen(!isStatusBarOpen)}
            className="fixed top-4 left-4 z-30 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-4 py-2 rounded-lg border border-red-500 transition-all duration-200 shadow-lg hover:shadow-red-500/25"
            style={{ fontFamily: "Rajdhani, sans-serif" }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            title={isStatusBarOpen ? "Hide Status Bar" : "Show Status Bar"}
          >
            <span className="text-sm font-bold flex items-center gap-2">
              {isStatusBarOpen ? (
                <>
                  <MdVisibilityOff className="text-base" />
                  Hide
                </>
              ) : (
                <>
                  <MdVisibility className="text-base" />
                  Show
                </>
              )}
            </span>
          </motion.button>

          {/* Always Visible Hearts (Health) */}
          <motion.div
            className="fixed top-20 left-4 z-30 bg-black/90 backdrop-blur-sm border-2 border-red-500/50 p-2 rounded-lg shadow-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-2">
              <FaSkull className="text-red-400 text-sm" />
              <div className="flex gap-1">
                {Array.from({ length: 3 }, (_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.05, duration: 0.2 }}
                  >
                    <FaHeart
                      className={`transition-all duration-200 text-lg ${
                        i < stats.strikesLeft
                          ? "text-red-500 drop-shadow-lg"
                          : "text-gray-800"
                      }`}
                      style={{
                        filter:
                          i < stats.strikesLeft
                            ? "drop-shadow(0 0 5px #ef4444)"
                            : "none",
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Quick Info Panel (when status bar is collapsed) */}
          <AnimatePresence>
            {!isStatusBarOpen && (
              <motion.div
                className="fixed top-32 left-4 z-30 bg-black/90 backdrop-blur-sm border-2 border-orange-500/50 p-2 rounded-lg space-y-1 shadow-lg"
                initial={{ opacity: 0, x: -20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-2">
                  <FaStar className="text-yellow-400 text-xs" />
                  <span
                    className="text-yellow-300 font-bold text-xs"
                    style={{ fontFamily: "'Orbitron', monospace" }}
                  >
                    {stats.score}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaFire className="text-orange-400 text-xs" />
                  <span
                    className="text-orange-300 font-bold text-xs"
                    style={{ fontFamily: "'Orbitron', monospace" }}
                  >
                    Lv.{stats.level}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaBolt className="text-green-400 text-xs" />
                  <span
                    className="text-green-300 font-bold text-xs"
                    style={{ fontFamily: "'Orbitron', monospace" }}
                  >
                    {stats.correctStreak || 0}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Collapsible Status Bar */}
          <AnimatePresence mode="wait">
            {isStatusBarOpen && (
              <motion.div
                className="w-1/4 min-w-[280px] h-screen sticky top-0"
                initial={{ x: -280, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -280, opacity: 0 }}
                transition={{
                  duration: 0.25,
                  ease: [0.4, 0, 0.2, 1],
                  opacity: { duration: 0.2 },
                }}
              >
                <StatusBar stats={stats} currentQuestion={currentQuestion} />
              </motion.div>
            )}
          </AnimatePresence>

          <main
            className={`flex-grow p-8 transition-all duration-300 ease-out ${
              !isStatusBarOpen ? "ml-0" : ""
            }`}
          >
            <div className="max-w-4xl mx-auto">
              <DevilDialogue feedback={feedback} />
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion._id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="bg-black/40 border border-red-700/50 rounded-2xl p-8 shadow-2xl backdrop-blur-sm"
                  style={{
                    boxShadow: "0 0 30px rgba(220, 38, 38, 0.3)",
                  }}
                >
                  <div className="mb-8">
                    <div className="flex justify-between items-center text-sm text-gray-300 mb-2 font-mono">
                      <span className="text-orange-400">
                        Topic: {currentQuestion.subject}
                      </span>
                      <span
                        className={`capitalize px-3 py-1 rounded-md text-xs font-bold ${
                          currentQuestion.difficulty === "hard"
                            ? "bg-red-600 text-white"
                            : currentQuestion.difficulty === "medium"
                            ? "bg-orange-500 text-white"
                            : "bg-yellow-500 text-black"
                        }`}
                      >
                        {currentQuestion.difficulty}
                      </span>
                    </div>
                    <h2
                      className="text-2xl md:text-3xl font-bold leading-tight text-red-300"
                      style={{
                        fontFamily: "'Orbitron', 'Rajdhani', monospace",
                      }}
                    >
                      {currentQuestion.prompt}
                    </h2>
                  </div>
                  <AnswerZone
                    question={currentQuestion}
                    userAnswer={userAnswer}
                    setUserAnswer={setUserAnswer}
                  />
                </motion.div>
              </AnimatePresence>
              <div className="mt-8 flex justify-between items-center">
                <button
                  onClick={() => setQuitModalOpen(true)}
                  className="bg-gray-800/80 hover:bg-gray-700 text-gray-300 hover:text-red-300 font-bold py-3 px-6 rounded-lg transition-all border border-gray-600 hover:border-red-500 flex items-center gap-2"
                  style={{ fontFamily: "'Orbitron', monospace" }}
                >
                  <FaRunning className="text-base" />
                  Abandon Trial
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-bold py-3 px-12 rounded-lg text-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:scale-100 shadow-lg flex items-center gap-2"
                  style={{
                    fontFamily: "'Orbitron', monospace",
                    boxShadow: "0 0 20px rgba(220, 38, 38, 0.4)",
                  }}
                >
                  {loading ? (
                    <>
                      <FaBolt className="text-base animate-pulse" />
                      Judging...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="text-base" />
                      Submit Answer
                    </>
                  )}
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default GauntletPage;
