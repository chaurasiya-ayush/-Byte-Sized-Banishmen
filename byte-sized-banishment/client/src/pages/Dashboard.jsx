import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTachometerAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaScroll,
  FaSkullCrossbones,
  FaTrophy,
  FaTree,
  FaUsers,
} from "react-icons/fa";
import { GiLevelEndFlag, GiCrown, GiFist } from "react-icons/gi";
import GauntletSetupModal from "../components/GauntletSetupModal";
import { useCountdown } from "../hooks/useCountdown";

// --- PLACEHOLDER ASSETS ---
const backgroundVideo = "/src/assets/";
const logoImage = "/src/assets/logo.png";
const themeMusic = "/src/assets/theme.mp3";
const gauntletCardBg = "/src/assets/gauntlet-bg.jpg";
const devilSigil =
  "/src/assets/wing.jpg"; 

const fireShadow = "0 0 20px 7px #ff3b0faf, 0 0 30px 14px #a80019cc";

const Header = ({ user, onLogout }) => (
  <motion.header
    initial={{ opacity: 0, y: -40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1, type: "spring" }}
    className="flex justify-between items-center mb-10 relative"
  >
    <div className="flex items-center gap-4">
      <motion.img
        src={logoImage}
        alt="Logo"
        className="h-14 w-14 rounded-full shadow-xl border-4 border-red-800 animate-firelogo"
        style={{ boxShadow: fireShadow }}
        initial={{ scale: 0.92 }}
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      />
      <div>
        <h1
          className="text-3xl md:text-4xl font-black text-white tracking-widest devil-text-flicker"
          style={{ textShadow: fireShadow }}
        >
          The Devil's Crossroads
        </h1>
        <p className="text-base text-red-400/70 font-mono tracking-tight">
          Welcome back,{" "}
          <span className="text-yellow-400 font-bold">
            {user?.username || user?.email}
          </span>
        </p>
      </div>
    </div>
    <motion.button
      onClick={onLogout}
      whileHover={{
        scale: 1.1,
        backgroundColor: "#941204",
        boxShadow: fireShadow,
      }}
      className="bg-black font-bold py-2 px-5 rounded-xl shadow-lg border-2 border-red-600/60 text-white hover:border-yellow-400 transition-all"
    >
      Logout
    </motion.button>
  </motion.header>
);

