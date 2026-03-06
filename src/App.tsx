/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Insights } from "./components/Insights";
import { Dashboard } from "./components/Dashboard";
import { Features } from "./components/Features";
import { ChatPanel } from "./components/ChatPanel";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-white font-sans selection:bg-accent-purple/30">
      <Navbar />
      <main>
        <Hero />
        <Insights />
        <Dashboard />
        <Features />
        <ChatPanel />
      </main>
      <Footer />
    </div>
  );
}
