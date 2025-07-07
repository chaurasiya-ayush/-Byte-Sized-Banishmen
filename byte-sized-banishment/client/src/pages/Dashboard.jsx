import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import StatsPanel from "../dashboard/components/StatsPanel";
import GauntletCard from "../dashboard/components/GauntletCard";
import DailyChallenges from "../dashboard/components/DailyChallenges";
import ActiveEffectPanel from "../dashboard/components/ActiveEffectPanel";
import GauntletSetupModal from "../components/GauntletSetupModal";

const backgroundVideo = "/src/assets/background.mp4";
const logoImage = "/src/assets/logo.png";
const themeMusic = "/src/assets/theme.mp3";

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
        if (!token)
          throw new Error("No auth token found, please log in again.");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get(
          "http://localhost:5000/api/user/dashboard",
          config
        );

        if (data.success) {
          setDashboardData(data);
        } else {
          throw new Error(data.message || "Failed to fetch data");
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
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
      audioRef.current
        .play()
        .catch((e) => console.log("Audio autoplay was prevented."));
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
      <GauntletSetupModal
        showModal={showGauntletModal}
        setShowModal={setShowGauntletModal}
      />

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <img
              src={logoImage}
              alt="Byte-Sized Banishment Logo"
              className="h-10 w-auto mr-4"
            />
            <h1 className="text-xl md:text-3xl font-bold text-red-500 hidden sm:block">
              The Devil's Crossroads
            </h1>
          </div>
          <div className="flex items-center">
            <span className="text-gray-300 mr-4 hidden md:block">
              Welcome, {currentUser?.email}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            {dashboardData && <StatsPanel stats={dashboardData.stats} />}
            {/* THIS LINE WAS MISSING AND IS NOW FIXED */}
            {dashboardData && (
              <ActiveEffectPanel effect={dashboardData.stats.activeEffect} />
            )}
            {dashboardData && (
              <DailyChallenges
                challenge={dashboardData.dailyChallenge}
                weakestLink={dashboardData.weakestLink}
              />
            )}
          </div>
          <div className="lg:col-span-2 space-y-6">
            {dashboardData && (
              <GauntletCard
                session={dashboardData.activeSession}
                onStartGauntlet={() => setShowGauntletModal(true)}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
