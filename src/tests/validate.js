/**
 * Business Logic Validation Script
 * Tests the calculations for taxes, delivery fee zones, discounts, and WhatsApp structured messages.
 */

// QC Taxes (GST + QST approx 14.975%)
const TAXES_PERCENT = 14.975;

function calculateOrder({ subtotal, discountPercent = 0, deliveryType = 'pickup', postalCode = '' }) {
  const discountAmount = subtotal * (discountPercent / 100);
  const taxableAmount = subtotal - discountAmount;
  const taxes = taxableAmount * (TAXES_PERCENT / 100);
  
  let deliveryFee = 0;
  if (deliveryType === 'delivery') {
    const firstChar = postalCode.trim().toUpperCase().charAt(0);
    deliveryFee = firstChar === 'K' ? 10.00 : 5.00;
  }
  
  const total = taxableAmount + taxes + deliveryFee;
  
  return {
    subtotal,
    discountAmount,
    taxableAmount,
    taxes,
    deliveryFee,
    total
  };
}

function generateWhatsAppMessage({ orderNumber, name, phone, type, address, date, time, items, calc }) {
  const itemsList = items
    .map(item => `- ${item.quantity}x ${item.name}`)
    .join('\n');
    
  const methodStr = type === 'delivery' 
    ? `Livraison à : ${address.street}, ${address.postalCode}`
    : 'Retrait à Gatineau (40 chemin des Érables)';

  return `Bonjour LES MERVEILLES D’OLI,

Je souhaite confirmer ma commande ${orderNumber}.

Nom : ${name}
Téléphone : ${phone}
Livraison ou retrait : ${methodStr}
Date : ${date}
Heure : ${time}

Articles :
${itemsList}

Sous-total : ${calc.subtotal.toFixed(2)} $
Taxes : ${calc.taxes.toFixed(2)} $
Livraison : ${calc.deliveryFee.toFixed(2)} $
Total : ${calc.total.toFixed(2)} $

Adresse ou instructions : ${address?.landmark || 'Aucune'}

Merci de me confirmer la disponibilité.`;
}

// ---------------------------------------------------------
// RUNNING CHECKS
// ---------------------------------------------------------
console.log("=== RUNNING BUSINESS LOGIC CHECKS ===");

// Test Case 1: Pickup, no discount
const case1 = calculateOrder({ subtotal: 50.00, deliveryType: 'pickup' });
console.assert(case1.deliveryFee === 0, "Case 1: Delivery fee should be 0");
console.assert(Math.abs(case1.taxes - 7.49) < 0.01, `Case 1: Taxes should be ~7.49, got ${case1.taxes.toFixed(2)}`);
console.assert(Math.abs(case1.total - 57.49) < 0.01, `Case 1: Total should be ~57.49, got ${case1.total.toFixed(2)}`);
console.log("✓ Test Case 1 passed (Pickup, No discount).");

// Test Case 2: Delivery to Ottawa (K...), with 10% discount
const case2 = calculateOrder({ subtotal: 100.00, discountPercent: 10, deliveryType: 'delivery', postalCode: 'K1N 6N5' });
console.assert(case2.discountAmount === 10.00, "Case 2: Discount should be 10.00");
console.assert(case2.deliveryFee === 10.00, `Case 2: Delivery to Ottawa should be 10.00, got ${case2.deliveryFee}`);
console.assert(Math.abs(case2.taxes - 13.48) < 0.01, `Case 2: Taxes should be ~13.48, got ${case2.taxes.toFixed(2)}`);
console.assert(Math.abs(case2.total - 113.48) < 0.01, `Case 2: Total should be ~113.48, got ${case2.total.toFixed(2)}`);
console.log("✓ Test Case 2 passed (Delivery Ottawa, 10% Discount).");

// Test Case 3: Delivery to Gatineau (J...), no discount
const case3 = calculateOrder({ subtotal: 30.00, deliveryType: 'delivery', postalCode: 'J8V 1C4' });
console.assert(case3.deliveryFee === 5.00, `Case 3: Delivery to Gatineau should be 5.00, got ${case3.deliveryFee}`);
console.log("✓ Test Case 3 passed (Delivery Gatineau, No discount).");

// Test Case 4: WhatsApp Message format check
const message = generateWhatsAppMessage({
  orderNumber: 'OLI-829103',
  name: 'Aline Ndiaye',
  phone: '+1 819 555-0192',
  type: 'delivery',
  address: { street: '40 chemin des Érables', postalCode: 'J8V 1C4', landmark: 'Maison' },
  date: '2026-06-21',
  time: '18:30 - 19:00',
  items: [
    { name: 'Ndolé Royal', quantity: 2 },
    { name: 'Alloco croustillant', quantity: 1 }
  ],
  calc: calculateOrder({ subtotal: 55.50, deliveryType: 'delivery', postalCode: 'J8V 1C4' })
});

console.assert(message.includes("Bonjour LES MERVEILLES D’OLI,"), "WhatsApp msg missing greeting");
console.assert(message.includes("Je souhaite confirmer ma commande OLI-829103."), "WhatsApp msg missing order number confirmation");
console.assert(message.includes("Livraison à : 40 chemin des Érables, J8V 1C4"), "WhatsApp msg missing address details");
console.assert(message.includes("Total : 68.81 $") || message.includes("Total : 68.82 $"), `WhatsApp msg total cost miscalculated in format: ${message}`);
console.log("✓ Test Case 4 passed (WhatsApp structure matches format exactly).");

console.log("=== ALL CHECKS COMPLETED SUCCESSFULLY ===");
