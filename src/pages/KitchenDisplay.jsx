import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { updateOrderStatus } from '../services/db';
import { Play, Check, Truck, Clipboard, UtensilsCrossed } from 'lucide-react';

const KitchenDisplay = () => {
  const { language, t } = useApp();
  const { userProfile, isKitchen } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock initial orders if Firebase is not populated
  const MOCK_ORDERS = [
    {
      id: 'ord-1',
      orderNumber: 'OLI-829103',
      customerName: 'Aline Ndiaye',
      phone: '+1 819 555-0192',
      type: 'delivery',
      status: 'confirmed',
      deliverySlot: { date: '2026-06-21', time: '18:30 - 19:00' },
      items: [
        { nameFr: 'Ndolé Royal', quantity: 2, selectedOptions: { 'Viande additionnelle': { nameFr: 'Bœuf braisé' } } },
        { nameFr: 'Alloco croustillant', quantity: 1, selectedOptions: {} }
      ],
      total: 55.00,
      createdAt: new Date(Date.now() - 30 * 60000).toISOString() // 30 mins ago
    },
    {
      id: 'ord-2',
      orderNumber: 'OLI-491029',
      customerName: 'David Lévesque',
      phone: '+1 819 555-0144',
      type: 'pickup',
      status: 'preparing',
      deliverySlot: { date: '2026-06-21', time: '19:00 - 19:30' },
      items: [
        { nameFr: 'Poulet Yassa Impérial', quantity: 1, selectedOptions: {} },
        { nameFr: 'Bissap Royal', quantity: 2, selectedOptions: {} }
      ],
      total: 29.97,
      createdAt: new Date(Date.now() - 15 * 60000).toISOString() // 15 mins ago
    }
  ];

  useEffect(() => {
    if (!db) {
      setOrders(MOCK_ORDERS);
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        setOrders(MOCK_ORDERS);
      } else {
        setOrders(snapshot.docs.map(doc => doc.data()));
      }
      setLoading(false);
    }, (err) => {
      console.warn("KDS onSnapshot error, using mock data:", err);
      setOrders(MOCK_ORDERS);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAdvanceStatus = async (orderId, currentStatus) => {
    let nextStatus = 'completed';
    if (currentStatus === 'received') nextStatus = 'confirmed';
    else if (currentStatus === 'confirmed') nextStatus = 'preparing';
    else if (currentStatus === 'preparing') nextStatus = 'ready';
    else if (currentStatus === 'ready') nextStatus = 'completed';

    try {
      await updateOrderStatus(orderId, nextStatus);
      // Update local state if firebase listener is offline
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: nextStatus } : o));
    } catch (error) {
      console.error(error);
    }
  };

  const getColumnOrders = (status) => {
    return orders.filter(o => o.status === status);
  };

  if (!isKitchen) {
    return (
      <main style={{ padding: '120px 0', textAlign: 'center', minHeight: '80vh', backgroundColor: 'var(--bg-primary)' }}>
        <div className="container" style={{ maxWidth: '500px' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem' }}>Accès Cuisine Refusé</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Vous devez faire partie de l'équipe cuisine pour accéder à cette interface.
          </p>
        </div>
      </main>
    );
  }

  const columns = [
    { id: 'confirmed', label: 'Confirmées', color: 'rgba(212,175,55,0.1)', icon: Clipboard },
    { id: 'preparing', label: 'En Préparation', color: 'rgba(200,92,50,0.1)', icon: Play },
    { id: 'ready', label: 'Prête / Emballée', color: 'rgba(30,47,35,0.1)', icon: Check }
  ];

  return (
    <main style={{ padding: '100px 0 40px 0', backgroundColor: '#121212', color: '#eaeaea', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: '1400px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)', color: 'white' }}>Tableau de Production Cuisine</h1>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-safran)' }}>Gestion des commandes chaudes en temps réel</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--color-forest)', animation: 'pulse 1.5s infinite alternate' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Live KDS Screen</span>
          </div>
        </div>

        {/* KDS Columns Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.5rem',
          alignItems: 'start'
        }}>
          {columns.map(col => {
            const colOrders = getColumnOrders(col.id);
            const IconComp = col.icon;
            
            return (
              <div key={col.id} style={{
                backgroundColor: 'rgba(255,255,255,0.03)',
                borderRadius: '20px',
                padding: '1.2rem',
                border: '1px solid rgba(255,255,255,0.05)',
                minHeight: '75vh'
              }}>
                {/* Column Title */}
                <h3 style={{
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: col.id === 'preparing' ? 'var(--color-terracotta)' : col.id === 'ready' ? 'var(--color-safran)' : 'white'
                }}>
                  <IconComp size={18} /> {col.label} ({colOrders.length})
                </h3>

                {/* Orders List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {colOrders.map(order => {
                    const elapsedMins = Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000);
                    
                    return (
                      <div key={order.id} style={{
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        borderRadius: '16px',
                        padding: '1.2rem',
                        borderLeft: `5px solid ${order.type === 'delivery' ? 'var(--color-terracotta)' : 'var(--color-safran)'}`,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.8rem'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                          <span style={{ fontWeight: 'bold', color: 'white' }}>{order.orderNumber}</span>
                          <span style={{ color: elapsedMins > 20 ? 'red' : 'gray' }}>⏳ {elapsedMins} min</span>
                        </div>

                        {/* Customer & Slot details */}
                        <div style={{ fontSize: '0.8rem', color: '#aaa' }}>
                          <p>👤 {order.customerName}</p>
                          <p>⏰ {order.deliverySlot.time}</p>
                          <p>📦 {order.type === 'delivery' ? 'LIVRAISON' : 'RETRAIT'}</p>
                        </div>

                        {/* Order Items list */}
                        <div style={{
                          borderTop: '1px solid rgba(255,255,255,0.08)',
                          borderBottom: '1px solid rgba(255,255,255,0.08)',
                          padding: '0.6rem 0'
                        }}>
                          {order.items.map((item, idx) => (
                            <div key={idx} style={{ fontSize: '0.9rem', color: '#fff', marginBottom: '0.4rem' }}>
                              <strong>{item.quantity}x {item.nameFr || item.nameEn}</strong>
                              {Object.entries(item.selectedOptions || {}).map(([opt, val]) => (
                                <div key={opt} style={{ fontSize: '0.75rem', color: 'var(--color-copper)', marginLeft: '10px' }}>
                                  - {opt}: {val.nameFr}
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>

                        {/* Action buttons to advance status */}
                        <button
                          onClick={() => handleAdvanceStatus(order.id, order.status)}
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            borderRadius: '10px',
                            border: 'none',
                            backgroundColor: col.id === 'ready' ? 'var(--color-forest)' : 'var(--color-terracotta)',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            transition: 'opacity 0.2s'
                          }}
                          onMouseOver={e => e.target.style.opacity = 0.9}
                          onMouseOut={e => e.target.style.opacity = 1.0}
                        >
                          {col.id === 'confirmed' ? 'Démarrer Préparation' : col.id === 'preparing' ? 'Prêt & Emballé' : 'Remettre au Client'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

      </div>
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.6; }
          100% { opacity: 1; }
        }
      `}</style>
    </main>
  );
};

export default KitchenDisplay;
