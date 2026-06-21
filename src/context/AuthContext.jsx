import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db, googleProvider } from '../services/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  signInWithPopup,
  onAuthStateChanged,
  updateProfile,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync user profile from firestore
  const fetchUserProfile = async (user) => {
    if (!user) {
      setUserProfile(null);
      return;
    }
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        setUserProfile(docSnap.data());
      } else {
        // Create basic profile if it doesn't exist
        const basicProfile = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || 'Client',
          role: 'customer', // Default role
          createdAt: new Date().toISOString(),
          loyaltyPoints: 0,
          phone: user.phoneNumber || ''
        };
        await setDoc(userDocRef, basicProfile);
        setUserProfile(basicProfile);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchUserProfile(user);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Email Sign Up
  const signUp = async (email, password, displayName) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName });
      
      const newProfile = {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        role: 'customer',
        createdAt: new Date().toISOString(),
        loyaltyPoints: 0,
        phone: ''
      };
      await setDoc(doc(db, 'users', user.uid), newProfile);
      setUserProfile(newProfile);
      return user;
    } finally {
      setLoading(false);
    }
  };

  // Email Login
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Google Login
  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  };

  // Phone Authentication Setup (Invisible reCAPTCHA verifier helper)
  const setupRecaptcha = (containerId) => {
    if (!auth) return;
    return new RecaptchaVerifier(auth, containerId, {
      'size': 'invisible',
      'callback': (response) => {
        // reCAPTCHA solved
      }
    });
  };

  // Phone Login Request
  const loginWithPhone = async (phoneNumber, appVerifier) => {
    return signInWithPhoneNumber(auth, phoneNumber, appVerifier);
  };

  // Logout
  const logout = () => {
    return signOut(auth);
  };

  // Check roles
  const isAdmin = userProfile?.role === 'admin';
  const isKitchen = userProfile?.role === 'kitchen' || userProfile?.role === 'admin';

  return (
    <AuthContext.Provider value={{
      currentUser,
      userProfile,
      loading,
      signUp,
      login,
      loginWithGoogle,
      setupRecaptcha,
      loginWithPhone,
      logout,
      isAdmin,
      isKitchen
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
