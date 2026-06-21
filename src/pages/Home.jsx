import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useCart } from '../context/CartContext';
import { getProducts } from '../services/db';
import ThreeSignaturePlate from '../components/ThreeSignaturePlate';
import MagneticButton from '../components/MagneticButton';
import SauceReveal from '../components/SauceReveal';
import { 
  ArrowRight, 
  MapPin, 
  Flame, 
  Users, 
  Briefcase, 
  Utensils, 
  Sparkles, 
  Star, 
  CheckCircle, 
  Truck,
  Heart,
  ChevronRight,
  Pause,
  Play
} from 'lucide-react';

const Home = () => {
  const { language, t, siteSettings, animationsEnabled, setAnimationsEnabled } = useApp();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  // Page states
  const [showLoader, setShowLoader] = useState(true);
  const [loaderProgress, setLoaderProgress] = useState(0);
  const [bestSellers, setBestSellers] = useState([]);
  const [sauceTrigger, setSauceTrigger] = useState(false);
  const [sauceColor, setSauceColor] = useState('var(--color-terracotta)');
  
  // Interactive delivery checker states
  const [postalCode, setPostalCode] = useState('');
  const [deliveryResult, setDeliveryResult] = useState(null);
  
  // Scroll Storytelling step
  const [storyStep, setStoryStep] = useState(0);
  const [storyAutoplay, setStoryAutoplay] = useState(true);

  // Load products & handle loader progress
  useEffect(() => {
    // 1. Simulating Loader drawing progress (0.8s to 1.8s)
    const isFirstVisit = !sessionStorage.getItem('oli_visited');
    const targetDuration = isFirstVisit ? 1500 : 800; // shorter for return visits
    
    let startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, Math.floor((elapsed / targetDuration) * 100));
      setLoaderProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setShowLoader(false);
        sessionStorage.setItem('oli_visited', 'true');
      }
    }, 30);

    // 2. Fetch products
    getProducts().then(prods => {
      // Filter out best sellers
      setBestSellers(prods.slice(0, 3));
    });

    return () => clearInterval(interval);
  }, []);

  // Story step autoplay timer
  useEffect(() => {
    if (!storyAutoplay || !animationsEnabled) return;
    const timer = setInterval(() => {
      setStoryStep(prev => (prev + 1) % 5);
    }, 4500);
    return () => clearInterval(timer);
  }, [storyAutoplay, animationsEnabled]);

  // Handle Sauce Transition
  const triggerSauceReveal = (color, path) => {
    setSauceColor(color);
    setSauceTrigger(true);
    setTimeout(() => {
      navigate(path);
    }, 600);
  };

  // Delivery postal code verification
  const checkDelivery = (e) => {
    e.preventDefault();
    const cleanCode = postalCode.trim().toUpperCase().replace(/\s+/g, '');
    
    if (cleanCode.length < 3) {
      setDeliveryResult({
        success: false,
        msgFr: "Veuillez entrer un code postal canadien valide.",
        msgEn: "Please enter a valid Canadian postal code."
      });
      return;
    }

    const firstChar = cleanCode.charAt(0);
    // J = Western Quebec (Gatineau), K = Eastern Ontario (Ottawa)
    if (firstChar === 'J') {
      setDeliveryResult({
        success: true,
        zone: 'Gatineau',
        fee: 5.00,
        min: 20.00,
        msgFr: "Bonne nouvelle ! Nous livrons chez vous à Gatineau. Frais de livraison : 5,00 $ (minimum 20,00 $).",
        msgEn: "Great news! We deliver to you in Gatineau. Delivery fee: $5.00 (minimum $20.00)."
      });
    } else if (firstChar === 'K') {
      setDeliveryResult({
        success: true,
        zone: 'Ottawa',
        fee: 10.00,
        min: 30.00,
        msgFr: "Bonne nouvelle ! Nous livrons chez vous à Ottawa. Frais de livraison : 10,00 $ (minimum 30,00 $).",
        msgEn: "Great news! We deliver to you in Ottawa. Delivery fee: $10.00 (minimum $30.00)."
      });
    } else {
      setDeliveryResult({
        success: false,
        msgFr: "Vous êtes en dehors de notre zone de livraison directe. Cependant, vous pouvez commander et retirer vos plats à notre point de retrait à Gatineau !",
        msgEn: "You are outside our direct delivery zone. However, you can still place your order and pick it up at our Gatineau location!"
      });
    }
  };

  const storySteps = [
    {
      titleFr: "1. L'ingrédient",
      titleEn: "1. The Ingredient",
      descFr: "Tout commence par le choix. Des épices venues du continent aux herbes fraîches d'ici, chaque ingrédient raconte sa propre histoire.",
      descEn: "Everything begins with selection. From spices native to the continent to fresh local herbs, each ingredient tells its own story.",
      image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80"
    },
    {
      titleFr: "2. Le geste",
      titleEn: "2. The Gesture",
      descFr: "Chaque détail compte. La mouture fine des épices, le tri méticuleux des feuilles de ndolé, le massage délicat du poulet marinant.",
      descEn: "Every detail matters. The fine milling of spices, the meticulous sorting of Ndole leaves, the delicate massaging of marinated chicken.",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80"
    },
    {
      titleFr: "3. La flamme",
      titleEn: "3. The Flame",
      descFr: "Le feu révèle les saveurs. Une braise lente et maîtrisée caramélise les oignons du yassa et chauffe doucement la marmite de mafé.",
      descEn: "The flame reveals the flavors. A slow, controlled ember caramelizes the onions of the Yassa and gently heats the Mafe pot.",
      image: "https://images.unsplash.com/photo-1568254183919-78a4f43a2877?auto=format&fit=crop&w=600&q=80"
    },
    {
      titleFr: "4. Le dressage",
      titleEn: "4. The Plating",
      descFr: "La générosité prend forme. Les portions d'alloco doré viennent couronner le plat, et les crevettes sautées se placent au sommet du Ndolé.",
      descEn: "Generosity takes shape. Portions of golden alloco crown the plate, and sautéed prawns sit on top of the Ndole.",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80"
    },
    {
      titleFr: "5. Le partage",
      titleEn: "5. The Sharing",
      descFr: "Le repas devient un souvenir. Autour d'une table dressée avec soin, les rires et les saveurs se mélangent pour unir les familles et les collègues.",
      descEn: "The meal becomes a memory. Around a carefully set table, laughter and flavors blend to unite families and colleagues.",
      image: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=600&q=80"
    }
  ];

  const testimonials = [
    { name: "Mariam Diallo", role: "Gatineau", stars: 5, textFr: "Le Ndolé est absolument divin ! J'ai retrouvé le goût authentique du Cameroun. La livraison à Gatineau a été rapide et les portions sont tellement généreuses.", textEn: "The Ndole is absolutely divine! Found the authentic Cameroonian taste. Delivery in Gatineau was quick and the portions are so generous." },
    { name: "Jean-Pierre Tremblay", role: "Ottawa", stars: 5, textFr: "J'ai engagé Les Merveilles d'Oli comme traiteur pour mon anniversaire d'entreprise. 50 convives conquis par le Yassa et le Mafé. Service irréprochable et professionnel.", textEn: "Hired Les Merveilles d'Oli to cater our corporate anniversary. 50 guests amazed by the Yassa and Mafe. Impeccable and professional service." },
    { name: "Khadija & Family", role: "Orléans", stars: 5, textFr: "Le menu familial pour 4 personnes est un régal absolu. Excellent rapport qualité-prix. Les enfants ont adoré l'alloco !", textEn: "The family pack for 4 is an absolute treat. Excellent value. Kids loved the alloco!" }
  ];

  return (
    <>
      {/* 1. INTRODUCTION CINÉMATIQUE (LOADER) */}
      {showLoader && (
        <div className="loader-screen" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'var(--color-cacao)',
          color: 'var(--color-ivory)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          overflow: 'hidden'
        }}>
          {/* Drawing Contours representing a plate */}
          <svg width="150" height="150" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
            <circle 
              cx="50" 
              cy="50" 
              r="40" 
              stroke="var(--color-terracotta)" 
              strokeWidth="2" 
              fill="transparent"
              strokeDasharray="251.2"
              strokeDashoffset={251.2 - (251.2 * loaderProgress) / 100}
              style={{ transition: 'stroke-dashoffset 0.05s ease-out' }}
            />
            {/* Inner warm light glow */}
            <circle cx="50" cy="50" r="25" fill="var(--color-safran)" opacity={0.15 + (loaderProgress / 300)} />
          </svg>
          
          <h2 style={{
            marginTop: '2rem',
            fontFamily: 'var(--font-serif)',
            fontSize: '1.6rem',
            letterSpacing: '2px',
            animation: 'pulse 1.5s infinite alternate'
          }}>
            LES MERVEILLES D'OLI
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-copper)', marginTop: '0.5rem', opacity: 0.8 }}>
            "De notre cuisine à votre table"
          </p>

          <button 
            onClick={() => setShowLoader(false)}
            style={{
              marginTop: '1.5rem',
              background: 'transparent',
              border: '1px solid rgba(245, 239, 230, 0.2)',
              color: 'var(--color-cream)',
              padding: '0.3rem 1rem',
              borderRadius: '20px',
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
          >
            {t("Passer l'introduction", "Skip introduction")}
          </button>
        </div>
      )}

      {/* Sauce transition reveal overlay */}
      <SauceReveal trigger={sauceTrigger} onComplete={() => setSauceTrigger(false)} sauceColor={sauceColor} />

      <main style={{ paddingBottom: '0' }}>

        {/* 2. HERO IMMERSIF */}
        <section className="hero-section" style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          padding: '120px 0 60px 0',
          overflow: 'hidden',
          backgroundColor: 'var(--color-cacao)',
          color: 'var(--color-ivory)'
        }}>
          {/* Subtle warm glow background */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(200,92,50,0.15) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          <div className="container" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            alignItems: 'center',
            zIndex: 2
          }}>
            {/* Left Column: Heading text */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <span style={{
                color: 'var(--color-safran)',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                fontSize: '0.85rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Flame size={16} /> {t("Gastronomie Afro-Contemporaine", "Afro-Contemporary Gastronomy")}
              </span>
              <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-serif)', lineHeight: '1.15' }}>
                {t("Les saveurs africaines qui rassemblent Ottawa–Gatineau.", "African flavors uniting Ottawa–Gatineau.")}
              </h1>
              <p style={{ color: 'var(--color-cream)', fontSize: '1.1rem', maxWidth: '480px' }}>
                {t(
                  "Des repas généreux, préparés avec passion pour vos envies, vos familles, vos entreprises et vos événements.",
                  "Generous meals prepared with passion for your cravings, families, corporate needs, and events."
                )}
              </p>
              
              {/* Pickup / Delivery Pills */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.8rem', color: 'var(--color-cream)' }}>
                <span className="hero-badge"><MapPin size={14} /> {t("Retrait à Gatineau", "Pick-up in Gatineau")}</span>
                <span className="hero-badge"><Truck size={14} /> {t("Livraison Ottawa-Gatineau", "Ottawa-Gatineau Delivery")}</span>
              </div>

              {/* Call to Action Buttons */}
              <div style={{ display: 'flex', gap: '1.2rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                <MagneticButton 
                  className="btn btn-primary" 
                  onClick={() => triggerSauceReveal('var(--color-terracotta)', '/menu')}
                  dataCursor="order"
                >
                  {t("Commander maintenant", "Order Now")} <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                </MagneticButton>
                <button 
                  onClick={() => triggerSauceReveal('var(--color-bordeaux)', '/catering')} 
                  className="btn btn-secondary"
                  style={{ color: 'var(--color-ivory)', borderColor: 'rgba(245,239,230,0.3)' }}
                >
                  {t("Devis Traiteur", "Request Catering")}
                </button>
              </div>
            </div>

            {/* Right Column: ThreeJS Plate */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <ThreeSignaturePlate />
            </div>
          </div>
        </section>

        {/* 3. CHOIX DU PARCOURS */}
        <section style={{ padding: '6rem 0', backgroundColor: 'var(--bg-secondary)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
                {t("Comment souhaitez-vous déguster ?", "How would you like to feast ?")}
              </h2>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                {t(
                  "Choisissez votre parcours pour découvrir nos offres adaptées à chaque moment de partage.",
                  "Choose your journey to discover custom offers tailored for every moment."
                )}
              </p>
            </div>

            <div className="parcours-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '2rem'
            }}>
              {/* Box 1: Commander maintenant */}
              <div 
                className="parcours-card" 
                onClick={() => triggerSauceReveal('var(--color-terracotta)', '/menu')}
                data-cursor="add"
              >
                <div className="parcours-icon" style={{ backgroundColor: 'rgba(200,92,50,0.1)' }}><Utensils color="var(--color-terracotta)" /></div>
                <h3>{t("Je commande maintenant", "Order Now")}</h3>
                <p>{t("Plats à l'unité, accompagnements chauds et boissons fraîches.", "Single meals, warm sides, and refreshing drinks.")}</p>
                <span className="parcours-link">{t("Voir le menu", "View menu")} <ChevronRight size={16} /></span>
              </div>

              {/* Box 2: Nourrir ma famille */}
              <div 
                className="parcours-card" 
                onClick={() => triggerSauceReveal('var(--color-bordeaux)', '/menu?cat=menus_familiaux')}
                data-cursor="order"
              >
                <div className="parcours-icon" style={{ backgroundColor: 'rgba(92,29,36,0.1)' }}><Users color="var(--color-bordeaux)" /></div>
                <h3>{t("Je nourris ma famille", "Feed My Family")}</h3>
                <p>{t("Festins généreux et plateaux complets pour régaler tout le monde.", "Generous feasts and full platters to delight everyone.")}</p>
                <span className="parcours-link">{t("Découvrir les festins", "Discover feasts")} <ChevronRight size={16} /></span>
              </div>

              {/* Box 3: Organiser un événement */}
              <div 
                className="parcours-card" 
                onClick={() => triggerSauceReveal('var(--color-gold)', '/catering')}
                data-cursor="view"
              >
                <div className="parcours-icon" style={{ backgroundColor: 'rgba(212,175,55,0.1)' }}><Sparkles color="var(--color-gold)" /></div>
                <h3>{t("J'organise un événement", "Host an Event")}</h3>
                <p>{t("Mariages, buffets communautaires ou réceptions privées clés en main.", "Weddings, community buffets, or turnkey private receptions.")}</p>
                <span className="parcours-link">{t("Devis en ligne", "Online quote")} <ChevronRight size={16} /></span>
              </div>

              {/* Box 4: Commande d'entreprise */}
              <div 
                className="parcours-card" 
                onClick={() => triggerSauceReveal('var(--color-forest)', '/corporate')}
                data-cursor="hovered"
              >
                <div className="parcours-icon" style={{ backgroundColor: 'rgba(30,47,35,0.1)' }}><Briefcase color="var(--color-forest)" /></div>
                <h3>{t("Pour mon entreprise", "For My Business")}</h3>
                <p>{t("Plateaux-repas, réunions de direction et événements corporatifs.", "Lunch boxes, board meetings, and corporate events.")}</p>
                <span className="parcours-link">{t("Portail Pro", "Pro Portal")} <ChevronRight size={16} /></span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. HISTOIRE "DE LA FLAMME À LA TABLE" */}
        <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-cacao)', color: 'var(--color-ivory)', position: 'relative' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
              <div>
                <span style={{ color: 'var(--color-terracotta)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>
                  {t("Le Voyage d'un Repas", "The Journey of a Meal")}
                </span>
                <h2 style={{ fontSize: '2.5rem', marginTop: '0.5rem' }}>
                  {t("De la flamme à la table", "From Flame to Table")}
                </h2>
              </div>
              <button 
                onClick={() => setStoryAutoplay(!storyAutoplay)}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'var(--color-ivory)',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {storyAutoplay ? <Pause size={16} /> : <Play size={16} />}
              </button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '3rem',
              alignItems: 'center'
            }}>
              {/* Left Side: Images projection */}
              <div style={{
                position: 'relative',
                height: '350px',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                border: '4px solid var(--color-cacao)'
              }}>
                {storySteps.map((step, idx) => (
                  <img
                    key={idx}
                    src={step.image}
                    alt={t(step.titleFr, step.titleEn)}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      opacity: storyStep === idx ? 1 : 0,
                      transform: storyStep === idx ? 'scale(1)' : 'scale(1.05)',
                      transition: animationsEnabled ? 'opacity 0.8s ease, transform 1.2s ease' : 'opacity 0.3s ease'
                    }}
                  />
                ))}
              </div>

              {/* Right Side: Step descriptions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {storySteps.map((step, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => { setStoryStep(idx); setStoryAutoplay(false); }}
                    style={{
                      padding: '1.2rem',
                      borderRadius: '16px',
                      backgroundColor: storyStep === idx ? 'rgba(200,92,50,0.1)' : 'transparent',
                      borderLeft: `4px solid ${storyStep === idx ? 'var(--color-terracotta)' : 'transparent'}`,
                      cursor: 'pointer',
                      transition: 'var(--transition-fast)'
                    }}
                  >
                    <h3 style={{ 
                      fontSize: '1.2rem', 
                      color: storyStep === idx ? 'var(--color-safran)' : 'var(--color-ivory)',
                      fontFamily: 'var(--font-sans)',
                      fontWeight: '600'
                    }}>
                      {t(step.titleFr, step.titleEn)}
                    </h3>
                    {storyStep === idx && (
                      <p style={{ color: 'var(--color-cream)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
                        {t(step.descFr, step.descEn)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 5, 6, 7. MEILLEURES VENTES & MENUS DU JOUR & MENUS FAMILIAUX */}
        <section style={{ padding: '6rem 0' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
              <div>
                <span style={{ color: 'var(--color-terracotta)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>
                  {t("Sélection Gourmet", "Gourmet Selection")}
                </span>
                <h2 style={{ fontSize: '2.5rem', marginTop: '0.5rem' }}>
                  {t("Nos Plats Vedettes", "Our Top Sellers")}
                </h2>
              </div>
              <button 
                onClick={() => triggerSauceReveal('var(--color-terracotta)', '/menu')}
                className="btn btn-secondary"
              >
                {t("Tout le menu", "Full Menu")}
              </button>
            </div>

            <div className="grid-catalog">
              {bestSellers.map((prod) => (
                <div key={prod.id} className="product-card" data-cursor="view">
                  <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden' }}>
                    <img src={prod.image} alt={t(prod.nameFr, prod.nameEn)} />
                    {prod.promoPrice && (
                      <span style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        backgroundColor: 'var(--color-bordeaux)',
                        color: 'var(--color-ivory)',
                        padding: '0.3rem 0.8rem',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        borderRadius: '20px'
                      }}>
                        PROMO
                      </span>
                    )}
                    {prod.spiceLevel > 0 && (
                      <span style={{
                        position: 'absolute',
                        bottom: '12px',
                        right: '12px',
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        color: 'var(--color-safran)',
                        padding: '0.2rem 0.6rem',
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px'
                      }}>
                        {'🌶️'.repeat(prod.spiceLevel)}
                      </span>
                    )}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', marginTop: '1rem', fontFamily: 'var(--font-sans)', fontWeight: '600' }}>
                    {t(prod.nameFr, prod.nameEn)}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', height: '50px', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '0.4rem' }}>
                    {t(prod.descriptionFr, prod.descriptionEn)}
                  </p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
                    <div>
                      {prod.promoPrice ? (
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--color-terracotta)' }}>{prod.promoPrice.toFixed(2)} $</span>
                          <span style={{ fontSize: '0.9rem', textDecoration: 'line-through', color: '#a08a7c' }}>{prod.price.toFixed(2)} $</span>
                        </div>
                      ) : (
                        <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{prod.price.toFixed(2)} $</span>
                      )}
                    </div>
                    <button 
                      onClick={() => addToCart(prod, 1)}
                      className="btn btn-primary"
                      style={{ padding: '0.5rem 1.2rem', fontSize: '0.8rem' }}
                    >
                      {t("Ajouter", "Add")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 20. EFFET « TABLE QUI SE COMPOSE » */}
        <section style={{ padding: '6rem 0', backgroundColor: 'var(--bg-secondary)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <span style={{ color: 'var(--color-terracotta)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>
                {t("Une Table Pour Tous", "A Table For All")}
              </span>
              <h2 style={{ fontSize: '2.5rem', marginTop: '0.5rem' }}>
                {t("Composez Votre Table", "Compose Your Table")}
              </h2>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0.5rem auto 0 auto' }}>
                {t(
                  "Visualisez votre banquet culinaire africain. Ajoutez des couverts et découvrez nos formules adaptées à votre groupe.",
                  "Visualize your culinary feast. Add covers and discover our menus customized for your group."
                )}
              </p>
            </div>

            <div className="table-composition-widget" style={{
              backgroundColor: 'var(--bg-primary)',
              borderRadius: '32px',
              padding: '3rem',
              boxShadow: '0 15px 40px rgba(44, 26, 17, 0.04)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '3rem',
              alignItems: 'center'
            }}>
              {/* Left representation of the table */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  width: '280px',
                  height: '280px',
                  borderRadius: '50%',
                  border: '8px solid var(--color-cacao)',
                  position: 'relative',
                  backgroundColor: 'var(--bg-secondary)',
                  boxShadow: 'inset 0 0 30px rgba(0,0,0,0.1)'
                }}>
                  {/* Virtual Plate items appearing dynamically based on selection */}
                  <div className="plate-item-circle" style={{ position: 'absolute', top: '20px', left: '100px', width: '60px', height: '60px', borderRadius: '50%', border: '2px solid var(--color-gold)', backgroundColor: 'var(--color-forest)', opacity: 0.8 }} />
                  <div className="plate-item-circle" style={{ position: 'absolute', top: '100px', left: '20px', width: '60px', height: '60px', borderRadius: '50%', border: '2px solid var(--color-gold)', backgroundColor: 'var(--color-terracotta)', opacity: 0.8 }} />
                  <div className="plate-item-circle" style={{ position: 'absolute', top: '100px', right: '20px', width: '60px', height: '60px', borderRadius: '50%', border: '2px solid var(--color-gold)', backgroundColor: '#7A6440', opacity: 0.8 }} />
                  <div className="plate-item-circle" style={{ position: 'absolute', bottom: '20px', left: '100px', width: '60px', height: '60px', borderRadius: '50%', border: '2px solid var(--color-gold)', backgroundColor: 'var(--color-bordeaux)', opacity: 0.8 }} />
                  
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center'
                  }}>
                    <span style={{ fontSize: '1.8rem', fontWeight: 'bold', fontFamily: 'var(--font-serif)' }}>OLI</span>
                  </div>
                </div>
              </div>

              {/* Right configuration panel */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h3>{t("Sélectionnez votre formule", "Select your package")}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="formule-row active">
                    <h4>{t("Repas Individuel", "Individual Meal")}</h4>
                    <p>{t("1 Plat Principal + 1 Boisson", "1 Main + 1 Drink")}</p>
                    <span style={{ fontWeight: 'bold' }}>25.00 $</span>
                  </div>
                  <div className="formule-row">
                    <h4>{t("Formule Duo", "Duo Feast")}</h4>
                    <p>{t("2 Plats Principaux + 1 Alloco + 2 Boissons", "2 Mains + 1 Alloco + 2 Drinks")}</p>
                    <span style={{ fontWeight: 'bold' }}>48.00 $</span>
                  </div>
                  <div className="formule-row">
                    <h4>{t("Menu Familial", "Family Pack")}</h4>
                    <p>{t("4 Plats + Accompagnements géants + Boissons", "4 Mains + Double sides + Drinks")}</p>
                    <span style={{ fontWeight: 'bold' }}>75.00 $</span>
                  </div>
                </div>
                <button 
                  onClick={() => triggerSauceReveal('var(--color-terracotta)', '/menu')}
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '1rem' }}
                >
                  {t("Choisir cette expérience", "Choose this experience")}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 11. GALERIE HORIZONTALE */}
        <section style={{ padding: '6rem 0', overflow: 'hidden' }}>
          <div className="container">
            <div style={{ marginBottom: '3rem' }}>
              <span style={{ color: 'var(--color-terracotta)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>
                {t("Instant Culinaires", "Culinary Moments")}
              </span>
              <h2 style={{ fontSize: '2.5rem', marginTop: '0.5rem' }}>
                {t("Galerie des Merveilles", "Gallery of Wonders")}
              </h2>
            </div>
            
            {/* Scrollable Gallery container */}
            <div className="horizontal-scroll-gallery" style={{
              display: 'flex',
              gap: '1.5rem',
              overflowX: 'auto',
              paddingBottom: '1.5rem',
              scrollbarWidth: 'thin'
            }} data-cursor="drag">
              {[
                { img: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80', title: t("Préparation", "Preparation") },
                { img: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=400&q=80', title: t("Buffet Traiteur", "Catering Buffet") },
                { img: 'https://images.unsplash.com/photo-1568254183919-78a4f43a2877?auto=format&fit=crop&w=400&q=80', title: t("Grillades au feu", "Fire Grills") },
                { img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80', title: t("Ndolé dressé", "Plated Ndole") },
                { img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80', title: t("Épices africaines", "African Spices") }
              ].map((item, idx) => (
                <div key={idx} style={{
                  flex: '0 0 280px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  position: 'relative',
                  height: '350px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.05)'
                }} className="gallery-slide">
                  <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
                    padding: '1.5rem',
                    color: 'var(--color-ivory)'
                  }}>
                    <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', fontWeight: 'bold' }}>{item.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 12. TÉMOIGNAGES VÉRIFIÉS */}
        <section style={{ padding: '6rem 0', backgroundColor: 'var(--bg-secondary)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <span style={{ color: 'var(--color-terracotta)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>
                {t("Retours Expérience", "Customer Feedback")}
              </span>
              <h2 style={{ fontSize: '2.5rem', marginTop: '0.5rem' }}>
                {t("Ce que disent nos clients", "What our guests say")}
              </h2>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem'
            }}>
              {testimonials.map((test, idx) => (
                <div key={idx} style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderRadius: '24px',
                  padding: '2rem',
                  boxShadow: '0 10px 30px rgba(44, 26, 17, 0.02)',
                  border: '1px solid rgba(44, 26, 17, 0.05)'
                }}>
                  <div style={{ display: 'flex', gap: '3px', color: 'var(--color-gold)', marginBottom: '1rem' }}>
                    {Array.from({ length: test.stars }).map((_, i) => <Star key={i} size={16} fill="var(--color-gold)" />)}
                  </div>
                  <p style={{ fontStyle: 'italic', fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
                    "{t(test.textFr, test.textEn)}"
                  </p>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 'bold', fontFamily: 'var(--font-sans)' }}>{test.name}</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-terracotta)', fontWeight: '500' }}>{test.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 14. ZONE DE LIVRAISON */}
        <section style={{ padding: '6rem 0' }}>
          <div className="container">
            <div className="delivery-card-wrapper" style={{
              backgroundColor: 'var(--color-cacao)',
              color: 'var(--color-ivory)',
              borderRadius: '32px',
              padding: '3rem',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                width: '200px',
                height: '200px',
                background: 'radial-gradient(circle, rgba(200,92,50,0.15) 0%, transparent 70%)',
                pointerEvents: 'none'
              }} />

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '3rem',
                alignItems: 'center',
                zIndex: 2,
                position: 'relative'
              }}>
                <div>
                  <span style={{ color: 'var(--color-safran)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>
                    {t("Proximité & Rapidité", "Local & Fast")}
                  </span>
                  <h2 style={{ fontSize: '2.5rem', marginTop: '0.5rem', color: 'var(--color-ivory)' }}>
                    {t("Livrons-nous chez vous ?", "Do we deliver to your doorstep ?")}
                  </h2>
                  <p style={{ color: 'var(--color-cream)', fontSize: '0.95rem', marginTop: '1rem' }}>
                    {t(
                      "Nous livrons dans les régions d'Ottawa et Gatineau. Entrez votre code postal pour vérifier l'éligibilité et calculer les frais.",
                      "We deliver in the Ottawa and Gatineau regions. Enter your postal code to verify eligibility and calculate fees."
                    )}
                  </p>
                </div>

                {/* Checker Form */}
                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  padding: '2rem',
                  borderRadius: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <form onSubmit={checkDelivery} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--color-cream)' }}>
                      {t("Code postal (ex: J8V 1C4, K1N 6N5)", "Postal code (e.g., J8V 1C4, K1N 6N5)")}
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input 
                        type="text" 
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="J8V 1C4"
                        style={{
                          flex: 1,
                          padding: '0.8rem 1.2rem',
                          borderRadius: '12px',
                          border: '1px solid rgba(255,255,255,0.2)',
                          backgroundColor: 'rgba(0,0,0,0.3)',
                          color: 'white',
                          fontSize: '1rem',
                          outline: 'none'
                        }}
                      />
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        style={{ borderRadius: '12px', padding: '0 1.5rem' }}
                      >
                        {t("Vérifier", "Verify")}
                      </button>
                    </div>
                  </form>

                  {/* Results output */}
                  {deliveryResult && (
                    <div style={{
                      marginTop: '1.5rem',
                      padding: '1rem',
                      borderRadius: '12px',
                      backgroundColor: deliveryResult.success ? 'rgba(30,47,35,0.4)' : 'rgba(92,29,36,0.4)',
                      border: `1px solid ${deliveryResult.success ? 'var(--color-forest)' : 'var(--color-bordeaux)'}`,
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.5rem'
                    }}>
                      <CheckCircle size={18} style={{ color: deliveryResult.success ? 'var(--color-safran)' : 'var(--color-bordeaux)', marginTop: '2px', flexShrink: 0 }} />
                      <p style={{ color: 'var(--color-ivory)' }}>
                        {t(deliveryResult.msgFr, deliveryResult.msgEn)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 16. APPEL FINAL À LA COMMANDE */}
        <section style={{ padding: '6rem 0', textAlign: 'center', backgroundColor: 'var(--bg-secondary)' }}>
          <div className="container" style={{ maxWidth: '700px' }}>
            <h2 style={{ fontSize: '3rem', fontFamily: 'var(--font-serif)', marginBottom: '1rem' }}>
              {t("L'Afrique s'invite à votre table", "Africa invites itself to your table")}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2.5rem' }}>
              {t(
                "N'attendez plus pour savourer le meilleur Ndolé et Poulet Yassa d'Ottawa-Gatineau. Frais, généreux et plein de soleil.",
                "Wait no longer to savor the best Ndole and Chicken Yassa in Ottawa-Gatineau. Fresh, generous, and full of sunshine."
              )}
            </p>
            <MagneticButton 
              className="btn btn-primary" 
              onClick={() => triggerSauceReveal('var(--color-terracotta)', '/menu')}
              dataCursor="order"
            >
              {t("Passer ma commande maintenant", "Place My Order Now")}
            </MagneticButton>
          </div>
        </section>

      </main>

      <style>{`
        /* Dynamic CSS Classes */
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background-color: rgba(255, 255, 255, 0.05);
          padding: 0.4rem 1rem;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .parcours-card {
          background-color: var(--bg-primary);
          border-radius: 24px;
          padding: 2rem;
          box-shadow: 0 10px 35px rgba(44, 26, 17, 0.02);
          border: 1px solid rgba(44, 26, 17, 0.05);
          transition: var(--transition-smooth);
        }
        .parcours-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 45px rgba(200, 92, 50, 0.06);
          border-color: rgba(200, 92, 50, 0.15);
        }
        .parcours-icon {
          width: 50px;
          height: 50px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }
        .parcours-card h3 {
          font-family: var(--font-sans);
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .parcours-card p {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
          height: 40px;
        }
        .parcours-link {
          font-size: 0.85rem;
          font-weight: bold;
          color: var(--color-terracotta);
          display: inline-flex;
          align-items: center;
          gap: 0.2rem;
        }
        .formule-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border-radius: 12px;
          border: 1px solid rgba(44, 26, 17, 0.08);
          cursor: pointer;
          transition: var(--transition-fast);
        }
        .formule-row:hover {
          border-color: var(--color-terracotta);
          background-color: rgba(200, 92, 50, 0.02);
        }
        .formule-row.active {
          border-color: var(--color-terracotta);
          background-color: rgba(200, 92, 50, 0.05);
        }
        .formule-row h4 {
          font-family: var(--font-sans);
          font-size: 1rem;
          font-weight: bold;
        }
        .formule-row p {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }
        @keyframes pulse {
          0% { opacity: 0.6; }
          100% { opacity: 1; }
        }
        .horizontal-scroll-gallery::-webkit-scrollbar {
          height: 6px;
        }
        .horizontal-scroll-gallery::-webkit-scrollbar-thumb {
          background-color: rgba(200, 92, 50, 0.2);
          border-radius: 3px;
        }
      `}</style>
    </>
  );
};

export default Home;
