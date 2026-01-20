const express = require('express')
const { getDb } = require('../db/init')
const { adminAuthMiddleware, salonAuthMiddleware } = require('../middleware/auth')

const router = express.Router()

const COMMISSION_RATE = 0.30 // 30%

// Create order (public - from checkout)
router.post('/', async (req, res) => {
  try {
    const {
      salon_id,
      customer,
      items,
      delivery,
      subtotal,
      delivery_cost,
      total,
      payment_intent_id
    } = req.body

    if (!customer?.email || !items?.length || !delivery?.type) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const db = getDb()
    const orderId = 'AVA-' + Date.now().toString(36).toUpperCase()

    // Insert order
    db.prepare(`
      INSERT INTO orders (
        id, salon_id, customer_email, customer_name, customer_phone,
        delivery_type, delivery_address, delivery_city, delivery_postal_code,
        relay_point_id, subtotal, delivery_cost, total, payment_intent_id, payment_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      orderId,
      salon_id,
      customer.email,
      customer.name,
      customer.phone,
      delivery.type,
      delivery.address,
      delivery.city,
      delivery.postalCode,
      delivery.relayPointId,
      subtotal,
      delivery_cost,
      total,
      payment_intent_id,
      'paid'
    )

    // Insert order items
    const insertItem = db.prepare(`
      INSERT INTO order_items (order_id, product_id, custom_text, font, color, price)
      VALUES (?, ?, ?, ?, ?, ?)
    `)

    for (const item of items) {
      insertItem.run(orderId, item.productId, item.customText, item.font, item.color, item.price)
    }

    // Create commission if salon linked
    if (salon_id) {
      const commissionAmount = subtotal * COMMISSION_RATE
      db.prepare(`
        INSERT INTO commissions (salon_id, order_id, amount, status)
        VALUES (?, ?, ?, 'pending')
      `).run(salon_id, orderId, commissionAmount)
    }

    res.status(201).json({
      orderId,
      message: 'Order created successfully'
    })
  } catch (error) {
    console.error('Create order error:', error)
    res.status(500).json({ error: 'Failed to create order' })
  }
})

// Get all orders (admin only)
router.get('/', adminAuthMiddleware, (req, res) => {
  try {
    const { status, salon_id, limit = 50, offset = 0 } = req.query
    const db = getDb()

    let query = `
      SELECT
        o.*,
        s.name as salon_name,
        COALESCE(c.amount, 0) as commission_amount,
        c.status as commission_status
      FROM orders o
      LEFT JOIN salons s ON o.salon_id = s.id
      LEFT JOIN commissions c ON o.id = c.order_id
      WHERE 1=1
    `
    const params = []

    if (status) {
      query += ' AND o.status = ?'
      params.push(status)
    }

    if (salon_id) {
      query += ' AND o.salon_id = ?'
      params.push(salon_id)
    }

    query += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?'
    params.push(parseInt(limit), parseInt(offset))

    const orders = db.prepare(query).all(...params)

    // Get items for each order
    const getItems = db.prepare(`
      SELECT oi.*, p.name as product_name
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `)

    for (const order of orders) {
      order.items = getItems.all(order.id)
    }

    res.json({ orders })
  } catch (error) {
    console.error('Get orders error:', error)
    res.status(500).json({ error: 'Failed to get orders' })
  }
})

// Get salon's orders (salon only)
router.get('/salon', salonAuthMiddleware, (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query
    const db = getDb()

    let query = `
      SELECT
        o.*,
        COALESCE(c.amount, 0) as commission_amount,
        c.status as commission_status
      FROM orders o
      LEFT JOIN commissions c ON o.id = c.order_id
      WHERE o.salon_id = ?
    `
    const params = [req.salon.id]

    if (status) {
      query += ' AND o.status = ?'
      params.push(status)
    }

    query += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?'
    params.push(parseInt(limit), parseInt(offset))

    const orders = db.prepare(query).all(...params)

    // Get items for each order
    const getItems = db.prepare(`
      SELECT oi.*, p.name as product_name
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `)

    for (const order of orders) {
      order.items = getItems.all(order.id)
    }

    res.json({ orders })
  } catch (error) {
    console.error('Get salon orders error:', error)
    res.status(500).json({ error: 'Failed to get orders' })
  }
})

// Get single order (admin only)
router.get('/:id', adminAuthMiddleware, (req, res) => {
  try {
    const db = getDb()

    const order = db.prepare(`
      SELECT
        o.*,
        s.name as salon_name,
        s.email as salon_email,
        COALESCE(c.amount, 0) as commission_amount,
        c.status as commission_status
      FROM orders o
      LEFT JOIN salons s ON o.salon_id = s.id
      LEFT JOIN commissions c ON o.id = c.order_id
      WHERE o.id = ?
    `).get(req.params.id)

    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }

    order.items = db.prepare(`
      SELECT oi.*, p.name as product_name
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `).all(req.params.id)

    res.json({ order })
  } catch (error) {
    console.error('Get order error:', error)
    res.status(500).json({ error: 'Failed to get order' })
  }
})

// Update order status (admin only)
router.patch('/:id/status', adminAuthMiddleware, (req, res) => {
  try {
    const { status } = req.body
    const validStatuses = ['pending', 'production', 'shipped', 'ready', 'delivered', 'cancelled']

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }

    const db = getDb()

    const order = db.prepare('SELECT id FROM orders WHERE id = ?').get(req.params.id)
    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }

    db.prepare(`
      UPDATE orders
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(status, req.params.id)

    res.json({ message: 'Order status updated' })
  } catch (error) {
    console.error('Update order status error:', error)
    res.status(500).json({ error: 'Failed to update order status' })
  }
})

module.exports = router
