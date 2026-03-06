import { Dashboard } from "../components/Dashboard";
import { WowFeatures } from "../components/WowFeatures";
import { ChatPanel } from "../components/ChatPanel";
import { Footer } from "../components/Footer";

export function DashboardPage() {
  return (
    <>
      <main className="pt-20 min-h-screen flex flex-col">
        <div className="flex-1">
          <Dashboard />
          <WowFeatures />
          <ChatPanel />
        </div>
      </main>
      <Footer />
    </>
  );
}
