import React, { useEffect, useState, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import GauntletPage from "./pages/gauntlet/GauntletPage";
import SkillTreePage from "./pages/skill-tree/SkillTreePage";
import LeaderboardPage from "./pages/LeaderboardPage";
import SocialPage from "./pages/SocialPage";
import DuelGauntletPage from "./pages/DuelGauntletPage";
import ResetPassword from "./pages/ResetPassword";
import VerificationSuccess from "./pages/VerificationSuccess";
import VerificationError from "./pages/VerificationError";
import ProtectedRoute from "./components/ProtectedRoute";
import backgroundVideo from "./assets/background.mp4";

// ------------- IntroVideoOverlay component -------------

function IntroVideoOverlay({ onFinish }) {
  const [fade, setFade] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef();

  // Auto play & fade out after 8s
  useEffect(() => {
    const timeout1 = setTimeout(() => setFade(true), 8000); // 8s duration
    const timeout2 = setTimeout(() => onFinish(), 8700); // extra for fade out

    // Enhanced video loading
    const video = videoRef.current;
    if (video) {
      video.addEventListener("loadeddata", () => {
        console.log("Video loaded successfully");
      });

      video.addEventListener("error", (e) => {
        console.error("Video error:", e);
        setVideoError(true);
      });

      video.play().catch((error) => {
        console.error("Video play failed:", error);
        setVideoError(true);
      });
    }

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, [onFinish]);

  // Allow manual skip after 2.5s
  const [canSkip, setCanSkip] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setCanSkip(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-opacity duration-700 ${
        fade ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{
        background:
          "radial-gradient(ellipse at center, #120000 60%, #3c040d 100%)",
      }}
    >
      {!videoError ? (
        <video
          src={backgroundVideo}
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted
          playsInline
          style={{
            maxWidth: "100vw",
            maxHeight: "100vh",
          }}
        />
      ) : (
        <div className="text-red-400 text-center">
          <h1 className="text-4xl font-bold mb-4">Byte-Sized Banishment</h1>
          <p className="text-xl">Loading...</p>
        </div>
      )}
      {canSkip && (
        <button
          onClick={() => {
            setFade(true);
            setTimeout(onFinish, 700);
          }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-red-200 bg-black/70 px-5 py-2 rounded-full border-2 border-red-900 text-lg shadow-lg hover:bg-black/90 hover:border-yellow-400 transition-all animate-pulse"
        >
          Skip
        </button>
      )}
      {/* Devil logo or flames can be added as overlay for more drama */}
    </div>
  );
}

// ------------- APP COMPONENT -------------
function AppContent() {
  const location = useLocation();
  const [showIntro, setShowIntro] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  // Track navigation state
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Clear navigation flag on page refresh/reload
      sessionStorage.removeItem("isNavigating");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // Check if we should show intro video
  useEffect(() => {
    const currentPath = location.pathname;
    const isLandingOrDashboard =
      currentPath === "/" || currentPath === "/dashboard";
    const wasNavigating = sessionStorage.getItem("isNavigating") === "true";

    // Show intro only on landing/dashboard pages and only if it's not from navigation
    if (isLandingOrDashboard && !wasNavigating) {
      setShowIntro(true);
    }

    // Set navigation flag for subsequent page changes
    setIsNavigating(true);
    sessionStorage.setItem("isNavigating", "true");
  }, [location.pathname]);

  const handleIntroFinish = () => {
    setShowIntro(false);
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      {showIntro && <IntroVideoOverlay onFinish={handleIntroFinish} />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/verification-success" element={<VerificationSuccess />} />
        <Route path="/verification-error" element={<VerificationError />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gauntlet"
          element={
            <ProtectedRoute>
              <GauntletPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/skill-tree"
          element={
            <ProtectedRoute>
              <SkillTreePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <LeaderboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/friends"
          element={
            <ProtectedRoute>
              <SocialPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/duel/:duelId"
          element={
            <ProtectedRoute>
              <DuelGauntletPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
export default App;
