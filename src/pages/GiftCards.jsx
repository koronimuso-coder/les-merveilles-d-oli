import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Gift, Mail, Calendar, DollarSign, Send, CheckCircle } from 'lucide-react';

const GiftCards = () => {
  const { language, t } = () => useApp();
  const appTrans = useApp();
  const translate = (f, e) => appTrans?.t ? appTrans.t(f, e) : f;
  
  const [selectedTheme, setSelectedTheme] = useState('birthday'); // 'birthday'|'thankyou'|'love'|'corporate'
  const [amount, setAmount] = useState(50);
  const [senderName, setSenderName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [giftMessage, setGiftMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const themes = [
    { id: 'birthday', label: '🎂 Anniversaire', labelEn: 'Birthday', color: 'var(--color-terracotta)', pattern: 'repeating-linear-gradient(45deg, #C85C32, #C85C32 10px, #2C1A11 10px, #2C1A11 20px)' },
    { id: 'thankyou', label: '🙏 Merci', labelEn: 'Thank You', color: 'var(--color-forest)', pattern: 'repeating-linear-gradient(135deg, #1E2F23, #1E2F23 15px, #D4AF37 15px, #D4AF37 18px)' },
    { id: 'love', label: '❤️ Amour', labelEn: 'Love', color: 'var(--color-bordeaux)', pattern: 'radial-gradient(circle, #5C1D24 20%, #2C1A11 80%)' },
    { id: 'corporate', label: '💼 Pro', labelEn: 'Corporate', color: 'var(--color-cacao)', pattern: 'repeating-radial-gradient(circle, #2C1A11, #2C1A11 10px, #D38B5D 10px, #D38B5D 20px)' }
  ];

  const activeTheme = themes.find(t => t.id === selectedTheme);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main style={{ padding: '120px 0 60px 0', backgroundColor: 'var(--bg-primary)', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{ color: 'var(--color-terracotta)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>
            {translate("Cartes-cadeaux", "Gift Cards")}
          </span>
          <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-serif)', marginTop: '0.5rem' }}>
            {translate("Offrez Les Merveilles d'Oli", "Gift Les Merveilles d'Oli")}
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0.5rem auto 0 auto' }}>
            {translate(
              "Faites plaisir à vos proches avec nos cartes-cadeaux numériques personnalisées et animées.",
              "Delight your loved ones with our custom, animated digital gift cards."
            )}
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3rem',
          alignItems: 'center'
        }}>
          
          {/* Left Column: Visual card builder preview (Envelope Animation) */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
            <div className="envelope-container" style={{
              position: 'relative',
              width: '320px',
              height: '200px',
              backgroundColor: 'var(--color-cream)',
              borderRadius: '12px',
              boxShadow: '0 15px 35px rgba(44, 26, 17, 0.08)',
              overflow: 'visible',
              border: '2px solid rgba(44,26,11,0.05)'
            }}>
              
              {/* Back Envelope Fold */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '0',
                height: '0',
                borderLeft: '160px solid transparent',
                borderRight: '160px solid transparent',
                borderTop: '100px solid var(--color-cacao)',
                zIndex: 1
              }} />

              {/* Gift Card sliding out */}
              <div className="sliding-gift-card" style={{
                position: 'absolute',
                top: '-30px',
                left: '20px',
                width: '280px',
                height: '170px',
                borderRadius: '12px',
                background: activeTheme.pattern,
                color: 'white',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
                zIndex: 2,
                transition: 'top 0.5s ease-in-out'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--color-safran)' }}>
                    GIFT CARD
                  </span>
                  <span style={{ fontSize: '1.8rem', fontWeight: 'bold', fontFamily: 'var(--font-serif)' }}>
                    {amount} $
                  </span>
                </div>

                <div>
                  <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>Pour / To: {recipientName || '...'}</p>
                  <h3 style={{ fontSize: '1rem', fontFamily: 'var(--font-serif)', marginTop: '0.3rem' }}>LES MERVEILLES D'OLI</h3>
                </div>
              </div>

              {/* Front Envelope bottom folds */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '0',
                height: '0',
                borderLeft: '160px solid var(--color-cream)',
                borderRight: '160px solid var(--color-cream)',
                borderBottom: '100px solid rgba(44,26,11,0.03)',
                zIndex: 3
              }} />
            </div>

            {/* Customizer select theme */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              {themes.map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTheme(t.id)}
                  className={`calc-pill ${selectedTheme === t.id ? 'active' : ''}`}
                  style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}
                >
                  {language === 'fr' ? t.label : t.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Customizer Form */}
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '24px',
            padding: '2.5rem',
            boxShadow: '0 10px 30px rgba(44, 26, 17, 0.02)',
            border: '1px solid rgba(44, 26, 17, 0.05)'
          }}>
            {submitted ? (
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.2rem', alignItems: 'center' }}>
                <CheckCircle size={50} color="var(--color-forest)" />
                <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)' }}>{translate("Carte-cadeau envoyée !", "Gift Card Sent!")}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  {translate(
                    "Votre carte-cadeau a été émise avec succès et transmise par courriel au destinataire.",
                    "Your gift card has been successfully issued and sent to the recipient via email."
                  )}
                </p>
                <button onClick={() => setSubmitted(false)} className="btn btn-primary" style={{ width: '100%' }}>
                  {translate("Offrir une autre carte", "Gift another card")}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 'bold' }}>
                  🎁 {translate("Personnaliser la carte", "Customize Card")}
                </h3>
                
                {/* Predefined Amounts */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    {translate("Montant", "Amount")}
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {[25, 50, 75, 100].map(val => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setAmount(val)}
                        className={`spice-pill ${amount === val ? 'active' : ''}`}
                        style={{ fontSize: '0.9rem', padding: '0.5rem' }}
                      >
                        {val} $
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.2rem' }}>{translate("Nom de l'expéditeur", "Sender Name")}</label>
                  <input type="text" value={senderName} onChange={e => setSenderName(e.target.value)} required style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid rgba(44,26,11,0.1)' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.2rem' }}>{translate("Nom du destinataire", "Recipient Name")}</label>
                  <input type="text" value={recipientName} onChange={e => setRecipientName(e.target.value)} required style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid rgba(44,26,11,0.1)' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.2rem' }}>{translate("Courriel du destinataire", "Recipient Email")}</label>
                  <input type="email" value={recipientEmail} onChange={e => setRecipientEmail(e.target.value)} required style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid rgba(44,26,11,0.1)' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.2rem' }}>{translate("Message personnalisé", "Custom Message")}</label>
                  <textarea rows="3" value={giftMessage} onChange={e => setGiftMessage(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid rgba(44,26,11,0.1)' }} />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', gap: '8px' }}>
                  <Send size={16} /> {translate("Envoyer la carte-cadeau", "Send Gift Card")}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
      <style>{`
        .envelope-container:hover .sliding-gift-card {
          top: -90px !important;
        }
      `}</style>
    </main>
  );
};

export default GiftCards;
