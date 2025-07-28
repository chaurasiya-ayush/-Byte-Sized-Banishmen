import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import AuthModal from "../components/AuthModal";

// Coding syntax symbols as particles
const PARTICLES = [
  "{ }",
  "===",
  "( )",
  "[ ]",
  "< />",
  "!==",
  "=>",
  "&&",
  "||",
  "++",
  "--",
  "/**/",
  "//",
  "${}",
  "#",
  ".",
  ":",
  ";",
];
// Placeholder team data
const TEAM_MEMBERS = [
  {
    name: "Ayush 'Leader' Inferno",
    role: "Lead Fiend & Frontend Conjurer",
    img: "/team/dp1.png",
    bio: "Brings the pixel-sorcery and devilishly good UI magic.",
  },
  {
    name: "Naina DevOps",
    role: "Chaos of Deployments",
    img: "/team/dp4.png",
    bio: "Ensures the flames of production keep burning bright.",
  },
  {
    name: "Arya Syntax",
    role: "AI Quizmaster Architect",
    img: "/team/dp3.png",
    bio: "Built the gauntlet's mind-bending question engine.",
  },
  {
    name: "Rahul DeBug",
    role: "Backend Demoness",
    img: "/team/dp2.png",
    bio: "Turns database nightmares into functional hellscapes.",
  },
];

// ...TEAM_MEMBERS as before...

const heroVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 90, damping: 13, delay: 0.4 },
  },
};
// ...subtitleVariants as before...
// Animate the subtitle nicely
const subtitleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.7 + i * 0.1, duration: 0.7 },
  }),
};

// Optimized Particle Animations with fewer particles for better performance
const makeParticles = () =>
  Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    symbol: PARTICLES[i % PARTICLES.length],
    x: Math.random() * 80 + 10 + "%", // Keep particles more centered
    delay: Math.random() * 5,
    fontSize: Math.random() * 6 + 18, // Smaller range for consistency
    color: ["#dc2626", "#f97316", "#eab308", "#0ea5e9"][
      Math.floor(Math.random() * 4)
    ], // Fewer colors for better performance
  }));

