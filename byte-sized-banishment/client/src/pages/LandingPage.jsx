import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import AuthModal from "../components/AuthModal";

// Placeholder team data
const TEAM_MEMBERS = [
  {
    name: "Lucifer 'Luke' Inferno",
    role: "Lead Fiend & Frontend Conjurer",
    img: "/team/dp1.png", // Placeholder path, replace later
    bio: "Brings the pixel-sorcery and devilishly good UI magic.",
  },
  {
    name: "Lilith DeBug",
    role: "Backend Demoness",
    img: "/team/dp2.png",
    bio: "Turns database nightmares into functional hellscapes.",
  },
  {
    name: "Moloch Syntax",
    role: "AI Quizmaster Architect",
    img: "/team/dp3.png",
    bio: "Built the gauntlet's mind-bending question engine.",
  },
  {
    name: "Asmodeus DevOps",
    role: "Chaos of Deployments",
    img: "/team/dp4.png",
    bio: "Ensures the flames of production keep burning bright.",
  },
];

const heroVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 80, damping: 14, delay: 0.4 },
  },
};
const subtitleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.7 + i * 0.1, duration: 0.7 },
  }),
};

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
    <div className="bg-gradient-to-br from-gray-950 via-black to-red-900 min-h-screen text-white flex flex-col items-center justify-center p-0 relative overflow-hidden">
      {/* BG Glows */}
      <motion.div
        className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-red-900 rounded-full opacity-25 blur-3xl z-0 pointer-events-none"
        animate={{ scale: [1, 1.1, 0.9, 1] }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
        style={{ boxShadow: "0 0 90px 50px #7f1d1d44" }}
      />
      <motion.div
        className="absolute -top-40 -right-40 w-[530px] h-[500px] bg-red-800 rounded-full opacity-30 blur-3xl z-0 pointer-events-none"
        animate={{ scale: [1, 0.93, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        style={{ boxShadow: "0 0 150px 60px #991b1b33" }}
      />

      {/* Hero */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={heroVariants}
        className="mt-24 mb-12 z-10 text-center"
      >
        <motion.h1
          className="text-5xl md:text-7xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-red-600 relative inline-block drop-shadow-2xl"
          style={{
            fontFamily:
              "'Orbitron', 'Exo 2', 'Rajdhani', 'Bebas Neue', monospace",
            textShadow:
              "0 0 20px #dc2626aa, 0 0 40px #dc2626aa, 0 0 60px #dc262655",
            letterSpacing: "0.05em",
          }}
        >
          BYTE-SIZED
          <br />
          <span
            className="text-yellow-400 drop-shadow-2xl"
            style={{ textShadow: "0 0 20px #fbbf24aa, 0 0 40px #fbbf24aa" }}
          >
            BANISHMENT
          </span>
          <span className="ml-3 text-4xl md:text-6xl animate-pulse">🔥</span>
        </motion.h1>
        <motion.p
          custom={0}
          variants={subtitleVariants}
          className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-10 tracking-wide leading-relaxed"
          style={{
            fontFamily: "'Rajdhani', 'Exo 2', sans-serif",
            fontWeight: "500",
            textShadow: "0 2px 4px rgba(0,0,0,0.8)",
          }}
        >
          <span
            className="text-red-400 font-bold text-2xl md:text-3xl block mb-2"
            style={{ fontFamily: "'Orbitron', monospace" }}
          >
            FACE THE DEVIL'S GAUNTLET
          </span>
          Master programming concepts under{" "}
          <span className="text-orange-400 font-bold">intense pressure</span>.
          <br />
          Survive the{" "}
          <span className="text-red-400 font-bold">trial by fire</span> and
          claim your place among the elite.
          <br />
          <span
            className="font-black text-white text-xl md:text-2xl mt-3 block animate-pulse"
            style={{
              fontFamily: "'Bebas Neue', cursive",
              letterSpacing: "0.1em",
            }}
          >
            ⚡ YOUR CODING DESTINY AWAITS ⚡
          </span>
        </motion.p>

        <motion.button
          whileHover={{
            scale: 1.05,
            backgroundColor: "#dc2626",
            color: "#fff",
            boxShadow: "0 0 30px 10px #dc262680, 0 0 60px 20px #dc262640",
          }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 250, damping: 10 }}
          onClick={handleGetStartedClick}
          className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-black font-black py-5 px-12 rounded-full text-xl md:text-2xl hover:from-red-500 hover:to-yellow-400 transition-all duration-300 shadow-2xl shadow-red-500/50 border-4 border-yellow-400/20 hover:border-white/40"
          style={{
            fontFamily: "'Orbitron', 'Bebas Neue', monospace",
            letterSpacing: "0.1em",
            textShadow: "0 2px 4px rgba(0,0,0,0.5)",
          }}
        >
          {currentUser ? "🔥 ENTER THE GAUNTLET 🔥" : "💀 BEGIN YOUR TRIAL 💀"}
        </motion.button>
      </motion.section>

      {/* About Section */}
      <motion.section
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="backdrop-blur-lg bg-gradient-to-br from-black/60 via-red-900/30 to-transparent rounded-2xl shadow-2xl shadow-black/60 p-8 md:p-12 z-20 w-full md:w-5/6 max-w-5xl mt-8"
      >
        <h2
          className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 mb-6 flex items-center gap-3"
          style={{
            fontFamily: "'Orbitron', 'Bebas Neue', monospace",
            letterSpacing: "0.05em",
            textShadow: "0 0 20px #dc2626aa",
          }}
        >
          <span aria-label="demon" className="text-5xl animate-bounce">
            😈
          </span>
          MEET THE DEVIL'S CODERS
          <span aria-label="fire" className="text-4xl animate-pulse">
            🔥
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          {TEAM_MEMBERS.map((member, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 38 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.14, type: "spring", stiffness: 180 }}
              className="rounded-xl p-4 bg-black/60 border border-red-800 flex items-center gap-5 shadow-lg cursor-pointer"
            >
              {/* Image placeholder (swap src later) */}
              <div className="w-20 h-20 bg-gradient-to-br from-red-800 to-black rounded-full flex-shrink-0 overflow-hidden border-4 border-red-700 shadow-md flex items-center justify-center">
                <img
                  src={member.img}
                  alt={member.name}
                  className="object-cover w-full h-full"
                  style={{ filter: "grayscale(10%) contrast(1.16)" }}
                  // Show fallback demon emoji if no dp available
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://em-content.zobj.net/thumbs/120/microsoft/319/smiling-face-with-horns_1f608.png";
                  }}
                />
              </div>
              <div>
                <h3
                  className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-300 to-orange-300 flex items-center gap-2"
                  style={{
                    fontFamily: "'Rajdhani', 'Exo 2', sans-serif",
                    letterSpacing: "0.05em",
                  }}
                >
                  {member.name}
                  <span className="text-lg animate-pulse">🔥</span>
                </h3>
                <p
                  className="font-bold text-yellow-400 mb-1"
                  style={{
                    fontFamily: "'Orbitron', monospace",
                    fontSize: "0.9rem",
                  }}
                >
                  {member.role}
                </p>
                <p
                  className="text-gray-300 text-sm leading-relaxed"
                  style={{ fontFamily: "'Rajdhani', sans-serif" }}
                >
                  {member.bio}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Auth Modal */}
      <AnimatePresence>
        {showModal && <AuthModal setShowModal={setShowModal} />}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;
