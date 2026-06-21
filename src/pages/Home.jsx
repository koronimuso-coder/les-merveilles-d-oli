import React, { useState, useEffect, useRef } from 'react';
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

const SpiceGrinder = ({ language, t, playTick }) => {
  const canvasRef = useRef(null);
  const [activeSecret, setActiveSecret] = useState(null);
  const [grindStatus, setGrindStatus] = useState({
    penja: 0,
    djansang: 0,
    pebe: 0
  });

  const secrets = {
    penja: {
      titleFr: "Poivre Blanc de Penja ⚪",
      titleEn: "White Penja Pepper ⚪",
      descFr: "Cultivé sur des terres volcaniques au Cameroun. Secret : Il donne au Ndolé son piquant délicat et son parfum boisé inimitable.",
      descEn: "Grown in volcanic soils of Cameroon. Secret: It gives Ndole its delicate heat and inimitable woody aroma."
    },
    djansang: {
      titleFr: "Graines de Djansang 🟤",
      titleEn: "Djansang Seeds 🟤",
      descFr: "Graines d'arbres forestiers torréfiées. Secret : Moulues, elles épaississent naturellement la sauce et apportent une note de noisette grillée.",
      descEn: "Roasted wild forest seeds. Secret: Ground up, they naturally thicken the sauce and bring a roasted hazelnut note."
    },
    pebe: {
      titleFr: "Pébé (Fausse Muscade) 🟡",
      titleEn: "Pebe (African Nutmeg) 🟡",
      descFr: "Épice aromatique sauvage. Secret : Libère un arôme résineux et citronné indispensable pour parfumer le bouillon du Mafé.",
      descEn: "Wild aromatic nutmeg. Secret: Releases a resinous, citrusy aroma essential to flavor the Mafe stew."
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    let mouse = { x: 200, y: 200, lastX: 200, lastY: 200 };
    let particles = [];
    
    let spices = [
      { id: 'penja', nameFr: 'Penja', nameEn: 'Penja', x: 150, y: 170, r: 24, color: '#EBEBEB', textCol: '#2C1A11', hp: 5 },
      { id: 'djansang', nameFr: 'Djansang', nameEn: 'Djansang', x: 250, y: 190, r: 24, color: '#A06D48', textCol: '#FAF6F0', hp: 5 },
      { id: 'pebe', nameFr: 'Pébé', nameEn: 'Pebe', x: 200, y: 240, r: 24, color: '#CFA751', textCol: '#2C1A11', hp: 5 }
    ];

    const mortarCenter = { x: 200, y: 200 };
    const mortarRadius = 130;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.lastX = mouse.x;
      mouse.lastY = mouse.y;
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    const spawnParticles = (x, y, color) => {
      for (let i = 0; i < 6; i++) {
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 5,
          vy: (Math.random() - 0.5) * 5 - 1.5,
          alpha: 1,
          size: Math.random() * 4 + 2,
          decay: Math.random() * 0.04 + 0.02,
          color
        });
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.beginPath();
      ctx.arc(mortarCenter.x, mortarCenter.y, mortarRadius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(44, 26, 17, 0.06)';
      ctx.fill();
      ctx.lineWidth = 6;
      ctx.strokeStyle = 'var(--color-cacao)';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(mortarCenter.x, mortarCenter.y, mortarRadius - 10, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(44, 26, 17, 0.04)';
      ctx.fill();

      spices.forEach(sp => {
        if (sp.hp <= 0) return;

        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2);
        ctx.fillStyle = sp.color;
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = 'rgba(44, 26, 17, 0.15)';
        ctx.stroke();

        ctx.fillStyle = sp.textCol;
        ctx.font = 'bold 9.5px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(language === 'fr' ? sp.nameFr : sp.nameEn, sp.x, sp.y);

        const dist = Math.hypot(mouse.x - sp.x, mouse.y - sp.y);
        const speed = Math.hypot(mouse.x - mouse.lastX, mouse.y - mouse.lastY);

        if (dist < sp.r + 12 && speed > 3) {
          sp.hp -= 0.08;
          spawnParticles(sp.x, sp.y, sp.color);
          
          if (Math.random() < 0.18) {
            playTick();
          }

          const angle = Math.atan2(sp.y - mortarCenter.y, sp.x - mortarCenter.x);
          sp.x += Math.cos(angle) * 3;
          sp.y += Math.sin(angle) * 3;

          if (sp.hp <= 0) {
            playTick();
            setGrindStatus(prev => ({ ...prev, [sp.id]: 100 }));
            setActiveSecret(sp.id);
          }
        }

        const distFromCenter = Math.hypot(sp.x - mortarCenter.x, sp.y - mortarCenter.y);
        if (distFromCenter > mortarRadius - sp.r - 10) {
          const angle = Math.atan2(sp.y - mortarCenter.y, sp.x - mortarCenter.x);
          sp.x = mortarCenter.x + Math.cos(angle) * (mortarRadius - sp.r - 10);
          sp.y = mortarCenter.y + Math.sin(angle) * (mortarRadius - sp.r - 10);
        }
      });

      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(idx, 1);
          return;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.restore();
      });

      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = 'var(--color-terracotta)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 14, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(200,92,50,0.3)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [language, playTick]);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '3rem',
      alignItems: 'center',
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: '32px',
      padding: '3rem',
      boxShadow: '0 15px 40px rgba(44, 26, 17, 0.03)',
      border: '1px solid rgba(44, 26, 17, 0.05)',
      marginTop: '3rem'
    }}>
      <div>
        <span style={{ color: 'var(--color-terracotta)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>
          {t("Atelier Culinaire", "Culinary Workshop")}
        </span>
        <h3 style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', marginTop: '0.5rem' }}>
          {t("L'Atelier Secret des Épices", "The Secret Spice Atelier")}
        </h3>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.8rem', fontSize: '0.9rem', lineHeight: '1.6' }}>
          {t(
            "Le mortier traditionnel en bois est le cœur battant de la cuisine africaine. En écrasant nos épices sauvages à la main, nous libérons les huiles aromatiques qui confèrent à nos plats leur goût unique.",
            "The traditional wooden mortar is the heartbeat of African culinary arts. By grinding our wild forest spices by hand, we release the aromatic oils that give our signature dishes their unique depth."
          )}
        </p>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-terracotta)', fontWeight: 'bold', marginTop: '1rem' }}>
          💡 {t("Déplacez votre souris rapidement dans le mortier pour pilonner le Poivre de Penja, le Djansang et le Pébé !", "Move your cursor rapidly inside the mortar to pound Penja Pepper, Djansang, and Pebe!")}
        </p>

        {activeSecret && secrets[activeSecret] && (
          <div style={{
            marginTop: '1.5rem',
            padding: '1.2rem',
            borderRadius: '16px',
            backgroundColor: 'var(--bg-primary)',
            border: '1px solid rgba(200,92,50,0.15)',
            boxShadow: '0 5px 15px rgba(0,0,0,0.02)',
            animation: 'fade-in 0.4s ease'
          }}>
            <h4 style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--color-terracotta)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              ✨ {t(secrets[activeSecret].titleFr, secrets[activeSecret].titleEn)}
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.4rem', lineHeight: '1.5' }}>
              {t(secrets[activeSecret].descFr, secrets[activeSecret].descEn)}
            </p>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <canvas 
          ref={canvasRef} 
          width="400" 
          height="400" 
          style={{ 
            maxWidth: '100%', 
            borderRadius: '50%', 
            backgroundColor: 'var(--bg-primary)',
            border: '1px solid rgba(44,26,11,0.06)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.03)'
          }} 
        />
      </div>
    </div>
  );
};

