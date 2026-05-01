import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const AuthContext = createContext(null);

const ADMIN_EMAIL = process.env.REACT_APP_ADMIN_EMAIL || '';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        const extra = userDoc.exists() ? userDoc.data() : {};
        setCurrentUser({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || extra.name || '',
          email: firebaseUser.email,
          joinedAt: extra.joinedAt || '',
          isAdmin: firebaseUser.email === ADMIN_EMAIL || extra.isAdmin === true,
        });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = useCallback(async (email, password) => {
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (err) {
      setAuthError('Невірний email або пароль.');
      return false;
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    setAuthError(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      const joinedAt = new Date().toISOString().split('T')[0];
      await setDoc(doc(db, 'users', cred.user.uid), {
        name,
        email,
        joinedAt,
        isAdmin: email === ADMIN_EMAIL,
        createdAt: serverTimestamp(),
      });
      return true;
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setAuthError('Обліковий запис із цим email вже існує.');
      } else {
        setAuthError('Помилка реєстрації. Спробуйте ще раз.');
      }
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
    setAuthError(null);
  }, []);

  const clearAuthError = useCallback(() => setAuthError(null), []);

  const value = {
    currentUser,
    isAuthenticated: currentUser !== null,
    isAdmin: currentUser?.isAdmin === true,
    login,
    register,
    logout,
    authError,
    clearAuthError,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export default AuthContext;
