import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import { LandingPage } from "../pages/LandingPage";
import { DashboardPage } from "../pages/DashboardPage";
import { ProfilePage } from "../pages/ProfilePage";

export function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </AnimatePresence>
  );
}
