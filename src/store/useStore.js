import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Produits par défaut
const defaultProducts = [
  {
        id: 1,
        name: 'Collier Étoile',
        category: 'collier',
        basePrice: 35,
        description: 'Un magnifique collier avec pendentif étoile personnalisable',
        images: [],
        materials: ['Acier inoxydable', 'Plaqué or'],
        customizable: true,
        maxChars: 15,
        active: true,
        stock: 100,
        createdAt: '2025-01-10'
  },
  {
        id: 2,
        name: 'Bracelet Infini',
        category: 'bracelet',
        basePrice: 28,
        description: 'Bracelet élégant avec symbole infini et gravure personnalisée',
        images: [],
        materials: ['Acier inoxydable', 'Or rose'],
        customizable: true,
        maxChars: 10,
        active: true,
        stock: 75,
        createdAt: '2025-01-12'
  },
  {
        id: 3,
        name: 'Pendentif Cœur',
        category: 'collier',
        basePrice: 42,
        description: 'Pendentif en forme de cœur avec gravure laser',
        images: [],
        materials: ['Acier inoxydable', 'Plaqué or'],
        customizable: true,
        maxChars: 12,
        active: true,
        stock: 50,
        createdAt: '2025-01-15'
  }
  ]

export const useStore = create(
    persist(
          (set, get) => ({
                  // ============ PRODUCTS MANAGEMENT ============
                               products: defaultProducts,

                  getActiveProducts: () => {
                            return get().products.filter(p => p.active)
                  },

                  getProductById: (id) => {
                            return get().products.find(p => p.id === parseInt(id))
                  },

                  addProduct: (product) => set((state) => ({
                            products: [...state.products, {
                                        ...product,
                                        id: Date.now(),
                                        createdAt: new Date().toISOString().split('T')[0]
                            }]
                  })),

                  updateProduct: (id, updates) => set((state) => ({
                            products: state.products.map(p =>
                                        p.id === id ? { ...p, ...updates } : p
                                                                 )
                  })),

                  deleteProduct: (id) => set((state) => ({
                            products: state.products.filter(p => p.id !== id)
                  })),

                  toggleProductStatus: (id) => set((state) => ({
                            products: state.products.map(p =>
                                        p.id === id ? { ...p, active: !p.active } : p
                                                                 )
                  })),

                  // ============ SALON CONTEXT ============
                  currentSalon: null,
                  setCurrentSalon: (salon) => set({ currentSalon: salon }),

                  // ============ CART ============
                  cart: [],
                  addToCart: (item) => set((state) => ({
                            cart: [...state.cart, { ...item, cartId: Date.now() }]
                  })),
                  removeFromCart: (cartId) => set((state) => ({
                            cart: state.cart.filter((item) => item.cartId !== cartId)
                  })),
                  updateCartItem: (cartId, updates) => set((state) => ({
                            cart: state.cart.map((item) =>
                                        item.cartId === cartId ? { ...item, ...updates } : item
                                                         )
                  })),
                  clearCart: () => set({ cart: [] }),
                  getCartTotal: () => {
                            const cart = get().cart
                            return cart.reduce((total, item) => total + item.price, 0)
                  },

                  // ============ DELIVERY ============
                  deliveryOption: null,
                  setDeliveryOption: (option) => set({ deliveryOption: option }),

                  // ============ CUSTOMIZATION ============
                  currentCustomization: {
                            productId: null,
                            text: '',
                            font: 'elegant',
                            color: 'gold',
                  },
                  setCustomization: (updates) => set((state) => ({
                            currentCustomization: { ...state.currentCustomization, ...updates }
                  })),
                  resetCustomization: () => set({
                            currentCustomization: {
                                        productId: null,
                                        text: '',
                                        font: 'elegant',
                                        color: 'gold',
                            }
                  }),

                  // ============ SALON AUTH ============
                  salonAuth: null,
                  setSalonAuth: (auth) => set({ salonAuth: auth }),
                  logoutSalon: () => set({ salonAuth: null }),

                  // ============ ADMIN AUTH ============
                  adminAuth: null,
                  setAdminAuth: (auth) => set({ adminAuth: auth }),
                  logoutAdmin: () => set({ adminAuth: null }),
          }),
      {
              name: 'ava-bijoux-storage',
              partialize: (state) => ({
                        products: state.products,
                        cart: state.cart,
                        currentSalon: state.currentSalon,
                        deliveryOption: state.deliveryOption,
                        salonAuth: state.salonAuth,
                        adminAuth: state.adminAuth,
              }),
      }
        )
  )
