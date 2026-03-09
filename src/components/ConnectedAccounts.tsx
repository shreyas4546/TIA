import { useState } from "react";
import { motion } from "motion/react";
import { CreditCard, Landmark, Plus, Settings, RefreshCw, AlertCircle } from "lucide-react";
import { GlassCard } from "./ui/GlassCard";
import { GlowButton } from "./ui/GlowButton";
import { BankLinkModal } from "./BankLinkModal";
import { slideUpVariants } from "../utils/animations";

type Account = {
  id: string;
  name: string;
  type: "checking" | "credit";
  balance: number;
  lastSync: string;
  status: "active" | "error";
  icon: any;
  color: string;
};

const initialAccounts: Account[] = [
  {
    id: "1",
    name: "Chase Sapphire Reserve",
    type: "credit",
    balance: 4250.75,
    lastSync: "2 mins ago",
    status: "active",
    icon: CreditCard,
    color: "bg-blue-600",
  },
  {
    id: "2",
    name: "Bank of America Checking",
    type: "checking",
    balance: 12450.00,
    lastSync: "1 hr ago",
    status: "active",
    icon: Landmark,
    color: "bg-red-600",
  },
];

export function ConnectedAccounts() {
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleLinkSuccess = (bankName: string) => {
    const newAccount: Account = {
      id: Date.now().toString(),
      name: `${bankName} Checking`,
      type: "checking",
      balance: Math.floor(Math.random() * 10000) + 1000,
      lastSync: "Just now",
      status: "active",
      icon: Landmark,
      color: "bg-accent-purple",
    };
    setAccounts((prev) => [...prev, newAccount]);
    setIsModalOpen(false);
  };

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setAccounts((prev) =>
        prev.map((acc) => ({ ...acc, lastSync: "Just now" }))
      );
      setIsSyncing(false);
    }, 1500);
  };

  return (
    <motion.div
      variants={slideUpVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="flex flex-col h-full"
    >
      <GlassCard className="h-full flex flex-col">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold mb-1 flex items-center gap-2 text-foreground">
              <Landmark className="w-5 h-5 text-accent-blue" />
              Connected Accounts
            </h3>
            <p className="text-sm text-muted-foreground">Manage your linked institutions</p>
          </div>
          <div className="flex gap-2">
            <GlowButton
              variant="ghost"
              size="sm"
              onClick={handleSync}
              className="!p-2 !rounded-full"
              disabled={isSyncing}
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin text-accent-cyan" : ""}`} />
            </GlowButton>
            <GlowButton
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="hidden sm:flex"
            >
              <Plus className="w-4 h-4 mr-2" /> Link Account
            </GlowButton>
            <GlowButton
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="sm:hidden !p-2 !rounded-full"
            >
              <Plus className="w-4 h-4" />
            </GlowButton>
          </div>
        </div>

        <div className="space-y-4 flex-1">
          {accounts.map((account) => {
            const Icon = account.icon;
            return (
              <div
                key={account.id}
                className="group flex items-center justify-between p-4 rounded-xl border border-border bg-background/50 hover:bg-card/80 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full ${account.color} flex items-center justify-center text-white shadow-md`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground group-hover:text-accent-blue transition-colors">
                      {account.name}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <span className="capitalize">{account.type}</span>
                      <span>•</span>
                      <span>Sync: {account.lastSync}</span>
                      {account.status === "error" && (
                        <>
                          <span>•</span>
                          <span className="text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> Error
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-foreground">
                    ${account.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <button className="text-[10px] font-medium text-muted-foreground hover:text-foreground uppercase tracking-wider mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Manage
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-border flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Total Balance: <span className="font-bold text-foreground ml-1">
              ${accounts.reduce((sum, acc) => sum + acc.balance, 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
            <Settings className="w-4 h-4" /> Settings
          </button>
        </div>
      </GlassCard>

      <BankLinkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleLinkSuccess}
      />
    </motion.div>
  );
}
