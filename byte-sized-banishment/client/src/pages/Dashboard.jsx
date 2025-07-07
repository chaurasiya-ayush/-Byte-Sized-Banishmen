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
} from "react-icons/fa";
import { GiLevelEndFlag, GiCrown, GiFist } from "react-icons/gi";
import GauntletSetupModal from "../components/GauntletSetupModal";
import { useCountdown } from "../hooks/useCountdown"; // Assuming you have this hook

// --- PLACEHOLDER ASSETS ---
const backgroundVideo = "/src/assets/background.mp4";
const logoImage = "/src/assets/logo.png";
const themeMusic = "/src/assets/theme.mp3";
const gauntletCardBg = "/src/assets/gauntlet-bg.jpg"; // Placeholder for a cool background image

// --- CHILD COMPONENTS (Redesigned for the new layout) ---

const Header = ({ user, onLogout }) => (
  <header className="flex justify-between items-center mb-8">
    <div className="flex items-center gap-4">
      <img src={logoImage} alt="Logo" className="h-12 w-auto" />
      <div>
        <h1 className="text-xl md:text-3xl font-bold text-white">
          The Devil's Crossroads
        </h1>
        <p className="text-sm text-gray-400">
          Welcome back,{" "}
          <span className="text-red-400 font-semibold">{user?.email}</span>
        </p>
      </div>
    </div>
    <button
      onClick={onLogout}
      className="bg-gray-800 hover:bg-red-600 border-2 border-red-500/50 hover:border-red-500 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300"
    >
      Logout
    </button>
  </header>
);

