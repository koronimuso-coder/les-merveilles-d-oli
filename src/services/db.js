import { db } from './firebase';
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  limit
} from 'firebase/firestore';

// ---------------------------------------------------------
// MOCK DATA (DEMONSTRATIONS)
// ---------------------------------------------------------
const MOCK_CATEGORIES = [
  { id: 'entrées', nameFr: 'Entrées', nameEn: 'Appetizers', order: 1, active: true },
  { id: 'plats', nameFr: 'Plats Principaux', nameEn: 'Main Courses', order: 2, active: true },
  { id: 'grillades', nameFr: 'Grillades', nameEn: 'Grills', order: 3, active: true },
  { id: 'accompagnements', nameFr: 'Accompagnements', nameEn: 'Sides', order: 4, active: true },
  { id: 'boissons', nameFr: 'Boissons', nameEn: 'Drinks', order: 5, active: true },
  { id: 'desserts', nameFr: 'Desserts', nameEn: 'Desserts', order: 6, active: true },
  { id: 'menus_familiaux', nameFr: 'Menus Familiaux', nameEn: 'Family Feasts', order: 7, active: true }
];

const MOCK_PRODUCTS = [
  {
    id: 'ndole',
    nameFr: 'Ndolé Royal',
    nameEn: 'Royal Ndole',
    descriptionFr: 'Le célèbre Ndolé camerounais aux arachides fraîches, herbes médicinales (ndolé) et crevettes fraîches. Servi chaud et parfumé.',
    descriptionEn: 'The famous Cameroonian Ndole prepared with fresh peanuts, medicinal bitter leaves (ndole), and fresh prawns. Served hot and flavorful.',
    price: 24.50,
    promoPrice: 22.00,
    category: 'plats',
    spiceLevel: 1, // 0 to 3
    vegetarian: false,
    allergens: ['crevettes', 'arachides'],
    prepTime: 25,
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=800&q=80',
    video: '',
    maxQty: 10,
    recommendations: ['alloco', 'riz_blanc'],
    options: [
      {
        nameFr: 'Viande additionnelle',
        nameEn: 'Additional meat',
        choices: [
          { nameFr: 'Bœuf braisé', nameEn: 'Braised beef', extraPrice: 4.00 },
          { nameFr: 'Tripes', nameEn: 'Tripe', extraPrice: 3.50 }
        ]
      }
    ],
    status: 'active'
  },
  {
    id: 'poulet_yassa',
    nameFr: 'Poulet Yassa Impérial',
    nameEn: 'Imperial Chicken Yassa',
    descriptionFr: 'Poulet mariné au citron vert, moutarde, et une généreuse quantité d\'oignons caramélisés fondants.',
    descriptionEn: 'Marinated chicken cooked with lime, mustard, and a generous amount of melting caramelized onions.',
    price: 19.99,
    category: 'plats',
    spiceLevel: 2,
    vegetarian: false,
    allergens: ['moutarde'],
    prepTime: 20,
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    video: '',
    maxQty: 15,
    recommendations: ['riz_parfume'],
    options: [],
    status: 'active'
  },
  {
    id: 'mafe',
    nameFr: 'Mafé de Bœuf Authentique',
    nameEn: 'Authentic Beef Mafe',
    descriptionFr: 'Mijoté de bœuf tendre dans une onctueuse sauce à base de beurre de cacahuète et de légumes de saison.',
    descriptionEn: 'Tender beef stew in a creamy peanut butter sauce with seasonal root vegetables.',
    price: 21.00,
    category: 'plats',
    spiceLevel: 1,
    vegetarian: false,
    allergens: ['arachides'],
    prepTime: 25,
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=800&q=80',
    video: '',
    maxQty: 8,
    recommendations: ['alloco'],
    options: [],
    status: 'active'
  },
  {
    id: 'alloco',
    nameFr: 'Alloco croustillant',
    nameEn: 'Crispy Alloco',
    descriptionFr: 'Rondelles de bananes plantains mûres frites à la perfection, dorées et douces.',
    descriptionEn: 'Sweet ripe plantain slices fried to golden perfection.',
    price: 6.50,
    category: 'accompagnements',
    spiceLevel: 0,
    vegetarian: true,
    allergens: [],
    prepTime: 10,
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1568254183919-78a4f43a2877?auto=format&fit=crop&w=800&q=80',
    video: '',
    maxQty: 20,
    recommendations: [],
    options: [],
    status: 'active'
  },
  {
    id: 'pastels',
    nameFr: 'Pastels de Poisson (4 pcs)',
    nameEn: 'Fish Pastels (4 pcs)',
    descriptionFr: 'Petits beignets croustillants fourrés au thon épicé, servis avec une sauce tomate pimentée maison.',
    descriptionEn: 'Crispy small pastries stuffed with spiced tuna, served with a hot tomato dipping sauce.',
    price: 7.99,
    category: 'entrées',
    spiceLevel: 2,
    vegetarian: false,
    allergens: ['poisson', 'gluten'],
    prepTime: 12,
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1589187151046-0936f4e1b3ac?auto=format&fit=crop&w=800&q=80',
    video: '',
    maxQty: 25,
    recommendations: [],
    options: [],
    status: 'active'
  },
  {
    id: 'jus_bissap',
    nameFr: 'Bissap Royal aux fleurs d\'hibiscus',
    nameEn: 'Royal Hibiscus Bissap',
    descriptionFr: 'Boisson rafraîchissante traditionnelle infusée à partir de fleurs d\'hibiscus séchées, menthe et arôme de vanille.',
    descriptionEn: 'Traditional refreshing drink brewed from dried hibiscus flowers, mint, and vanilla essence.',
    price: 4.99,
    category: 'boissons',
    spiceLevel: 0,
    vegetarian: true,
    allergens: [],
    prepTime: 3,
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
    video: '',
    maxQty: 30,
    recommendations: [],
    options: [],
    status: 'active'
  },
  {
    id: 'feast_family_4',
    nameFr: 'Festin Familial (4 personnes)',
    nameEn: 'Family Feast (4 people)',
    descriptionFr: 'Le menu de rassemblement ultime : 1 plat Ndolé, 1 plat Poulet Yassa, 2 portions de Riz blanc, 2 portions d\'Alloco et 4 boissons Bissap.',
    descriptionEn: 'The ultimate gathering pack: 1 Ndole, 1 Chicken Yassa, 2 White Rice portions, 2 Allocos, and 4 Bissap juices.',
    price: 75.00,
    promoPrice: 65.00,
    category: 'menus_familiaux',
    spiceLevel: 1,
    vegetarian: false,
    allergens: ['arachides', 'crevettes', 'moutarde', 'gluten'],
    prepTime: 40,
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    video: '',
    maxQty: 5,
    recommendations: [],
    options: [],
    status: 'active'
  }
];

