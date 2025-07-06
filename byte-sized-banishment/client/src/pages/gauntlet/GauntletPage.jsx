import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import DevilDialogue from "./components/DevilDialogue";
import StatusBar from "./components/StatusBar";
import AnswerZone from "./components/AnswerZone";

const GauntletPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Initialize state from the navigation state passed by the setup modal
  const [session, setSession] = useState(location.state?.sessionData);
  const [currentQuestion, setCurrentQuestion] = useState(
    location.state?.sessionData?.question
  );
  const [userAnswer, setUserAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [stats, setStats] = useState({ strikesLeft: 3, score: 0 });

  useEffect(() => {
    // If someone tries to access this page directly without starting a session, redirect them.
    if (!session) {
      toast.error("You must start a gauntlet from the dashboard first!");
      navigate("/dashboard");
    }
  }, [session, navigate]);

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
        toast.error("The Devil has claimed your soul!", { duration: 5000 });
        navigate("/dashboard");
        return;
      }

      if (data.result === "correct") {
        toast.success("Correct!", { duration: 1500 });
      } else {
        toast.error("Incorrect!", { duration: 1500 });
      }

      setCurrentQuestion(data.nextQuestion);
      setStats(data.updatedStats);
      setUserAnswer(""); // Reset answer for the next question
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (!currentQuestion) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex justify-center items-center">
        <p>Loading trial...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <DevilDialogue feedback={feedback} />
        <StatusBar stats={stats} />

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
          <div className="mb-8">
            <p className="text-sm text-gray-400 mb-2">
              Topic: {currentQuestion.subject} | Difficulty:{" "}
              {currentQuestion.difficulty}
            </p>
            <h2 className="text-2xl md:text-3xl font-semibold leading-tight">
              {currentQuestion.prompt}
            </h2>
          </div>

          <AnswerZone
            question={currentQuestion}
            userAnswer={userAnswer}
            setUserAnswer={setUserAnswer}
          />

          <div className="mt-10 text-center">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-12 rounded-lg text-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:scale-100"
            >
              {loading ? "Judging..." : "Submit Answer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GauntletPage;
