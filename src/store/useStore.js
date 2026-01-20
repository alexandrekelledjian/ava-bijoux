import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useStore = create(
  persist(
    (set, get) => ({
      // Salon context (from URL parameter)
      currentSalon: null,
      setCurrentSalon: (salon) => set({ currentSalon: salon }),

      // Cart
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

      // Delivery option
      deliveryOption: null,
      setDeliveryOption: (option) => set({ deliveryOption: option }),

      // Current customization state
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

      // Salon auth
      salonAuth: null,
      setSalonAuth: (auth) => set({ salonAuth: auth }),
      logoutSalon: () => set({ salonAuth: null }),

      // Admin auth
      adminAuth: null,
      setAdminAuth: (auth) => set({ adminAuth: auth }),
      logoutAdmin: () => set({ adminAuth: null }),
    }),
    {
      name: 'ava-bijoux-storage',
      partialize: (state) => ({
        cart: state.cart,
        currentSalon: state.currentSalon,
        deliveryOption: state.deliveryOption,
        salonAuth: state.salonAuth,
        adminAuth: state.adminAuth,
      }),
    }
  )
)
