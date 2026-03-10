/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { ScrollToTop } from "./components/ScrollToTop";
import { AnimatedRoutes } from "./components/AnimatedRoutes";
import { AuthProvider } from "./contexts/AuthContext";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { AuthModal } from "./components/AuthModal";

import { Suspense } from "react";

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CurrencyProvider>
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-background">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-purple"></div>
            </div>
          }>
            <BrowserRouter>
              <AuthModal />
              <ScrollToTop />
              <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent-purple/30 transition-colors duration-300">
                <Navbar />
                <AnimatedRoutes />
              </div>
            </BrowserRouter>
          </Suspense>
        </CurrencyProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
