import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Login from "./Login";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";

const AuthModal = ({ setShowModal }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const backdropVariants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  const modalVariants = {
    hidden: { y: "-100vh", opacity: 0 },
    visible: {
      y: "0",
      opacity: 1,
      transition: { delay: 0.2, type: "spring", stiffness: 120 },
    },
    exit: { y: "100vh", opacity: 0 },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={() => setShowModal(false)}
      >
        <motion.div
          className={`bg-gray-800 rounded-2xl shadow-2xl p-8 w-full m-4 relative text-white border border-gray-700 ${
            isForgotPassword ? "max-w-md" : isRegister ? "max-w-lg" : "max-w-md"
          }`}
          variants={modalVariants}
          onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
        >
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>

          {isForgotPassword ? (
            <ForgotPassword
              setIsForgotPassword={setIsForgotPassword}
              setIsRegister={setIsRegister}
            />
          ) : isRegister ? (
            <Register
              setIsRegister={setIsRegister}
              setShowModal={setShowModal}
            />
          ) : (
            <Login
              setIsRegister={setIsRegister}
              setShowModal={setShowModal}
              setIsForgotPassword={setIsForgotPassword}
            />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthModal;