const StatsCard = ({ stats }) => {
  const xpPercentage =
    stats.xpToNextLevel > 0 ? (stats.xp / stats.xpToNextLevel) * 100 : 0;

  // Animated XP RING (using SVG only for demo!)
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, type: "spring", delay: 0.2 }}
      className="bg-gradient-to-br from-black/80 via-red-900/70 to-black/80 border-2 border-red-700/40 rounded-2xl p-6 shadow-xl shadow-red-800/30 relative overflow-hidden"
    >
      {/* Animated glow ring */}
      <div className="absolute right-4 top-4">
        <svg width={56} height={56} className="rotate-[-35deg]">
          <circle
            cx={28}
            cy={28}
            r={24}
            fill="none"
            stroke="#1c1c1c"
            strokeWidth="6"
            opacity="0.5"
          />
          <motion.circle
            cx={28}
            cy={28}
            r={24}
            fill="none"
            stroke="url(#fire-xp)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 24}
            strokeDashoffset={2 * Math.PI * 24 * (1 - xpPercentage / 100)}
            initial={{ strokeDashoffset: 2 * Math.PI * 24 }}
            animate={{
              strokeDashoffset: 2 * Math.PI * 24 * (1 - xpPercentage / 100),
            }}
            transition={{ duration: 1.5, type: "spring" }}
            style={{ filter: "drop-shadow(0 0 12px #f87171bb)" }}
          />
          <defs>
            <linearGradient id="fire-xp" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#ff3b0f" />
              <stop offset="0.6" stopColor="#fae81e" />
              <stop offset="1" stopColor="#ff2b5e" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <h3 className="text-lg font-extrabold text-orange-400 mb-3 tracking-wider">
        HELLFIRE XP
      </h3>
      <div className="mb-4">
        <div className="flex justify-between items-end mb-1 font-mono text-sm">
          <span className="font-bold text-white">XP</span>
          <span className="text-gray-400">
            {stats.xp} / {stats.xpToNextLevel}
          </span>
        </div>
        <div className="w-full bg-gray-900 rounded-full h-4 border border-gray-800">
          <motion.div
            className="bg-gradient-to-r from-yellow-500 via-red-600 to-orange-500 h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${xpPercentage}%` }}
            transition={{ duration: 1.1, ease: "circOut" }}
          />
        </div>
      </div>
      <motion.div className="grid grid-cols-2 gap-4 mt-2">
        {[
          {
            icon: <GiCrown className="text-yellow-400 drop-shadow" />,
            label: "Rank",
            value: stats.rank,
          },
          {
            icon: <GiLevelEndFlag className="text-blue-400" />,
            label: "Level",
            value: stats.level,
          },
          {
            icon: <GiFist className="text-red-400" />,
            label: "Souls Claimed",
            value: stats.soulsClaimed,
          },
          {
            icon: <FaTachometerAlt className="text-orange-400" />,
            label: "Streak",
            value: stats.devilsFavor,
          },
        ].map((item, idx) => (
          <motion.div
            key={item.label}
            className="bg-black/70 p-3 rounded-xl flex items-center gap-3"
            transition={{ type: "spring", stiffness: 210 }}
          >
            <div className="text-2xl">{item.icon}</div>
            <div>
              <p className="text-xs text-gray-400">{item.label}</p>
              <p className="font-bold text-white text-base">{item.value}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

const GauntletCard = ({ onStartGauntlet }) => (
  <motion.div
    initial={{ opacity: 0, y: 45 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1, delay: 0.5, type: "spring" }}
    className="relative col-span-1 md:col-span-2 row-span-2 shadow-2xl shadow-red-900/60 rounded-3xl border-2 border-red-800 overflow-hidden bg-black/80"
    style={{
      backgroundImage: `url(${gauntletCardBg})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      minHeight: "350px",
    }}
  >
    {/* Fireplace Glow Overlay */}
    <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

    <div className="relative z-20 p-8 flex flex-col h-full justify-end">
      <h2 className="text-4xl font-black text-white uppercase tracking-wide drop-shadow devils-flicker">
        The Devil's Gauntlet
      </h2>
      <motion.p
        className="text-gray-200 mt-2 max-w-md"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        The <b>ultimate test of skill and nerve</b>. Choose your subject and{" "}
        <span className="text-orange-400 font-bold">face the trial</span>.
      </motion.p>
      <motion.button
        onClick={onStartGauntlet}
        whileHover={{
          scale: 1.07,

          backgroundColor: "#b91c1c",
          color: "#fff",
        }}
        className="mt-8 bg-gradient-to-r from-yellow-500 via-red-600 to-orange-600 text-black font-extrabold py-4 px-10 rounded-full text-xl shadow-md hover:to-yellow-400 transition-all duration-300 uppercase tracking-widest"
      >
        Begin a New Trial
      </motion.button>
    </div>
  </motion.div>
);

const CardBase = ({ children, color, className, ...props }) => (
  <motion.div
    className={`bg-black/70 border-2 ${color} backdrop-blur-md rounded-2xl shadow-xl p-6 flex items-center gap-4 ${
      className || ""
    }`}
    whileHover={{ y: -3, boxShadow: fireShadow }}
    transition={{ type: "tween", duration: 0.18 }}
    {...props}
  >
    {children}
  </motion.div>
);

const SkillTreeCard = () => (
  <Link to="/skill-tree">
    <CardBase
      color="border-red-700 hover:border-red-500"
      className="cursor-pointer"
    >
      <FaTree className="text-4xl text-red-400" />
      <div>
        <h3 className="font-bold text-white text-lg">The Devil's Path</h3>
        <p className="text-sm text-gray-400">
          View your skill tree and track mastery.
        </p>
      </div>
    </CardBase>
  </Link>
);

const LeaderboardCard = () => (
  <Link to="/leaderboard">
    <CardBase
      color="border-yellow-400 hover:border-orange-300"
      className="cursor-pointer"
    >
      <FaTrophy className="text-4xl text-yellow-400" />
      <div>
        <h3 className="font-bold text-white text-lg">League of the Damned</h3>
        <p className="text-sm text-gray-400">Climb the ranks of lost souls.</p>
      </div>
    </CardBase>
  </Link>
);

const SocialCard = () => (
  <Link to="/friends">
    <CardBase
      color="border-blue-400 hover:border-blue-600"
      className="cursor-pointer"
    >
      <FaUsers className="text-4xl text-yellow-200" />
      <div>
        <h3 className="font-bold text-white text-lg">The Soul-Binding</h3>
        <p className="text-sm text-gray-400">
          Manage friends and challenge rivals.
        </p>
      </div>
    </CardBase>
  </Link>
);

// -- Sidebar / Panel
const Sidebar = ({
  dailyChallenge,
  weakestLink,
  activeEffect,
  onStartWeaknessDrill,
  isDrillLoading,
}) => (
  <div className="lg:col-span-1 space-y-8">
    {activeEffect && activeEffect.type && (
      <ActiveEffectPanel effect={activeEffect} />
    )}
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, delay: 0.4 }}
      className="bg-black/80 border-2 border-yellow-700/30 rounded-2xl p-6 space-y-7 shadow-lg shadow-yellow-800/10"
    >
      <div className="flex items-center gap-3 mb-2">
        <FaScroll className="text-2xl text-yellow-400" />
        <h3 className="text-lg font-semibold text-yellow-400 drop-shadow">
          Devil's Demands
        </h3>
      </div>
      <div>
        <h4 className="font-bold text-white">Daily Challenge</h4>
        <p className="text-sm text-orange-200">{dailyChallenge?.description}</p>
      </div>
      <div className="border-t border-red-900/40 pt-4">
        <div className="flex items-center gap-3 mb-2">
          <FaSkullCrossbones className="text-2xl text-red-600" />
          <h4 className="font-bold text-white">Your Weakest Link</h4>
        </div>
        <p className="text-sm text-gray-300 mb-4">
          The Devil mocks your struggles with{" "}
          <span className="font-bold text-red-400">
            {weakestLink || "Nothing Yet"}
          </span>
          .
        </p>
        <motion.button
          onClick={onStartWeaknessDrill}
          disabled={
            isDrillLoading ||
            !weakestLink ||
            weakestLink.includes("Nothing Yet")
          }
          whileHover={{
            scale:
              !isDrillLoading &&
              weakestLink &&
              !weakestLink.includes("Nothing Yet")
                ? 1.05
                : 1,
            boxShadow: fireShadow,
          }}
          className="w-full bg-gray-900 hover:bg-red-700 border border-red-600/60 text-white font-extrabold py-2 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDrillLoading ? "Analyzing..." : "Confront Your Demons"}
        </motion.button>
      </div>
    </motion.div>
  </div>
);

const ActiveEffectPanel = ({ effect }) => {
  const { minutes, seconds } = useCountdown(effect.expiresAt);
  const isBlessing = effect.type === "blessing";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6 }}
      className={`border-2 rounded-2xl p-4 flex items-center gap-4 shadow-lg ${
        isBlessing
          ? "border-green-500 bg-green-900/70 shadow-green-800/10"
          : "border-red-700 bg-red-900/80 shadow-red-700/10 animate-pulse"
      }`}
    >
      <div
        className={`text-3xl ${isBlessing ? "text-green-400" : "text-red-400"}`}
      >
        {isBlessing ? <FaCheckCircle /> : <FaExclamationTriangle />}
      </div>
      <div>
        <p className="font-bold text-white">{effect.name}</p>
        <p className="text-sm text-gray-200">
          {isBlessing ? "XP gains are increased!" : "XP gains are reduced!"}
        </p>
      </div>
      <div
        className={`ml-auto font-mono text-lg px-3 py-1 rounded-md ${
          isBlessing
            ? "bg-green-500/20 text-green-300"
            : "bg-red-500/20 text-orange-200"
        }`}
      >
        {minutes}:{seconds}
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDrillLoading, setIsDrillLoading] = useState(false);
  const [error, setError] = useState("");
  const audioRef = useRef(null);
  const [showGauntletModal, setShowGauntletModal] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("No auth token found.");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get(
          "http://localhost:5000/api/user/dashboard",
          config
        );
        if (data.success) setDashboardData(data);
        else throw new Error(data.message || "Failed to fetch data");
      } catch (err) {
        setError(err.message || "Could not connect to the server.");
        if (err.response?.status === 401) logout();
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [logout]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.06;
      audioRef.current.play().catch((e) => {});
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleStartWeaknessDrill = async () => {
    setIsDrillLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.post(
        "http://localhost:5000/api/gauntlet/start-weakness-drill",
        {},
        config
      );
      navigate("/gauntlet", { state: { sessionData: data } });
    } catch (error) {
      // show error toast if you use react-toastify, here just alert
      alert(error.response?.data?.message || "Could not start the drill.");
    } finally {
      setIsDrillLoading(false);
    }
  };

  if (loading)
    return (
      <div className="bg-gray-950 text-white min-h-screen flex justify-center items-center">
        <motion.p
          className="text-2xl animate-pulse"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Forging Your Fate...
        </motion.p>
      </div>
    );
  if (error)
    return (
      <div className="bg-gray-950 text-white min-h-screen flex justify-center items-center">
        <p className="text-2xl text-red-600">{error}</p>
      </div>
    );

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-gray-950 to-red-900 text-white overflow-x-hidden">
      {/* Devil sigil glow & animated background overlays */}
      <motion.img
        src={devilSigil}
        alt=""
        className="pointer-events-none select-none fixed left-[10%] top-0 z-0 opacity-10 w-[30vw] min-w-[320px] max-w-[420px] blur-2xl animate-slowpulse"
        initial={{ opacity: 0.09, scale: 0.96 }}
        animate={{ opacity: [0.09, 0.18, 0.09], scale: [0.96, 1.09, 0.96] }}
        transition={{ repeat: Infinity, duration: 14, ease: "easeInOut" }}
        style={{ filter: "drop-shadow(0 0 120px #ff5733cc)" }}
      />
      <motion.img
        src={devilSigil}
        alt=""
        className="pointer-events-none select-none fixed right-[2%] bottom-[12vh] z-0 opacity-10 w-[29vw] min-w-[320px] max-w-[410px] blur-xl animate-slowpulse"
        initial={{ opacity: 0.09, scale: 1.1 }}
        animate={{ opacity: [0.1, 0.2, 0.11], scale: [1.1, 1.04, 1.1] }}
        transition={{ repeat: Infinity, duration: 16, ease: "easeInOut" }}
        style={{ filter: "drop-shadow(0 0 80px #c60a00ee)" }}
      />
      {/* BG Video Fire */}
      <video
        autoPlay
        loop
        muted
        className="absolute z-0 w-auto min-w-full min-h-full max-w-none opacity-15 pointer-events-none"
        style={{
          filter: "contrast(1.1) brightness(0.7)",
        }}
      >
        <source src={backgroundVideo} type="video/mp4" />
      </video>
      <audio ref={audioRef} src={themeMusic} loop />
      <AnimatePresence>
        {showGauntletModal && (
          <GauntletSetupModal
            showModal={showGauntletModal}
            setShowModal={setShowGauntletModal}
          />
        )}
      </AnimatePresence>
      <div className="relative z-10 p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto">
        <Header user={currentUser} onLogout={handleLogout} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
          <div className="lg:col-span-1 space-y-7">
            {dashboardData && <StatsCard stats={dashboardData.stats} />}
            {dashboardData && (
              <Sidebar
                dailyChallenge={dashboardData.dailyChallenge}
                weakestLink={dashboardData.weakestLink}
                activeEffect={dashboardData.stats.activeEffect}
                onStartWeaknessDrill={handleStartWeaknessDrill}
                isDrillLoading={isDrillLoading}
              />
            )}
          </div>
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 grid-rows-2 gap-7">
            {dashboardData && (
              <GauntletCard
                onStartGauntlet={() => setShowGauntletModal(true)}
              />
            )}
            <SkillTreeCard />
            <LeaderboardCard />
            <SocialCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
