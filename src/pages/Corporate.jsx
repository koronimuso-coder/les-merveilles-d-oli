import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Briefcase, Building, Shield, Clipboard, CreditCard, Send, CheckCircle } from 'lucide-react';

const Corporate = () => {
  const { language, t } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [companyContact, setCompanyContact] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [needsRecurring, setNeedsRecurring] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main style={{ padding: '120px 0 60px 0', backgroundColor: 'var(--bg-primary)' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span style={{ color: 'var(--color-terracotta)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>
            {t("Portail Entreprise", "Corporate Portal")}
          </span>
          <h1 style={{ fontSize: '3.2rem', fontFamily: 'var(--font-serif)', marginTop: '0.5rem' }}>
            {t("Nourrissez votre équipe sans compliquer votre journée.", "Feed your team without complicating your day.")}
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0.5rem auto 0 auto' }}>
            {t(
              "Facturation professionnelle unifiée, comptes multi-utilisateurs et livraison de plateaux-repas premium à Ottawa-Gatineau.",
              "Unified professional invoicing, multi-user accounts, and premium lunch box delivery in Ottawa-Gatineau."
            )}
          </p>
        </div>

        {/* Corporate grid showcase animation */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '3rem',
          alignItems: 'center',
          marginBottom: '5rem'
        }}>
          {/* Animated box arrangement representing a corporate platter layout */}
          <div style={{
            backgroundColor: 'var(--color-cacao)',
            borderRadius: '24px',
            padding: '3rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            boxShadow: '0 15px 35px rgba(44, 26, 17, 0.08)'
          }}>
            {[
              { label: 'Ndolé Box' }, { label: 'Yassa Box' }, { label: 'Mafé Box' },
              { label: 'Alloco Side' }, { label: 'Pastels Side' }, { label: 'Salade Side' },
              { label: 'Bissap Drink' }, { label: 'Ginger Drink' }, { label: 'Dessert Cup' }
            ].map((box, idx) => (
              <div 
                key={idx} 
                className="corp-box-animation"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  padding: '1rem 0.5rem',
                  textAlign: 'center',
                  fontSize: '0.75rem',
                  color: 'var(--color-cream)',
                  animation: `box-fade 1.5s ease-out infinite alternate ${idx * 0.15}s`
                }}
              >
                <strong>{box.label}</strong>
              </div>
            ))}
          </div>

          {/* Business Features list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-serif)' }}>
              {t("Une solution de restauration pour les pros", "A dining solution for professionals")}
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              {t(
                "Notre plateforme s'adapte aux contraintes des entreprises modernes en proposant des fonctionnalités exclusives pour simplifier la logistique des repas.",
                "Our platform adapts to modern business constraints by offering exclusive features to simplify meal logistics."
              )}
            </p>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                <Building size={20} color="var(--color-terracotta)" />
                <span><strong>{t("Compte Entreprise Unifié :", "Unified Corporate Account:")}</strong> {t("Attribuez des budgets par collaborateur.", "Assign budgets per collaborator.")}</span>
              </li>
              <li style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                <Shield size={20} color="var(--color-terracotta)" />
                <span><strong>{t("Centres de Coûts :", "Cost Centers:")}</strong> {t("Affectez chaque facture au bon département.", "Assign each invoice to the right department.")}</span>
              </li>
              <li style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                <CreditCard size={20} color="var(--color-terracotta)" />
                <span><strong>{t("Paiement Facture Fin de Mois :", "Monthly Invoicing:")}</strong> {t("Payez sur facture mensuelle groupée.", "Pay via a grouped monthly invoice.")}</span>
              </li>
              <li style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                <Clipboard size={20} color="var(--color-terracotta)" />
                <span><strong>{t("Commandes Programmées :", "Scheduled Orders:")}</strong> {t("Planifiez vos plateaux-repas sur toute la semaine.", "Schedule lunch boxes for the entire week.")}</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Corporate registration form */}
        <section style={{
          maxWidth: '600px',
          margin: '0 auto',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: '32px',
          padding: '3rem',
          boxShadow: '0 15px 40px rgba(44, 26, 17, 0.03)',
          border: '1px solid rgba(44, 26, 17, 0.05)'
        }}>
          {submitted ? (
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.2rem', alignItems: 'center' }}>
              <CheckCircle size={50} color="var(--color-forest)" />
              <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)' }}>{t("Demande d'activation reçue !", "Activation Request Received!")}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                {t(
                  "Un conseiller commercial prendra contact avec vous d'ici 2 heures pour valider votre compte pro et activer la facturation mensuelle.",
                  "A sales counselor will contact you within 2 hours to validate your pro account and activate monthly invoicing."
                )}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                🏢 {t("Créer un Compte Entreprise", "Register a Corporate Account")}
              </h3>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.2rem' }}>{t("Nom de l'entreprise", "Company Name")}</label>
                <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} required style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid rgba(44,26,11,0.1)' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.2rem' }}>{t("Nom du contact responsable", "Responsible Contact Name")}</label>
                <input type="text" value={companyContact} onChange={e => setCompanyContact(e.target.value)} required style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid rgba(44,26,11,0.1)' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.2rem' }}>{t("Téléphone", "Phone")}</label>
                <input type="tel" value={companyPhone} onChange={e => setCompanyPhone(e.target.value)} required style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid rgba(44,26,11,0.1)' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.2rem' }}>{t("Courriel professionnel", "Corporate Email")}</label>
                <input type="email" value={companyEmail} onChange={e => setCompanyEmail(e.target.value)} required style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid rgba(44,26,11,0.1)' }} />
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}>
                <input 
                  type="checkbox" 
                  checked={needsRecurring}
                  onChange={e => setNeedsRecurring(e.target.checked)}
                  style={{ accentColor: 'var(--color-terracotta)' }}
                />
                <span>{t("Nous prévoyons des commandes récurrentes hebdomadaires", "We expect weekly recurring orders")}</span>
              </label>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', gap: '8px' }}>
                <Send size={16} /> {t("Demander l'activation pro", "Request Corporate Activation")}
              </button>
            </form>
          )}
        </section>

      </div>
      <style>{`
        @keyframes box-fade {
          0% { transform: scale(0.95); opacity: 0.6; border-color: rgba(255,255,255,0.1); }
          100% { transform: scale(1); opacity: 1; border-color: var(--color-terracotta); background-color: rgba(200,92,50,0.1); }
        }
      `}</style>
    </main>
  );
};

export default Corporate;