const Home = () => {
  const { language, t, siteSettings, animationsEnabled, setAnimationsEnabled, playTick } = useApp();
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

        {/* 4b. EXPLORATEUR D'INGRÉDIENTS INTERACTIF ("DE LA TERRE À L'ASSIETTE") */}
        <section style={{ padding: '6rem 0', backgroundColor: 'var(--bg-secondary)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <span style={{ color: 'var(--color-terracotta)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>
                {t("Épices et Terroir", "Spices & Sourcing")}
              </span>
              <h2 style={{ fontSize: '2.5rem', marginTop: '0.5rem', fontFamily: 'var(--font-serif)' }}>
                {t("Les Secrets de Nos Ingrédients", "Our Secret Premium Ingredients")}
              </h2>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0.5rem auto 0 auto' }}>
                {t(
                  "Chaque plat tire sa force d'ingrédients d'exception sourcés de manière éthique, combinant épices du terroir africain et fraîcheur locale.",
                  "Each dish owes its character to exceptional ingredients ethically sourced, blending authentic African spices with local freshness."
                )}
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem'
            }}>
              {[
                {
                  nameFr: "Poivre de Penja (Cameroun)",
                  nameEn: "Penja Pepper (Cameroon)",
                  descFr: "Le premier produit du terroir africain à obtenir une Indication Géographique Protégée. Cultivé sur des terres volcaniques, il offre des arômes boisés et une puissance aromatique unique qui parfume nos viandes braisées.",
                  descEn: "The first African product to receive a Protected Geographical Indication (PGI). Grown in volcanic soils, it delivers unique woody notes and an aromatic punch that elevates our braised meats.",
                  benefitFr: "Digeste, antioxydant et riche en piperine stimulante.",
                  benefitEn: "Aids digestion, rich in antioxidants and active piperine.",
                  origin: "Province du Littoral, Cameroun",
                  icon: "🌶️"
                },
                {
                  nameFr: "Herbes de Ndolé Sauvages",
                  nameEn: "Wild Bitterleaves (Ndole)",
                  descFr: "Les feuilles de vernonia (ndolé) sont rigoureusement sélectionnées, rincées et blanchies plusieurs fois selon la méthode ancestrale pour conserver leurs vertus thérapeutiques tout en adoucissant leur amertume.",
                  descEn: "Vernonia leaves (ndole) are rigorously selected, washed, and blanched multiple times following ancestral techniques to retain therapeutic benefits while softening their natural bitterness.",
                  benefitFr: "Purifiant, tonique hépatique et riche en sels minéraux.",
                  benefitEn: "Detoxifying, liver tonic, and packed with essential minerals.",
                  origin: "Régions forestières d'Afrique Centrale",
                  icon: "🌿"
                },
                {
                  nameFr: "Banane Plantain Artisanale",
                  nameEn: "Artisanal Sweet Plantain",
                  descFr: "Nos bananes plantains sont mûries à point de manière 100% naturelle jusqu'à ce que leur sucre soit parfaitement concentré. Elles sont ensuite frites à température contrôlée pour obtenir un Alloco croustillant à l'extérieur et fondant à l'intérieur.",
                  descEn: "Our plantains are ripened naturally until their sugars are fully concentrated. They are fried at a monitored temperature to guarantee Alloco that is crispy on the outside and melting on the inside.",
                  benefitFr: "Excellente source de potassium, fibres et glucides complexes.",
                  benefitEn: "Rich in potassium, dietary fibers, and complex energy carbs.",
                  origin: "Ottawa-Gatineau (Marchés locaux & importations éthiques)",
                  icon: "🍌"
                }
              ].map((ing, idx) => (
                <div 
                  key={idx}
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderRadius: '24px',
                    padding: '2.5rem',
                    boxShadow: '0 15px 35px rgba(44, 26, 17, 0.03)',
                    border: '1px solid rgba(44, 26, 17, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.2rem',
                    transition: 'all 0.3s ease',
                    cursor: 'default'
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 20px 45px rgba(200,92,50,0.08)';
                    e.currentTarget.style.borderColor = 'var(--color-terracotta)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(44, 26, 17, 0.03)';
                    e.currentTarget.style.borderColor = 'rgba(44, 26, 17, 0.05)';
                  }}
                >
                  <div style={{
                    fontSize: '2.5rem',
                    width: '60px',
                    height: '60px',
                    borderRadius: '16px',
                    backgroundColor: 'rgba(200,92,50,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {ing.icon}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>
                      {t(ing.nameFr, ing.nameEn)}
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-terracotta)', fontWeight: 'bold', textTransform: 'uppercase' }}>
                      📍 {ing.origin}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    {t(ing.descFr, ing.descEn)}
                  </p>
                  <div style={{
                    marginTop: 'auto',
                    borderTop: '1px dashed rgba(44,26,11,0.1)',
                    paddingTop: '1rem',
                    fontSize: '0.8rem',
                    color: 'var(--color-forest)',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    💚 {t("Bienfait :", "Health benefit:")} {t(ing.benefitFr, ing.benefitEn)}
                  </div>
                </div>
              ))}
            </div>

            {/* Atelier Secret des Épices (Interactive Mortar Canvas) */}
            <SpiceGrinder language={language} t={t} playTick={playTick} />
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

        {/* 15. FAQ ACCORDÉON INTERACTIF */}
        <section style={{ padding: '6rem 0' }}>
          <div className="container" style={{ maxWidth: '800px' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <span style={{ color: 'var(--color-terracotta)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>
                {t("Des Réponses à Vos Questions", "Frequently Asked Questions")}
              </span>
              <h2 style={{ fontSize: '2.5rem', marginTop: '0.5rem', fontFamily: 'var(--font-serif)' }}>
                {t("Questions Fréquentes", "Frequently Asked Questions")}
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                {t(
                  "Trouvez rapidement les réponses concernant la livraison à Ottawa-Gatineau, les allergènes et nos services traiteur.",
                  "Find quick answers regarding delivery in Ottawa-Gatineau, allergens, and our catering services."
                )}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                {
                  qFr: "Quels sont vos délais de préparation et de livraison ?",
                  qEn: "What are your preparation and delivery times?",
                  aFr: "Nos plats traditionnels comme le Ndolé ou le Mafé de bœuf sont préparés fraîchement le jour même. Pour la livraison directe à Ottawa-Gatineau, prévoyez un délai de 45 à 60 minutes selon l'affluence. Pour le service traiteur événementiel, nous recommandons de soumettre votre devis au moins 7 jours à l'avance.",
                  aEn: "Our traditional dishes like Ndole or Beef Mafe are freshly prepared daily. For direct delivery in Ottawa-Gatineau, expect 45 to 60 minutes depending on peak hours. For event catering, we recommend requesting your quote at least 7 days in advance."
                },
                {
                  qFr: "Comment réchauffer mes plats pour conserver leur goût d'origine ?",
                  qEn: "How do I reheat my meals to preserve their original taste?",
                  aFr: "Un guide de dégustation interactif est disponible sur votre écran de suivi après achat. En règle générale, privilégiez un réchauffage doux à la casserole avec une cuillère d'eau pour le Ndolé et le Mafé, et le four traditionnel à 180°C pour redonner du croustillant aux Pastels de poisson.",
                  aEn: "An interactive tasting guide is available on your tracking screen after purchase. Generally, prefer gentle reheating in a pot with a spoonful of water for Ndole and Mafe, and a traditional oven at 180°C to restore crispiness to fish Pastels."
                },
                {
                  qFr: "Gérez-vous les allergies alimentaires et régimes spéciaux ?",
                  qEn: "Do you accommodate food allergies and special diets?",
                  aFr: "Absolument. Notre menu dispose d'un filtre d'allergènes exclusif (Safe Dining Mode) pour exclure les arachides, le gluten, les crevettes et la moutarde. Les plats non compatibles s'estompent visuellement pour assurer votre sécurité. Nous proposons également plusieurs accompagnements et plats végétariens.",
                  aEn: "Absolutely. Our menu features a dedicated allergen filter (Safe Dining Mode) to screen out peanuts, gluten, shellfish, and mustard. Incompatible dishes fade out visually to ensure your safety. We also offer several vegetarian sides and courses."
                },
                {
                  qFr: "Comment se déroule la facturation pour les entreprises ?",
                  qEn: "How does billing work for corporate accounts?",
                  aFr: "Dans notre Portail Entreprise, vous pouvez soumettre une demande pour activer un compte pro. Une fois validé, votre entreprise bénéficie d'une facturation mensuelle consolidée fin de mois, de budgets alloués par département et de la possibilité de créer des commandes groupées d'équipe en un clic.",
                  aEn: "Through our Corporate Portal, you can request account activation. Once approved, your business gains access to consolidated monthly invoicing, departmental budgets, and one-click group ordering links for team lunches."
                }
              ].map((faq, fIdx) => (
                <details 
                  key={fIdx}
                  style={{
                    padding: '1.2rem 1.5rem',
                    borderRadius: '16px',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid rgba(44,26,11,0.05)',
                    fontSize: '0.95rem',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <summary style={{ fontWeight: 'bold', cursor: 'pointer', outline: 'none', color: 'var(--text-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{t(faq.qFr, faq.qEn)}</span>
                  </summary>
                  <p style={{ color: 'var(--text-secondary)', marginTop: '0.8rem', lineHeight: '1.6', fontSize: '0.9rem' }}>
                    {t(faq.aFr, faq.aEn)}
                  </p>
                </details>
              ))}
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
