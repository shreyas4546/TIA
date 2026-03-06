import { Hero } from "../components/Hero";
import { Insights } from "../components/Insights";
import { Features } from "../components/Features";
import { Footer } from "../components/Footer";

export function LandingPage() {
  return (
    <>
      <main>
        <Hero />
        <Insights />
        <Features />
      </main>
      <Footer />
    </>
  );
}
