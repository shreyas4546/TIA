import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck, Menu, X, Sun, Moon, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { GlowButton } from "./ui/GlowButton";
import { useTheme } from "./ThemeProvider";
import { NotificationsDropdown } from "./NotificationsDropdown";
import { useAuth } from "../contexts/AuthContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const { user, signInWithGoogle } = useAuth();
  const { t } = useTranslation();

  const navLinks = [
    { name: t("nav.home"), path: "/" },
    { name: t("nav.dashboard"), path: "/dashboard" },
    { name: t("nav.insights"), path: "/#insights" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Focus trap for mobile menu
  useEffect(() => {
    if (isMobileMenuOpen) {
      const focusableElements = mobileMenuRef.current?.querySelectorAll(
        'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
      );
      const firstElement = focusableElements?.[0] as HTMLElement;
      const lastElement = focusableElements?.[focusableElements.length - 1] as HTMLElement;

      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key === "Tab") {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
        if (e.key === "Escape") {
          setIsMobileMenuOpen(false);
        }
      };

      document.addEventListener("keydown", handleTabKey);
      firstElement?.focus();

      return () => {
        document.removeEventListener("keydown", handleTabKey);
      };
    }
  }, [isMobileMenuOpen]);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/60 backdrop-blur-2xl border-b border-border py-4 shadow-lg"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          {/* Swap this SVG with your custom logo */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center shadow-[0_0_15px_var(--color-accent-glow)] group-hover:shadow-[0_0_25px_var(--color-accent-glow)] transition-shadow duration-500">
            <ShieldCheck className="w-6 h-6 text-white" aria-hidden="true" />
          </div>
          <span className="text-2xl font-display font-bold tracking-tight text-foreground group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-accent-purple group-hover:to-accent-cyan transition-all duration-500">
            Tia
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 relative">
          {navLinks.map((link, index) => {
            const isActive = location.pathname === link.path || (link.path.startsWith('/#') && location.hash === link.path.substring(1));
            return (
            <Link
              key={link.name}
              to={link.path}
              aria-current={isActive ? "page" : undefined}
              className={`relative px-2 py-1 text-sm font-medium transition-colors duration-300 ${isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {link.name}
              {hoveredIndex === index && (
                <motion.div
                  layoutId="navbar-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent-cyan to-accent-purple shadow-[0_0_8px_var(--color-accent-cyan)]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          )})}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <LanguageSwitcher />
          <NotificationsDropdown />
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-300"
            aria-label="Toggle theme"
          >
            <motion.div
              initial={false}
              animate={{ rotate: theme === 'dark' ? 0 : 180 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.div>
          </button>

          {/* CTA Button */}
          {user ? (
            <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-full bg-accent-purple/20 flex items-center justify-center overflow-hidden border border-accent-purple/50">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <User className="w-4 h-4 text-accent-purple" />
                )}
              </div>
            </Link>
          ) : (
            <GlowButton
              variant="primary"
              size="sm"
              className="shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] transition-shadow duration-500"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={signInWithGoogle}
            >
              {t("nav.signIn")}
            </GlowButton>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <LanguageSwitcher />
          <NotificationsDropdown />
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-300"
            aria-label="Toggle theme"
          >
             {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <button
            className="text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent-purple rounded-lg p-1"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            ref={mobileMenuRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 w-full sm:w-80 bg-background/95 backdrop-blur-2xl border-l border-border shadow-2xl z-50 flex flex-col p-6 md:hidden"
          >
            <div className="flex justify-between items-center mb-8">
              <span className="text-xl font-display font-bold text-foreground">Menu</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent-purple rounded-lg p-1"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path || (link.path.startsWith('/#') && location.hash === link.path.substring(1));
                return (
                <Link
                  key={link.name}
                  to={link.path}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-lg font-medium hover:pl-2 transition-all duration-300 border-b border-border pb-2 ${isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  {link.name}
                </Link>
              )})}
            </nav>

            <div className="mt-auto">
              {user ? (
                <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                  <GlowButton className="w-full justify-center">
                    {t("nav.myProfile")}
                  </GlowButton>
                </Link>
              ) : (
                <GlowButton className="w-full justify-center" onClick={() => { setIsMobileMenuOpen(false); signInWithGoogle(); }}>
                  {t("nav.signIn")}
                </GlowButton>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