const LandingPage = () => {
  const [showModal, setShowModal] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const particles = makeParticles();

  const handleGetStartedClick = (e) => {
    e.preventDefault(); // Prevent any default behavior that might cause refresh
    if (currentUser) {
      navigate("/dashboard");
    } else {
      setShowModal(true);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-950 to-red-900 min-h-screen text-white flex flex-col items-center justify-center p-0 relative overflow-hidden">
      {/* BACKGROUND OVERLAY - Simplified */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at 50% 80%, rgba(124,25,25,0.4), transparent 70%)",
          zIndex: 1,
        }}
      />

      {/* SIMPLIFIED HERO GLOWS - Reduced complexity */}
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-red-800/20 rounded-full blur-3xl z-0 pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-red-700/15 rounded-full blur-2xl z-0 pointer-events-none" />

      {/* OPTIMIZED: Coding Syntax Floating Particles */}
      {particles.map((p, idx) => (
        <motion.div
          key={p.id}
          className="absolute z-10 opacity-70 font-mono font-bold select-none pointer-events-none"
          style={{
            left: p.x,
            bottom: "-40px",
            fontSize: `${p.fontSize}px`,
            color: p.color,
            textShadow: `0 0 10px ${p.color}aa`,
          }}
          initial={{ y: 0, opacity: 0.4, scale: 0.9 }}
          animate={{
            y: [-5, -200 - idx * 12],
            opacity: [0.3, 0.7, 0],
            scale: [0.9, 1.1, 1],
          }}
          transition={{
            repeat: Infinity,
            delay: p.delay,
            duration: 5 + idx * 0.2,
            ease: "linear",
          }}
        >
          {p.symbol}
        </motion.div>
      ))}

      {/* HERO: Title, Subtitle, Button - Performance Optimized */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={heroVariants}
        className="mt-24 mb-12 z-10 text-center"
      >
        <motion.h1
          className="text-5xl md:text-7xl font-black mb-6 text-red-400 relative inline-block"
          style={{
            fontFamily: "'Orbitron', 'Bebas Neue', monospace",
            textShadow: "0 0 20px #dc2626aa",
            letterSpacing: "0.05em",
          }}
        >
          BYTE-SIZED
          <br />
          <span
            className="text-yellow-400"
            style={{ textShadow: "0 2px 16px #fbbf24aa" }}
          >
            BANISHMENT
          </span>
          <span className="ml-2 text-4xl md:text-6xl text-orange-400">🔥</span>
          {/* Simplified animated overlay */}
        </motion.h1>
        <motion.p
          custom={0}
          variants={subtitleVariants}
          className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-10 tracking-wide leading-relaxed"
          style={{
            fontFamily: "'Rajdhani', 'Exo 2', sans-serif",
            fontWeight: "500",
            textShadow: "0 2px 6px rgba(0,0,0,0.8)",
          }}
        >
          <span
            className="text-red-400 font-bold text-2xl md:text-3xl block mb-2"
            style={{
              fontFamily: "'Orbitron', monospace",
              letterSpacing: "0.09em",
            }}
          >
            FACE THE DEVIL'S GAUNTLET
          </span>
          Master programming concepts under{" "}
          <span className="text-orange-400 font-bold">intense pressure</span>.
          <br />
          Survive the{" "}
          <span className="text-red-500 font-bold">trial by fire</span> and
          claim your place among the elite.
          <br />
          <span
            className="font-black text-white text-xl md:text-2xl mt-3 block"
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
          }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={handleGetStartedClick}
          className="relative shadow-xl border-3 border-yellow-400/30 hover:border-yellow-200 bg-gradient-to-r from-yellow-500 to-red-500 text-black font-black py-5 px-12 rounded-full text-xl md:text-2xl group"
          style={{
            fontFamily: "'Orbitron', 'Bebas Neue', monospace",
            letterSpacing: "0.11em",
            textShadow: "0 2px 8px rgba(0,0,0,0.6)",
          }}
        >
          {currentUser ? "🔥 ENTER THE GAUNTLET 🔥" : "💀 BEGIN YOUR TRIAL 💀"}
          {/* Simplified devil tail */}
          <span className="absolute right-3 -bottom-5 text-2xl select-none pointer-events-none opacity-80 group-hover:opacity-100">
            😈
          </span>
        </motion.button>
      </motion.section>

      {/* ABOUT/TEAM SECTION: Optimized for Performance */}
      <motion.section
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="bg-black/60 border border-red-800/40 rounded-2xl shadow-2xl p-8 md:p-12 z-20 w-full md:w-5/6 max-w-5xl mt-8"
        style={{
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        <h2
          className="text-4xl md:text-5xl font-black text-red-400 mb-7 flex items-center gap-3"
          style={{
            fontFamily: "'Orbitron', 'Rajdhani', monospace",
            letterSpacing: "0.05em",
            textShadow: "0 0 12px #dc2626aa",
          }}
        >
          <motion.span
            aria-label="demon"
            className="text-5xl"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            😈
          </motion.span>
          MEET THE DEVIL'S CODERS
          <motion.span
            aria-label="fire"
            className="text-4xl text-orange-400"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            🔥
          </motion.span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-5">
          {TEAM_MEMBERS.map((member, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                delay: idx * 0.1,
                duration: 0.5,
                type: "tween",
                ease: "easeOut",
              }}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2, ease: "easeOut" },
              }}
              className="relative rounded-xl p-5 bg-gradient-to-br from-gray-900 to-red-900/40 border-2 border-red-700/60 hover:border-yellow-400/60 flex items-center gap-5 shadow-lg cursor-pointer group transition-colors duration-300"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-red-700 to-gray-900 rounded-full flex-shrink-0 overflow-hidden border-3 border-red-600 shadow-lg flex items-center justify-center">
                <img
                  src={member.img}
                  alt={member.name}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://em-content.zobj.net/thumbs/120/microsoft/319/smiling-face-with-horns_1f608.png";
                  }}
                />
              </div>
              <div>
                <h3
                  className="text-xl md:text-2xl font-bold text-yellow-300 flex items-center gap-2 group-hover:text-yellow-200 transition-colors duration-300"
                  style={{
                    fontFamily: "'Rajdhani', 'Exo 2', sans-serif",
                    letterSpacing: "0.05em",
                    textShadow: "0 0 8px #d97706aa",
                  }}
                >
                  {member.name}
                  <span className="text-lg text-orange-400">🔥</span>
                </h3>
                <p
                  className="font-bold text-red-300 mb-1"
                  style={{
                    fontFamily: "'Orbitron', monospace",
                    fontSize: "0.9rem",
                    letterSpacing: "0.04em",
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

      {/* OPTIMIZED FOOTER - Simplified */}
      <div
        className="absolute left-0 bottom-0 w-full h-6 pointer-events-none z-30 opacity-80"
        style={{
          background:
            "linear-gradient(90deg, #330000 30%, #dc2626 60%, #fbbf24 90%)",
          filter: "blur(4px)",
        }}
      />

      {/* Auth Modal */}
      <AnimatePresence>
        {showModal && <AuthModal setShowModal={setShowModal} />}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;
