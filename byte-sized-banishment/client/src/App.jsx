import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import GauntletPage from "./pages/gauntlet/GauntletPage";
import SkillTreePage from "./pages/skill-tree/SkillTreePage";
import LeaderboardPage from "./pages/LeaderboardPage";
import SocialPage from "./pages/SocialPage";
import DuelGauntletPage from "./pages/DuelGauntletPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
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
      </Router>
    </>
  );
}
export default App;
