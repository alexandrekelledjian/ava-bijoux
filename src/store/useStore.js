import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { productsApi, salonsApi, ordersApi, usersApi } from '../lib/supabase'

export const useStore = create(
  persist(
    (set, get) => ({
      // ============ PRODUCTS STATE ============
      products: [],
      productsLoading: false,
      productsError: null,

      // Fetch all products from Supabase
      fetchProducts: async () => {
        set({ productsLoading: true, productsError: null })
        try {
          const data = await productsApi.getAll()
          set({ products: data, productsLoading: false })
          return data
        } catch (error) {
          console.error('Error fetching products:', error)
          set({ productsError: error.message, productsLoading: false })
          throw error
        }
      },

      // Fetch only active products (for client side)
      fetchActiveProducts: async () => {
        set({ productsLoading: true, productsError: null })
        try {
          const data = await productsApi.getActive()
          set({ products: data, productsLoading: false })
          return data
        } catch (error) {
          console.error('Error fetching active products:', error)
          set({ productsError: error.message, productsLoading: false })
          throw error
        }
      },

      // Add a new product
      addProduct: async (productData) => {
        try {
          // Map frontend field names to database field names
          const dbProduct = {
            name: productData.name,
            category: productData.category,
            base_price: parseFloat(productData.basePrice),
            description: productData.description || '',
            images: productData.images || [],
            materials: productData.materials || ['Acier inoxydable'],
            customizable: productData.customizable !== false,
            max_chars: productData.maxChars || 15,
            active: productData.active !== false,
            stock: parseInt(productData.stock) || 0
          }

          const newProduct = await productsApi.create(dbProduct)

          // Map back to frontend format and add to state
          const frontendProduct = mapProductToFrontend(newProduct)
          set(state => ({ products: [frontendProduct, ...state.products] }))

          return frontendProduct
        } catch (error) {
          console.error('Error adding product:', error)
          throw error
        }
      },

      // Update a product
      updateProduct: async (id, updates) => {
        try {
          // Map frontend field names to database field names
          const dbUpdates = {}
          if (updates.name !== undefined) dbUpdates.name = updates.name
          if (updates.category !== undefined) dbUpdates.category = updates.category
          if (updates.basePrice !== undefined) dbUpdates.base_price = parseFloat(updates.basePrice)
          if (updates.description !== undefined) dbUpdates.description = updates.description
          if (updates.images !== undefined) dbUpdates.images = updates.images
          if (updates.materials !== undefined) dbUpdates.materials = updates.materials
          if (updates.customizable !== undefined) dbUpdates.customizable = updates.customizable
          if (updates.maxChars !== undefined) dbUpdates.max_chars = updates.maxChars
          if (updates.active !== undefined) dbUpdates.active = updates.active
          if (updates.stock !== undefined) dbUpdates.stock = parseInt(updates.stock)

          const updatedProduct = await productsApi.update(id, dbUpdates)

          // Map back to frontend format and update state
          const frontendProduct = mapProductToFrontend(updatedProduct)
          set(state => ({
            products: state.products.map(p =>
              p.id === id ? frontendProduct : p
            )
          }))

          return frontendProduct
        } catch (error) {
          console.error('Error updating product:', error)
          throw error
        }
      },

      // Delete a product
      deleteProduct: async (id) => {
        try {
          await productsApi.delete(id)
          set(state => ({
            products: state.products.filter(p => p.id !== id)
          }))
          return true
        } catch (error) {
          console.error('Error deleting product:', error)
          throw error
        }
      },

      // Toggle product active status
      toggleProductStatus: async (id) => {
        const product = get().products.find(p => p.id === id)
        if (product) {
          return get().updateProduct(id, { active: !product.active })
        }
      },

      // ============ SALONS STATE ============
      salons: [],
      salonsLoading: false,
      salonsError: null,

      fetchSalons: async () => {
        set({ salonsLoading: true, salonsError: null })
        try {
          const data = await salonsApi.getAll()
          set({ salons: data, salonsLoading: false })
          return data
        } catch (error) {
          console.error('Error fetching salons:', error)
          set({ salonsError: error.message, salonsLoading: false })
          throw error
        }
      },

      getSalonBySlug: async (slug) => {
        try {
          return await salonsApi.getBySlug(slug)
        } catch (error) {
          console.error('Error fetching salon by slug:', error)
          throw error
        }
      },

      addSalon: async (salonData) => {
        try {
          const newSalon = await salonsApi.create(salonData)
          set(state => ({ salons: [...state.salons, newSalon] }))
          return newSalon
        } catch (error) {
          console.error('Error adding salon:', error)
          throw error
        }
      },

      updateSalon: async (id, updates) => {
        try {
          const updatedSalon = await salonsApi.update(id, updates)
          set(state => ({
            salons: state.salons.map(s => s.id === id ? updatedSalon : s)
          }))
          return updatedSalon
        } catch (error) {
          console.error('Error updating salon:', error)
          throw error
        }
      },

      deleteSalon: async (id) => {
        try {
          await salonsApi.delete(id)
          set(state => ({
            salons: state.salons.filter(s => s.id !== id)
          }))
          return true
        } catch (error) {
          console.error('Error deleting salon:', error)
          throw error
        }
      },

      importSalons: async (salonsData) => {
        try {
          const imported = await salonsApi.importBulk(salonsData)
          set(state => ({ salons: [...state.salons, ...imported] }))
          return imported
        } catch (error) {
          console.error('Error importing salons:', error)
          throw error
        }
      },

      exportSalons: async (baseUrl) => {
        try {
          return await salonsApi.exportAll(baseUrl)
        } catch (error) {
          console.error('Error exporting salons:', error)
          throw error
        }
      },

      // ============ USERS STATE ============
      users: [],
      usersLoading: false,
      usersError: null,

      fetchUsers: async () => {
        set({ usersLoading: true, usersError: null })
        try {
          const data = await usersApi.getAll()
          set({ users: data, usersLoading: false })
          return data
        } catch (error) {
          console.error('Error fetching users:', error)
          set({ usersError: error.message, usersLoading: false })
          throw error
        }
      },

      addUser: async (userData) => {
        try {
          const newUser = await usersApi.create(userData)
          set(state => ({ users: [...state.users, newUser] }))
          return newUser
        } catch (error) {
          console.error('Error adding user:', error)
          throw error
        }
      },

      updateUser: async (id, updates) => {
        try {
          const updatedUser = await usersApi.update(id, updates)
          set(state => ({
            users: state.users.map(u => u.id === id ? updatedUser : u)
          }))
          return updatedUser
        } catch (error) {
          console.error('Error updating user:', error)
          throw error
        }
      },

      deleteUser: async (id) => {
        try {
          await usersApi.delete(id)
          set(state => ({
            users: state.users.filter(u => u.id !== id)
          }))
          return true
        } catch (error) {
          console.error('Error deleting user:', error)
          throw error
        }
      },

      // ============ ORDERS STATE ============
      orders: [],
      ordersLoading: false,
      ordersError: null,

      fetchOrders: async () => {
        set({ ordersLoading: true, ordersError: null })
        try {
          const data = await ordersApi.getAll()
          set({ orders: data, ordersLoading: false })
          return data
        } catch (error) {
          console.error('Error fetching orders:', error)
          set({ ordersError: error.message, ordersLoading: false })
          throw error
        }
      },

      fetchSalonOrders: async (salonId) => {
        set({ ordersLoading: true, ordersError: null })
        try {
          const data = await ordersApi.getBySalon(salonId)
          set({ orders: data, ordersLoading: false })
          return data
        } catch (error) {
          console.error('Error fetching salon orders:', error)
          set({ ordersError: error.message, ordersLoading: false })
          throw error
        }
      },

      createOrder: async (orderData, items) => {
        try {
          const newOrder = await ordersApi.create(orderData, items)
          set(state => ({ orders: [newOrder, ...state.orders] }))
          return newOrder
        } catch (error) {
          console.error('Error creating order:', error)
          throw error
        }
      },

      updateOrderStatus: async (id, status) => {
        try {
          const updatedOrder = await ordersApi.updateStatus(id, status)
          set(state => ({
            orders: state.orders.map(o => o.id === id ? { ...o, status } : o)
          }))
          return updatedOrder
        } catch (error) {
          console.error('Error updating order status:', error)
          throw error
        }
      },

      // ============ LOCAL STATE (persisted) ============

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

// Helper function to map database product to frontend format
function mapProductToFrontend(dbProduct) {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    category: dbProduct.category,
    basePrice: dbProduct.base_price,
    description: dbProduct.description,
    images: dbProduct.images || [],
    materials: dbProduct.materials || [],
    customizable: dbProduct.customizable,
    maxChars: dbProduct.max_chars,
    active: dbProduct.active,
    stock: dbProduct.stock,
    createdAt: dbProduct.created_at,
    updatedAt: dbProduct.updated_at
  }
}
