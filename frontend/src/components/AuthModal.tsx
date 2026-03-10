import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../contexts/AuthContext";
import { X, Mail, ShieldCheck, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { GlowButton } from "./ui/GlowButton";
import { useNavigate } from "react-router-dom";

type ModalView = 'options' | 'email';
type EmailMode = 'signin' | 'signup';

export function AuthModal() {
    const { isAuthModalOpen, closeAuthModal, signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
    const navigate = useNavigate();

    const [view, setView] = useState<ModalView>('options');
    const [emailMode, setEmailMode] = useState<EmailMode>('signup');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isAuthModalOpen) return null;

    // Reset state when closing
    const handleClose = () => {
        closeAuthModal();
        setTimeout(() => {
            setView('options');
            setEmail('');
            setPassword('');
            setError('');
        }, 300); // Wait for transition
    };

    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle();
            navigate('/dashboard');
            handleClose();
        } catch (error) {
            console.error("Failed to sign in via Google:", error);
            setError("Google sign-in failed. Please try again.");
        }
    };

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            if (emailMode === 'signup') {
                await signUpWithEmail(email, password);
            } else {
                await signInWithEmail(email, password);
            }
            navigate('/dashboard');
            handleClose();
        } catch (err: any) {
            console.error("Email auth error:", err);
            // Provide user-friendly error messages based on Firebase codes
            if (err.code === 'auth/email-already-in-use') {
                setError("This email is already registered. Please log in.");
                setEmailMode('signin');
            } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
                setError("Incorrect email or password.");
            } else if (err.code === 'auth/weak-password') {
                setError("Password should be at least 6 characters.");
            } else {
                setError(err.message || "Authentication failed. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="bg-card border border-border rounded-3xl p-8 w-full max-w-md shadow-[0_0_50px_rgba(139,92,246,0.15)] relative overflow-hidden"
                >
                    {/* Close Button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-colors z-20"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Ambient Glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent-purple/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                    <AnimatePresence mode="wait">
                        {view === 'options' ? (
                            <motion.div
                                key="options"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                                className="relative z-10 text-center"
                            >
                                {/* Logo */}
                                <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center shadow-[0_0_15px_var(--color-accent-glow)] mb-6">
                                    <ShieldCheck className="w-7 h-7 text-white" />
                                </div>

                                <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                                    Welcome to Tia
                                </h2>
                                <p className="text-muted-foreground mb-8 text-sm">
                                    Log in or sign up to access your AI financial intelligence dashboard.
                                </p>

                                <div className="space-y-4">
                                    {/* Primary: Google Login */}
                                    <button
                                        onClick={handleGoogleSignIn}
                                        className="w-full flex items-center justify-center gap-3 bg-surface-hover/50 hover:bg-surface-hover border border-border rounded-xl px-4 py-3 text-foreground font-medium transition-all"
                                    >
                                        <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                        </svg>
                                        Continue with Google
                                    </button>

                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <span className="w-full border-t border-border" />
                                        </div>
                                        <div className="relative flex justify-center text-xs uppercase">
                                            <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                                        </div>
                                    </div>

                                    {/* Secondary Option: Email Login */}
                                    <button
                                        onClick={() => setView('email')}
                                        className="w-full flex items-center justify-center gap-3 bg-surface hover:bg-surface-hover border border-border rounded-xl px-4 py-3 text-muted-foreground font-medium transition-all"
                                    >
                                        <Mail className="w-5 h-5" />
                                        Continue with Email
                                    </button>
                                </div>

                                <p className="mt-8 text-xs text-muted-foreground px-4">
                                    By clicking continue, you agree to our Terms of Service and Privacy Policy.
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="email"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                className="relative z-10"
                            >
                                {/* Back Button */}
                                <button
                                    onClick={() => { setView('options'); setError(''); }}
                                    className="absolute -top-2 -left-2 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-colors z-20"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>

                                <div className="text-center mb-8 pt-2">
                                    <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                                        {emailMode === 'signup' ? 'Create an Account' : 'Welcome Back'}
                                    </h2>
                                    <p className="text-muted-foreground text-sm">
                                        {emailMode === 'signup' ? 'Enter your details to get started.' : 'Enter your credentials to access your dashboard.'}
                                    </p>
                                </div>

                                {error && (
                                    <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-400 text-sm">
                                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                        <p>{error}</p>
                                    </div>
                                )}

                                <form onSubmit={handleEmailSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-surface-hover/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent-purple/50 transition-all placeholder:text-muted-foreground/50"
                                            placeholder="you@example.com"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Password</label>
                                        <input
                                            type="password"
                                            required
                                            minLength={6}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-surface-hover/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent-purple/50 transition-all placeholder:text-muted-foreground/50"
                                            placeholder="••••••••"
                                        />
                                    </div>

                                    <GlowButton
                                        type="submit"
                                        className="w-full justify-center py-4 mt-6"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            emailMode === 'signup' ? 'Sign Up' : 'Log In'
                                        )}
                                    </GlowButton>
                                </form>

                                <div className="mt-6 text-center text-sm text-muted-foreground">
                                    {emailMode === 'signup' ? (
                                        <p>
                                            Already have an account?{' '}
                                            <button onClick={() => { setEmailMode('signin'); setError(''); }} className="text-accent-purple hover:underline font-medium focus:outline-none">
                                                Log In
                                            </button>
                                        </p>
                                    ) : (
                                        <p>
                                            Don't have an account?{' '}
                                            <button onClick={() => { setEmailMode('signup'); setError(''); }} className="text-accent-purple hover:underline font-medium focus:outline-none">
                                                Sign Up
                                            </button>
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
