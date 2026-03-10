import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Building2, Landmark, CreditCard, Loader2, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";
import { GlowButton } from "./ui/GlowButton";

interface BankLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (bankName: string) => void;
}

const institutions = [
  { id: "chase", name: "Chase", icon: Building2, color: "bg-blue-600" },
  { id: "bofa", name: "Bank of America", icon: Landmark, color: "bg-red-600" },
  { id: "wells", name: "Wells Fargo", icon: Building2, color: "bg-yellow-600" },
  { id: "citi", name: "Citi", icon: CreditCard, color: "bg-blue-500" },
  { id: "capital", name: "Capital One", icon: CreditCard, color: "bg-red-700" },
  { id: "amex", name: "American Express", icon: CreditCard, color: "bg-blue-400" },
];

export function BankLinkModal({ isOpen, onClose, onSuccess }: BankLinkModalProps) {
  const [step, setStep] = useState<"select" | "connecting" | "success">("select");
  const [selectedBank, setSelectedBank] = useState<typeof institutions[0] | null>(null);
  const [connectionProgress, setConnectionProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setStep("select");
      setSelectedBank(null);
      setConnectionProgress(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (step === "connecting") {
      const interval = setInterval(() => {
        setConnectionProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep("success"), 500);
            return 100;
          }
          return prev + Math.floor(Math.random() * 15) + 5;
        });
      }, 300);
      return () => clearInterval(interval);
    }
  }, [step]);

  const handleSelectBank = (bank: typeof institutions[0]) => {
    setSelectedBank(bank);
    setStep("connecting");
  };

  const handleComplete = () => {
    if (selectedBank) {
      onSuccess(selectedBank.name);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-2 text-foreground">
                <ShieldCheck className="w-5 h-5 text-green-500" />
                <span className="font-semibold">Secure Connection</span>
              </div>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition-colors rounded-full p-1 hover:bg-card/80"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 flex-1 min-h-[350px] flex flex-col">
              <AnimatePresence mode="wait">
                {step === "select" && (
                  <motion.div
                    key="select"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex flex-col h-full"
                  >
                    <div className="mb-6 text-center">
                      <h3 id="modal-title" className="text-xl font-bold text-foreground mb-2">Select your institution</h3>
                      <p className="text-sm text-muted-foreground">
                        Link your bank or credit card to get real-time AI insights on your spending.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 flex-1 overflow-y-auto pr-1 custom-scrollbar">
                      {institutions.map((bank) => {
                        const Icon = bank.icon;
                        return (
                          <button
                            key={bank.id}
                            onClick={() => handleSelectBank(bank)}
                            className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border border-border bg-background/50 hover:bg-card/80 hover:border-accent-purple/50 transition-all group"
                          >
                            <div className={`w-12 h-12 rounded-full ${bank.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                              <Icon className="w-6 h-6" />
                            </div>
                            <span className="text-sm font-medium text-foreground text-center">
                              {bank.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {step === "connecting" && selectedBank && (
                  <motion.div
                    key="connecting"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center justify-center h-full flex-1 py-8"
                  >
                    <div className="relative mb-8">
                      <div className="absolute inset-0 bg-accent-purple/20 rounded-full blur-xl animate-pulse" />
                      <div className={`relative w-20 h-20 rounded-full ${selectedBank.color} flex items-center justify-center text-white shadow-2xl z-10`}>
                        <selectedBank.icon className="w-10 h-10" />
                      </div>
                      
                      {/* Orbiting dots */}
                      <motion.div 
                        animate={{ rotate: 360 }} 
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute -inset-4 border border-dashed border-border rounded-full z-0"
                      >
                        <div className="absolute top-0 left-1/2 w-2 h-2 bg-accent-cyan rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_#06B6D4]" />
                      </motion.div>
                    </div>

                    <h3 id="modal-title" className="text-xl font-bold text-foreground mb-2">Connecting to {selectedBank.name}</h3>
                    <p className="text-sm text-muted-foreground mb-8 text-center">
                      Establishing a secure, read-only connection. This may take a moment.
                    </p>

                    <div className="w-full max-w-xs bg-background rounded-full h-2 overflow-hidden border border-border">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-accent-purple to-accent-cyan origin-left"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: connectionProgress / 100 }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                    <div className="mt-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {connectionProgress < 30 ? "Authenticating..." : connectionProgress < 70 ? "Retrieving accounts..." : "Finalizing..."}
                    </div>
                  </motion.div>
                )}

                {step === "success" && selectedBank && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center h-full flex-1 py-8"
                  >
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", bounce: 0.5 }}
                      className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]"
                    >
                      <CheckCircle2 className="w-10 h-10" />
                    </motion.div>

                    <h3 id="modal-title" className="text-2xl font-bold text-foreground mb-2 text-center">Successfully Linked!</h3>
                    <p className="text-sm text-muted-foreground mb-8 text-center">
                      Your {selectedBank.name} account is now connected. Tia is analyzing your transaction history.
                    </p>

                    <GlowButton onClick={handleComplete} className="w-full">
                      Continue to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                    </GlowButton>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Footer */}
            {step === "select" && (
              <div className="p-4 bg-background/50 border-t border-border text-center">
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Your data is encrypted and never sold.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
