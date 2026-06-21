import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useCart } from '../context/CartContext';
import { getCategories, getProducts } from '../services/db';
import { Flame, Star, ShoppingBag, Eye, Info, Check, Filter } from 'lucide-react';
import SauceReveal from '../components/SauceReveal';

const Menu = () => {
  const { language, t } = useApp();
  const { addToCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Database States
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [spiceFilter, setSpiceFilter] = useState(-1); // -1 = all, 0, 1, 2, 3
  const [vegetarianOnly, setVegetarianOnly] = useState(false);
  const [onlyPromos, setOnlyPromos] = useState(false);
  const [priceRange, setPriceRange] = useState(100);
  const [allergensAvoid, setAllergensAvoid] = useState([]);

  // Options Dialog / Drawer State
  const [activeProduct, setActiveProduct] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});

  // Transition State
  const [sauceTrigger, setSauceTrigger] = useState(false);

  useEffect(() => {
    // Check search params first
    const catParam = searchParams.get('cat');
    if (catParam) setSelectedCategory(catParam);
    
    const filterParam = searchParams.get('filter');
    if (filterParam === 'promo') setOnlyPromos(true);

    // Fetch database items
    Promise.all([getCategories(), getProducts()]).then(([cats, prods]) => {
      setCategories(cats);
      setProducts(prods);
      setLoading(false);
    });
  }, [searchParams]);

  // Synchronize category select with route params
  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    if (catId === 'all') {
      searchParams.delete('cat');
    } else {
      searchParams.set('cat', catId);
    }
    setSearchParams(searchParams);
  };

  // Option selection logic
  const handleOptionChange = (optionName, choice) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionName]: choice
    }));
  };

  const handleAddToCartWithSelection = () => {
    if (!activeProduct) return;
    addToCart(activeProduct, 1, selectedOptions);
    setActiveProduct(null);
    setSelectedOptions({});
    
    // Quick custom alert confirmation
    const event = new CustomEvent('toast-alert', {
      detail: { 
        msgFr: `${activeProduct.nameFr} ajouté au panier !`,
        msgEn: `${activeProduct.nameEn} added to cart!`
      }
    });
    window.dispatchEvent(event);
  };

  // Filtering Logic
  const filteredProducts = products.filter(prod => {
    if (selectedCategory !== 'all' && prod.category !== selectedCategory) return false;
    if (spiceFilter !== -1 && prod.spiceLevel !== spiceFilter) return false;
    if (vegetarianOnly && !prod.vegetarian) return false;
    if (onlyPromos && !prod.promoPrice) return false;
    
    const actualPrice = prod.promoPrice || prod.price;
    if (actualPrice > priceRange) return false;
    
    return true;
  });

  if (loading) {
    return (
      <div style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-primary)'
      }}>
        <div className="spinner" />
        <style>{`
          .spinner {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(200,92,50,0.1);
            border-top: 4px solid var(--color-terracotta);
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <SauceReveal trigger={sauceTrigger} onComplete={() => setSauceTrigger(false)} sauceColor="var(--color-bordeaux)" />
      
      <main style={{ padding: '120px 0 60px 0', backgroundColor: 'var(--bg-primary)' }}>
        <div className="container">
          
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ color: 'var(--color-terracotta)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>
              {t("Notre Menu", "Our Menu")}
            </span>
            <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-serif)', marginTop: '0.5rem' }}>
              {t("La Gastronomie Africaine à Ottawa", "African Gastronomy in Ottawa")}
            </h1>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0.5rem auto 0 auto' }}>
              {t(
                "Tous nos plats sont préparés à la commande avec des ingrédients frais de qualité supérieure.",
                "All our dishes are freshly prepared to order using premium quality ingredients."
              )}
            </p>
          </div>

          {/* Categories Horizontal Pills Bar */}
          <div className="categories-bar" style={{
            display: 'flex',
            gap: '0.8rem',
            overflowX: 'auto',
            paddingBottom: '1.2rem',
            marginBottom: '2.5rem',
            scrollbarWidth: 'none'
          }}>
            <button 
              onClick={() => handleCategorySelect('all')}
              className={`cat-pill ${selectedCategory === 'all' ? 'active' : ''}`}
            >
              {t("Tous", "All")}
            </button>
            {categories.map(cat => (
              <button 
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`cat-pill ${selectedCategory === cat.id ? 'active' : ''}`}
              >
                {t(cat.nameFr, cat.nameEn)}
              </button>
            ))}
          </div>

          {/* Grid Layout: Left filters panel, Right products catalog */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '3rem',
            alignItems: 'start'
          }}>
            
            {/* Filters Sidebar Panel */}
            <aside style={{
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: '24px',
              padding: '2rem',
              border: '1px solid rgba(44, 26, 17, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              gap: '2rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid rgba(44,26,11,0.08)', paddingBottom: '0.8rem' }}>
                <Filter size={18} color="var(--color-terracotta)" />
                <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-sans)', fontWeight: 'bold' }}>Filtres</h3>
              </div>

              {/* Price Range Filter */}
              <div>
                <label style={{ fontSize: '0.9rem', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>{t("Budget maximum", "Max budget")}</span>
                  <span style={{ color: 'var(--color-terracotta)' }}>{priceRange.toFixed(2)} $</span>
                </label>
                <input 
                  type="range" 
                  min="5" 
                  max="100" 
                  step="5"
                  value={priceRange} 
                  onChange={(e) => setPriceRange(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--color-terracotta)' }}
                />
              </div>

              {/* Chili/Spice Level Filter */}
              <div>
                <label style={{ fontSize: '0.9rem', fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>
                  {t("Niveau de piment", "Spiciness")}
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => setSpiceFilter(-1)}
                    className={`spice-pill ${spiceFilter === -1 ? 'active' : ''}`}
                  >
                    {t("Tous", "All")}
                  </button>
                  {[0, 1, 2, 3].map(level => (
                    <button 
                      key={level}
                      onClick={() => setSpiceFilter(level)}
                      className={`spice-pill ${spiceFilter === level ? 'active' : ''}`}
                    >
                      {level === 0 ? t("Doux", "Mild") : '🌶️'.repeat(level)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600' }}>
                  <input 
                    type="checkbox" 
                    checked={vegetarianOnly}
                    onChange={(e) => setVegetarianOnly(e.target.checked)}
                    style={{ accentColor: 'var(--color-terracotta)', width: '18px', height: '18px' }}
                  />
                  <span>🥗 {t("Végétarien uniquement", "Vegetarian only")}</span>
                </label>
                
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600' }}>
                  <input 
                    type="checkbox" 
                    checked={onlyPromos}
                    onChange={(e) => setOnlyPromos(e.target.checked)}
                    style={{ accentColor: 'var(--color-terracotta)', width: '18px', height: '18px' }}
                  />
                  <span>🏷️ {t("En promotion", "Special Offers")}</span>
                </label>
              </div>

              {/* Allergen Filters (Safe Dining Mode) */}
              <div>
                <label style={{ fontSize: '0.9rem', fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>
                  {t("Régimes & Allergènes", "Diets & Allergens")}
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {[
                    { id: 'arachides', labelFr: 'Sans arachides', labelEn: 'Peanut-free' },
                    { id: 'gluten', labelFr: 'Sans gluten', labelEn: 'Gluten-free' },
                    { id: 'crevettes', labelFr: 'Sans crevettes/crustacés', labelEn: 'Shellfish-free' },
                    { id: 'moutarde', labelFr: 'Sans moutarde', labelEn: 'Mustard-free' }
                  ].map(allg => {
                    const active = allergensAvoid.includes(allg.id);
                    return (
                      <button
                        key={allg.id}
                        type="button"
                        onClick={() => {
                          setAllergensAvoid(prev => 
                            prev.includes(allg.id) 
                              ? prev.filter(x => x !== allg.id) 
                              : [...prev, allg.id]
                          );
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.6rem 0.8rem',
                          borderRadius: '12px',
                          border: `1px solid ${active ? 'var(--color-bordeaux)' : 'rgba(44, 26, 17, 0.08)'}`,
                          backgroundColor: active ? 'rgba(128, 20, 20, 0.05)' : 'transparent',
                          color: active ? 'var(--color-bordeaux)' : 'var(--text-primary)',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          textAlign: 'left',
                          transition: 'all 0.2s'
                        }}
                      >
                        <span>{t(allg.labelFr, allg.labelEn)}</span>
                        <span>{active ? '❌' : '🛡️'}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Reset Filters button */}
              <button 
                onClick={() => {
                  setSelectedCategory('all');
                  setSpiceFilter(-1);
                  setVegetarianOnly(false);
                  setOnlyPromos(false);
                  setPriceRange(100);
                  setAllergensAvoid([]);
                  searchParams.delete('cat');
                  searchParams.delete('filter');
                  setSearchParams(searchParams);
                }}
                className="btn btn-secondary"
                style={{ width: '100%', fontSize: '0.85rem', padding: '0.6rem' }}
              >
                {t("Réinitialiser les filtres", "Reset Filters")}
              </button>
            </aside>

            {/* Catalog Grid */}
            <div style={{ gridColumn: 'span 2' }}>
              {filteredProducts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-secondary)' }}>
                  <p style={{ fontSize: '1.2rem', fontWeight: '500' }}>
                    {t("Aucun plat ne correspond à vos filtres.", "No dishes match your filter criteria.")}
                  </p>
                </div>
              ) : (
                <div className="grid-catalog" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
                  {filteredProducts.map(prod => {
                    const hasAllergen = prod.allergens && prod.allergens.some(a => allergensAvoid.includes(a));
                    return (
                      <div 
                        key={prod.id} 
                        className="product-card"
                        style={{
                          opacity: hasAllergen ? 0.45 : 1,
                          filter: hasAllergen ? 'grayscale(60%)' : 'none',
                          transition: 'all 0.3s ease',
                          border: hasAllergen ? '1px dashed rgba(128, 20, 20, 0.2)' : 'none'
                        }}
                      >
                        <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden' }}>
                          <img src={prod.image} alt={t(prod.nameFr, prod.nameEn)} />
                          
                          {prod.promoPrice && (
                            <span className="badge-promo">PROMO</span>
                          )}

                          {prod.spiceLevel > 0 && (
                            <span className="badge-spice">{'🌶️'.repeat(prod.spiceLevel)}</span>
                          )}

                          {hasAllergen && (
                            <span style={{
                              position: 'absolute',
                              top: '12px',
                              right: '12px',
                              backgroundColor: 'var(--color-bordeaux)',
                              color: 'white',
                              padding: '0.3rem 0.6rem',
                              fontSize: '0.7rem',
                              fontWeight: 'bold',
                              borderRadius: '10px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                            }}>
                              ⚠️ {t("Contient des allergènes", "Contains allergens")}
                            </span>
                          )}

                          {!hasAllergen && allergensAvoid.length > 0 && (
                            <span style={{
                              position: 'absolute',
                              top: '12px',
                              right: '12px',
                              backgroundColor: 'var(--color-forest)',
                              color: 'white',
                              padding: '0.3rem 0.6rem',
                              fontSize: '0.7rem',
                              fontWeight: 'bold',
                              borderRadius: '10px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                            }}>
                              ✨ {t("Sûr pour vous", "Safe")}
                            </span>
                          )}
                        </div>

                        <h3 style={{ fontSize: '1.2rem', marginTop: '1rem', fontWeight: 'bold', fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {t(prod.nameFr, prod.nameEn)}
                        </h3>
                        
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', height: '50px', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '0.4rem' }}>
                          {t(prod.descriptionFr, prod.descriptionEn)}
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
                          <div>
                            {prod.promoPrice ? (
                              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-terracotta)' }}>{prod.promoPrice.toFixed(2)} $</span>
                                <span style={{ fontSize: '0.85rem', textDecoration: 'line-through', color: '#a08a7c' }}>{prod.price.toFixed(2)} $</span>
                              </div>
                            ) : (
                              <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{prod.price.toFixed(2)} $</span>
                            )}
                          </div>

                          {/* Order Options / Add button with Allergen Guard */}
                          {hasAllergen ? (
                            <button 
                              disabled
                              className="btn"
                              style={{ 
                                padding: '0.5rem 1rem', 
                                fontSize: '0.8rem', 
                                borderRadius: '12px',
                                backgroundColor: 'rgba(128, 20, 20, 0.1)',
                                color: 'var(--color-bordeaux)',
                                border: 'none',
                                cursor: 'not-allowed',
                                fontWeight: '600'
                              }}
                            >
                              {t("Non compatible", "Incompatible")}
                            </button>
                          ) : (
                            <button 
                              onClick={() => {
                                if (prod.options && prod.options.length > 0) {
                                  setActiveProduct(prod);
                                  setSelectedOptions({});
                                } else {
                                  addToCart(prod, 1);
                                  const event = new CustomEvent('toast-alert', {
                                    detail: { 
                                      msgFr: `${prod.nameFr} ajouté au panier !`,
                                      msgEn: `${prod.nameEn} added to cart!`
                                    }
                                  });
                                  window.dispatchEvent(event);
                                }
                              }}
                              className="btn btn-primary"
                              style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', borderRadius: '12px' }}
                            >
                              {prod.options && prod.options.length > 0 ? t("Personnaliser", "Customize") : t("Ajouter", "Add")}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

        </div>
      </main>

      {/* OPTIONS CUSTOMIZATION DIALOG / MODAL */}
      {activeProduct && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(5px)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-primary)',
            width: '100%',
            maxWidth: '500px',
            borderRadius: '24px',
            padding: '2rem',
            boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>
                {t(activeProduct.nameFr, activeProduct.nameEn)}
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
                {t("Personnalisez votre plat selon vos préférences.", "Customize your meal to your preferences.")}
              </p>
            </div>

            {/* Render options from product data */}
            {activeProduct.options.map((opt, oIdx) => (
              <div key={oIdx} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 'bold' }}>{t(opt.nameFr, opt.nameEn)}</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {opt.choices.map((choice, cIdx) => {
                    const isSelected = selectedOptions[opt.nameFr]?.nameFr === choice.nameFr;
                    return (
                      <div 
                        key={cIdx}
                        onClick={() => handleOptionChange(opt.nameFr, choice)}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0.8rem 1rem',
                          borderRadius: '12px',
                          border: `2px solid ${isSelected ? 'var(--color-terracotta)' : 'rgba(44, 26, 17, 0.08)'}`,
                          backgroundColor: isSelected ? 'rgba(200, 92, 50, 0.03)' : 'transparent',
                          cursor: 'pointer',
                          fontSize: '0.9rem'
                        }}
                      >
                        <span style={{ fontWeight: isSelected ? '600' : '400' }}>
                          {t(choice.nameFr, choice.nameEn)}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {choice.extraPrice > 0 && (
                            <span style={{ color: 'var(--color-terracotta)', fontWeight: 'bold' }}>+{choice.extraPrice.toFixed(2)} $</span>
                          )}
                          {isSelected && <Check size={16} color="var(--color-terracotta)" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button 
                onClick={() => { setActiveProduct(null); setSelectedOptions({}); }}
                className="btn btn-secondary"
                style={{ flex: 1, padding: '0.8rem', borderRadius: '12px' }}
              >
                {t("Annuler", "Cancel")}
              </button>
              <button 
                onClick={handleAddToCartWithSelection}
                className="btn btn-primary"
                style={{ flex: 1, padding: '0.8rem', borderRadius: '12px' }}
              >
                {t("Valider l'ajout", "Add to Cart")}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .cat-pill {
          padding: 0.6rem 1.5rem;
          border-radius: 50px;
          border: 1px solid rgba(44, 26, 17, 0.08);
          background-color: var(--bg-primary);
          color: var(--text-primary);
          font-family: var(--font-sans);
          font-weight: 600;
          font-size: 0.9rem;
          white-space: nowrap;
          cursor: pointer;
          transition: var(--transition-fast);
        }
        .cat-pill.active, .cat-pill:hover {
          background-color: var(--color-terracotta);
          color: var(--color-ivory);
          border-color: var(--color-terracotta);
        }
        .spice-pill {
          flex: 1;
          padding: 0.5rem;
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
        .spice-pill.active, .spice-pill:hover {
          border-color: var(--color-terracotta);
          background-color: rgba(200, 92, 50, 0.05);
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
        .badge-promo {
          position: absolute;
          top: 12px;
          left: 12px;
          background-color: var(--color-bordeaux);
          color: var(--color-ivory);
          padding: 0.3rem 0.8rem;
          font-size: 0.75rem;
          font-weight: bold;
          border-radius: 20px;
        }
        .badge-spice {
          position: absolute;
          bottom: 12px;
          right: 12px;
          background-color: rgba(0,0,0,0.6);
          color: var(--color-safran);
          padding: 0.2rem 0.6rem;
          font-size: 0.7rem;
          font-weight: bold;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 2px;
        }
      `}</style>
    </>
  );
};

export default Menu;
