import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { createCateringQuote } from '../services/db';
import { 
  Sparkles, 
  Users, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Utensils, 
  Smile, 
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Briefcase
} from 'lucide-react';

const Catering = () => {
  const { language, t } = useApp();
  
  // Portion Calculator States
  const [calcGuests, setCalcGuests] = useState(30);
  const [calcService, setCalcService] = useState('dropoff'); // 'dropoff' | 'staffed'
  const [selectedBuilderItems, setSelectedBuilderItems] = useState(['ndole', 'alloco', 'bissap']);
  const [selectedVibe, setSelectedVibe] = useState('kente'); // Table Decor visual theme curator

  const CATERING_ITEMS = [
    { id: 'pastels', nameFr: 'Pastels de Poisson', nameEn: 'Fish Pastels', category: 'entrees', unitPrice: 2.00, ratio: 2 }, // 2 per person
    { id: 'ndole', nameFr: 'Ndolé Royal', nameEn: 'Royal Ndole', category: 'plats', unitPrice: 10.00, ratio: 0.4 }, // 0.4 portion per person
    { id: 'yassa', nameFr: 'Poulet Yassa Impérial', nameEn: 'Imperial Chicken Yassa', category: 'plats', unitPrice: 8.50, ratio: 0.4 },
    { id: 'mafe', nameFr: 'Mafé de Bœuf', nameEn: 'Beef Mafe', category: 'plats', unitPrice: 9.00, ratio: 0.4 },
    { id: 'alloco', nameFr: 'Alloco croustillant', nameEn: 'Crispy Alloco', category: 'sides', unitPrice: 3.00, ratio: 0.5 },
    { id: 'bissap', nameFr: 'Bissap Royal à l\'hibiscus', nameEn: 'Royal Hibiscus Bissap', category: 'drinks', unitPrice: 2.50, ratio: 1.0 }
  ];

  // Calculator Outputs
  const foodCost = CATERING_ITEMS.reduce((sum, item) => {
    if (!selectedBuilderItems.includes(item.id)) return sum;
    const qty = Math.ceil(calcGuests * item.ratio);
    return sum + (qty * item.unitPrice);
  }, 0);

  const serviceAddition = calcService === 'staffed' ? (calcGuests * 12) : 0;
  const estimatedTotalCost = foodCost + serviceAddition;
  const costPerGuest = calcGuests > 0 ? (estimatedTotalCost / calcGuests) : 0;

  // 8-Step Form States
  const [formStep, setFormStep] = useState(1);
  const [eventType, setEventType] = useState('wedding');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventGuests, setEventGuests] = useState('');
  
  // Preferences Checkboxes
  const [menuPrefs, setMenuPrefs] = useState({
    ndole: false,
    yassa: false,
    mafe: false,
    alloco: false,
    pastels: false,
    bissap: false
  });

  const [servicePrefs, setServicePrefs] = useState({
    staffing: false,
    decoration: false,
    drinksService: false,
    rentals: false
  });

  const [quoteBudgetRange, setQuoteBudgetRange] = useState('1000-2500');
  
  // Contact States
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  const [placedQuote, setPlacedQuote] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleCheckboxChange = (type, key) => {
    if (type === 'menu') {
      setMenuPrefs(prev => ({ ...prev, [key]: !prev[key] }));
    } else if (type === 'service') {
      setServicePrefs(prev => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const quoteData = {
      eventType,
      date: eventDate,
      time: eventTime,
      location: eventLocation,
      guestsCount: parseInt(eventGuests) || 0,
      menuPreferences: Object.keys(menuPrefs).filter(k => menuPrefs[k]),
      additionalServices: Object.keys(servicePrefs).filter(k => servicePrefs[k]),
      decorTheme: selectedVibe,
      budgetRange: quoteBudgetRange,
      contact: {
        name: contactName,
        phone: contactPhone,
        email: contactEmail,
        message: contactMessage
      }
    };

    try {
      const result = await createCateringQuote(quoteData);
      setPlacedQuote(result);
      setFormStep(8); // Quote success step
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue lors de la soumission du devis.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main style={{ padding: '120px 0 60px 0', backgroundColor: 'var(--bg-primary)' }}>
      <div className="container">
        
        {/* Page title */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span style={{ color: 'var(--color-terracotta)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>
            {t("Services d'Événements", "Event Services")}
          </span>
          <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-serif)', marginTop: '0.5rem' }}>
            {t("Service Traiteur Immersif", "Immersive Catering Service")}
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0.5rem auto 0 auto' }}>
            {t(
              "De la conception du menu à la décoration, nous créons des réceptions culinaires africaines mémorables pour vos mariages, fêtes et réunions.",
              "From menu drafting to decoration, we curate memorable African receptions for weddings, feasts, and gatherings."
            )}
          </p>
        </div>

        {/* Portion Calculator (Interactive Widget) */}
        <section style={{
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: '32px',
          padding: '2.5rem',
          border: '1px solid rgba(44, 26, 17, 0.05)',
          marginBottom: '5rem'
        }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '2rem', fontFamily: 'var(--font-serif)', textAlign: 'center' }}>
            🧮 {t("Créateur de Buffet & Quantités", "Catering Buffet Builder")}
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '3rem',
            alignItems: 'center'
          }}>
            {/* Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  <span>{t("Nombre d'invités :", "Number of guests:")}</span>
                  <span style={{ color: 'var(--color-terracotta)', fontSize: '1.1rem' }}>{calcGuests} pax</span>
                </label>
                <input 
                  type="range" 
                  min="10" 
                  max="300" 
                  step="5"
                  value={calcGuests} 
                  onChange={e => setCalcGuests(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--color-terracotta)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{t("Prise en charge :", "Staffing requirements:")}</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button type="button" onClick={() => setCalcService('dropoff')} className={`calc-pill ${calcService === 'dropoff' ? 'active' : ''}`}>{t("Livraison simple", "Delivery Only")}</button>
                  <button type="button" onClick={() => setCalcService('staffed')} className={`calc-pill ${calcService === 'staffed' ? 'active' : ''}`}>{t("Avec serveurs (+12$/pers)", "Full Staffed (+12$/pax)")}</button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{t("Composez le menu du buffet :", "Build your buffet menu:")}</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '300px', overflowY: 'auto', paddingRight: '5px' }}>
                  {CATERING_ITEMS.map(item => {
                    const isSelected = selectedBuilderItems.includes(item.id);
                    const qty = Math.ceil(calcGuests * item.ratio);
                    return (
                      <div 
                        key={item.id}
                        onClick={() => {
                          setSelectedBuilderItems(prev => 
                            prev.includes(item.id) 
                              ? prev.filter(x => x !== item.id) 
                              : [...prev, item.id]
                          );
                        }}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0.8rem 1rem',
                          borderRadius: '12px',
                          border: `2px solid ${isSelected ? 'var(--color-terracotta)' : 'rgba(44,26,11,0.08)'}`,
                          backgroundColor: isSelected ? 'rgba(200,92,50,0.03)' : 'transparent',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          fontSize: '0.85rem'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <input 
                            type="checkbox" 
                            checked={isSelected}
                            readOnly
                            style={{ accentColor: 'var(--color-terracotta)' }}
                          />
                          <div>
                            <p style={{ fontWeight: isSelected ? '600' : '400', margin: 0 }}>{t(item.nameFr, item.nameEn)}</p>
                            <span style={{ fontSize: '0.7rem', color: '#888' }}>
                              {item.ratio >= 1 
                                ? `${item.ratio}x / ${t("pers.", "guest")}` 
                                : `${item.ratio} ${t("portion / pers.", "portion / guest")}`}
                            </span>
                          </div>
                        </div>
                        <span style={{ fontWeight: 'bold', color: 'var(--color-terracotta)' }}>
                          {qty} {t("portions", "portions")}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Estimations Output */}
            <div style={{
              backgroundColor: 'var(--color-cacao)',
              color: 'var(--color-ivory)',
              padding: '2.5rem',
              borderRadius: '24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.2rem',
              boxShadow: '0 15px 35px rgba(44, 26, 17, 0.1)',
              alignSelf: 'stretch',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-safran)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {t("Estimation Budgétaire", "Budget Estimate")}
              </span>
              <div>
                <span style={{ fontSize: '3rem', fontFamily: 'var(--font-serif)', color: 'var(--color-safran)', fontWeight: 'bold' }}>
                  {estimatedTotalCost.toFixed(2)} $
                </span>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-cream)' }}>
                  {costPerGuest.toFixed(2)} $ / {t("invité", "guest")}
                </p>
              </div>

              {/* Portion breakdown list */}
              <div style={{
                textAlign: 'left',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                padding: '1rem 0',
                maxHeight: '150px',
                overflowY: 'auto',
                fontSize: '0.8rem',
                color: 'var(--color-cream)'
              }}>
                <p style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--color-safran)' }}>
                  {t("Détail des quantités calculées :", "Portion Quantities Breakdown:")}
                </p>
                {selectedBuilderItems.length === 0 ? (
                  <p style={{ fontStyle: 'italic', color: '#aaa' }}>{t("Aucun plat sélectionné", "No items selected")}</p>
                ) : (
                  CATERING_ITEMS.filter(i => selectedBuilderItems.includes(i.id)).map(item => {
                    const qty = Math.ceil(calcGuests * item.ratio);
                    return (
                      <div key={item.id} style={{ display: 'flex', justifyContext: 'space-between', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                        <span>• {t(item.nameFr, item.nameEn)}</span>
                        <strong>{qty} {t("portions", "portions")}</strong>
                      </div>
                    );
                  })
                )}
                {calcService === 'staffed' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '0.3rem', marginTop: '0.3rem' }}>
                    <span>• {t("Service complet (Serveurs)", "Full Staffing Service")}</span>
                    <strong>{calcGuests} pax</strong>
                  </div>
                )}
              </div>

              <p style={{ fontSize: '0.75rem', color: 'var(--color-cream)', opacity: 0.8, lineHeight: '1.4' }}>
                {t(
                  "Cette estimation varie selon les options finales et la vaisselle. Les portions sont calibrées selon les standards de satiété.",
                  "This estimate varies based on final choices and tableware. Portions calibrated to standard satiety values."
                )}
              </p>
              <button 
                type="button"
                onClick={() => {
                  setEventGuests(calcGuests.toString());
                  
                  const newMenuPrefs = {
                    ndole: selectedBuilderItems.includes('ndole'),
                    yassa: selectedBuilderItems.includes('yassa'),
                    mafe: selectedBuilderItems.includes('mafe'),
                    alloco: selectedBuilderItems.includes('alloco'),
                    pastels: selectedBuilderItems.includes('pastels'),
                    bissap: selectedBuilderItems.includes('bissap')
                  };
                  setMenuPrefs(newMenuPrefs);
                  
                  setServicePrefs(prev => ({
                    ...prev,
                    staffing: calcService === 'staffed'
                  }));

                  setFormStep(1);
                  document.getElementById('quote-builder-form').scrollIntoView({ behavior: 'smooth' });

                  const event = new CustomEvent('toast-alert', {
                    detail: { 
                      msgFr: "Buffet synchronisé avec le devis !",
                      msgEn: "Buffet synced with the quote request!"
                    }
                  });
                  window.dispatchEvent(event);
                }} 
                className="btn btn-primary"
                style={{ width: '100%', backgroundColor: 'var(--color-terracotta)' }}
              >
                {t("Convertir en Devis", "Create Quote Request")}
              </button>
            </div>
          </div>
        </section>

        {/* VIBE SELECTOR - CURATEUR VISUEL DE DÉCORATION */}
        <section style={{
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: '32px',
          padding: '2.5rem',
          border: '1px solid rgba(44, 26, 17, 0.05)',
          marginBottom: '5rem',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ color: 'var(--color-terracotta)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>
              {t("Aesthetic & Ambiance", "Aesthetic & Theme")}
            </span>
            <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-serif)', marginTop: '0.5rem' }}>
              {t("Curateur de Style de Table", "Catering Table Decor Curator")}
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0.5rem auto 0 auto', fontSize: '0.9rem' }}>
              {t(
                "Sélectionnez le thème visuel de votre buffet. Nous adaptons le nappage, la vaisselle et la décoration florale à vos préférences.",
                "Choose the visual theme for your event. We adapt the table linens, dinnerware, and floral centerpieces to match."
              )}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
            {[
              {
                id: 'kente',
                titleFr: "Kente Royal 👑",
                titleEn: "Royal Kente 👑",
                descFr: "Inspiré par les tissus géométriques ghanéens. Nappages chauds orange/safran, argenterie dorée et vaisselle en terre cuite brute pour une table de prestige.",
                descEn: "Inspired by Ghanaian geometric patterns. Warm orange/saffron runners, golden cutlery, and raw clay dinnerware for a prestigious royal table.",
                color: 'var(--color-safran)',
                bg: 'rgba(244,196,48,0.06)',
                borderCol: 'var(--color-safran)',
                image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80'
              },
              {
                id: 'safari',
                titleFr: "Safari Chic Moderne 🌿",
                titleEn: "Modern Safari Chic 🌿",
                descFr: "Harmonie d'ivoire et d'olivier. Lin naturel brut, feuillages exotiques d'eucalyptus, couverts en cuivre brossé et bougies blanches minimalistes.",
                descEn: "Harmony of ivory and olive. Raw natural linen, eucalyptus and palm leaves, brushed copper details, and minimalist white candles.",
                color: 'var(--color-forest)',
                bg: 'rgba(30,47,35,0.06)',
                borderCol: 'var(--color-forest)',
                image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=400&q=80'
              },
              {
                id: 'terracotta',
                titleFr: "Nuit Terracotta 🏺",
                titleEn: "Terracotta Night 🏺",
                descFr: "Mode sombre luxueux. Nappages charbon profond, vases en céramique d'argile rouge cuite, chandeliers en laiton et vaisselle émaillée sombre.",
                descEn: "Luxury dark mode. Deep charcoal linens, clay pots in baked red terracotta, brass candleholders, and dark glazed stoneware.",
                color: 'var(--color-terracotta)',
                bg: 'rgba(200,92,50,0.06)',
                borderCol: 'var(--color-terracotta)',
                image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=400&q=80'
              }
            ].map(vibe => {
              const isActive = selectedVibe === vibe.id;
              return (
                <div 
                  key={vibe.id}
                  onClick={() => setSelectedVibe(vibe.id)}
                  style={{
                    backgroundColor: isActive ? vibe.bg : 'var(--bg-primary)',
                    border: `3px solid ${isActive ? vibe.borderCol : 'rgba(44,26,11,0.06)'}`,
                    borderRadius: '24px',
                    padding: '1.5rem',
                    cursor: 'pointer',
                    transform: isActive ? 'translateY(-5px)' : 'none',
                    boxShadow: isActive ? '0 10px 25px rgba(0,0,0,0.04)' : 'none',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}
                >
                  <img 
                    src={vibe.image} 
                    alt={vibe.titleFr} 
                    style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '16px' }}
                  />
                  <div>
                    <h4 style={{ fontWeight: 'bold', fontSize: '1.1rem', color: isActive ? vibe.color : 'var(--text-primary)', margin: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{t(vibe.titleFr, vibe.titleEn)}</span>
                      {isActive && <span style={{ fontSize: '0.75rem', color: vibe.color }}>★ {t("Choisi", "Selected")}</span>}
                    </h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.5rem', lineHeight: '1.5' }}>
                      {t(vibe.descFr, vibe.descEn)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 8-STEP DYNAMIC QUOTE BUILDER FORM */}
        <section id="quote-builder-form" style={{
          maxWidth: '650px',
          margin: '0 auto',
          backgroundColor: 'var(--bg-primary)',
          borderRadius: '32px',
          padding: '3rem',
          boxShadow: '0 20px 45px rgba(44, 26, 17, 0.05)',
          border: '1px solid rgba(44, 26, 17, 0.08)'
        }}>
          {formStep < 8 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-sans)', fontWeight: 'bold' }}>
                📝 Devis Événement (Étape {formStep}/7)
              </h3>
              <div style={{
                height: '4px',
                backgroundColor: 'rgba(0,0,0,0.05)',
                width: '100px',
                borderRadius: '2px',
                position: 'relative'
              }}>
                <div style={{
                  height: '100%',
                  backgroundColor: 'var(--color-terracotta)',
                  width: `${(formStep / 7) * 100}%`,
                  borderRadius: '2px',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
          )}

          <form onSubmit={handleFormSubmit}>
            
            {/* STEP 1: EVENT TYPE */}
            {formStep === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '600' }}>{t("Quel est le type de votre événement ?", "What is your event type?")}</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {[
                    { id: 'wedding', label: '💍 Mariage' },
                    { id: 'birthday', label: '🎂 Anniversaire' },
                    { id: 'corporate', label: '💼 Entreprise' },
                    { id: 'family', label: '👨‍👩‍👧 Buffet Familial' }
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setEventType(item.id)}
                      style={{
                        padding: '1.2rem',
                        borderRadius: '12px',
                        border: `2px solid ${eventType === item.id ? 'var(--color-terracotta)' : 'rgba(44,26,11,0.08)'}`,
                        backgroundColor: eventType === item.id ? 'rgba(200, 92, 50, 0.03)' : 'transparent',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                <button type="button" onClick={() => setFormStep(2)} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                  {t("Continuer", "Continue")} <ArrowRight size={16} style={{ marginLeft: '8px' }} />
                </button>
              </div>
            )}

            {/* STEP 2: DATE & TIME */}
            {formStep === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '600' }}>{t("Quand aura lieu l'événement ?", "When is the event?")}</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <input 
                    type="date" 
                    value={eventDate} 
                    onChange={e => setEventDate(e.target.value)}
                    style={{ padding: '0.8rem 1rem', borderRadius: '12px', border: '1px solid rgba(44,26,11,0.1)' }}
                    required
                  />
                  <input 
                    type="time" 
                    value={eventTime} 
                    onChange={e => setEventTime(e.target.value)}
                    style={{ padding: '0.8rem 1rem', borderRadius: '12px', border: '1px solid rgba(44,26,11,0.1)' }}
                    required
                  />
                  <input 
                    type="text" 
                    placeholder={t("Lieu ou Ville (Ottawa/Gatineau)", "Location or City")} 
                    value={eventLocation} 
                    onChange={e => setEventLocation(e.target.value)}
                    style={{ padding: '0.8rem 1rem', borderRadius: '12px', border: '1px solid rgba(44,26,11,0.1)' }}
                    required
                  />
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="button" onClick={() => setFormStep(1)} className="btn btn-secondary" style={{ flex: 1 }}><ArrowLeft size={16} /></button>
                  <button type="button" onClick={() => {
                    if (!eventDate || !eventLocation) {
                      alert("Veuillez remplir les informations.");
                      return;
                    }
                    setFormStep(3);
                  }} className="btn btn-primary" style={{ flex: 1 }}>{t("Continuer", "Continue")}</button>
                </div>
              </div>
            )}

            {/* STEP 3: GUESTS COUNT */}
            {formStep === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '600' }}>{t("Combien d'invités prévoyez-vous ?", "How many guests?")}</h4>
                <input 
                  type="number" 
                  value={eventGuests} 
                  onChange={e => setEventGuests(e.target.value)}
                  placeholder="50"
                  style={{ padding: '0.8rem 1.2rem', borderRadius: '12px', border: '1px solid rgba(44,26,11,0.1)', fontSize: '1.2rem', textAlign: 'center' }}
                  required
                />
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="button" onClick={() => setFormStep(2)} className="btn btn-secondary" style={{ flex: 1 }}><ArrowLeft size={16} /></button>
                  <button type="button" onClick={() => {
                    if (!eventGuests) return;
                    setFormStep(4);
                  }} className="btn btn-primary" style={{ flex: 1 }}>{t("Continuer", "Continue")}</button>
                </div>
              </div>
            )}

            {/* STEP 4: MENU PREFERENCES */}
            {formStep === 4 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '600' }}>{t("Quels plats vous intéressent ?", "Which dishes interest you?")}</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                  {[
                    { id: 'ndole', name: 'Ndolé Royal' },
                    { id: 'yassa', name: 'Poulet Yassa' },
                    { id: 'mafe', name: 'Mafé Bœuf' },
                    { id: 'alloco', name: 'Alloco' },
                    { id: 'pastels', name: 'Pastels Poisson' },
                    { id: 'bissap', name: 'Bissap Royal' }
                  ].map(item => (
                    <label key={item.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.8rem',
                      border: '1px solid rgba(44,26,11,0.08)',
                      borderRadius: '10px',
                      cursor: 'pointer'
                    }}>
                      <input 
                        type="checkbox" 
                        checked={menuPrefs[item.id]} 
                        onChange={() => handleCheckboxChange('menu', item.id)}
                        style={{ accentColor: 'var(--color-terracotta)' }}
                      />
                      <span>{item.name}</span>
                    </label>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="button" onClick={() => setFormStep(3)} className="btn btn-secondary" style={{ flex: 1 }}><ArrowLeft size={16} /></button>
                  <button type="button" onClick={() => setFormStep(5)} className="btn btn-primary" style={{ flex: 1 }}>{t("Continuer", "Continue")}</button>
                </div>
              </div>
            )}

            {/* STEP 5: COMPLEMENTARY SERVICES */}
            {formStep === 5 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '600' }}>{t("Services complémentaires souhaités", "Additional Services Needed")}</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {[
                    { id: 'staffing', label: t("Personnel de service (serveurs/maître d'hôtel)", "Staffing (Waiters)") },
                    { id: 'decoration', label: t("Décoration & Nappage de table afro-premium", "Afro-premium table setup") },
                    { id: 'drinksService', label: t("Service de boissons & Cocktails signature", "Drinks & Cocktail service") },
                    { id: 'rentals', label: t("Location de vaisselle et couverts de prestige", "Plate & Fork rentals") }
                  ].map(item => (
                    <label key={item.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.8rem',
                      padding: '1rem',
                      border: '1px solid rgba(44,26,11,0.08)',
                      borderRadius: '12px',
                      cursor: 'pointer'
                    }}>
                      <input 
                        type="checkbox" 
                        checked={servicePrefs[item.id]} 
                        onChange={() => handleCheckboxChange('service', item.id)}
                        style={{ accentColor: 'var(--color-terracotta)' }}
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="button" onClick={() => setFormStep(4)} className="btn btn-secondary" style={{ flex: 1 }}><ArrowLeft size={16} /></button>
                  <button type="button" onClick={() => setFormStep(6)} className="btn btn-primary" style={{ flex: 1 }}>{t("Continuer", "Continue")}</button>
                </div>
              </div>
            )}

            {/* STEP 6: BUDGET */}
            {formStep === 6 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '600' }}>{t("Quel est votre budget global ?", "What is your overall budget?")}</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {[
                    { id: 'under-1000', label: t("Moins de 1 000 $", "Under $1,000") },
                    { id: '1000-2500', label: "1 000 $ - 2 500 $" },
                    { id: '2500-5000', label: "2 500 $ - 5 000 $" },
                    { id: '5000-plus', label: t("Plus de 5 000 $", "Above $5,000") }
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setQuoteBudgetRange(item.id)}
                      style={{
                        padding: '1rem',
                        borderRadius: '12px',
                        border: `2px solid ${quoteBudgetRange === item.id ? 'var(--color-terracotta)' : 'rgba(44,26,11,0.08)'}`,
                        backgroundColor: quoteBudgetRange === item.id ? 'rgba(200, 92, 50, 0.03)' : 'transparent',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="button" onClick={() => setFormStep(5)} className="btn btn-secondary" style={{ flex: 1 }}><ArrowLeft size={16} /></button>
                  <button type="button" onClick={() => setFormStep(7)} className="btn btn-primary" style={{ flex: 1 }}>{t("Continuer", "Continue")}</button>
                </div>
              </div>
            )}

            {/* STEP 7: CONTACT DETAILS & MESSAGE */}
            {formStep === 7 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '600' }}>{t("Vos coordonnées de contact", "Contact Information")}</h4>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.2rem' }}>{t("Nom complet", "Full Name")}</label>
                  <input type="text" value={contactName} onChange={e => setContactName(e.target.value)} required style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid rgba(44,26,11,0.1)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.2rem' }}>{t("Téléphone", "Phone")}</label>
                  <input type="tel" value={contactPhone} onChange={e => setContactPhone(e.target.value)} required style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid rgba(44,26,11,0.1)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.2rem' }}>{t("Courriel", "Email")}</label>
                  <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} required style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid rgba(44,26,11,0.1)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.2rem' }}>{t("Détails supplémentaires", "Additional Details")}</label>
                  <textarea rows="3" value={contactMessage} onChange={e => setContactMessage(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid rgba(44,26,11,0.1)' }} />
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="button" onClick={() => setFormStep(6)} className="btn btn-secondary" style={{ flex: 1 }}><ArrowLeft size={16} /></button>
                  <button type="submit" disabled={submitting} className="btn btn-primary" style={{ flex: 1 }}>
                    {submitting ? t("Envoi...", "Sending...") : t("Soumettre la demande", "Submit Request")}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 8: SUCCESS SCREEN */}
            {formStep === 8 && placedQuote && (
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
                <CheckCircle size={60} color="var(--color-safran)" />
                <div>
                  <h3 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-serif)' }}>{t("Demande de devis transmise !", "Quote Request Submitted!")}</h3>
                  <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '0.95rem' }}>
                    {t(
                      "Nous analysons votre demande et vous enverrons une proposition détaillée sous 24 à 48 heures.",
                      "We will review your request and send a detailed proposal within 24 to 48 hours."
                    )}
                  </p>
                </div>

                <div style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  width: '100%',
                  textAlign: 'left',
                  fontSize: '0.9rem'
                }}>
                  <p><strong>Référence Devis :</strong> {placedQuote.quoteRef}</p>
                  <p><strong>Type :</strong> {placedQuote.eventType.toUpperCase()}</p>
                  <p><strong>Invités :</strong> {placedQuote.guestsCount} pax</p>
                  <p><strong>Date prévue :</strong> {placedQuote.date}</p>
                </div>

                <button 
                  type="button"
                  onClick={() => { setFormStep(1); setPlacedQuote(null); }}
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  {t("Créer une nouvelle demande", "Create new request")}
                </button>
              </div>
            )}

          </form>
        </section>

      </div>
      <style>{`
        .calc-pill {
          flex: 1;
          padding: 0.6rem;
          border-radius: 10px;
          border: 1px solid rgba(44, 26, 17, 0.08);
          background-color: var(--bg-primary);
          color: var(--text-primary);
          font-size: 0.8rem;
          font-weight: bold;
          cursor: pointer;
          transition: var(--transition-fast);
          text-align: center;
        }
        .calc-pill.active, .calc-pill:hover {
          border-color: var(--color-terracotta);
          background-color: rgba(200, 92, 50, 0.05);
          color: var(--color-terracotta);
        }
      `}</style>
    </main>
  );
};

export default Catering;
