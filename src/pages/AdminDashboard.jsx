import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { getProducts, saveProduct, updateSettings, getCateringQuotes } from '../services/db';
import { Settings, Shield, Plus, ToggleLeft, ToggleRight, Edit, AlertCircle, CheckCircle } from 'lucide-react';

const AdminDashboard = () => {
  const { siteSettings, setSiteSettings, language, t } = useApp();
  const { userProfile, isAdmin } = useAuth();
  
  const [activeTab, setActiveTab] = useState('settings');
  const [products, setProducts] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  // Editable settings state
  const [editSettings, setEditSettings] = useState({ ...siteSettings });

  useEffect(() => {
    Promise.all([getProducts(), getCateringQuotes()]).then(([prods, qts]) => {
      setProducts(prods);
      setQuotes(qts);
      setLoading(false);
    });
  }, []);

  const handleSettingsSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateSettings(editSettings);
      setSiteSettings(editSettings);
      setMessage({ type: 'success', text: "Paramètres de l'établissement sauvegardés !" });
    } catch (err) {
      setMessage({ type: 'error', text: "Erreur lors de la sauvegarde." });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (product) => {
    const updated = { ...product, isAvailable: !product.isAvailable };
    try {
      await saveProduct(updated);
      setProducts(prev => prev.map(p => p.id === product.id ? updated : p));
      setMessage({ type: 'success', text: `Disponibilité de ${product.nameFr} mise à jour.` });
    } catch (err) {
      setMessage({ type: 'error', text: "Erreur de mise à jour." });
    }
  };

  if (loading && products.length === 0) {
    return <div style={{ padding: '120px', textAlign: 'center' }}>Chargement du panneau...</div>;
  }

  // Double check admin guard
  if (!isAdmin) {
    return (
      <main style={{ padding: '120px 0', textAlign: 'center', backgroundColor: 'var(--bg-primary)', minHeight: '80vh' }}>
        <div className="container" style={{ maxWidth: '500px' }}>
          <AlertCircle size={60} color="var(--color-bordeaux)" style={{ marginBottom: '1.5rem' }} />
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem' }}>Accès Administrateur Refusé</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Vous devez être connecté avec un compte Administrateur pour accéder à cette interface.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main style={{ padding: '120px 0 60px 0', backgroundColor: 'var(--bg-primary)', minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '1100px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-serif)' }}>Tableau de bord d'Administration</h1>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-terracotta)', fontWeight: 'bold' }}>LES MERVEILLES D'OLI</span>
          </div>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', backgroundColor: 'rgba(30,47,35,0.08)', color: 'var(--color-forest)', padding: '0.3rem 0.8rem', borderRadius: '20px', fontWeight: 'bold' }}>
            <Shield size={16} /> Admin Mode
          </span>
        </div>

        {/* Success/Error Toast Message */}
        {message && (
          <div style={{
            padding: '1rem',
            borderRadius: '12px',
            backgroundColor: message.type === 'success' ? 'rgba(30,47,35,0.08)' : 'rgba(92,29,36,0.08)',
            border: `1px solid ${message.type === 'success' ? 'var(--color-forest)' : 'var(--color-bordeaux)'}`,
            color: message.type === 'success' ? 'var(--color-forest)' : 'var(--color-bordeaux)',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem'
          }}>
            <CheckCircle size={18} />
            <span>{message.text}</span>
            <button onClick={() => setMessage(null)} style={{ marginLeft: 'auto', border: 'none', background: 'transparent', fontWeight: 'bold', color: 'inherit' }}>X</button>
          </div>
        )}

        {/* Dashboard grid structure */}
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '3rem', alignItems: 'start' }}>
          
          {/* Tabs Navigation */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`calc-pill ${activeTab === 'settings' ? 'active' : ''}`}
              style={{ textAlign: 'left', borderRadius: '10px' }}
            >
              ⚙️ Établissement
            </button>
            <button 
              onClick={() => setActiveTab('products')}
              className={`calc-pill ${activeTab === 'products' ? 'active' : ''}`}
              style={{ textAlign: 'left', borderRadius: '10px' }}
            >
              🍲 Catalogue Plats
            </button>
            <button 
              onClick={() => setActiveTab('quotes')}
              className={`calc-pill ${activeTab === 'quotes' ? 'active' : ''}`}
              style={{ textAlign: 'left', borderRadius: '10px' }}
            >
              📄 Devis Traiteur
            </button>
          </nav>

          {/* Tab Content Panels */}
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '24px',
            padding: '2.5rem',
            border: '1px solid rgba(44, 26, 17, 0.05)'
          }}>
            
            {/* 1. SETTINGS TAB */}
            {activeTab === 'settings' && (
              <form onSubmit={handleSettingsSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '0.5rem' }}>
                  Configuration de la boutique
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.2rem' }}>Nom Commercial</label>
                    <input type="text" value={editSettings.brandName} onChange={e => setEditSettings({ ...editSettings, brandName: e.target.value })} required style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid rgba(44,26,11,0.1)' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.2rem' }}>Slogan</label>
                    <input type="text" value={editSettings.slogan} onChange={e => setEditSettings({ ...editSettings, slogan: e.target.value })} required style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid rgba(44,26,11,0.1)' }} />
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.2rem' }}>Adresse Civique de Retrait</label>
                    <input type="text" value={editSettings.address} onChange={e => setEditSettings({ ...editSettings, address: e.target.value })} required style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid rgba(44,26,11,0.1)' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.2rem' }}>Téléphone Commandes</label>
                    <input type="text" value={editSettings.phone} onChange={e => setEditSettings({ ...editSettings, phone: e.target.value })} required style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid rgba(44,26,11,0.1)' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.2rem' }}>WhatsApp Commandes</label>
                    <input type="text" value={editSettings.whatsapp} onChange={e => setEditSettings({ ...editSettings, whatsapp: e.target.value })} required style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid rgba(44,26,11,0.1)' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.2rem' }}>Courriel Établissement</label>
                    <input type="email" value={editSettings.email} onChange={e => setEditSettings({ ...editSettings, email: e.target.value })} required style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid rgba(44,26,11,0.1)' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.2rem' }}>Taux de taxes QC (GST+QST %)</label>
                    <input type="number" step="0.001" value={editSettings.taxesPercent} onChange={e => setEditSettings({ ...editSettings, taxesPercent: parseFloat(e.target.value) })} required style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid rgba(44,26,11,0.1)' }} />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '1rem' }}>
                  Sauvegarder les paramètres
                </button>
              </form>
            )}

            {/* 2. PRODUCTS TAB */}
            {activeTab === 'products' && (
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '0.5rem' }}>
                  Gestion du catalogue plats
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {products.map(prod => (
                    <div key={prod.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1rem',
                      backgroundColor: 'var(--bg-primary)',
                      borderRadius: '16px',
                      border: '1px solid rgba(44,26,11,0.05)'
                    }}>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <img src={prod.image} alt="" style={{ width: '50px', height: '50px', borderRadius: '10px', objectFit: 'cover' }} />
                        <div>
                          <h4 style={{ fontSize: '1rem', fontWeight: 'bold' }}>{prod.nameFr}</h4>
                          <span style={{ fontSize: '0.8rem', color: 'var(--color-terracotta)', fontWeight: 'bold' }}>{prod.price.toFixed(2)} $</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        {/* Chili rating info */}
                        <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>
                          Piment: {prod.spiceLevel > 0 ? '🌶️'.repeat(prod.spiceLevel) : 'Doux'}
                        </span>
                        
                        {/* Toggle switch for availability */}
                        <button 
                          onClick={() => handleToggleAvailability(prod)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: prod.isAvailable ? 'var(--color-forest)' : 'var(--color-bordeaux)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem'
                          }}
                        >
                          {prod.isAvailable ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                          <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>
                            {prod.isAvailable ? 'Disponible' : 'Épuisé'}
                          </span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. CATERING QUOTES TAB */}
            {activeTab === 'quotes' && (
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '0.5rem' }}>
                  Demandes de devis reçues
                </h3>
                {quotes.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>Aucune demande de devis reçue pour le moment.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {quotes.map(quote => (
                      <div key={quote.id} style={{
                        padding: '1.5rem',
                        backgroundColor: 'var(--bg-primary)',
                        borderRadius: '16px',
                        border: '1px solid rgba(44,26,11,0.08)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '0.5rem', marginBottom: '0.8rem' }}>
                          <div>
                            <strong>Devis {quote.quoteRef}</strong>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Créé le : {new Date(quote.createdAt).toLocaleDateString()}</p>
                          </div>
                          <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--color-terracotta)' }}>{quote.eventType.toUpperCase()}</span>
                        </div>
                        <div style={{ fontSize: '0.85rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                          <p><strong>Client :</strong> {quote.contact.name} ({quote.contact.phone})</p>
                          <p><strong>Courriel :</strong> {quote.contact.email}</p>
                          <p><strong>Invités :</strong> {quote.guestsCount} pax</p>
                          <p><strong>Date & Lieu :</strong> {quote.date} ({quote.location})</p>
                        </div>
                        {quote.contact.message && (
                          <div style={{ marginTop: '0.8rem', padding: '0.5rem 0.8rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', fontSize: '0.8rem', fontStyle: 'italic' }}>
                            "{quote.contact.message}"
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </div>
    </main>
  );
};

export default AdminDashboard;
