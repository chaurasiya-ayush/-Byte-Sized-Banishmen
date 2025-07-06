import React, { useEffect, useRef, useState } from "react";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";

const DevilDialogue = ({ feedback }) => {
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

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
    <div className="bg-gray-900 bg-opacity-50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 text-center mb-6">
      <div className="flex justify-between items-center">
        <div className="flex-grow">
          <p className="text-xl italic text-red-400">
            "{feedback?.text || "...Waiting for your move, mortal."}"
          </p>
        </div>
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="ml-4 text-2xl text-gray-400 hover:text-white"
        >
          {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
        </button>
      </div>
      <audio ref={audioRef} hidden />
    </div>
  );
};

export default DevilDialogue;
