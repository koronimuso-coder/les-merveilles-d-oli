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
    if (!db) {
      // Offline/Mock fallback profile
      setUserProfile({
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'Client Démo',
        role: user.email === 'admin@lesmerveillesdoli.com' ? 'admin' : (user.email === 'kitchen@lesmerveillesdoli.com' ? 'kitchen' : 'customer'),
        createdAt: new Date().toISOString(),
        loyaltyPoints: 120,
        phone: user.phoneNumber || ''
      });
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
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchUserProfile(user);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    }, (error) => {
      console.warn("Auth observer warning:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Email Sign Up
  const signUp = async (email, password, displayName) => {
    setLoading(true);
    try {
      if (!auth) {
        const mockUser = { uid: 'mock-uid-' + Date.now(), email, displayName };
        setCurrentUser(mockUser);
        setUserProfile({
          uid: mockUser.uid,
          email: mockUser.email,
          displayName: mockUser.displayName,
          role: 'customer',
          createdAt: new Date().toISOString(),
          loyaltyPoints: 100,
          phone: ''
        });
        return mockUser;
      }
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
      if (db) {
        await setDoc(doc(db, 'users', user.uid), newProfile);
      }
      setUserProfile(newProfile);
      return user;
    } finally {
      setLoading(false);
    }
  };

  // Email Login
  const login = async (email, password) => {
    if (!auth) {
      let role = 'customer';
      let displayName = 'Client Démo';
      if (email === 'admin@lesmerveillesdoli.com') {
        role = 'admin';
        displayName = 'Administrateur';
      } else if (email === 'kitchen@lesmerveillesdoli.com') {
        role = 'kitchen';
        displayName = 'Chef Cuisine';
      }
      const mockUser = { uid: 'mock-uid-' + Date.now(), email, displayName };
      setCurrentUser(mockUser);
      setUserProfile({
        uid: mockUser.uid,
        email,
        displayName,
        role,
        createdAt: new Date().toISOString(),
        loyaltyPoints: 120,
        phone: ''
      });
      return mockUser;
    }
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  };

  // Google Login
  const loginWithGoogle = async () => {
    if (!auth) {
      const mockUser = { uid: 'mock-google-uid', email: 'google-user@gmail.com', displayName: 'Google User' };
      setCurrentUser(mockUser);
      setUserProfile({
        uid: mockUser.uid,
        email: mockUser.email,
        displayName: mockUser.displayName,
        role: 'customer',
        createdAt: new Date().toISOString(),
        loyaltyPoints: 50,
        phone: ''
      });
      return mockUser;
    }
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  };

  // Phone Authentication Setup (Invisible reCAPTCHA verifier helper)
  const setupRecaptcha = (containerId) => {
    if (!auth) return { verify: () => {} };
    return new RecaptchaVerifier(auth, containerId, {
      'size': 'invisible',
      'callback': (response) => {
        // reCAPTCHA solved
      }
    });
  };

  // Phone Login Request
  const loginWithPhone = async (phoneNumber, appVerifier) => {
    if (!auth) {
      const mockUser = { uid: 'mock-phone-uid', phoneNumber };
      setCurrentUser(mockUser);
      setUserProfile({
        uid: mockUser.uid,
        email: '',
        displayName: 'Phone User',
        role: 'customer',
        createdAt: new Date().toISOString(),
        loyaltyPoints: 0,
        phone: phoneNumber
      });
      return { confirm: async () => ({ user: mockUser }) };
    }
    return signInWithPhoneNumber(auth, phoneNumber, appVerifier);
  };

  // Logout
  const logout = async () => {
    if (!auth) {
      setCurrentUser(null);
      setUserProfile(null);
      return;
    }
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
