import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import GauntletPage from "./pages/gauntlet/GauntletPage"; // <-- IMPORT NEW PAGE
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
          />{" "}
          {/* <-- ADD NEW ROUTE */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
