import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useCart } from '../context/CartContext';
import { Menu, X, ShoppingBag, Globe, EyeOff, Eye, Palette, Volume2, VolumeX } from 'lucide-react';
import MagneticButton from './MagneticButton';

const Navbar = () => {
  const { language, toggleLanguage, animationsEnabled, setAnimationsEnabled, siteSettings, theme, setTheme, soundEnabled, setSoundEnabled, playTick, t } = useApp();
  const { getTotalCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredLinkImage, setHoveredLinkImage] = useState('');
  const navigate = useNavigate();

  const handleMenuToggle = () => setIsOpen(!isOpen);

  const handleLinkClick = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  const navLinks = [
    { nameFr: 'Accueil', nameEn: 'Home', path: '/', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80' },
    { nameFr: 'Notre Menu', nameEn: 'Our Menu', path: '/menu', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80' },
    { nameFr: 'Menus Familiaux', nameEn: 'Family Feasts', path: '/menu?cat=menus_familiaux', image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=600&q=80' },
    { nameFr: 'Service Traiteur', nameEn: 'Catering', path: '/catering', image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=600&q=80' },
    { nameFr: 'Entreprises', nameEn: 'Corporate', path: '/corporate', image: 'https://images.unsplash.com/photo-1560624052-449f5ddf0c31?auto=format&fit=crop&w=600&q=80' },
    { nameFr: 'Notre Histoire', nameEn: 'Our Story', path: '/history', image: 'https://images.unsplash.com/photo-1568254183919-78a4f43a2877?auto=format&fit=crop&w=600&q=80' },
    { nameFr: 'Contact', nameEn: 'Contact', path: '/contact', image: 'https://images.unsplash.com/photo-1589187151046-0936f4e1b3ac?auto=format&fit=crop&w=600&q=80' }
  ];

  const subLinks = [
    { nameFr: 'Fidélité', nameEn: 'Loyalty Program', path: '/loyalty' },
    { nameFr: 'Cartes-cadeaux', nameEn: 'Gift Cards', path: '/gift-cards' },
    { nameFr: 'Promotions', nameEn: 'Promotions', path: '/menu?filter=promo' },
    { nameFr: 'Suivi de commande', nameEn: 'Order Tracking', path: '/tracking' }
  ];

  return (
    <>
      {/* Navbar Container */}
      <header className={`nav-header ${isOpen ? 'menu-open' : ''}`}>
        <Link to="/" onClick={() => setIsOpen(false)} style={{ textDecoration: 'none', color: isOpen ? 'var(--color-ivory)' : 'var(--text-primary)' }} data-cursor="hovered">
          <h1 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)', display: 'flex', flexDirection: 'column' }}>
            <span>LES MERVEILLES</span>
            <span style={{ fontSize: '0.8rem', letterSpacing: '3px', color: 'var(--color-terracotta)', fontWeight: '600' }}>D'OLI</span>
          </h1>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {/* Toggle Animations button */}
          <button 
            onClick={() => setAnimationsEnabled(!animationsEnabled)}
            style={{
              background: 'transparent',
              border: 'none',
              color: isOpen ? 'var(--color-ivory)' : 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.8rem',
              fontWeight: '500'
            }}
            title={animationsEnabled ? "Réduire les animations" : "Activer les animations"}
          >
            {animationsEnabled ? <Eye size={18} /> : <EyeOff size={18} />}
            <span className="desktop-only">{animationsEnabled ? 'FX On' : 'FX Off'}</span>
          </button>

          {/* Toggle Sound */}
          <button 
            onClick={() => {
              const nextVal = !soundEnabled;
              setSoundEnabled(nextVal);
              if (nextVal) {
                setTimeout(() => {
                  try {
                    const ctx = new (window.AudioContext || window.webkitAudioContext)();
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(440, ctx.currentTime);
                    gain.gain.setValueAtTime(0.04, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start();
                    osc.stop(ctx.currentTime + 0.15);
                  } catch(err) {}
                }, 50);
              }
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: isOpen ? 'var(--color-ivory)' : 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.8rem',
              fontWeight: '500'
            }}
            title={soundEnabled ? t("Désactiver le son", "Mute sound") : t("Activer le son", "Unmute sound")}
          >
            {soundEnabled ? (
              <>
                <Volume2 size={18} style={{ color: 'var(--color-terracotta)' }} />
                <span className="sound-wave-anim" style={{ display: 'inline-flex', gap: '2px', alignItems: 'center' }}>
                  <span style={{ width: '2px', height: '10px', backgroundColor: 'var(--color-terracotta)', animation: 'wave 1s ease-in-out infinite alternate' }} />
                  <span style={{ width: '2px', height: '14px', backgroundColor: 'var(--color-terracotta)', animation: 'wave 1.2s ease-in-out infinite alternate 0.2s' }} />
                  <span style={{ width: '2px', height: '8px', backgroundColor: 'var(--color-terracotta)', animation: 'wave 0.8s ease-in-out infinite alternate 0.4s' }} />
                </span>
              </>
            ) : (
              <>
                <VolumeX size={18} />
                <span className="desktop-only">{t("Sourdine", "Mute")}</span>
              </>
            )}
            <style>{`
              @keyframes wave {
                0% { transform: scaleY(0.3); }
                100% { transform: scaleY(1); }
              }
            `}</style>
          </button>

          {/* Toggle Language */}
          <button 
            onClick={toggleLanguage}
            style={{
              background: 'transparent',
              border: 'none',
              color: isOpen ? 'var(--color-ivory)' : 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.8rem',
              fontWeight: '500'
            }}
          >
            <Globe size={18} />
            <span>{language.toUpperCase()}</span>
          </button>

          {/* Theme Selector */}
          <button 
            onClick={() => {
              const themes = ['ivory', 'dark', 'sunset'];
              const nextIndex = (themes.indexOf(theme) + 1) % themes.length;
              setTheme(themes[nextIndex]);
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: isOpen ? 'var(--color-ivory)' : 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.8rem',
              fontWeight: '500'
            }}
            title={t("Changer de thème visuel", "Change visual theme")}
          >
            <Palette size={18} />
            <span className="desktop-only">
              {theme === 'ivory' && t('Ivoire', 'Ivory')}
              {theme === 'dark' && t('Nuit', 'Night')}
              {theme === 'sunset' && t('Safran', 'Saffron')}
            </span>
          </button>

          {/* Shopping Cart button */}
          <Link to="/checkout" className="btn-cart" style={{ position: 'relative', color: isOpen ? 'var(--color-ivory)' : 'var(--text-primary)' }} data-cursor="add">
            <ShoppingBag size={24} />
            {getTotalCount() > 0 && (
              <span className="cart-badge">{getTotalCount()}</span>
            )}
          </Link>

          {/* Hamburger Menu Toggle */}
          <button 
            className="menu-toggle-btn"
            onClick={() => {
              playTick();
              handleMenuToggle();
            }}
            style={{
              background: 'var(--color-terracotta)',
              border: 'none',
              color: 'var(--color-ivory)',
              width: '45px',
              height: '45px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
            }}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Full-Screen Menu Overlay */}
      {isOpen && (
        <div className="menu-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          backgroundColor: 'var(--color-cacao)',
          color: 'var(--color-ivory)',
          zIndex: 999,
          display: 'flex',
          padding: '120px 4rem 40px 4rem',
          overflow: 'hidden'
        }}>
          {/* Animated Background Preview on desktop */}
          {hoveredLinkImage && animationsEnabled && (
            <div className="menu-bg-preview" style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '50%',
              height: '100%',
              backgroundImage: `url(${hoveredLinkImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.25,
              transition: 'background-image 0.5s ease-out',
              pointerEvents: 'none'
            }} />
          )}

          {/* Navigation Links Column */}
          <div className="menu-nav-column" style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
            width: '100%',
            maxWidth: '600px',
            zIndex: 2
          }}>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {navLinks.map((link) => (
                <div 
                  key={link.path}
                  onMouseEnter={() => setHoveredLinkImage(link.image)}
                  onMouseLeave={() => setHoveredLinkImage('')}
                  style={{ overflow: 'hidden' }}
                >
                  <span 
                    onClick={() => handleLinkClick(link.path)}
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '2.5rem',
                      fontWeight: 'bold',
                      color: 'var(--color-ivory)',
                      textDecoration: 'none',
                      display: 'inline-block',
                      transition: 'transform 0.3s ease, color 0.3s ease'
                    }}
                    className="menu-nav-link"
                    data-cursor="view"
                  >
                    {t(link.nameFr, link.nameEn)}
                  </span>
                </div>
              ))}
            </nav>

            {/* Sub Links & Footer */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                {subLinks.map((link) => (
                  <span 
                    key={link.path}
                    onClick={() => handleLinkClick(link.path)}
                    style={{
                      color: 'var(--color-copper)',
                      fontSize: '1rem',
                      textDecoration: 'none',
                      fontWeight: '600'
                    }}
                    className="menu-sub-link"
                    data-cursor="hovered"
                  >
                    {t(link.nameFr, link.nameEn)}
                  </span>
                ))}
              </div>

              {/* Establishment Coordinates */}
              <div style={{
                borderTop: '1px solid rgba(245, 239, 230, 0.1)',
                paddingTop: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                fontSize: '0.85rem',
                color: 'var(--color-cream)'
              }}>
                <div>
                  <p style={{ fontWeight: 'bold', color: 'var(--color-terracotta)' }}>Gatineau (Retrait)</p>
                  <p>{siteSettings.address}</p>
                </div>
                <div>
                  <p style={{ fontWeight: 'bold', color: 'var(--color-terracotta)' }}>Contact</p>
                  <p>{t('Tél : ', 'Tel: ')} <a href={`tel:${siteSettings.phone.replace(/\s+/g, '')}`} style={{ color: 'inherit' }}>{siteSettings.phone}</a></p>
                  <p>WhatsApp : <a href={`https://wa.me/${siteSettings.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>{siteSettings.whatsapp}</a></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global CSS Inject for specific elements */}
      <style>{`
        .desktop-only {
          display: inline;
        }
        @media (max-width: 768px) {
          .desktop-only {
            display: none;
          }
          .nav-header {
            padding: 0 1.5rem;
          }
          .menu-overlay {
            padding: 100px 1.5rem 30px 1.5rem !important;
          }
          .menu-nav-link {
            font-size: 1.8rem !important;
          }
        }
        .cart-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background-color: var(--color-terracotta);
          color: var(--color-ivory);
          font-size: 0.7rem;
          font-weight: bold;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .menu-nav-link:hover {
          color: var(--color-terracotta) !important;
          transform: translateX(10px);
        }
        .menu-sub-link:hover {
          color: var(--color-ivory) !important;
        }
        .menu-toggle-btn:hover {
          transform: scale(1.05);
        }
      `}</style>
    </>
  );
};

export default Navbar;
