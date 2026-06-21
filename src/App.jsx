import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Components & Layout
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';

// Page Views
import Home from './pages/Home';
import Menu from './pages/Menu';
import Catering from './pages/Catering';
import Corporate from './pages/Corporate';
import Loyalty from './pages/Loyalty';
import GiftCards from './pages/GiftCards';
import OrderTracking from './pages/OrderTracking';
import AdminDashboard from './pages/AdminDashboard';
import KitchenDisplay from './pages/KitchenDisplay';

// Simple Toast Alert notifier component
import { useState, useEffect } from 'react';
import { Info } from 'lucide-react';

const ToastAlert = () => {
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const handleAlert = (e) => {
      setAlert(e.detail);
      setTimeout(() => setAlert(null), 3000);
    };

    window.addEventListener('toast-alert', handleAlert);
    window.addEventListener('cart-item-added', (e) => {
      setAlert({
        msgFr: `Ajouté au panier ! (+${e.detail.count})`,
        msgEn: `Added to cart! (+${e.detail.count})`
      });
      setTimeout(() => setAlert(null), 2500);
    });

    return () => {
      window.removeEventListener('toast-alert', handleAlert);
    };
  }, []);

  if (!alert) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '30px',
      right: '30px',
      backgroundColor: 'var(--color-cacao)',
      color: 'var(--color-ivory)',
      padding: '1rem 1.5rem',
      borderRadius: '16px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      gap: '0.8rem',
      borderLeft: '4px solid var(--color-terracotta)',
      animation: 'slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
    }}>
      <Info size={18} color="var(--color-safran)" />
      <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>
        {alert.msgFr}
      </span>
      <style>{`
        @keyframes slide-in {
          0% { transform: translateY(50px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

// Layout Manager to hide Navbar/Footer on KDS page
const AppLayout = () => {
  const location = useLocation();
  const isKds = location.pathname === '/kitchen';

  return (
    <>
      <CustomCursor />
      {!isKds && <Navbar />}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/catering" element={<Catering />} />
        <Route path="/corporate" element={<Corporate />} />
        <Route path="/loyalty" element={<Loyalty />} />
        <Route path="/gift-cards" element={<GiftCards />} />
        <Route path="/tracking" element={<OrderTracking />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/kitchen" element={<KitchenDisplay />} />
      </Routes>

      {!isKds && <Footer />}
      <ToastAlert />
    </>
  );
};

function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <AppLayout />
          </Router>
        </CartProvider>
      </AuthProvider>
    </AppProvider>
  );
}

export default App;
