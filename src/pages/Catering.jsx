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
  const [calcType, setCalcType] = useState('buffet'); // 'buffet' | 'plated' | 'box'
  const [calcCourses, setCalcCourses] = useState(3); // 2 | 3 | 4
  const [calcService, setCalcService] = useState('dropoff'); // 'dropoff' | 'staffed'

  // Calculator Outputs
  const basePricePerPerson = calcType === 'buffet' ? 30 : calcType === 'plated' ? 45 : 20;
  const courseMultiplier = calcCourses === 2 ? 0.9 : calcCourses === 3 ? 1.0 : 1.25;
  const serviceAddition = calcService === 'staffed' ? 12 : 0;
  const costPerGuest = (basePricePerPerson * courseMultiplier) + serviceAddition;
  const estimatedTotalCost = costPerGuest * calcGuests;

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
            🧮 {t("Calculateur de Portion & Budget", "Portion & Budget Estimator")}
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
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{t("Style de service :", "Service style:")}</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => setCalcType('box')} className={`calc-pill ${calcType === 'box' ? 'active' : ''}`}>{t("Plateau Pro", "Lunch Box")}</button>
                  <button onClick={() => setCalcType('buffet')} className={`calc-pill ${calcType === 'buffet' ? 'active' : ''}`}>{t("Buffet libre", "Buffet")}</button>
                  <button onClick={() => setCalcType('plated')} className={`calc-pill ${calcType === 'plated' ? 'active' : ''}`}>{t("Dressage à l'assiette", "Plated")}</button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{t("Nombre de services :", "Number of courses:")}</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => setCalcCourses(2)} className={`calc-pill ${calcCourses === 2 ? 'active' : ''}`}>2 {t("plats", "courses")}</button>
                  <button onClick={() => setCalcCourses(3)} className={`calc-pill ${calcCourses === 3 ? 'active' : ''}`}>3 {t("plats", "courses")}</button>
                  <button onClick={() => setCalcCourses(4)} className={`calc-pill ${calcCourses === 4 ? 'active' : ''}`}>4 {t("plats", "courses")}</button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{t("Prise en charge :", "Staffing requirements:")}</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => setCalcService('dropoff')} className={`calc-pill ${calcService === 'dropoff' ? 'active' : ''}`}>{t("Livraison simple", "Delivery Only")}</button>
                  <button onClick={() => setCalcService('staffed')} className={`calc-pill ${calcService === 'staffed' ? 'active' : ''}`}>{t("Avec serveurs", "Full Staffed")}</button>
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
              boxShadow: '0 15px 35px rgba(44, 26, 17, 0.1)'
            }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-safran)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {t("Estimation Budgétaire", "Budget Estimate")}
              </span>
              <div>
                <span style={{ fontSize: '3rem', fontFamily: 'var(--font-serif)', color: 'var(--color-terracotta)', fontWeight: 'bold' }}>
                  {estimatedTotalCost.toFixed(2)} $
                </span>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-cream)' }}>
                  {costPerGuest.toFixed(2)} $ / {t("invité", "guest")}
                </p>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-cream)', lineHeight: '1.4' }}>
                {t(
                  "Cette estimation inclut les plats et le service choisi, hors taxes locales. Parlez à notre équipe pour bloquer cette tarification.",
                  "This estimate includes food and selected service, excluding local taxes. Talk to our team to freeze this quote."
                )}
              </p>
              <button 
                onClick={() => {
                  setEventGuests(calcGuests.toString());
                  setFormStep(1);
                  // Scroll to quote builder
                  document.getElementById('quote-builder-form').scrollIntoView({ behavior: 'smooth' });
                }} 
                className="btn btn-primary"
                style={{ width: '100%', backgroundColor: 'var(--color-terracotta)' }}
              >
                {t("Convertir en Devis", "Create Quote Request")}
              </button>
            </div>
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
