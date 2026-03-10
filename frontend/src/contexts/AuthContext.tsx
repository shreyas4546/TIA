import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  userData: any | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserData: (data: any) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Ref to prevent onAuthStateChanged from overwriting locally-updated userData
  // This is the KEY fix: once we set userData for a user (especially after
  // onboarding), subsequent onAuthStateChanged fires (token refresh, HMR, etc.)
  // must NOT reset it to onboardingComplete: false.
  const sessionDataRef = useRef<{ uid: string; data: any } | null>(null);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // If we already have session data for THIS user, reuse it.
        // This prevents the listener from overwriting onboarding state.
        if (sessionDataRef.current && sessionDataRef.current.uid === currentUser.uid) {
          setUserData(sessionDataRef.current.data);
          setLoading(false);
          return;
        }

        // First time seeing this user in this session — fetch from Firestore
        const userRef = doc(db, 'users', currentUser.uid);
        let currentData = null;

        try {
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            currentData = userSnap.data();
          }
        } catch (error) {
          console.warn("Could not fetch user from Firestore. Falling back to local state.");
        }

        if (!currentData) {
          const newUserDoc = {
            displayName: currentUser.displayName || '',
            email: currentUser.email || '',
            photoURL: currentUser.photoURL || '',
            onboardingComplete: false,
            nickname: '',
            financialGoal: '',
            monthlyIncome: 0,
            monthlySpending: 0,
            professionalStatus: '',
            investmentExperience: '',
            preferences: {
              theme: 'system',
              notifications: true,
              currency: 'USD'
            },
            linkedInstitutions: [],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          };

          try {
            await setDoc(userRef, newUserDoc);
          } catch (error) {
            console.warn("Could not save new user to Firestore. Storing locally for this session.");
          }
          currentData = newUserDoc;
        }

        // Cache in the ref so subsequent onAuthStateChanged calls don't overwrite
        sessionDataRef.current = { uid: currentUser.uid, data: currentData };
        setUserData(currentData);
      } else {
        // User signed out — clear everything
        sessionDataRef.current = null;
        setUserData(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const updateUserData = async (data: any) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    try {
      await updateDoc(userRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.warn('Firestore rejected the update. Updating local state anyway.');
    }
    // Always update BOTH the React state AND the session ref
    setUserData((prev: any) => {
      const updated = { ...prev, ...data };
      sessionDataRef.current = { uid: user.uid, data: updated };
      return updated;
    });
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in with Google', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error signing in with Email', error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error signing up with Email', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      sessionDataRef.current = null;
    } catch (error) {
      console.error('Error signing out', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user, userData, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, logout, updateUserData,
      isAuthModalOpen, openAuthModal, closeAuthModal
    }}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-purple"></div>
        </div>
      ) : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
