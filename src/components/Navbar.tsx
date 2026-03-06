import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ShieldCheck, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-[#0B0F19]/80 backdrop-blur-md border-b border-brand-border py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center shadow-[0_0_15px_var(--color-accent-glow)]">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-display font-bold tracking-tight">Tia</span>
        </Link>

        {!isDashboard && (
          <nav className="hidden md:flex items-center gap-8">
            <a href="#insights" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Insights</a>
            <a href="#features" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Features</a>
          </nav>
        )}

        <div className="hidden md:flex items-center gap-4">
          {isDashboard ? (
            <Link to="/" className="neon-button px-5 py-2 text-sm" onClick={() => window.scrollTo(0, 0)}>Back to Home</Link>
          ) : (
            <Link to="/dashboard" className="neon-button px-5 py-2 text-sm" onClick={() => window.scrollTo(0, 0)}>Open Dashboard</Link>
          )}
        </div>

        <button
          className="md:hidden text-gray-300 hover:text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#0B0F19] border-b border-brand-border p-6 flex flex-col gap-4 shadow-2xl">
          {!isDashboard && (
            <>
              <a href="#insights" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-white py-2 border-b border-brand-border/50">Insights</a>
              <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-white py-2 border-b border-brand-border/50">Features</a>
            </>
          )}
          {isDashboard ? (
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="neon-button text-center mt-4">Back to Home</Link>
          ) : (
            <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="neon-button text-center mt-4">Open Dashboard</Link>
          )}
        </div>
      )}
    </motion.header>
  );
}
