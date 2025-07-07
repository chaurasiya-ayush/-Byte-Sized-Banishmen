import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

import DevilDialogue from "./components/DevilDialogue";
import StatusBar from "./components/StatusBar";
import AnswerZone from "./components/AnswerZone";
import QuitModal from "./components/QuitModal";

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
  });
  const [isQuitModalOpen, setQuitModalOpen] = useState(false);

  useEffect(() => {
    if (!session) {
      toast.error("You must start a gauntlet from the dashboard first!");
      navigate("/dashboard");
    }
  }, [session, navigate]);

  useEffect(() => {
    if (currentQuestion) {
      if (currentQuestion.type === "code") {
        const match = currentQuestion.prompt.match(/`(\w+)\s*\([^)]*\)`/);
        const functionName = match ? match[1] : "yourFunction";
        setUserAnswer(`function ${functionName}() {\n  // Your code here\n}`);
      } else {
        setUserAnswer("");
      }
    }
  }, [currentQuestion]);

  const handleSubmit = async () => {
    if (userAnswer === "") {
      toast("You must provide an answer.", { icon: "🤔" });
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
        toast.error(data.feedback?.text || "The Devil has claimed your soul!", {
          duration: 5000,
        });
        navigate("/dashboard");
        return;
      }

      const toastOptions = { duration: 2000, position: "bottom-center" };
      if (data.feedback.text.includes("Level")) {
        toast.success(data.feedback.text, {
          ...toastOptions,
          duration: 4000,
          icon: "🎉",
        });
      } else if (data.result === "correct") {
        toast.success("Correct!", toastOptions);
      } else {
        toast.error("Incorrect!", toastOptions);
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
    // Here you could add logic to invalidate the session on the backend if desired
    toast("You have fled the trial.", { icon: " cowardly 🏃" });
    navigate("/dashboard");
  };

  if (!currentQuestion) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex justify-center items-center">
        <p>Loading trial...</p>
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
      <div className="min-h-screen bg-gray-900 text-white flex">
        {/* Left Sidebar */}
        <div className="w-1/4 min-w-[280px] h-screen sticky top-0">
          <StatusBar stats={stats} />
        </div>

        {/* Main Content */}
        <main className="flex-grow p-8">
          <div className="max-w-4xl mx-auto">
            <DevilDialogue feedback={feedback} />

            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion._id} // This key is crucial for AnimatePresence to detect changes
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="bg-gray-800/60 border border-gray-700 rounded-2xl p-8 shadow-2xl"
              >
                <div className="mb-8">
                  <div className="flex justify-between items-center text-sm text-gray-400 mb-2 font-mono">
                    <span>Topic: {currentQuestion.subject}</span>
                    <span
                      className={`capitalize px-2 py-1 rounded-md text-xs ${
                        currentQuestion.difficulty === "hard"
                          ? "bg-red-800"
                          : currentQuestion.difficulty === "medium"
                          ? "bg-yellow-800"
                          : "bg-green-800"
                      }`}
                    >
                      {currentQuestion.difficulty}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold leading-tight text-white">
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
                className="bg-gray-700 hover:bg-gray-600 text-gray-300 font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Abandon Trial
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-12 rounded-lg text-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:scale-100"
              >
                {loading ? "Judging..." : "Submit Answer"}
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default GauntletPage;
