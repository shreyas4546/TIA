import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

type CurrencyCode = 'USD' | 'INR' | 'EUR' | 'GBP' | 'JPY';

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  convertAmount: (amount: number) => number;
  formatAmount: (amount: number) => string;
}

const exchangeRates: Record<CurrencyCode, number> = {
  USD: 1,
  INR: 83.5,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 150.0,
};

const currencySymbols: Record<CurrencyCode, string> = {
  USD: '$',
  INR: '₹',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [currency, setCurrencyState] = useState<CurrencyCode>('USD');

  // We could listen to user preferences here, but for simplicity, we'll just use local state
  // and update Firebase when it changes if the user is logged in.

  const setCurrency = async (newCurrency: CurrencyCode) => {
    setCurrencyState(newCurrency);
    if (user) {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          'preferences.currency': newCurrency,
          updatedAt: serverTimestamp()
        });
      } catch (error) {
        console.error("Failed to update currency preference", error);
      }
    }
  };

  const convertAmount = (amount: number) => {
    return amount * exchangeRates[currency];
  };

  const formatAmount = (amount: number) => {
    const converted = convertAmount(amount);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(converted);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convertAmount, formatAmount }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
