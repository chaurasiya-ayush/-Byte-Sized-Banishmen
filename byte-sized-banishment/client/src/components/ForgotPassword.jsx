import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";

const ForgotPassword = ({ setIsForgotPassword, setIsRegister }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Sending reset email...");

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email }
      );

      if (data.success) {
        setEmailSent(true);
        toast.success("Password reset email sent! Check your inbox.", {
          id: toastId,
        });
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to send reset email";
      toast.error(message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: { opacity: 0, x: 20, transition: { duration: 0.2 } },
  };

  if (emailSent) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="text-center"
      >
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 8l7.89 3.26a2 2 0 001.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-400 mb-2 font-mono">
            📧 Email Sent!
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            We've sent a password reset link to{" "}
            <span className="text-red-400 font-semibold">{email}</span>
          </p>
          <p className="text-gray-400 text-xs mt-2">
            Check your spam folder if you don't see it in your inbox.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => {
              setEmailSent(false);
              setEmail("");
            }}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
          >
            Send Another Email
          </button>

          <button
            onClick={() => {
              setIsForgotPassword(false);
              setIsRegister(false);
            }}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 text-sm font-semibold"
          >
            Back to Login
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-red-400 mb-2 font-mono">
          🔐 Forgot Password
        </h2>
        <p className="text-gray-300 text-sm">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter your email"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Sending...
            </span>
          ) : (
            "Send Reset Email"
          )}
        </button>
      </form>

      <div className="mt-6 text-center space-y-2">
        <button
          onClick={() => {
            setIsForgotPassword(false);
            setIsRegister(false);
          }}
          className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors duration-200"
        >
          ← Back to Login
        </button>

        <div className="text-gray-400 text-sm">
          Don't have an account?{" "}
          <button
            onClick={() => {
              setIsForgotPassword(false);
              setIsRegister(true);
            }}
            className="text-red-400 hover:text-red-300 font-medium transition-colors duration-200"
          >
            Sign up
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ForgotPassword;
