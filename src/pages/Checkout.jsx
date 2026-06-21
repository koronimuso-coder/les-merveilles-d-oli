import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/db';
import { 
  ShoppingBag, 
  User, 
  MapPin, 
  Calendar, 
  CreditCard, 
  CheckCircle, 
  Plus, 
  Minus, 
  Trash2, 
  MessageSquare,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

const Checkout = () => {
  const { cartItems, updateQuantity, removeFromCart, getSubtotal, getTaxes, clearCart } = useCart();
  const { siteSettings, language, t } = useApp();
  const { currentUser, userProfile } = useAuth();
  
  // Funnel steps: 1 = Cart, 2 = Info, 3 = Method & Address, 4 = Date & Time, 5 = Payment, 6 = Success
  const [step, setStep] = useState(1);
  
  // Checkout Form States
  const [customerName, setCustomerName] = useState(userProfile?.displayName || '');
  const [customerPhone, setCustomerPhone] = useState(userProfile?.phone || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  
  const [deliveryType, setDeliveryType] = useState('pickup'); // 'pickup' | 'delivery'
  const [streetAddress, setStreetAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [landmark, setLandmark] = useState('');
  
  const [orderDate, setOrderDate] = useState('');
  const [orderTime, setOrderTime] = useState('');
  
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);

  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'whatsapp'
  const [ccNumber, setCcNumber] = useState('');
  const [ccExpiry, setCcExpiry] = useState('');
  const [ccCvc, setCcCvc] = useState('');
  
  const [placedOrder, setPlacedOrder] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Calculations
  const subtotal = getSubtotal();
  const discountAmount = subtotal * (promoDiscount / 100);
  const taxableAmount = subtotal - discountAmount;
  const taxes = getTaxes(taxableAmount);
  const deliveryFee = deliveryType === 'delivery' ? (postalCode.toUpperCase().startsWith('K') ? 10.00 : 5.00) : 0;
  const total = taxableAmount + taxes + deliveryFee;

  // Confetti helper
  const triggerConfettiEffect = async () => {
    try {
      const confetti = (await import('canvas-confetti')).default;
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    } catch (e) {
      console.log("Confetti effect bypass (module not loaded yet)");
    }
  };

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'OLI10') {
      setPromoDiscount(10); // 10% discount
      alert(t("Code promotionnel OLI10 appliqué : -10% !", "Promo code OLI10 applied: -10%!"));
    } else {
      alert(t("Code invalide.", "Invalid code."));
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const orderData = {
      uid: currentUser?.uid || 'guest',
      customerName,
      phone: customerPhone,
      email: customerEmail,
      type: deliveryType,
      address: deliveryType === 'delivery' ? {
        street: streetAddress,
        postalCode: postalCode.toUpperCase(),
        landmark
      } : null,
      deliverySlot: {
        date: orderDate,
        time: orderTime
      },
      items: cartItems.map(item => ({
        productId: item.product.id,
        nameFr: item.product.nameFr,
        nameEn: item.product.nameEn,
        quantity: item.quantity,
        price: item.product.promoPrice || item.product.price,
        selectedOptions: item.selectedOptions
      })),
      subtotal,
      discount: discountAmount,
      taxes,
      deliveryFee,
      total,
      paymentMethod,
      paymentStatus: paymentMethod === 'card' ? 'paid' : 'pending'
    };

    try {
      const result = await createOrder(orderData);
      setPlacedOrder(result);
      clearCart();
      setStep(6); // Success screen
      triggerConfettiEffect();
    } catch (error) {
      console.error(error);
      alert(t("Une erreur est survenue lors de la commande.", "An error occurred while placing your order."));
    } finally {
      setSubmitting(false);
    }
  };

  // Generate WhatsApp message structure
  const getWhatsAppMessage = () => {
    if (!placedOrder) return '';
    
    const itemsList = placedOrder.items
      .map(item => `- ${item.quantity}x ${item.nameFr || item.nameEn}`)
      .join('\n');
      
    const methodStr = placedOrder.type === 'delivery' 
      ? `Livraison à : ${placedOrder.address.street}, ${placedOrder.address.postalCode}`
      : 'Retrait à Gatineau (40 chemin des Érables)';

    return encodeURIComponent(`Bonjour LES MERVEILLES D’OLI,

Je souhaite confirmer ma commande ${placedOrder.orderNumber}.

Nom : ${placedOrder.customerName}
Téléphone : ${placedOrder.phone}
Livraison ou retrait : ${methodStr}
Date : ${placedOrder.deliverySlot.date}
Heure : ${placedOrder.deliverySlot.time}

Articles :
${itemsList}

Sous-total : ${placedOrder.subtotal.toFixed(2)} $
Taxes : ${placedOrder.taxes.toFixed(2)} $
Livraison : ${placedOrder.deliveryFee.toFixed(2)} $
Total : ${placedOrder.total.toFixed(2)} $

Adresse ou instructions : ${placedOrder.address?.landmark || 'Aucune'}

Merci de me confirmer la disponibilité.`);
  };

  return (
    <main style={{ padding: '120px 0 60px 0', backgroundColor: 'var(--bg-primary)', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        
        {/* Progress Bar Header */}
        {step < 6 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem', fontSize: '0.8rem', fontWeight: 'bold' }}>
            <span style={{ color: step >= 1 ? 'var(--color-terracotta)' : '#ccc' }}>1. {t("Panier", "Cart")}</span>
            <span style={{ color: step >= 2 ? 'var(--color-terracotta)' : '#ccc' }}>2. {t("Coordonnées", "Details")}</span>
            <span style={{ color: step >= 3 ? 'var(--color-terracotta)' : '#ccc' }}>3. {t("Livraison", "Delivery")}</span>
            <span style={{ color: step >= 4 ? 'var(--color-terracotta)' : '#ccc' }}>4. {t("Horaire", "Time")}</span>
            <span style={{ color: step >= 5 ? 'var(--color-terracotta)' : '#ccc' }}>5. {t("Paiement", "Payment")}</span>
          </div>
        )}

        {/* STEP 1: CART VIEW */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <h2 style={{ fontFamily: 'var(--font-sans)', fontWeight: 'bold', fontSize: '1.8rem' }}>
              <ShoppingBag style={{ marginRight: '10px', verticalAlign: 'middle' }} /> {t("Votre Panier", "Your Cart")}
            </h2>
            {cartItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <p style={{ color: 'var(--text-secondary)' }}>{t("Votre panier est vide.", "Your cart is empty.")}</p>
                <button onClick={() => setStep(6)} style={{ display: 'none' }} /> {/* hidden hack */}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {cartItems.map((item) => (
                  <div key={item.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: '16px',
                    border: '1px solid rgba(44, 26, 17, 0.05)'
                  }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <img src={item.product.image} alt="" style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover' }} />
                      <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 'bold' }}>{t(item.product.nameFr, item.product.nameEn)}</h4>
                        {Object.entries(item.selectedOptions).map(([optName, choice]) => (
                          <span key={optName} style={{ fontSize: '0.75rem', color: 'var(--color-terracotta)', marginRight: '10px' }}>
                            {optName}: {t(choice.nameFr, choice.nameEn)} (+{choice.extraPrice.toFixed(2)} $)
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--bg-primary)', padding: '0.3rem 0.6rem', borderRadius: '20px' }}>
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ border: 'none', background: 'transparent' }}><Minus size={14} /></button>
                        <span style={{ fontSize: '0.9rem', fontWeight: 'bold', width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ border: 'none', background: 'transparent' }}><Plus size={14} /></button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} style={{ border: 'none', background: 'transparent', color: 'var(--color-bordeaux)' }}><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}

                {/* Promo Code input */}
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <input 
                    type="text" 
                    placeholder={t("Code promo (ex: OLI10)", "Promo code (e.g. OLI10)")} 
                    value={promoCode} 
                    onChange={e => setPromoCode(e.target.value)}
                    style={{ padding: '0.8rem 1.2rem', borderRadius: '12px', border: '1px solid rgba(44,26,11,0.1)', outline: 'none', flex: 1 }}
                  />
                  <button onClick={handleApplyPromo} className="btn btn-secondary" style={{ padding: '0 1.5rem', borderRadius: '12px' }}>
                    {t("Appliquer", "Apply")}
                  </button>
                </div>

                {/* Summary Box */}
                <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '16px', marginTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>{t("Sous-total :", "Subtotal:")}</span>
                    <span>{subtotal.toFixed(2)} $</span>
                  </div>
                  {discountAmount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--color-terracotta)' }}>
                      <span>{t("Réduction :", "Discount:")}</span>
                      <span>-{discountAmount.toFixed(2)} $</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '0.5rem' }}>
                    <span>{t("Total estimé :", "Estimated Total:")}</span>
                    <span>{(subtotal - discountAmount).toFixed(2)} $</span>
                  </div>
                </div>

                <button onClick={() => setStep(2)} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                  {t("Continuer la commande", "Proceed to details")} <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: USER INFO */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <h2 style={{ fontFamily: 'var(--font-sans)', fontWeight: 'bold', fontSize: '1.8rem' }}>
              <User style={{ marginRight: '10px', verticalAlign: 'middle' }} /> {t("Vos Coordonnées", "Your Information")}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.3rem' }}>{t("Nom complet", "Full Name")}</label>
                <input 
                  type="text" 
                  value={customerName} 
                  onChange={e => setCustomerName(e.target.value)}
                  style={{ width: '100%', padding: '0.8rem 1.2rem', borderRadius: '12px', border: '1px solid rgba(44,26,11,0.1)' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.3rem' }}>{t("Téléphone", "Phone number")}</label>
                <input 
                  type="tel" 
                  value={customerPhone} 
                  onChange={e => setCustomerPhone(e.target.value)}
                  style={{ width: '100%', padding: '0.8rem 1.2rem', borderRadius: '12px', border: '1px solid rgba(44,26,11,0.1)' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.3rem' }}>{t("Courriel", "Email address")}</label>
                <input 
                  type="email" 
                  value={customerEmail} 
                  onChange={e => setCustomerEmail(e.target.value)}
                  style={{ width: '100%', padding: '0.8rem 1.2rem', borderRadius: '12px', border: '1px solid rgba(44,26,11,0.1)' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button onClick={() => setStep(1)} className="btn btn-secondary" style={{ flex: 1 }}>
                  <ArrowLeft size={16} style={{ marginRight: '8px' }} /> {t("Retour", "Back")}
                </button>
                <button 
                  onClick={() => {
                    if (!customerName || !customerPhone || !customerEmail) {
                      alert(t("Veuillez remplir tous les champs.", "Please fill in all fields."));
                      return;
                    }
                    setStep(3);
                  }} 
                  className="btn btn-primary" 
                  style={{ flex: 1 }}
                >
                  {t("Continuer", "Continue")} <ArrowRight size={16} style={{ marginLeft: '8px' }} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: PICKUP OR DELIVERY */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <h2 style={{ fontFamily: 'var(--font-sans)', fontWeight: 'bold', fontSize: '1.8rem' }}>
              <MapPin style={{ marginRight: '10px', verticalAlign: 'middle' }} /> {t("Mode de réception", "Receipt Method")}
            </h2>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={() => setDeliveryType('pickup')}
                style={{
                  flex: 1,
                  padding: '1.5rem',
                  borderRadius: '16px',
                  border: `2px solid ${deliveryType === 'pickup' ? 'var(--color-terracotta)' : 'rgba(44,26,11,0.08)'}`,
                  backgroundColor: deliveryType === 'pickup' ? 'rgba(200, 92, 50, 0.03)' : 'transparent',
                  textAlign: 'center',
                  cursor: 'pointer'
                }}
              >
                <h4>🏪 {t("Retrait (Gatineau)", "Pick-up (Gatineau)")}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>{t("Gratuit - Prêt à Gatineau", "Free - Ready in Gatineau")}</p>
              </button>
              
              <button 
                onClick={() => setDeliveryType('delivery')}
                style={{
                  flex: 1,
                  padding: '1.5rem',
                  borderRadius: '16px',
                  border: `2px solid ${deliveryType === 'delivery' ? 'var(--color-terracotta)' : 'rgba(44,26,11,0.08)'}`,
                  backgroundColor: deliveryType === 'delivery' ? 'rgba(200, 92, 50, 0.03)' : 'transparent',
                  textAlign: 'center',
                  cursor: 'pointer'
                }}
              >
                <h4>🚚 {t("Livraison à domicile", "Home Delivery")}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>{t("Ottawa (10 $) ou Gatineau (5 $)", "Ottawa ($10) or Gatineau ($5)")}</p>
              </button>
            </div>

            {deliveryType === 'delivery' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.3rem' }}>{t("Adresse civique", "Street Address")}</label>
                  <input 
                    type="text" 
                    value={streetAddress} 
                    onChange={e => setStreetAddress(e.target.value)}
                    placeholder="123 rue Principale"
                    style={{ width: '100%', padding: '0.8rem 1.2rem', borderRadius: '12px', border: '1px solid rgba(44,26,11,0.1)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.3rem' }}>{t("Code postal", "Postal Code")}</label>
                  <input 
                    type="text" 
                    value={postalCode} 
                    onChange={e => setPostalCode(e.target.value)}
                    placeholder="J8V 1C4"
                    style={{ width: '100%', padding: '0.8rem 1.2rem', borderRadius: '12px', border: '1px solid rgba(44,26,11,0.1)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.3rem' }}>{t("Instructions (Appartement, repères)", "Instructions (Apt, landmarks)")}</label>
                  <input 
                    type="text" 
                    value={landmark} 
                    onChange={e => setLandmark(e.target.value)}
                    placeholder="Appt 202, à côté de la bibliothèque"
                    style={{ width: '100%', padding: '0.8rem 1.2rem', borderRadius: '12px', border: '1px solid rgba(44,26,11,0.1)' }}
                  />
                </div>
              </div>
            )}

            {deliveryType === 'pickup' && (
              <div style={{ padding: '1.2rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid rgba(44,26,11,0.08)' }}>
                <p>📍 <strong>{t("Adresse de retrait :", "Pick-up Address:")}</strong> {siteSettings.address}</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                  {t(
                    "Présentez-vous à notre point de retrait à l'heure sélectionnée. Vous recevrez une notification par SMS/WhatsApp dès que votre commande sera prête.",
                    "Please arrive at our pick-up location at the selected slot. You will be notified via SMS/WhatsApp once ready."
                  )}
                </p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button onClick={() => setStep(2)} className="btn btn-secondary" style={{ flex: 1 }}>
                <ArrowLeft size={16} style={{ marginRight: '8px' }} /> {t("Retour", "Back")}
              </button>
              <button 
                onClick={() => {
                  if (deliveryType === 'delivery' && (!streetAddress || !postalCode)) {
                    alert(t("Veuillez saisir votre adresse de livraison.", "Please enter your delivery address."));
                    return;
                  }
                  setStep(4);
                }} 
                className="btn btn-primary" 
                style={{ flex: 1 }}
              >
                {t("Continuer", "Continue")} <ArrowRight size={16} style={{ marginLeft: '8px' }} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: DATE & TIME */}
        {step === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <h2 style={{ fontFamily: 'var(--font-sans)', fontWeight: 'bold', fontSize: '1.8rem' }}>
              <Calendar style={{ marginRight: '10px', verticalAlign: 'middle' }} /> {t("Planification", "Schedule Order")}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.3rem' }}>{t("Date de retrait / livraison", "Date")}</label>
                <input 
                  type="date" 
                  value={orderDate} 
                  onChange={e => setOrderDate(e.target.value)}
                  style={{ width: '100%', padding: '0.8rem 1.2rem', borderRadius: '12px', border: '1px solid rgba(44,26,11,0.1)' }}
                  required
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.3rem' }}>{t("Heure (Créneau de 30 minutes)", "Time Slot")}</label>
                <select 
                  value={orderTime} 
                  onChange={e => setOrderTime(e.target.value)}
                  style={{ width: '100%', padding: '0.8rem 1.2rem', borderRadius: '12px', border: '1px solid rgba(44,26,11,0.1)' }}
                  required
                >
                  <option value="">-- {t("Choisir un créneau", "Select slot")} --</option>
                  <option value="11:30 - 12:00">11:30 - 12:00</option>
                  <option value="12:00 - 12:30">12:00 - 12:30</option>
                  <option value="12:30 - 13:00">12:30 - 13:00</option>
                  <option value="13:00 - 13:30">13:00 - 13:30</option>
                  <option value="17:30 - 18:00">17:30 - 18:00</option>
                  <option value="18:00 - 18:30">18:00 - 18:30</option>
                  <option value="18:30 - 19:00">18:30 - 19:00</option>
                  <option value="19:00 - 19:30">19:00 - 19:30</option>
                  <option value="19:30 - 20:00">19:30 - 20:00</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button onClick={() => setStep(3)} className="btn btn-secondary" style={{ flex: 1 }}>
                <ArrowLeft size={16} style={{ marginRight: '8px' }} /> {t("Retour", "Back")}
              </button>
              <button 
                onClick={() => {
                  if (!orderDate || !orderTime) {
                    alert(t("Veuillez sélectionner un jour et un créneau.", "Please choose a day and time slot."));
                    return;
                  }
                  setStep(5);
                }} 
                className="btn btn-primary" 
                style={{ flex: 1 }}
              >
                {t("Continuer", "Continue")} <ArrowRight size={16} style={{ marginLeft: '8px' }} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: QUIET PAYMENT METHOD */}
        {step === 5 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <h2 style={{ fontFamily: 'var(--font-sans)', fontWeight: 'bold', fontSize: '1.8rem' }}>
              <CreditCard style={{ marginRight: '10px', verticalAlign: 'middle' }} /> {t("Paiement & Mode", "Payment Method")}
            </h2>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={() => setPaymentMethod('card')}
                style={{
                  flex: 1,
                  padding: '1.2rem',
                  borderRadius: '16px',
                  border: `2px solid ${paymentMethod === 'card' ? 'var(--color-terracotta)' : 'rgba(44,26,11,0.08)'}`,
                  backgroundColor: paymentMethod === 'card' ? 'rgba(200, 92, 50, 0.03)' : 'transparent',
                  textAlign: 'center',
                  cursor: 'pointer'
                }}
              >
                💳 {t("Carte de crédit (Simulé)", "Credit Card (Simulated)")}
              </button>
              
              <button 
                onClick={() => setPaymentMethod('whatsapp')}
                style={{
                  flex: 1,
                  padding: '1.2rem',
                  borderRadius: '16px',
                  border: `2px solid ${paymentMethod === 'whatsapp' ? 'var(--color-terracotta)' : 'rgba(44,26,11,0.08)'}`,
                  backgroundColor: paymentMethod === 'whatsapp' ? 'rgba(200, 92, 50, 0.03)' : 'transparent',
                  textAlign: 'center',
                  cursor: 'pointer'
                }}
              >
                💬 {t("Confirmation WhatsApp", "WhatsApp Confirmation")}
              </button>
            </div>

            {paymentMethod === 'card' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.2rem' }}>{t("Numéro de carte", "Card number")}</label>
                  <input 
                    type="text" 
                    placeholder="4000 1234 5678 9010" 
                    value={ccNumber} 
                    onChange={e => setCcNumber(e.target.value)}
                    style={{ width: '100%', padding: '0.8rem 1.2rem', borderRadius: '12px', border: '1px solid rgba(44,26,11,0.1)' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.2rem' }}>{t("Expiration", "Expiration")}</label>
                    <input 
                      type="text" 
                      placeholder="MM/AA" 
                      value={ccExpiry} 
                      onChange={e => setCcExpiry(e.target.value)}
                      style={{ width: '100%', padding: '0.8rem 1.2rem', borderRadius: '12px', border: '1px solid rgba(44,26,11,0.1)' }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.2rem' }}>CVC</label>
                    <input 
                      type="text" 
                      placeholder="123" 
                      value={ccCvc} 
                      onChange={e => setCcCvc(e.target.value)}
                      style={{ width: '100%', padding: '0.8rem 1.2rem', borderRadius: '12px', border: '1px solid rgba(44,26,11,0.1)' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'whatsapp' && (
              <div style={{ padding: '1.2rem', backgroundColor: 'rgba(30,47,35,0.05)', borderRadius: '16px', border: '1px solid var(--color-forest)' }}>
                <p>💬 <strong>{t("Commande finalisée sur WhatsApp", "Finalize order via WhatsApp")}</strong></p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                  {t(
                    "Vous validerez les détails du paiement (e-transfer ou comptant au retrait) directement par message structuré sur notre WhatsApp.",
                    "You will validate payment details (e-transfer or cash on pick-up) directly through a structured message on our WhatsApp."
                  )}
                </p>
              </div>
            )}

            {/* Recap Invoice details */}
            <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '16px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem' }}>{t("Résumé de la facture", "Invoice Summary")}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContext: 'space-between', justifyContent: 'space-between' }}>
                  <span>{t("Sous-total :", "Subtotal:")}</span>
                  <span>{subtotal.toFixed(2)} $</span>
                </div>
                {discountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-terracotta)' }}>
                    <span>{t("Réduction :", "Discount:")}</span>
                    <span>-{discountAmount.toFixed(2)} $</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{t("Taxes (GST/QST) :", "Taxes:")}</span>
                  <span>{taxes.toFixed(2)} $</span>
                </div>
                {deliveryType === 'delivery' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{t("Frais de livraison :", "Delivery fee:")}</span>
                    <span>{deliveryFee.toFixed(2)} $</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                  <span>Total :</span>
                  <span>{total.toFixed(2)} $</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button onClick={() => setStep(4)} className="btn btn-secondary" style={{ flex: 1 }}>
                <ArrowLeft size={16} style={{ marginRight: '8px' }} /> {t("Retour", "Back")}
              </button>
              <button 
                onClick={handlePlaceOrder}
                disabled={submitting}
                className="btn btn-primary" 
                style={{ flex: 1 }}
              >
                {submitting ? t("Traitement...", "Processing...") : t("Confirmer et payer", "Place Order")}
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: SUCCESS & CELEBRATION (WhatsApp Generator) */}
        {step === 6 && placedOrder && (
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center', padding: '2rem 0' }}>
            
            {/* Draw plate animation simulation */}
            <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContext: 'center', justifyContent: 'center' }}>
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                border: '6px solid var(--color-terracotta)',
                animation: 'pulse 1s infinite alternate'
              }} />
              <CheckCircle size={60} color="var(--color-safran)" style={{ zIndex: 2 }} />
            </div>

            <div>
              <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-serif)' }}>
                {t("Votre commande est entre de bonnes mains.", "Your order is in good hands.")}
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', maxWidth: '500px', margin: '0.5rem auto 0 auto' }}>
                {t(
                  "Merci de faire confiance aux Merveilles d'Oli. Nous commençons la préparation avec passion.",
                  "Thank you for choosing Les Merveilles d'Oli. We begin preparation with passion."
                )}
              </p>
            </div>

            {/* Receipt Summary Box */}
            <div style={{
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: '24px',
              padding: '2rem',
              width: '100%',
              maxWidth: '500px',
              border: '1px solid rgba(44, 26, 17, 0.05)',
              textAlign: 'left'
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '0.8rem', marginBottom: '1rem', color: 'var(--color-terracotta)' }}>
                {t("Détail de la commande", "Order Details")}
              </h3>
              <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}><strong>{t("Numéro :", "Number:")}</strong> {placedOrder.orderNumber}</p>
              <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}><strong>{t("Statut :", "Status:")}</strong> {t("Reçue / En attente de confirmation", "Received / Pending confirmation")}</p>
              <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}><strong>{t("Créneau choisi :", "Selected slot:")}</strong> {placedOrder.deliverySlot.date} ({placedOrder.deliverySlot.time})</p>
              <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}><strong>{t("Mode :", "Method:")}</strong> {placedOrder.type === 'delivery' ? t("Livraison", "Delivery") : t("Retrait", "Pick-up")}</p>
              <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}><strong>Total :</strong> {placedOrder.total.toFixed(2)} $</p>

              {/* Action buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1.5rem' }}>
                <a 
                  href={`https://wa.me/18192134647?text=${getWhatsAppMessage()}`}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-primary"
                  style={{ width: '100%', gap: '8px', textDecoration: 'none' }}
                >
                  <MessageSquare size={18} /> {t("Confirmer sur WhatsApp", "Confirm on WhatsApp")}
                </a>
              </div>
            </div>

          </div>
        )}

      </div>
      <style>{`
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background-color: rgba(255, 255, 255, 0.05);
          padding: 0.4rem 1rem;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </main>
  );
};

export default Checkout;
