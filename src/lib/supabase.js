import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Please check your .env file.')
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  }
)

// Helper functions for products
export const productsApi = {
  // Get all products
  async getAll() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Get active products only
  async getActive() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Get single product by ID
  async getById(id) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Create new product
  async create(product) {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update product
  async update(id, updates) {
    const { data, error } = await supabase
      .from('products')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete product
  async delete(id) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  },

  // Toggle product status
  async toggleStatus(id, currentStatus) {
    return this.update(id, { active: !currentStatus })
  }
}

// Helper functions for salons
export const salonsApi = {
  // Get all salons
  async getAll() {
    const { data, error } = await supabase
      .from('salons')
      .select('*')
      .order('name', { ascending: true })

    if (error) throw error
    return data
  },

  // Get salon by slug (for URL routing)
  async getBySlug(slug) {
    const { data, error } = await supabase
      .from('salons')
      .select('*')
      .eq('slug', slug)
      .eq('active', true)
      .single()

    if (error) throw error
    return data
  },

  // Get salon by ID
  async getById(id) {
    const { data, error } = await supabase
      .from('salons')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Create new salon
  async create(salon) {
    const { data, error } = await supabase
      .from('salons')
      .insert([salon])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update salon
  async update(id, updates) {
    const { data, error } = await supabase
      .from('salons')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete salon
  async delete(id) {
    const { error } = await supabase
      .from('salons')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  },

  // Import multiple salons from CSV data
  async importBulk(salons) {
    const { data, error } = await supabase
      .from('salons')
      .insert(salons)
      .select()

    if (error) throw error
    return data
  },

  // Export all salons with URLs
  async exportAll(baseUrl) {
    const { data, error } = await supabase
      .from('salons')
      .select('name, slug, email, phone, city, postal_code, commission_rate, active')
      .order('name', { ascending: true })

    if (error) throw error

    // Add URL to each salon
    return data.map(salon => ({
      ...salon,
      url: `${baseUrl}/salon/${salon.slug}`
    }))
  }
}

// Helper functions for orders
export const ordersApi = {
  // Get all orders
  async getAll() {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        salon:salons(name, slug),
        items:order_items(*, product:products(name, category))
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Get orders by salon
  async getBySalon(salonId) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*, product:products(name, category))
      `)
      .eq('salon_id', salonId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Create new order
  async create(order, items) {
    // Generate order number
    const orderNumber = `AVA-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`

    // Insert order
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([{ ...order, order_number: orderNumber }])
      .select()
      .single()

    if (orderError) throw orderError

    // Insert order items
    const orderItems = items.map(item => ({
      order_id: orderData.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      customization: item.customization
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) throw itemsError

    return orderData
  },

  // Update order status
  async updateStatus(id, status) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }
}

// Helper functions for users
export const usersApi = {
  // Get all users
  async getAll() {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        salon:salons(name)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Get user by email
  async getByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        salon:salons(*)
      `)
      .eq('email', email)
      .single()

    if (error) throw error
    return data
  },

  // Create new user
  async create(user) {
    const { data, error } = await supabase
      .from('users')
      .insert([user])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update user
  async update(id, updates) {
    const { data, error } = await supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete user
  async delete(id) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  }
}
