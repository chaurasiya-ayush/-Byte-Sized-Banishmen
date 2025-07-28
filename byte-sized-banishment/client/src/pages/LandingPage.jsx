import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import AuthModal from "../components/AuthModal";

// Gaming devil particle images (place in /public or static CDN)
const PARTICLES = [
  "/icons/flame.png",
  "/icons/dice.png",
  "/icons/controller.png",
  "/icons/xp-star.png",
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

// NEW: Particle Animations
const makeParticles = () =>
  Array.from({ length: 10 }).map((_, i) => ({
    id: i,
    icon: PARTICLES[i % PARTICLES.length],
    x: Math.random() * 90 + "%",
    delay: Math.random() * 8,
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
    <div className="bg-gradient-to-br from-gray-950 via-black to-red-900 min-h-screen text-white flex flex-col items-center justify-center p-0 relative overflow-hidden">
      {/* BACKGROUND SMOKE/SHADOW OVERLAY */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 80%, rgba(124,25,25,0.27), transparent 80%)",
          zIndex: 1,
        }}
        animate={{ opacity: [0.7, 0.9, 0.7] }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
      />

      {/* DEVILISH HERO GLOWS */}
      <motion.div
        className="absolute -bottom-48 -left-48 w-[500px] h-[500px] bg-red-900 rounded-full opacity-25 blur-3xl z-0 pointer-events-none"
        animate={{ scale: [1, 1.1, 0.9, 1], y: [0, -30, 0] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        style={{ boxShadow: "0 0 120px 60px #a21c1c55" }}
      />
      <motion.div
        className="absolute -top-40 -right-40 w-[430px] h-[400px] bg-red-800 rounded-full opacity-25 blur-2xl z-0 pointer-events-none"
        animate={{ scale: [1, 0.96, 1.04, 1], y: [0, 30, 0] }}
        transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
        style={{ boxShadow: "0 0 120px 40px #ef444433" }}
      />

      {/* NEW: Gaming Devil Floating Particles */}
      {particles.map((p, idx) => (
        <motion.img
          key={p.id}
          src={p.icon}
          className="absolute z-10 opacity-80"
          alt="particle"
          style={{
            left: p.x,
            bottom: "-48px",
            width: "30px",
            filter: "drop-shadow(0 0 15px #dc2626bb)",
          }}
          initial={{ y: 0, opacity: 0.5, scale: 0.85, rotate: 0 }}
          animate={{
            y: [-10, -280 - idx * 18],
            opacity: [0.4, 0.9, 0],
            scale: [0.85, 1.12, 1],
            rotate: [0, 12 * idx, -3 * idx],
          }}
          transition={{
            repeat: Infinity,
            delay: p.delay,
            duration: 7 + idx * 0.33,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* HERO: Title, Subtitle, Button */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={heroVariants}
        className="mt-24 mb-12 z-10 text-center"
      >
        <motion.h1
          className="text-5xl md:text-7xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-yellow-600 relative inline-block drop-shadow-2xl"
          style={{
            fontFamily: "'Orbitron', 'Bebas Neue', monospace",
            textShadow: "0 0 20px #d97706aaa, 0 0 60px #dc262655",
            letterSpacing: "0.05em",
          }}
        >
          BYTE-SIZED
          <br />
          <span
            className="text-yellow-400 drop-shadow-2xl"
            style={{ textShadow: "0 2px 16px #fbbf24aa" }}
          >
            BANISHMENT
          </span>
          <span className="ml-2 text-4xl md:text-6xl animate-pulse">🔥</span>
          {/* NEW: Animated pixel sparkle, devil horn overlay */}
          <span className="absolute left-1/2 -top-8 -translate-x-1/2 text-5xl animate-bounce select-none pointer-events-none">
            😈
          </span>
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
            scale: 1.08,
            backgroundColor: "#b91c1c",
            color: "#fff",
            boxShadow: "0 0 32px 10px #dc2626af, 0 0 64px 20px #dc262650",
          }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 360, damping: 19 }}
          onClick={handleGetStartedClick}
          className="relative shadow-2xl shadow-red-700/60 border-4 border-yellow-400/20 hover:border-yellow-200 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-black font-black py-5 px-14 rounded-full text-xl md:text-2xl transition-all duration-300 group"
          style={{
            fontFamily: "'Orbitron', 'Bebas Neue', monospace",
            letterSpacing: "0.11em",
            textShadow: "0 2px 8px rgba(0,0,0,0.6)",
          }}
        >
          {currentUser ? "🔥 ENTER THE GAUNTLET 🔥" : "💀 BEGIN YOUR TRIAL 💀"}
          {/* Devil tail */}
          <span className="absolute right-3 -bottom-6 rotate-12 scale-[2.5] select-none pointer-events-none opacity-75 transition-all group-hover:opacity-100">
            😈
          </span>
        </motion.button>
      </motion.section>

      {/* ABOUT/TEAM SECTION: Demonified */}
      <motion.section
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.9, delay: 0.25 }}
        className="backdrop-blur-md bg-gradient-to-tr from-black/50 via-red-800/20 to-transparent border border-red-900/30 rounded-2xl shadow-xl p-8 md:p-12 z-20 w-full md:w-5/6 max-w-5xl mt-8"
      >
        <h2
          className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 mb-7 flex items-center gap-3"
          style={{
            fontFamily: "'Orbitron', 'Rajdhani', monospace",
            letterSpacing: "0.05em",
            textShadow: "0 0 14px #dc2626b9",
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-5">
          {TEAM_MEMBERS.map((member, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 44, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.13, type: "spring", stiffness: 160 }}
              className="relative rounded-xl p-5 bg-gradient-to-bl from-black/80 via-red-900/60 to-black/60 border-2 border-red-800 hover:border-yellow-400/40 flex items-center gap-5 shadow-lg cursor-pointer overflow-hidden group"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-red-800 to-black rounded-full flex-shrink-0 overflow-hidden border-4 border-red-700 shadow-md flex items-center justify-center">
                <img
                  src={member.img}
                  alt={member.name}
                  className="object-cover w-full h-full"
                  style={{ filter: "grayscale(10%) contrast(1.12)" }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://em-content.zobj.net/thumbs/120/microsoft/319/smiling-face-with-horns_1f608.png";
                  }}
                />
              </div>
              <div>
                <h3
                  className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-300 via-yellow-400 to-orange-300 flex items-center gap-2"
                  style={{
                    fontFamily: "'Rajdhani', 'Exo 2', sans-serif",
                    letterSpacing: "0.05em",
                    textShadow: "0 0 6px #d97706aa",
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

      {/* LAVA FLICKER FOOTER for the gaming mood */}
      <motion.div
        className="absolute left-0 bottom-0 w-full h-[26px] pointer-events-none z-30"
        style={{
          background:
            "linear-gradient(90deg, #330000 35%, #b91c1c 60%, #ffd700 85%, #f97316 100%)",
          filter: "blur(8px)",
        }}
        animate={{ opacity: [0.8, 1, 0.9, 1] }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
      />

      {/* Auth Modal */}
      <AnimatePresence>
        {showModal && <AuthModal setShowModal={setShowModal} />}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;
