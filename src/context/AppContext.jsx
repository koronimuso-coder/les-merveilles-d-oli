import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [language, setLanguage] = useState('fr'); // Default French
  const [performanceProfile, setPerformanceProfile] = useState('standard');
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [siteSettings, setSiteSettings] = useState({
    brandName: "Les Merveilles d'Oli",
    address: "40 chemin des Érables, Gatineau, Québec, J8V 1C4, Canada",
    showAddress: true,
    phone: "+1 819 679-7696",
    whatsapp: "+1 819 213-4647",
    email: "contact@lesmerveillesdoli.com",
    hours: {
      weekdays: "11:00 - 22:00",
      weekends: "11:00 - 23:00"
    },
    socialLinks: {
      snapchat: "K_im1998",
      instagram: "",
      facebook: ""
    },
    deliveryZones: [
      { id: 'gatineau', name: 'Gatineau', fee: 5.00, minOrder: 20.00, active: true },
      { id: 'ottawa', name: 'Ottawa', fee: 10.00, minOrder: 30.00, active: true }
    ],
    currency: "CAD",
    taxesPercent: 14.975, // QC Taxes (GST + QST approx 14.975%)
    logo: "",
    slogan: "De notre cuisine à votre table.",
    legalInfo: "Les Merveilles d'Oli Inc. © 2026. Tous droits réservés."
  });

  // Detect reduced motion preferences
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e) => {
      setAnimationsEnabled(!e.matches);
      if (e.matches) {
        setPerformanceProfile('light');
      }
    };

    setAnimationsEnabled(!mediaQuery.matches);
    if (mediaQuery.matches) {
      setPerformanceProfile('light');
    }

    mediaQuery.addEventListener('change', handleMotionChange);
    return () => mediaQuery.removeEventListener('change', handleMotionChange);
  }, []);

  // Listen to site settings in Firestore
  useEffect(() => {
    if (!db) return;
    const settingsDocRef = doc(db, 'settings', 'establishment');
    
    // Set up a snapshot listener or fallback to default
    const unsubscribe = onSnapshot(settingsDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setSiteSettings(prev => ({ ...prev, ...docSnap.data() }));
      }
    }, (error) => {
      console.warn("Failed to listen to establishment settings, using defaults:", error);
    });

    return () => unsubscribe();
  }, []);

  // Toggle Language
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'fr' ? 'en' : 'fr');
  };

  // Translate helper function
  const t = (keyFr, keyEn) => {
    return language === 'fr' ? keyFr : keyEn;
  };

  return (
    <AppContext.Provider value={{
      language,
      setLanguage,
      toggleLanguage,
      performanceProfile,
      setPerformanceProfile,
      animationsEnabled,
      setAnimationsEnabled,
      siteSettings,
      setSiteSettings,
      t
    }}>
      {children}
    </AppContext.Provider>
  );
};
