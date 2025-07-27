import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import DevilDialogue from "./gauntlet/components/DevilDialogue";
import AnswerZone from "./gauntlet/components/AnswerZone";
import { useAuth } from "../context/AuthContext";

const DuelGauntletPage = () => {
  const { duelId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [duel, setDuel] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDuel = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const { data } = await axios.get(
          `http://localhost:5000/api/duels/${duelId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setDuel(data.duel);
        setQuestions(data.duel.questions);
      } catch (error) {
        toast.error("Failed to load duel.");
        navigate("/friends");
      } finally {
        setLoading(false);
      }
    };
    fetchDuel();
  }, [duelId, navigate]);

  const handleNextQuestion = () => {
    // Simple validation for now. A real implementation would call the backend.
    if (
      userAnswer.toString() ===
      questions[currentQuestionIndex].correctAnswer?.toString()
    ) {
      setScore((prev) => prev + 10);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleSubmitScore();
    }
  };

  const handleSubmitScore = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        `http://localhost:5000/api/duels/submit/${duelId}`,
        { score },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Duel complete! Your score has been submitted.");
      navigate("/friends");
    } catch (error) {
      toast.error("Failed to submit score.");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !duel)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white text-2xl animate-pulse">
        Loading Duel...
      </div>
    );

  const currentQuestion = questions[currentQuestionIndex];
  const opponent =
    duel.challenger._id === currentUser.id ? duel.opponent : duel.challenger;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8 flex flex-col">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold">Duel vs. {opponent.username}</h1>
        <p className="text-gray-400">
          Question {currentQuestionIndex + 1} of {questions.length} | Score:{" "}
          {score}
        </p>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl">
          <DevilDialogue
            feedback={{ text: `Subject: ${duel.subject}. No mercy.` }}
          />
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion._id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="bg-gray-800/60 border border-gray-700 rounded-2xl p-8 shadow-2xl"
            >
              <h2 className="text-2xl md:text-3xl font-bold leading-tight text-white mb-8">
                {currentQuestion.prompt}
              </h2>
              <AnswerZone
                question={currentQuestion}
                userAnswer={userAnswer}
                setUserAnswer={setUserAnswer}
              />
            </motion.div>
          </AnimatePresence>
          <div className="mt-8 text-center">
            <button
              onClick={handleNextQuestion}
              disabled={loading}
              className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-12 rounded-lg text-lg transition-all"
            >
              {loading
                ? "Submitting..."
                : currentQuestionIndex < questions.length - 1
                ? "Next Question"
                : "Finish Duel"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
export default DuelGauntletPage;
