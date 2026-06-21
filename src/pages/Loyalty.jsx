import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Gift, Award, Share2, Clipboard, Heart, ArrowRight } from 'lucide-react';

const Loyalty = () => {
  const { language, t } = useApp();
  const { userProfile, currentUser } = useAuth();
  const [copied, setCopied] = useState(false);

  // Mock point state if user profile has none
  const loyaltyPoints = userProfile?.loyaltyPoints || 120; // Default mock for demo
  const ordersCount = 3; // Mock orders count
  const segmentsNeeded = 5; // Unlocks next tier
  const progressPercent = (ordersCount / segmentsNeeded) * 100;

  // Referral Link Generator
  const referralLink = `https://lesmerveillesdoli.com/signup?ref=${currentUser?.uid || 'OLI-FRIEND'}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main style={{ padding: '120px 0 60px 0', backgroundColor: 'var(--bg-primary)', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{ color: 'var(--color-terracotta)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>
            {t("Programme de Fidélité", "Loyalty Program")}
          </span>
          <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-serif)', marginTop: '0.5rem' }}>
            {t("Remplissez Votre Table", "Fill Your Table")}
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0.5rem auto 0 auto' }}>
            {t(
              "Chaque commande complète votre assiette et débloque des récompenses gourmandes exclusives.",
              "Each order fills your plate, unlocking exclusive culinary rewards."
            )}
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3rem',
          alignItems: 'center'
        }}>
          
          {/* Left Column: Visual Plate fill-up */}
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '32px',
            padding: '3rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2rem',
            boxShadow: '0 10px 30px rgba(44, 26, 17, 0.03)',
            border: '1px solid rgba(44, 26, 17, 0.05)'
          }}>
            {/* Visual Segmented Plate representing progress */}
            <div style={{
              width: '240px',
              height: '240px',
              borderRadius: '50%',
              border: '6px solid var(--color-cacao)',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--bg-primary)'
            }}>
              {/* Progress Ring */}
              <svg width="220" height="220" viewBox="0 0 100 100" style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
                <circle 
                  cx="50" 
                  cy="50" 
                  r="44" 
                  stroke="rgba(200,92,50,0.1)" 
                  strokeWidth="6" 
                  fill="transparent"
                />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="44" 
                  stroke="var(--color-terracotta)" 
                  strokeWidth="6" 
                  fill="transparent"
                  strokeDasharray="276.4"
                  strokeDashoffset={276.4 - (276.4 * progressPercent) / 100}
                  style={{ transition: 'stroke-dashoffset 0.8s ease-out-in' }}
                />
              </svg>

              {/* Text inside the ring */}
              <div style={{ textAlign: 'center', zIndex: 2 }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--color-terracotta)' }}>{ordersCount}/{segmentsNeeded}</span>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {t("Commandes", "Orders")}
                </p>
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                🎉 {t("Encore 2 repas avant votre cadeau !", "2 more meals to get your reward!")}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
                {t("Niveau actuel : Client Privilège (Argent)", "Current status: Privilege Guest (Silver)")}
              </p>
            </div>
          </div>

          {/* Right Column: Points, Tier levels & referrals */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Loyalty Balance Card */}
            <div style={{
              backgroundColor: 'var(--color-cacao)',
              color: 'var(--color-ivory)',
              borderRadius: '24px',
              padding: '2rem',
              boxShadow: '0 15px 35px rgba(0,0,0,0.08)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-safran)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {t("Solde de Points", "Points Balance")}
                </span>
                <h2 style={{ fontSize: '2.8rem', fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)', marginTop: '0.3rem' }}>
                  {loyaltyPoints} pts
                </h2>
              </div>
              <Award size={48} color="var(--color-safran)" />
            </div>

            {/* Referrals Section */}
            <div style={{
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: '24px',
              padding: '2rem',
              border: '1px solid rgba(44, 26, 17, 0.05)'
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-terracotta)' }}>
                <Share2 size={18} /> {t("Parrainez un ami", "Refer a friend")}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem', marginBottom: '1.2rem' }}>
                {t(
                  "Offrez 10 $ à vos proches sur leur première commande et recevez 100 points de fidélité lors de leur premier achat !",
                  "Give $10 to your friends on their first order and earn 100 points upon their first purchase!"
                )}
              </p>
              
              <div style={{ display: 'flex', position: 'relative' }}>
                <input 
                  type="text" 
                  value={referralLink} 
                  readOnly 
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(44,26,11,0.1)',
                    backgroundColor: 'var(--bg-primary)',
                    fontSize: '0.8rem',
                    outline: 'none',
                    fontWeight: '500'
                  }}
                />
                <button 
                  onClick={handleCopyLink}
                  className="btn btn-primary"
                  style={{
                    position: 'absolute',
                    right: '5px',
                    top: '5px',
                    padding: '0.4rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.75rem'
                  }}
                >
                  {copied ? t("Copié !", "Copied!") : <Clipboard size={14} />}
                </button>
              </div>
            </div>

            {/* Unlocked rewards list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>🎁 {t("Récompenses Disponibles", "Available Rewards")}</h3>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem 1.2rem',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '16px',
                border: '1px dashed var(--color-terracotta)'
              }}>
                <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                  <Gift size={20} color="var(--color-terracotta)" />
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{t("Alloco Gratuit", "Free Alloco")}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{t("Code débloqué à 100 pts", "Unlocked at 100 pts")}</span>
                  </div>
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--color-forest)' }}>{t("Utiliser", "Redeem")}</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </main>
  );
};

export default Loyalty;