const StatsCard = ({ stats }) => {
  const xpPercentage =
    stats.xpToNextLevel > 0 ? (stats.xp / stats.xpToNextLevel) * 100 : 0;

  const statItems = [
    {
      icon: <GiCrown className="text-yellow-400" />,
      label: "Rank",
      value: stats.rank,
    },
    {
      icon: <GiLevelEndFlag className="text-blue-400" />,
      label: "Level",
      value: stats.level,
    },
    {
      icon: <GiFist className="text-green-400" />,
      label: "Souls Claimed",
      value: stats.soulsClaimed,
    },
    {
      icon: <FaTachometerAlt className="text-orange-400" />,
      label: "Streak",
      value: stats.devilsFavor,
    },
  ];

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-red-400 mb-4">Player Stats</h3>
      <div className="mb-4">
        <div className="flex justify-between items-end mb-1 font-mono text-sm">
          <span className="font-bold text-white">XP</span>
          <span className="text-gray-400">
            {stats.xp} / {stats.xpToNextLevel}
          </span>
        </div>
        <div className="w-full bg-gray-900 rounded-full h-4 border border-gray-700">
          <motion.div
            className="bg-gradient-to-r from-red-500 to-orange-500 h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${xpPercentage}%` }}
            transition={{ duration: 1, ease: "circOut" }}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {statItems.map((item) => (
          <div
            key={item.label}
            className="bg-gray-900/70 p-3 rounded-lg flex items-center gap-3"
          >
            <div className="text-2xl">{item.icon}</div>
            <div>
              <p className="text-xs text-gray-400">{item.label}</p>
              <p className="font-bold text-white text-sm">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const GauntletCard = ({ onStartGauntlet }) => (
  <motion.div
    className="relative col-span-1 md:col-span-2 row-span-2 bg-cover bg-center rounded-2xl p-8 flex flex-col justify-end overflow-hidden shadow-2xl shadow-red-900/50 border border-gray-700"
    style={{ backgroundImage: `url(${gauntletCardBg})` }}
    whileHover={{ scale: 1.02 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
    <div className="relative z-10">
      <h2 className="text-4xl font-black text-white uppercase">
        The Devil's Gauntlet
      </h2>
      <p className="text-gray-300 mt-2 max-w-md">
        The ultimate test of skill and nerve. Choose your subject and face the
        trial. Your soul is the price of failure.
      </p>
      <button
        onClick={onStartGauntlet}
        className="mt-6 bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all transform hover:scale-105 shadow-lg shadow-red-500/30"
      >
        Begin a New Trial
      </button>
    </div>
  </motion.div>
);

const SkillTreeCard = () => (
  <Link to="/skill-tree">
    <motion.div
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 flex items-center gap-4 hover:border-red-500 transition-colors duration-300 cursor-pointer"
      whileHover={{ y: -5 }}
    >
      <FaTree className="text-4xl text-red-400" />
      <div>
        <h3 className="font-bold text-white text-lg">The Devil's Path</h3>
        <p className="text-sm text-gray-400">
          View your skill tree and track mastery.
        </p>
      </div>
    </motion.div>
  </Link>
);

const LeaderboardCard = () => (
  <Link to="/leaderboard">
    {" "}
    {/* <-- WRAP WITH LINK */}
    <motion.div
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 flex items-center gap-4 hover:border-yellow-500 transition-colors duration-300 cursor-pointer"
      whileHover={{ y: -5 }}
    >
      <FaTrophy className="text-4xl text-yellow-400" />
      <div>
        <h3 className="font-bold text-white text-lg">League of the Damned</h3>
        <p className="text-sm text-gray-400">
          See how you rank against other souls.
        </p>
      </div>
    </motion.div>
  </Link>
);
const Sidebar = ({ dailyChallenge, weakestLink, activeEffect }) => (
  <div className="lg:col-span-1 space-y-6">
    {activeEffect && activeEffect.type && (
      <ActiveEffectPanel effect={activeEffect} />
    )}
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 space-y-6">
      <div className="flex items-center gap-3">
        <FaScroll className="text-2xl text-yellow-400" />
        <h3 className="text-lg font-semibold text-yellow-400">
          Devil's Demands
        </h3>
      </div>
      <div>
        <h4 className="font-bold text-white">Daily Challenge</h4>
        <p className="text-sm text-gray-300">{dailyChallenge?.description}</p>
      </div>
      <div className="border-t border-gray-700 pt-4">
        {/* FIXED: Added the FaSkullCrossbones icon here */}
        <div className="flex items-center gap-3 mb-2">
          <FaSkullCrossbones className="text-2xl text-gray-400" />
          <h4 className="font-bold text-white">Your Weakest Link</h4>
        </div>
        <p className="text-sm text-gray-300">
          The Devil mocks your struggles with{" "}
          <span className="font-bold text-red-400">{weakestLink}</span>.
        </p>
      </div>
    </div>
  </div>
);

const ActiveEffectPanel = ({ effect }) => {
  const { minutes, seconds } = useCountdown(effect.expiresAt);
  const isBlessing = effect.type === "blessing";
  return (
    <div
      className={`border-2 rounded-2xl p-4 flex items-center gap-4 shadow-lg ${
        isBlessing
          ? "border-green-500 bg-green-900/50 shadow-green-500/20"
          : "border-red-500 bg-red-900/50 shadow-red-500/20 animate-pulse"
      }`}
    >
      <div
        className={`text-3xl ${isBlessing ? "text-green-400" : "text-red-400"}`}
      >
        {isBlessing ? <FaCheckCircle /> : <FaExclamationTriangle />}
      </div>
      <div>
        <p className="font-bold text-white">{effect.name}</p>
        <p className="text-sm text-gray-300">
          {isBlessing ? "XP gains are increased!" : "XP gains are reduced!"}
        </p>
      </div>
      <div
        className={`ml-auto font-mono text-lg px-3 py-1 rounded-md ${
          isBlessing
            ? "bg-green-500/20 text-green-300"
            : "bg-red-500/20 text-red-300"
        }`}
      >
        {minutes}:{seconds}
      </div>
    </div>
  );
};

// --- Main Dashboard Component ---

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
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
      audioRef.current.volume = 0.1;
      audioRef.current.play().catch((e) => {});
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading)
    return (
      <div className="bg-gray-900 text-white min-h-screen flex justify-center items-center">
        <p className="text-2xl animate-pulse">Forging Your Fate...</p>
      </div>
    );
  if (error)
    return (
      <div className="bg-gray-900 text-white min-h-screen flex justify-center items-center">
        <p className="text-2xl text-red-500">{error}</p>
      </div>
    );

  return (
    <div className="relative min-h-screen bg-gray-900 text-white overflow-hidden">
      <video
        autoPlay
        loop
        muted
        className="absolute z-0 w-auto min-w-full min-h-full max-w-none opacity-20"
      >
        <source src={backgroundVideo} type="video/mp4" />
      </video>
      <audio ref={audioRef} src={themeMusic} loop />

      {/* FIXED: The modal is now correctly wrapped with AnimatePresence for exit animations */}
      <AnimatePresence>
        {showGauntletModal && (
          <GauntletSetupModal
            showModal={showGauntletModal}
            setShowModal={setShowGauntletModal}
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <Header user={currentUser} onLogout={handleLogout} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            {dashboardData && <StatsCard stats={dashboardData.stats} />}
            {dashboardData && (
              <Sidebar
                dailyChallenge={dashboardData.dailyChallenge}
                weakestLink={dashboardData.weakestLink}
                activeEffect={dashboardData.stats.activeEffect}
              />
            )}
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 grid-rows-2 gap-6">
            {dashboardData && (
              <GauntletCard
                onStartGauntlet={() => setShowGauntletModal(true)}
              />
            )}
            <SkillTreeCard />
            <LeaderboardCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
