// Catalogue des bijoux personnalisables
export const products = [
  {
    id: 'collier-plaque-or',
    name: 'Collier Plaque Or',
    category: 'colliers',
    price: 39.90,
    description: 'Élégant collier avec plaque rectangulaire personnalisable, plaqué or 18 carats. Chaîne ajustable 40-45cm.',
    maxChars: 12,
    images: ['/images/collier-plaque-or.jpg'],
    modelColor: '#d4af37', // Gold
    dimensions: { width: 25, height: 8 }, // mm
    inStock: true,
  },
  {
    id: 'collier-medaillon-coeur',
    name: 'Médaillon Cœur',
    category: 'colliers',
    price: 34.90,
    description: 'Délicat médaillon en forme de cœur à personnaliser. Plaqué or rose, chaîne 42cm.',
    maxChars: 8,
    images: ['/images/medaillon-coeur.jpg'],
    modelColor: '#e8c4c4', // Rose gold
    dimensions: { width: 15, height: 15 },
    inStock: true,
  },
  {
    id: 'collier-barre-argent',
    name: 'Collier Barre Argent',
    category: 'colliers',
    price: 32.90,
    description: 'Collier minimaliste avec barre horizontale gravable. Argent 925, chaîne 45cm.',
    maxChars: 15,
    images: ['/images/collier-barre-argent.jpg'],
    modelColor: '#c0c0c0', // Silver
    dimensions: { width: 35, height: 5 },
    inStock: true,
  },
  {
    id: 'bracelet-jonc-or',
    name: 'Jonc Personnalisé Or',
    category: 'bracelets',
    price: 44.90,
    description: 'Bracelet jonc ouvert à graver sur le dessus. Plaqué or 18 carats, taille unique ajustable.',
    maxChars: 10,
    images: ['/images/bracelet-jonc-or.jpg'],
    modelColor: '#d4af37',
    dimensions: { width: 40, height: 6 },
    inStock: true,
  },
  {
    id: 'bracelet-chaine-plaque',
    name: 'Bracelet Chaîne Plaque',
    category: 'bracelets',
    price: 36.90,
    description: 'Bracelet chaîne fine avec plaque centrale personnalisable. Plaqué or, ajustable 16-19cm.',
    maxChars: 12,
    images: ['/images/bracelet-chaine-plaque.jpg'],
    modelColor: '#d4af37',
    dimensions: { width: 30, height: 8 },
    inStock: true,
  },
  {
    id: 'bracelet-cuir-argent',
    name: 'Bracelet Cuir & Argent',
    category: 'bracelets',
    price: 42.90,
    description: 'Bracelet en cuir véritable avec plaque argent 925 à personnaliser. Fermoir magnétique.',
    maxChars: 10,
    images: ['/images/bracelet-cuir-argent.jpg'],
    modelColor: '#c0c0c0',
    dimensions: { width: 35, height: 10 },
    inStock: true,
  },
]

export const categories = [
  { id: 'colliers', name: 'Colliers & Pendentifs', icon: '💎' },
  { id: 'bracelets', name: 'Bracelets', icon: '✨' },
]

export const fonts = [
  { id: 'elegant', name: 'Élégant', fontFamily: 'Cormorant Garamond', preview: 'Abc' },
  { id: 'script', name: 'Script', fontFamily: 'Dancing Script', preview: 'Abc' },
  { id: 'modern', name: 'Moderne', fontFamily: 'Montserrat', preview: 'Abc' },
  { id: 'classic', name: 'Classique', fontFamily: 'Playfair Display', preview: 'Abc' },
]

export const deliveryOptions = [
  {
    id: 'salon',
    name: 'Livraison en salon',
    description: 'Récupérez votre bijou dans votre salon partenaire',
    price: 0,
    delay: '45 jours ouvrés',
    icon: '🏪',
  },
  {
    id: 'relay',
    name: 'Point Relais Mondial Relay',
    description: 'Livraison dans le point relais de votre choix',
    price: 4.99,
    delay: '48-72h après expédition',
    icon: '📦',
  },
  {
    id: 'home',
    name: 'Livraison à domicile',
    description: 'Livraison directement chez vous par Mondial Relay',
    price: 7.99,
    delay: '24-48h après expédition',
    icon: '🏠',
  },
]

export function getProductById(id) {
  return products.find(p => p.id === id)
}

export function getProductsByCategory(categoryId) {
  return products.filter(p => p.category === categoryId)
}

export function getFontById(id) {
  return fonts.find(f => f.id === id)
}

export function getDeliveryOptionById(id) {
  return deliveryOptions.find(d => d.id === id)
}
