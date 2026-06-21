import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Circle, Flame, PackageCheck, Truck, ClipboardCheck } from 'lucide-react';

const OrderTracking = () => {
  const { language, t } = useApp();
  const [orderNum, setOrderNum] = useState('');
  const [trackingData, setTrackingData] = useState(null);
  const [searched, setSearched] = useState(false);

  const steps = [
    { key: 'received', labelFr: 'Commande reçue', labelEn: 'Order received', descFr: 'Votre commande a bien été enregistrée.', descEn: 'We have received your order details.', icon: ClipboardCheck },
    { key: 'confirmed', labelFr: 'Confirmée', labelEn: 'Confirmed', descFr: 'Notre équipe a validé la commande.', descEn: 'Our team has verified and confirmed your order.', icon: CheckCircle2 },
    { key: 'preparing', labelFr: 'En préparation', labelEn: 'Preparing', descFr: 'Votre plat passe maintenant entre les mains de notre équipe.', descEn: 'Our chef is preparing your traditional dish with passion.', icon: Flame },
    { key: 'ready', labelFr: 'Prête pour retrait / en livraison', labelEn: 'Ready for pickup / transit', descFr: 'Le plat est chaud et soigneusement emballé.', descEn: 'Meals are hot, packed, and ready to go.', icon: PackageCheck },
    { key: 'transit', labelFr: 'En cours de livraison', labelEn: 'In transit', descFr: 'Le livreur fait route vers votre adresse.', descEn: 'The courier is on their way to your location.', icon: Truck },
    { key: 'completed', labelFr: 'Livrée / Retirée', labelEn: 'Completed', descFr: 'Bon appétit des Merveilles d\'Oli !', descEn: 'Bon appetit from Les Merveilles d\'Oli!', icon: CheckCircle2 }
  ];

  const handleTrack = (e) => {
    e.preventDefault();
    setSearched(true);
    
    // Standard mock tracker matching input
    if (orderNum.trim()) {
      setTrackingData({
        orderNumber: orderNum.trim().toUpperCase(),
        currentStatus: 'preparing', // mock status
        type: 'delivery',
        date: new Date().toLocaleDateString(),
        time: '18:30'
      });
    } else {
      setTrackingData(null);
    }
  };

  const currentStepIndex = 2; // 'preparing' is index 2

  return (
    <main style={{ padding: '120px 0 60px 0', backgroundColor: 'var(--bg-primary)', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '650px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{ color: 'var(--color-terracotta)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>
            {t("Suivi en temps réel", "Live Tracking")}
          </span>
          <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-serif)', marginTop: '0.5rem' }}>
            {t("Suivi de Commande", "Order Status")}
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0.5rem auto 0 auto' }}>
            {t(
              "Suivez en direct chaque étape de la préparation de vos plats traditionnels.",
              "Track every culinary step of your meal's preparation in real time."
            )}
          </p>
        </div>

        {/* Search input form */}
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: '24px',
          padding: '2rem',
          boxShadow: '0 10px 30px rgba(44, 26, 17, 0.02)',
          border: '1px solid rgba(44, 26, 17, 0.05)',
          marginBottom: '3rem'
        }}>
          <form onSubmit={handleTrack} style={{ display: 'flex', gap: '0.8rem' }}>
            <input 
              type="text" 
              placeholder={t("Référence de commande (ex: OLI-123456)", "Order ID (e.g. OLI-123456)")}
              value={orderNum}
              onChange={e => setOrderNum(e.target.value)}
              style={{
                flex: 1,
                padding: '0.8rem 1.2rem',
                borderRadius: '12px',
                border: '1px solid rgba(44,26,11,0.1)',
                backgroundColor: 'var(--bg-primary)',
                fontSize: '1rem',
                outline: 'none',
                fontWeight: '500'
              }}
              required
            />
            <button type="submit" className="btn btn-primary" style={{ borderRadius: '12px', padding: '0 1.5rem' }}>
              {t("Suivre", "Track")}
            </button>
          </form>
        </div>

        {/* Tracking Timeline Output */}
        {searched && trackingData && (
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '24px',
            padding: '2.5rem',
            boxShadow: '0 10px 30px rgba(44, 26, 17, 0.02)',
            border: '1px solid rgba(44, 26, 17, 0.05)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '1rem', marginBottom: '2rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{t("Commande", "Order")} {trackingData.orderNumber}</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{trackingData.date}</span>
              </div>
              <span style={{
                fontSize: '0.8rem',
                fontWeight: 'bold',
                backgroundColor: 'var(--color-safran)',
                color: 'var(--color-cacao)',
                padding: '0.3rem 0.8rem',
                borderRadius: '20px',
                alignSelf: 'center'
              }}>
                {t("EN PRÉPARATION", "PREPARING")}
              </span>
            </div>

            {/* Timeline Steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative' }}>
              {/* Vertical line connecting steps */}
              <div style={{
                position: 'absolute',
                left: '20px',
                top: '15px',
                bottom: '15px',
                width: '3px',
                backgroundColor: 'rgba(200,92,50,0.15)',
                zIndex: 1
              }} />

              {steps.map((step, idx) => {
                const IconComponent = step.icon;
                const isCompleted = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={idx} style={{
                    display: 'flex',
                    gap: '1.5rem',
                    alignItems: 'start',
                    opacity: isCompleted ? 1 : 0.4,
                    zIndex: 2,
                    position: 'relative'
                  }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      backgroundColor: isCurrent ? 'var(--color-terracotta)' : isCompleted ? 'var(--color-forest)' : 'var(--bg-primary)',
                      border: `3px solid ${isCurrent || isCompleted ? 'transparent' : 'rgba(44,26,11,0.1)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isCompleted ? 'white' : 'var(--text-secondary)',
                      boxShadow: isCurrent ? '0 0 15px rgba(200,92,50,0.4)' : 'none'
                    }}>
                      <IconComponent size={20} />
                    </div>

                    <div style={{ flex: 1 }}>
                      <h4 style={{ 
                        fontSize: '1rem', 
                        fontWeight: 'bold', 
                        color: isCurrent ? 'var(--color-terracotta)' : 'var(--text-primary)' 
                      }}>
                        {t(step.labelFr, step.labelEn)}
                      </h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                        {t(step.descFr, step.descEn)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {searched && !trackingData && (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-bordeaux)' }}>
            <p>❌ {t("Aucune commande trouvée avec cette référence.", "No order found with this ID.")}</p>
          </div>
        )}

      </div>
    </main>
  );
};

export default OrderTracking;
