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
      className="bg-gray-900/50 backdrop-blur-md border-2 border-red-500/30 rounded-xl p-6 mb-8 shadow-2xl shadow-red-900/20"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-start gap-4">
        <div className="text-3xl text-red-500 mt-1">
          <FaFire />
        </div>
        <div className="flex-grow">
          <AnimatePresence mode="wait">
            <motion.p
              key={dialogueText} // The key is crucial to re-trigger the animation
              className="text-xl italic text-red-300 min-h-[56px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              "{typedText}"
            </motion.p>
          </AnimatePresence>
        </div>
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="ml-4 text-2xl text-gray-400 hover:text-white hover:scale-110 transition-transform"
        >
          {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
        </button>
      </div>
      <audio ref={audioRef} hidden />
    </motion.div>
  );
};

export default DevilDialogue;
