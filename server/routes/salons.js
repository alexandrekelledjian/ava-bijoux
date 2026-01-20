const express = require('express')
const bcrypt = require('bcryptjs')
const { getDb } = require('../db/init')
const { adminAuthMiddleware, salonAuthMiddleware } = require('../middleware/auth')

const router = express.Router()

// Get salon by ID (public - for shop link)
router.get('/public/:id', (req, res) => {
  try {
    const db = getDb()
    const salon = db.prepare(`
      SELECT id, name, city
      FROM salons
      WHERE id = ? AND status = 'active'
    `).get(req.params.id)

    if (!salon) {
      return res.status(404).json({ error: 'Salon not found' })
    }

    res.json({ salon })
  } catch (error) {
    console.error('Get salon error:', error)
    res.status(500).json({ error: 'Failed to get salon' })
  }
})

// Get all salons (admin only)
router.get('/', adminAuthMiddleware, (req, res) => {
  try {
    const db = getDb()
    const salons = db.prepare(`
      SELECT
        s.*,
        COUNT(DISTINCT o.id) as total_orders,
        COALESCE(SUM(o.total), 0) as total_revenue,
        COALESCE(SUM(CASE WHEN c.status = 'pending' THEN c.amount ELSE 0 END), 0) as pending_commission
      FROM salons s
      LEFT JOIN orders o ON s.id = o.salon_id
      LEFT JOIN commissions c ON s.id = c.salon_id
      GROUP BY s.id
      ORDER BY total_revenue DESC
    `).all()

    res.json({ salons })
  } catch (error) {
    console.error('Get salons error:', error)
    res.status(500).json({ error: 'Failed to get salons' })
  }
})

// Create salon (admin only)
router.post('/', adminAuthMiddleware, (req, res) => {
  try {
    const { name, email, phone, city, address, postal_code, iban, bic } = req.body

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email required' })
    }

    const db = getDb()

    // Check if email already exists
    const existing = db.prepare('SELECT id FROM salons WHERE email = ?').get(email)
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' })
    }

    // Generate ID and temporary password
    const id = 'rec' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
    const tempPassword = Math.random().toString(36).slice(2, 10)
    const passwordHash = bcrypt.hashSync(tempPassword, 10)

    db.prepare(`
      INSERT INTO salons (id, name, email, password_hash, phone, city, address, postal_code, iban, bic)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, name, email, passwordHash, phone, city, address, postal_code, iban, bic)

    res.status(201).json({
      message: 'Salon created',
      salon: { id, name, email },
      tempPassword // In production, send by email instead
    })
  } catch (error) {
    console.error('Create salon error:', error)
    res.status(500).json({ error: 'Failed to create salon' })
  }
})

// Update salon (admin only)
router.put('/:id', adminAuthMiddleware, (req, res) => {
  try {
    const { name, phone, city, address, postal_code, iban, bic, status } = req.body
    const db = getDb()

    const salon = db.prepare('SELECT id FROM salons WHERE id = ?').get(req.params.id)
    if (!salon) {
      return res.status(404).json({ error: 'Salon not found' })
    }

    db.prepare(`
      UPDATE salons
      SET name = COALESCE(?, name),
          phone = COALESCE(?, phone),
          city = COALESCE(?, city),
          address = COALESCE(?, address),
          postal_code = COALESCE(?, postal_code),
          iban = COALESCE(?, iban),
          bic = COALESCE(?, bic),
          status = COALESCE(?, status),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(name, phone, city, address, postal_code, iban, bic, status, req.params.id)

    res.json({ message: 'Salon updated' })
  } catch (error) {
    console.error('Update salon error:', error)
    res.status(500).json({ error: 'Failed to update salon' })
  }
})

// Get current salon's data (salon only)
router.get('/me', salonAuthMiddleware, (req, res) => {
  try {
    const db = getDb()

    // Get salon stats
    const stats = db.prepare(`
      SELECT
        COUNT(DISTINCT o.id) as total_orders,
        COALESCE(SUM(o.total), 0) as total_revenue,
        COALESCE(SUM(CASE WHEN c.status = 'pending' THEN c.amount ELSE 0 END), 0) as pending_commission,
        COALESCE(SUM(CASE WHEN c.status = 'paid' THEN c.amount ELSE 0 END), 0) as paid_commission
      FROM orders o
      LEFT JOIN commissions c ON o.id = c.order_id
      WHERE o.salon_id = ?
    `).get(req.salon.id)

    res.json({
      salon: {
        id: req.salon.id,
        name: req.salon.name,
        email: req.salon.email,
        city: req.salon.city
      },
      stats
    })
  } catch (error) {
    console.error('Get salon me error:', error)
    res.status(500).json({ error: 'Failed to get salon data' })
  }
})

module.exports = router
