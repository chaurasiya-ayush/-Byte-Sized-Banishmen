import React, { useEffect, useRef, useState } from "react";
import { FaVolumeUp, FaVolumeMute, FaFire } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useTypingEffect } from "../../../hooks/useTypingEffect"; // Adjust path if needed

const DevilDialogue = ({ feedback }) => {
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);
  const dialogueText = feedback?.text || "...Waiting for your move, mortal.";
  const typedText = useTypingEffect(dialogueText, 30); // Use the typing effect hook

  useEffect(() => {
    if (feedback?.audioUrl && !isMuted) {
      if (audioRef.current) {
        audioRef.current.src = feedback.audioUrl;
        audioRef.current
          .play()
          .catch((e) => console.error("Audio play failed", e));
      }
    }
  }, [feedback, isMuted]);

  return (
    <motion.div
      className="bg-gradient-to-r from-black/60 to-red-900/40 backdrop-blur-md border-2 border-red-500/50 rounded-xl p-6 mb-8 shadow-2xl relative overflow-hidden"
      style={{
        boxShadow:
          "0 0 30px rgba(220, 38, 38, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.5)",
      }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Flame effect background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none"></div>

      <div className="flex items-start gap-4 relative z-10">
        <div className="text-4xl text-red-500 mt-1 animate-pulse">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            😈
          </motion.div>
        </div>
        <div className="flex-grow">
          <div className="mb-2">
            <span
              className="text-sm text-orange-400 font-bold"
              style={{ fontFamily: "'Orbitron', monospace" }}
            >
              THE DEVIL SPEAKS:
            </span>
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={dialogueText} // The key is crucial to re-trigger the animation
              className="text-xl italic text-red-300 min-h-[56px] leading-relaxed"
              style={{
                fontFamily: "'Rajdhani', 'Exo 2', sans-serif",
                textShadow: "0 0 10px rgba(248, 113, 113, 0.5)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              "{typedText}"
            </motion.p>
          </AnimatePresence>
        </div>
        <motion.button
          onClick={() => setIsMuted(!isMuted)}
          className="ml-4 text-2xl text-gray-400 hover:text-orange-400 p-2 rounded-lg bg-black/30 hover:bg-red-900/30 border border-red-700/30 hover:border-orange-500/50 transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
        </motion.button>
      </div>
      <audio ref={audioRef} hidden />
    </motion.div>
  );
};

export default DevilDialogue;
