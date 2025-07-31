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
  FaQuestionCircle,
  FaQuestionCircle as FaInfo,
} from "react-icons/fa";
import { HiChartBar } from "react-icons/hi";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { GiDevilMask } from "react-icons/gi";

import DevilDialogue from "./components/DevilDialogue";
import StatusBar from "./components/StatusBar";
import AnswerZone from "./components/AnswerZone";
import QuitModal from "./components/QuitModal";
import PenanceModal from "./components/PenanceModal";
import QuestionTimer from "./components/QuestionTimer";
import SessionResultsModal from "../../components/SessionResultsModal";
import InstructionsModal from "./components/InstructionsModal";

const GauntletPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Timer duration calculator function
  const getTimerDuration = (difficulty, questionType) => {
    const timers = {
      easy: {
        mcq: 30, // 30 seconds
        integer: 45, // 45 seconds
        code: 60, // 1 minute
      },
      medium: {
        mcq: 45, // 45 seconds
        integer: 60, // 1 minute
        code: 180, // 3 minutes
      },
      hard: {
        mcq: 180, // 3 minutes
        integer: 300, // 5 minutes
        code: 600, // 10 minutes
      },
    };

    return timers[difficulty]?.[questionType] || 30; // Default 30 seconds
  };

  // Initialize session state with persistence
  const [session, setSession] = useState(() => {
    // Try to restore from localStorage first, then from location state
    const savedSession = localStorage.getItem("gauntlet-active-session");
    if (savedSession) {
      try {
        return JSON.parse(savedSession);
      } catch (error) {
        console.error("Error parsing saved session:", error);
        localStorage.removeItem("gauntlet-active-session");
      }
    }
    return location.state?.sessionData;
  });

  const [currentQuestion, setCurrentQuestion] = useState(() => {
    // Try to restore current question from localStorage first
    const savedQuestion = localStorage.getItem("gauntlet-current-question");
    if (savedQuestion) {
      try {
        return JSON.parse(savedQuestion);
      } catch (error) {
        console.error("Error parsing saved question:", error);
        localStorage.removeItem("gauntlet-current-question");
      }
    }
    return location.state?.sessionData?.question;
  });

  const [userAnswer, setUserAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [stats, setStats] = useState(() => {
    // Try to restore stats from localStorage first
    const savedStats = localStorage.getItem("gauntlet-stats");
    if (savedStats) {
      try {
        return JSON.parse(savedStats);
      } catch (error) {
        console.error("Error parsing saved stats:", error);
        localStorage.removeItem("gauntlet-stats");
      }
    }
    return {
      strikesLeft: 3,
      score: 0,
      level: 1,
      rank: "Novice",
      questionNum: 1,
      correctStreak: 0,
      sessionTime: "00:00",
    };
  });
  const [isQuitModalOpen, setQuitModalOpen] = useState(false);
  const [activePenance, setActivePenance] = useState(null);
  const [sessionResults, setSessionResults] = useState(null);
  const [isSessionResultsOpen, setIsSessionResultsOpen] = useState(false);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const [sessionProgress, setSessionProgress] = useState(() => {
    // Try to restore session progress from localStorage first
    const savedProgress = localStorage.getItem("gauntlet-session-progress");
    if (savedProgress) {
      try {
        return JSON.parse(savedProgress);
      } catch (error) {
        console.error("Error parsing saved progress:", error);
        localStorage.removeItem("gauntlet-session-progress");
      }
    }
    return {
      currentQuestion: 1,
      totalQuestions: "unlimited",
      correctAnswers: 0,
      incorrectAnswers: 0,
      currentDifficulty: "easy",
      correctStreak: 0,
    };
  });
  const [timerActive, setTimerActive] = useState(true);
  const [questionStartTime, setQuestionStartTime] = useState(() => {
    // Restore question start time from localStorage
    const savedStartTime = localStorage.getItem("gauntlet-question-start-time");
    return savedStartTime ? parseInt(savedStartTime) : Date.now();
  });
  const [isStatusBarOpen, setIsStatusBarOpen] = useState(() => {
    // Load from localStorage, default to false (hidden)
    const saved = localStorage.getItem("gauntlet-status-bar-open");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    if (!session) {
      toast.error("You must start a gauntlet from the dashboard first!");
      navigate("/dashboard");
    }
  }, [session, navigate]);

  // Persist session state to localStorage
  useEffect(() => {
    if (session) {
      localStorage.setItem("gauntlet-active-session", JSON.stringify(session));
    }
  }, [session]);

  useEffect(() => {
    if (currentQuestion) {
      localStorage.setItem(
        "gauntlet-current-question",
        JSON.stringify(currentQuestion)
      );
    }
  }, [currentQuestion]);

  useEffect(() => {
    localStorage.setItem("gauntlet-stats", JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem(
      "gauntlet-session-progress",
      JSON.stringify(sessionProgress)
    );
  }, [sessionProgress]);

  useEffect(() => {
    localStorage.setItem(
      "gauntlet-question-start-time",
      questionStartTime.toString()
    );
  }, [questionStartTime]);

  // Persist status bar state to localStorage
  useEffect(() => {
    localStorage.setItem(
      "gauntlet-status-bar-open",
      JSON.stringify(isStatusBarOpen)
    );
  }, [isStatusBarOpen]);

  // Clear gauntlet session data from localStorage
  const clearGauntletSession = () => {
    try {
      console.log("Clearing gauntlet session data");
      localStorage.removeItem("gauntlet-active-session");
      localStorage.removeItem("gauntlet-current-question");
      localStorage.removeItem("gauntlet-current-question-id");
      localStorage.removeItem("gauntlet-stats");
      localStorage.removeItem("gauntlet-session-progress");
      localStorage.removeItem("gauntlet-question-start-time");
      console.log("Session data cleared successfully");
    } catch (error) {
      console.error("Error clearing session data:", error);
    }
  };

  useEffect(() => {
    if (currentQuestion) {
      setTimerActive(true);

      // Calculate timer duration based on difficulty and type
      const calculatedDuration = getTimerDuration(
        currentQuestion.difficulty,
        currentQuestion.type
      );
      console.log(
        `[DEBUG] Question received - ID: ${currentQuestion._id}, Difficulty: ${currentQuestion.difficulty}, Type: ${currentQuestion.type}, Calculated Timer Duration: ${calculatedDuration}s`
      );

      // Only set question start time if it's not already saved in localStorage
      // (i.e., this is a genuinely new question, not a page refresh)
      const savedStartTime = localStorage.getItem(
        "gauntlet-question-start-time"
      );
      const savedQuestionId = localStorage.getItem(
        "gauntlet-current-question-id"
      );

      try {
        const currentQuestionFromStorage = JSON.parse(
          localStorage.getItem("gauntlet-current-question") || "{}"
        );
        const isNewQuestion =
          !savedStartTime ||
          !savedQuestionId ||
          savedQuestionId !== currentQuestion._id;

        if (isNewQuestion) {
          const newStartTime = Date.now();
          setQuestionStartTime(newStartTime);
          localStorage.setItem(
            "gauntlet-current-question-id",
            currentQuestion._id
          );
        }
      } catch (error) {
        // If there's an error parsing, treat as new question
        const newStartTime = Date.now();
        setQuestionStartTime(newStartTime);
        localStorage.setItem(
          "gauntlet-current-question-id",
          currentQuestion._id
        );
      }

      if (currentQuestion.type === "code") {
        // Let the CodeEditorComponent handle the default template based on subject
        // No need to set a default here as the editor will use its own language-specific template
        setUserAnswer("");
      } else {
        setUserAnswer("");
      }
    }
  }, [currentQuestion]);

  const handleTimeout = async () => {
    if (!currentQuestion || !session || !timerActive) return;

    setTimerActive(false);
    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const payload = {
        sessionId: session.sessionId,
        questionId: currentQuestion._id,
      };

      const { data } = await axios.post(
        "http://localhost:5000/api/gauntlet/timeout",
        payload,
        config
      );

      setFeedback(data.feedback);

      if (data.isGameOver) {
        // Handle session completion (15 questions) or failure (3 strikes)
        if (data.sessionSummary) {
          setSessionResults({
            ...data.sessionSummary,
            completionReason: data.sessionSummary.completionReason,
            punishment: data.punishment || null,
          });
          setIsSessionResultsOpen(true);
        } else if (data.punishment) {
          // Fallback for older punishment system
          setActivePenance(data.punishment);
        } else {
          toast.error(data.feedback?.text || "Time's up! Session ended!", {
            duration: 5000,
          });
          navigate("/dashboard");
        }
        return;
      }

      // Update session progress from backend response
      if (data.sessionProgress) {
        setSessionProgress(data.sessionProgress);
      }

      // Update question number in stats
      setStats((prev) => ({
        ...data.updatedStats,
        questionNum:
          data.sessionProgress?.currentQuestion || prev.questionNum + 1,
      }));

      // Show timeout feedback
      toast.error(
        data.feedback?.text || "Time's up! Moving to next question.",
        {
          duration: 3000,
          position: "bottom-center",
          style: {
            background: "#1f2937",
            color: "#f3f4f6",
            border: "1px solid #dc2626",
          },
        }
      );

      setCurrentQuestion(data.nextQuestion);
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
      clearGauntletSession(); // Clear session data on timeout error
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

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

    setTimerActive(false); // Stop the timer when submitting
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
        // Handle session completion or failure (3 strikes)
        if (data.punishment) {
          // Show punishment first for failed sessions
          setSessionResults({
            ...data.sessionSummary,
            completionReason: data.sessionSummary.completionReason,
            punishment: data.punishment,
          });
          setActivePenance(data.punishment);
        } else if (data.sessionSummary) {
          // Show session results directly for completed sessions
          setSessionResults({
            ...data.sessionSummary,
            completionReason: data.sessionSummary.completionReason,
          });
          setIsSessionResultsOpen(true);
        } else {
          toast.error(data.feedback?.text || "Session ended!", {
            duration: 5000,
          });
          clearGauntletSession(); // Clear session data when session ends without modal
          navigate("/dashboard");
        }
        return;
      }

      // Update session progress from backend response
      if (data.sessionProgress) {
        setSessionProgress(data.sessionProgress);
      }

      // Update question number in stats
      setStats((prev) => ({
        ...data.updatedStats,
        questionNum:
          data.sessionProgress?.currentQuestion || prev.questionNum + 1,
      }));

      // Show feedback toasts
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
        let successMessage = "Correct Answer!";

        // Show execution feedback for code questions
        if (data.executionFeedback && currentQuestion.type === "code") {
          successMessage = data.executionFeedback;
        }

        toast.success(successMessage, {
          ...toastOptions,
          duration: data.executionFeedback ? 4000 : 2000, // Longer duration for execution feedback
          style: {
            ...toastOptions.style,
            border: "1px solid #16a34a",
          },
        });
      } else {
        let errorMessage = "Incorrect Answer!";

        // Show execution feedback for code questions
        if (data.executionFeedback && currentQuestion.type === "code") {
          errorMessage = data.executionFeedback;
        }

        toast.error(errorMessage, {
          ...toastOptions,
          duration: data.executionFeedback ? 5000 : 2000, // Longer duration for execution feedback
          style: {
            ...toastOptions.style,
            border: "1px solid #dc2626",
          },
        });
      }

      setCurrentQuestion(data.nextQuestion);
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
      clearGauntletSession(); // Clear session data on submit error
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleQuit = async () => {
    if (!session || !currentQuestion) {
      clearGauntletSession();
      navigate("/dashboard");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const payload = {
        sessionId: session.sessionId,
      };

      const { data } = await axios.post(
        "http://localhost:5000/api/gauntlet/quit",
        payload,
        config
      );

      // Handle quit response - may include punishment
      if (data.punishment) {
        // Show punishment first for quitters who deserve it
        setSessionResults({
          ...data.sessionSummary,
          completionReason: "abandoned",
          punishment: data.punishment,
        });
        setActivePenance(data.punishment);
      } else if (data.sessionSummary) {
        // Show session results directly for clean quits
        setSessionResults({
          ...data.sessionSummary,
          completionReason: "abandoned",
        });
        setIsSessionResultsOpen(true);
      } else {
        // Fallback if no summary
        clearGauntletSession();
        toast("You have fled the trial.", {
          icon: <FaRunning className="text-orange-400" />,
          style: {
            background: "#1f2937",
            color: "#f3f4f6",
            border: "1px solid #374151",
          },
        });
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error quitting session:", error);
      // Fallback to simple quit
      clearGauntletSession();
      toast("Session ended.", {
        icon: <FaRunning className="text-orange-400" />,
        style: {
          background: "#1f2937",
          color: "#f3f4f6",
          border: "1px solid #374151",
        },
      });
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledgePenance = () => {
    console.log("handleAcknowledgePenance called");
    console.log("sessionResults:", sessionResults);

    try {
      // Close punishment modal
      setActivePenance(null);
      console.log("activePenance cleared");

      // Always show session results - create fallback if none exist
      if (sessionResults) {
        console.log("Opening existing session results");
        setIsSessionResultsOpen(true);
      } else {
        console.log("Creating fallback session results");
        // Create a basic session results object for display
        const fallbackResults = {
          questionsCompleted: sessionProgress?.currentQuestion || 0,
          totalQuestions: "Unlimited",
          correctAnswers: sessionProgress?.correctAnswers || 0,
          incorrectAnswers: sessionProgress?.incorrectAnswers || 0,
          finalScore: stats?.score || 0,
          totalXpGained: 0,
          maxCorrectStreak: sessionProgress?.correctStreak || 0,
          sessionDuration: 0,
          completionReason: "failed",
          highestDifficulty: 1,
        };
        setSessionResults(fallbackResults);
        setIsSessionResultsOpen(true);
      }
    } catch (error) {
      console.error("Error in handleAcknowledgePenance:", error);
      // Fallback: just go to dashboard
      clearGauntletSession();
      navigate("/dashboard");
    }
  };

  const handleCloseSessionResults = () => {
    console.log("Closing session results and navigating to dashboard");
    clearGauntletSession(); // Clear session data when session results are closed
    setIsSessionResultsOpen(false);
    setSessionResults(null);
    setActivePenance(null); // Ensure punishment modal is also closed
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
      <SessionResultsModal
        isOpen={isSessionResultsOpen}
        onClose={handleCloseSessionResults}
        sessionSummary={sessionResults}
        completionReason={sessionResults?.completionReason}
        punishment={sessionResults?.punishment}
      />
      <InstructionsModal
        isOpen={isInstructionsOpen}
        onClose={() => setIsInstructionsOpen(false)}
        questionType={currentQuestion?.type}
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
            className={`fixed top-20 z-30 bg-black/90 backdrop-blur-sm border-2 border-red-500/50 p-2 rounded-lg shadow-lg transition-all duration-300 ${
              isStatusBarOpen ? "left-[300px]" : "left-4"
            }`}
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

          {/* Question Timer */}
          {currentQuestion && (
            <QuestionTimer
              duration={getTimerDuration(
                currentQuestion.difficulty,
                currentQuestion.type
              )}
              onTimeout={handleTimeout}
              isActive={timerActive && !loading}
              questionId={currentQuestion._id}
              difficulty={currentQuestion.difficulty}
              questionType={currentQuestion.type}
              startTime={questionStartTime}
            />
          )}

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
                  <FaQuestionCircle className="text-blue-400 text-xs" />
                  <span
                    className="text-blue-300 font-bold text-xs"
                    style={{ fontFamily: "'Orbitron', monospace" }}
                  >
                    Q{sessionProgress.currentQuestion}
                    {sessionProgress.totalQuestions === "unlimited"
                      ? " / ∞"
                      : ` / ${sessionProgress.totalQuestions}`}
                  </span>
                </div>
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
                    {sessionProgress.correctStreak || 0}
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
                <StatusBar
                  stats={stats}
                  currentQuestion={currentQuestion}
                  sessionProgress={sessionProgress}
                />
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
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setIsInstructionsOpen(true)}
                          className="bg-blue-600/20 hover:bg-blue-500/30 border border-blue-500/50 hover:border-blue-400 text-blue-300 hover:text-blue-200 px-3 py-1 rounded-lg transition-all duration-200 flex items-center gap-2 text-xs"
                          style={{ fontFamily: "'Orbitron', monospace" }}
                          title="View instructions for this question type"
                        >
                          <FaInfo className="text-xs" />
                          Instructions
                        </button>
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
