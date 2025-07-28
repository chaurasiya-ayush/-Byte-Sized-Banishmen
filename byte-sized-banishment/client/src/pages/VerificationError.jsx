import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaUser,
  FaClock,
  FaLink,
  FaWrench,
  FaComments,
  FaTools,
  FaCheck,
  FaTimes,
  FaEnvelope,
  FaSync,
  FaHome,
  FaExclamationTriangle,
} from "react-icons/fa";

const VerificationError = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const error = searchParams.get("error") || "Unknown error occurred";

  const getErrorDetails = (errorType) => {
    switch (errorType) {
      case "user-not-found":
        return {
          title: "User Not Found",
          message:
            "The verification link is invalid. The user account could not be found.",
          icon: <FaUser className="text-red-400" />,
        };
      case "token-expired":
        return {
          title: "Link Expired",
          message:
            "This verification link has expired. Please request a new verification email.",
          icon: <FaClock className="text-yellow-400" />,
        };
      case "invalid-token":
        return {
          title: "Invalid Link",
          message:
            "This verification link is invalid or has already been used.",
          icon: <FaLink className="text-red-400" />,
        };
      case "already-verified":
        return {
          title: "Already Verified",
          message:
            "This email address has already been verified. You can log in to your account.",
          icon: <FaCheck className="text-green-400" />,
        };
      default:
        return {
          title: "Verification Failed",
          message: "An unexpected error occurred during email verification.",
          icon: <FaTimes className="text-red-400" />,
        };
    }
  };

  const errorDetails = getErrorDetails(error);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-red-900 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 max-w-md w-full"
      >
        <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 shadow-2xl">
          {/* Error Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="text-center mb-6"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-3xl text-white"
              >
                {errorDetails.icon}
              </motion.div>
            </div>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <h1 className="text-2xl font-bold text-white mb-2">
              {errorDetails.title}
            </h1>

            <p className="text-gray-300 mb-6">{errorDetails.message}</p>

            {/* Help Section */}
            <div className="bg-gray-700/50 rounded-lg p-4 mb-6 text-left">
              <h3 className="text-red-400 font-semibold mb-3 text-center flex items-center justify-center gap-2">
                <FaWrench className="text-red-400" />
                What you can do:
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center">
                  <span className="text-orange-400 mr-2">
                    <FaEnvelope />
                  </span>
                  Check your email for a newer verification link
                </li>
                <li className="flex items-center">
                  <span className="text-orange-400 mr-2">
                    <FaSync />
                  </span>
                  Try registering again if the link is very old
                </li>
                <li className="flex items-center">
                  <span className="text-orange-400 mr-2">
                    <FaComments />
                  </span>
                  Contact support if the problem persists
                </li>
                <li className="flex items-center">
                  <span className="text-orange-400 mr-2">
                    <FaHome />
                  </span>
                  Return to homepage and try logging in
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/")}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                <FaHome />
                Back to Homepage
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  (window.location.href =
                    "mailto:support@byte-sized-banishment.com")
                }
                className="w-full bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <FaEnvelope />
                Contact Support
              </motion.button>
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
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-red-400"
            >
              <FaWrench />
            </motion.span>
            <motion.span
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
              className="text-yellow-400"
            >
              <FaExclamationTriangle />
            </motion.span>
            <motion.span
              animate={{ rotate: [0, 10, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-orange-400"
            >
              <FaTools />
            </motion.span>
          </div>
          <p className="text-gray-500 text-sm mt-2">
            Byte-Sized Banishment Support
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default VerificationError;
