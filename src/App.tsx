/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { ScrollToTop } from "./components/ScrollToTop";
import { AnimatedRoutes } from "./components/AnimatedRoutes";
import { AuthProvider } from "./contexts/AuthContext";
import { ErrorBoundary } from "./components/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent-purple/30 transition-colors duration-300">
            <Navbar />
            <AnimatedRoutes />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}
