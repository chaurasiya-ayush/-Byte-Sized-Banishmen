import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

const VerificationSuccess = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 max-w-md w-full"
      >
        <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 shadow-2xl">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="text-center mb-6"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-3xl text-white"
              >
                ✓
              </motion.div>
            </div>
          </motion.div>

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <h1 className="text-2xl font-bold text-white mb-2">
              🎉 Email Verified Successfully!
            </h1>

            <p className="text-gray-300 mb-6">
              Welcome to{" "}
              <span className="text-orange-400 font-semibold">
                Byte-Sized Banishment
              </span>
              ! Your account is now activated and ready for coding battles.
            </p>

            {/* Features List */}
            <div className="bg-gray-700/50 rounded-lg p-4 mb-6 text-left">
              <h3 className="text-orange-400 font-semibold mb-3 text-center">
                🔥 You can now:
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">⚡</span>
                  Access coding challenges and gauntlets
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">⚔️</span>
                  Battle other developers in duels
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">🏆</span>
                  Climb the global leaderboards
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">👥</span>
                  Connect with fellow coders
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/")}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                🚀 Start Coding Journey
              </motion.button>

              <p className="text-xs text-gray-400">
                Redirecting automatically in {countdown} seconds...
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bottom Gaming Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-6"
        >
          <div className="flex justify-center space-x-4 text-2xl">
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              ⚙️
            </motion.span>
            <motion.span
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              💻
            </motion.span>
            <motion.span
              animate={{ rotate: -360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              🔧
            </motion.span>
          </div>
          <p className="text-gray-500 text-sm mt-2">
            Powered by Byte-Sized Banishment
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default VerificationSuccess;
