import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import AuthModal from "../components/AuthModal"; // Assuming AuthModal is in /src/components

const LandingPage = () => {
  const [showModal, setShowModal] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    if (currentUser) {
      navigate("/dashboard");
    } else {
      setShowModal(true);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="text-center z-10">
        <h1
          className="text-5xl md:text-7xl font-extrabold mb-4 text-red-600"
          style={{ textShadow: "0 0 10px rgba(220, 38, 38, 0.7)" }}
        >
          Byte-Sized Banishment
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
          Face the Devil's Gauntlet. Master programming concepts under pressure.
          Your trial by fire awaits.
        </p>
        <button
          onClick={handleGetStartedClick}
          className="bg-white text-gray-900 font-bold py-4 px-8 rounded-full text-lg hover:bg-red-500 hover:text-white transform hover:scale-105 transition-all duration-300 shadow-lg shadow-red-500/30"
        >
          {currentUser ? "Enter the Gauntlet" : "Get Started"}
        </button>
      </div>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-red-900 rounded-full opacity-20 blur-3xl"
          style={{ transform: "rotate(45deg)" }}
        ></div>
        <div
          className="absolute -top-40 -right-40 w-96 h-96 bg-red-900 rounded-full opacity-20 blur-3xl"
          style={{ transform: "rotate(45deg)" }}
        ></div>
      </div>
      <AnimatePresence>
        {showModal && <AuthModal setShowModal={setShowModal} />}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;
