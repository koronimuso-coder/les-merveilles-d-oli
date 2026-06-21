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

  const [theme, setTheme] = useState('ivory'); // Theme states: 'ivory', 'dark', 'sunset'
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Background Audio Loop
  useEffect(() => {
    let audio = null;
    if (soundEnabled) {
      audio = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3");
      audio.loop = true;
      audio.volume = 0.12; // soft background volume
      audio.play().catch(e => console.warn("Audio play prevented:", e));
    }
    return () => {
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    };
  }, [soundEnabled]);

  // Web Audio Synth for micro-interactions
  const playTick = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(580, ctx.currentTime); // wooden clicking sound
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.07);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.07);
    } catch (e) {
      console.warn("Audio context failed:", e);
    }
  };

  const playCartSound = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const playTone = (freq, time, dur) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(0.05, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + dur);
      };
      playTone(523.25, ctx.currentTime, 0.12); // C5 chime
      playTone(659.25, ctx.currentTime + 0.08, 0.18); // E5 chime
    } catch (e) {
      console.warn("Audio context failed:", e);
    }
  };

  useEffect(() => {
    document.body.classList.remove('theme-ivory', 'theme-dark', 'theme-sunset');
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

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
      theme,
      setTheme,
      soundEnabled,
      setSoundEnabled,
      playTick,
      playCartSound,
      t
    }}>
      {children}
    </AppContext.Provider>
  );
};