// Helper to determine if we use mock data or firebase
const isFirebaseReady = () => {
  return db !== undefined && db !== null;
};

// ---------------------------------------------------------
// DATABASE SERVICES
// ---------------------------------------------------------

export const getCategories = async () => {
  if (!isFirebaseReady()) return MOCK_CATEGORIES;
  try {
    const qSnap = await getDocs(query(collection(db, 'categories'), orderBy('order', 'asc')));
    if (qSnap.empty) {
      // Seed Firestore if empty
      for (const cat of MOCK_CATEGORIES) {
        await setDoc(doc(db, 'categories', cat.id), cat);
      }
      return MOCK_CATEGORIES;
    }
    return qSnap.docs.map(doc => doc.data());
  } catch (error) {
    console.warn("Firestore categories error, returning mock:", error);
    return MOCK_CATEGORIES;
  }
};

export const getProducts = async () => {
  if (!isFirebaseReady()) return MOCK_PRODUCTS;
  try {
    const qSnap = await getDocs(collection(db, 'products'));
    if (qSnap.empty) {
      // Seed Firestore if empty
      for (const prod of MOCK_PRODUCTS) {
        await setDoc(doc(db, 'products', prod.id), prod);
      }
      return MOCK_PRODUCTS;
    }
    return qSnap.docs.map(doc => doc.data());
  } catch (error) {
    console.warn("Firestore products error, returning mock:", error);
    return MOCK_PRODUCTS;
  }
};

export const createOrder = async (orderData) => {
  const orderNum = 'OLI-' + Math.floor(100000 + Math.random() * 900000);
  const newOrder = {
    ...orderData,
    orderNumber: orderNum,
    createdAt: new Date().toISOString(),
    status: 'received'
  };

  if (!isFirebaseReady()) {
    console.log("Mock Order Created:", newOrder);
    return newOrder;
  }

  try {
    const docRef = await addDoc(collection(db, 'orders'), newOrder);
    newOrder.id = docRef.id;
    // Update it with the newly generated doc id
    await updateDoc(docRef, { id: docRef.id });
    return newOrder;
  } catch (error) {
    console.error("Error creating Firestore order:", error);
    return newOrder;
  }
};

export const subscribeToOrders = (callback) => {
  if (!isFirebaseReady()) {
    // Return dummy unsubscriber
    return () => {};
  }
  // Listen to all orders for kitchen display / dashboard
  const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
  const { onSnapshot } = require('firebase/firestore'); // Lazy loaded
  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map(doc => doc.data());
    callback(orders);
  });
};

export const createCateringQuote = async (quoteData) => {
  const quoteRef = 'DEV-' + Math.floor(1000 + Math.random() * 9000);
  const newQuote = {
    ...quoteData,
    quoteRef,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  if (!isFirebaseReady()) {
    console.log("Mock Catering Quote Created:", newQuote);
    return newQuote;
  }

  try {
    const docRef = await addDoc(collection(db, 'quotes'), newQuote);
    newQuote.id = docRef.id;
    await updateDoc(docRef, { id: docRef.id });
    return newQuote;
  } catch (error) {
    console.error("Error creating catering quote in Firestore:", error);
    return newQuote;
  }
};

export const getCateringQuotes = async () => {
  if (!isFirebaseReady()) return [];
  try {
    const qSnap = await getDocs(collection(db, 'quotes'));
    return qSnap.docs.map(doc => doc.data());
  } catch (error) {
    console.error("Error getting quotes:", error);
    return [];
  }
};

export const updateOrderStatus = async (orderId, newStatus) => {
  if (!isFirebaseReady()) {
    console.log(`Mock order ${orderId} updated to status ${newStatus}`);
    return true;
  }
  try {
    const orderDocRef = doc(db, 'orders', orderId);
    await updateDoc(orderDocRef, { status: newStatus });
    return true;
  } catch (error) {
    console.error("Error updating order status:", error);
    return false;
  }
};

export const saveProduct = async (productData) => {
  if (!isFirebaseReady()) {
    console.log("Mock product saved:", productData);
    return true;
  }
  try {
    const prodDocRef = doc(db, 'products', productData.id);
    await setDoc(prodDocRef, productData, { merge: true });
    return true;
  } catch (error) {
    console.error("Error saving product:", error);
    return false;
  }
};

export const updateSettings = async (settingsData) => {
  if (!isFirebaseReady()) {
    console.log("Mock settings updated:", settingsData);
    return true;
  }
  try {
    const settingsDocRef = doc(db, 'settings', 'establishment');
    await setDoc(settingsDocRef, settingsData, { merge: true });
    return true;
  } catch (error) {
    console.error("Error updating settings:", error);
    return false;
  }
};
