import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Download, 
  Calendar, 
  Tag, 
  ChevronLeft, 
  ChevronRight,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownLeft,
  X
} from "lucide-react";
import { spendingData } from "../mock/data";
import { useCurrency } from "../contexts/CurrencyContext";
import { GlassCard } from "./ui/GlassCard";
import { GlowButton } from "./ui/GlowButton";

interface Transaction {
  id: string;
  date: string;
  category: string;
  amount: number;
  description?: string;
  type?: 'income' | 'expense';
}

export function TransactionHistory() {
  const { formatAmount } = useCurrency();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortConfig, setSortConfig] = useState<{ key: keyof Transaction; direction: 'asc' | 'desc' }>({
    key: 'date',
    direction: 'desc'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Flatten and prepare transactions
  const allTransactions = useMemo(() => {
    const flattened: Transaction[] = [];
    spendingData.forEach(month => {
      month.transactions.forEach(t => {
        flattened.push({
          ...t,
          description: `${t.category} payment`, // Mock description
          type: 'expense' // All mock data seems to be expenses
        });
      });
    });
    return flattened;
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(allTransactions.map(t => t.category));
    return ["All", ...Array.from(cats)];
  }, [allTransactions]);

  const filteredTransactions = useMemo(() => {
    return allTransactions
      .filter(t => {
        const matchesSearch = 
          t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
        const matchesCategory = selectedCategory === "All" || t.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue === undefined || bValue === undefined) return 0;

        if (sortConfig.direction === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
  }, [allTransactions, searchTerm, selectedCategory, sortConfig]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (key: keyof Transaction) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-card/50 border border-border rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50 transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          <div className="flex items-center gap-2 bg-card/50 border border-border rounded-xl px-3 py-1.5 shrink-0">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-sm focus:outline-none cursor-pointer"
            >
              {categories.map(cat => (
                <option key={cat} value={cat} className="bg-card text-foreground">{cat}</option>
              ))}
            </select>
          </div>

          <GlowButton variant="ghost" size="sm" className="shrink-0">
            <Download className="w-4 h-4 mr-2" />
            Export
          </GlowButton>

          {(searchTerm || selectedCategory !== "All") && (
            <button
              onClick={clearFilters}
              className="text-xs text-accent-purple hover:underline shrink-0"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <GlassCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th 
                  className="p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center gap-2">
                    Date
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Description
                </th>
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Category
                </th>
                <th 
                  className="p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer hover:text-foreground transition-colors text-right"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center gap-2 justify-end">
                    Amount
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {paginatedTransactions.length > 0 ? (
                  paginatedTransactions.map((t, index) => (
                    <motion.tr
                      key={t.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                      className="border-b border-border/50 hover:bg-muted/20 transition-colors group"
                    >
                      <td className="p-4 text-sm whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">
                            {new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(t.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-sm">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${t.type === 'income' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                            {t.type === 'income' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                          </div>
                          <span className="font-medium text-foreground truncate max-w-[200px]">
                            {t.description}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-sm">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
                          <Tag className="w-3 h-3" />
                          {t.category}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-right">
                        <span className={`font-bold ${t.type === 'income' ? 'text-green-500' : 'text-foreground'}`}>
                          {t.type === 'expense' ? '-' : '+'}{formatAmount(t.amount)}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all opacity-0 group-hover:opacity-100">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-muted-foreground">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                          <Search className="w-6 h-6 opacity-20" />
                        </div>
                        <p>No transactions found matching your criteria.</p>
                        <button 
                          onClick={clearFilters}
                          className="text-sm text-accent-purple hover:underline"
                        >
                          Reset all filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-border flex items-center justify-between bg-muted/10">
            <p className="text-xs text-muted-foreground">
              Showing <span className="font-medium text-foreground">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-foreground">{Math.min(currentPage * itemsPerPage, filteredTransactions.length)}</span> of <span className="font-medium text-foreground">{filteredTransactions.length}</span> results
            </p>
            <div className="flex items-center gap-2">
              <GlowButton
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="!p-2"
              >
                <ChevronLeft className="w-4 h-4" />
              </GlowButton>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                      currentPage === page 
                        ? 'bg-accent-purple text-white shadow-[0_0_10px_var(--color-accent-purple-glow)]' 
                        : 'hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <GlowButton
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="!p-2"
              >
                <ChevronRight className="w-4 h-4" />
              </GlowButton>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
