import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Phone, MessageCircle, Send, ShieldCheck } from 'lucide-react';

const Footer = () => {
  const { siteSettings, language, t } = useApp();

  return (
    <footer style={{
      backgroundColor: 'var(--color-cacao)',
      color: 'var(--color-ivory)',
      padding: '5rem 2rem 2rem 2rem',
      borderTop: '4px solid var(--color-terracotta)',
      position: 'relative'
    }} className="pattern-overlay">
      
      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '3rem',
        marginBottom: '4rem'
      }}>
        
        {/* Brand & Mission Statement */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--color-ivory)' }}>
            LES MERVEILLES D'OLI
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-cream)' }}>
            {t(
              "Des saveurs culinaires africaines authentiques préparées avec passion pour réchauffer les cœurs à Ottawa et Gatineau.",
              "Authentic African culinary flavors prepared with passion to warm hearts in Ottawa and Gatineau."
            )}
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <a href={`tel:${siteSettings.phone.replace(/\s+/g, '')}`} className="footer-icon-btn" title="Téléphone">
              <Phone size={18} />
            </a>
            <a href={`https://wa.me/${siteSettings.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="footer-icon-btn" title="WhatsApp">
              <MessageCircle size={18} />
            </a>
          </div>
        </div>

        {/* Dynamic Opening Hours & Contact */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.1rem', textTransform: 'uppercase', color: 'var(--color-terracotta)', letterSpacing: '1px' }}>
            {t("Horaires de Retrait", "Pick-up Hours")}
          </h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
            <li><strong>{t("Semaine :", "Weekdays:")}</strong> {siteSettings.hours.weekdays}</li>
            <li><strong>{t("Week-end :", "Weekends:")}</strong> {siteSettings.hours.weekends}</li>
            {siteSettings.showAddress && (
              <li style={{ marginTop: '0.8rem', color: 'var(--color-cream)' }}>
                <strong>{t("Adresse :", "Address:")}</strong><br />
                {siteSettings.address}
              </li>
            )}
            <li>Snapchat: <strong>{siteSettings.socialLinks.snapchat}</strong></li>
          </ul>
        </div>

        {/* Client Portal Navigation Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.1rem', textTransform: 'uppercase', color: 'var(--color-terracotta)', letterSpacing: '1px' }}>
            {t("Navigation", "Navigation")}
          </h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
            <li><Link to="/menu" className="footer-link">{t("Notre Menu", "Our Menu")}</Link></li>
            <li><Link to="/catering" className="footer-link">{t("Service Traiteur", "Catering Service")}</Link></li>
            <li><Link to="/corporate" className="footer-link">{t("Entreprises", "Corporate")}</Link></li>
            <li><Link to="/loyalty" className="footer-link">{t("Programme Fidélité", "Loyalty Program")}</Link></li>
            <li><Link to="/gift-cards" className="footer-link">{t("Cartes-cadeaux", "Gift Cards")}</Link></li>
            <li><Link to="/tracking" className="footer-link">{t("Suivi Commande", "Track Order")}</Link></li>
          </ul>
        </div>

        {/* Local SEO & Newsletter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.1rem', textTransform: 'uppercase', color: 'var(--color-terracotta)', letterSpacing: '1px' }}>
            {t("Restez Informé", "Stay Updated")}
          </h3>
          <div style={{ display: 'flex', position: 'relative' }}>
            <input 
              type="email" 
              placeholder={t("Votre courriel", "Your email")}
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                borderRadius: '50px',
                border: '1px solid rgba(245, 239, 230, 0.2)',
                backgroundColor: 'rgba(255,255,255,0.05)',
                color: 'var(--color-ivory)',
                outline: 'none',
                fontSize: '0.9rem'
              }}
            />
            <button style={{
              position: 'absolute',
              right: '5px',
              top: '5px',
              backgroundColor: 'var(--color-terracotta)',
              border: 'none',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-ivory)'
            }}>
              <Send size={14} />
            </button>
          </div>
          
          {/* Local SEO Text */}
          <p style={{ fontSize: '0.75rem', color: 'var(--color-copper)', lineHeight: '1.4' }}>
            {t(
              "Cuisine africaine d'excellence à Gatineau et Ottawa. Plats traditionnels africains (Ndolé, Yassa, Mafé, Alloco) à emporter ou livrés directement chez vous. Traiteur africain officiel pour mariages, anniversaires et événements d'entreprises.",
              "Excellent African cuisine in Gatineau and Ottawa. Traditional African dishes (Ndole, Yassa, Mafe, Alloco) for pick-up or delivered directly to your doorstep. Official African caterer for weddings, birthdays, and corporate events."
            )}
          </p>
        </div>

      </div>

      {/* Bottom Bar */}
      <div style={{
        borderTop: '1px solid rgba(245, 239, 230, 0.1)',
        paddingTop: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        alignItems: 'center',
        fontSize: '0.8rem',
        color: 'var(--color-cream)'
      }}>
        <p>{siteSettings.legalInfo}</p>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--color-gold)' }}>
            <ShieldCheck size={16} />
            {t("Sécurisé par Firebase", "Firebase Secured")}
          </span>
          <Link to="/privacy" style={{ color: 'inherit', textDecoration: 'underline' }}>{t("Confidentialité", "Privacy Policy")}</Link>
        </div>
      </div>

      <style>{`
        .footer-icon-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: rgba(255,255,255,0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-ivory);
          text-decoration: none;
          transition: var(--transition-smooth);
        }
        .footer-icon-btn:hover {
          background-color: var(--color-terracotta);
          transform: translateY(-2px);
        }
        .footer-link {
          color: var(--color-cream);
          text-decoration: none;
          transition: var(--transition-fast);
        }
        .footer-link:hover {
          color: var(--color-terracotta);
          padding-left: 5px;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
