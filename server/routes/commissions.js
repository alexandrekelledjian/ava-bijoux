const express = require('express')
const { getDb } = require('../db/init')
const { adminAuthMiddleware, salonAuthMiddleware } = require('../middleware/auth')

const router = express.Router()

// Get all commissions (admin only)
router.get('/', adminAuthMiddleware, (req, res) => {
  try {
    const { status, salon_id } = req.query
    const db = getDb()

    let query = `
      SELECT
        c.*,
        s.name as salon_name,
        s.email as salon_email,
        s.iban as salon_iban,
        o.customer_name,
        o.total as order_total
      FROM commissions c
      JOIN salons s ON c.salon_id = s.id
      JOIN orders o ON c.order_id = o.id
      WHERE 1=1
    `
    const params = []

    if (status) {
      query += ' AND c.status = ?'
      params.push(status)
    }

    if (salon_id) {
      query += ' AND c.salon_id = ?'
      params.push(salon_id)
    }

    query += ' ORDER BY c.created_at DESC'

    const commissions = db.prepare(query).all(...params)

    // Summary stats
    const summary = db.prepare(`
      SELECT
        SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) as total_pending,
        SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) as total_paid,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count
      FROM commissions
    `).get()

    res.json({ commissions, summary })
  } catch (error) {
    console.error('Get commissions error:', error)
    res.status(500).json({ error: 'Failed to get commissions' })
  }
})

// Get commission summary by salon (admin only)
router.get('/by-salon', adminAuthMiddleware, (req, res) => {
  try {
    const db = getDb()

    const salons = db.prepare(`
      SELECT
        s.id,
        s.name,
        s.email,
        s.iban,
        SUM(CASE WHEN c.status = 'pending' THEN c.amount ELSE 0 END) as pending_amount,
        SUM(CASE WHEN c.status = 'paid' THEN c.amount ELSE 0 END) as paid_amount,
        COUNT(CASE WHEN c.status = 'pending' THEN 1 END) as pending_orders,
        MAX(p.requested_at) as payout_requested_at
      FROM salons s
      LEFT JOIN commissions c ON s.id = c.salon_id
      LEFT JOIN payouts p ON s.id = p.salon_id AND p.status = 'pending'
      GROUP BY s.id
      HAVING pending_amount > 0 OR paid_amount > 0
      ORDER BY pending_amount DESC
    `).all()

    res.json({ salons })
  } catch (error) {
    console.error('Get commissions by salon error:', error)
    res.status(500).json({ error: 'Failed to get commissions' })
  }
})

// Get salon's commissions (salon only)
router.get('/me', salonAuthMiddleware, (req, res) => {
  try {
    const db = getDb()

    // Get pending commissions (orders delivered)
    const pending = db.prepare(`
      SELECT c.*, o.id as order_id, o.customer_name, o.status as order_status
      FROM commissions c
      JOIN orders o ON c.order_id = o.id
      WHERE c.salon_id = ? AND c.status = 'pending'
      ORDER BY c.created_at DESC
    `).all(req.salon.id)

    // Get summary
    const summary = db.prepare(`
      SELECT
        SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) as available,
        SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) as total_paid
      FROM commissions
      WHERE salon_id = ?
    `).get(req.salon.id)

    // Get payout history
    const payouts = db.prepare(`
      SELECT * FROM payouts
      WHERE salon_id = ?
      ORDER BY requested_at DESC
      LIMIT 10
    `).all(req.salon.id)

    // Check for pending payout request
    const pendingPayout = db.prepare(`
      SELECT * FROM payouts
      WHERE salon_id = ? AND status = 'pending'
      LIMIT 1
    `).get(req.salon.id)

    res.json({
      commissions: pending,
      summary: {
        available: summary.available || 0,
        totalPaid: summary.total_paid || 0,
        hasPendingRequest: !!pendingPayout
      },
      payouts
    })
  } catch (error) {
    console.error('Get salon commissions error:', error)
    res.status(500).json({ error: 'Failed to get commissions' })
  }
})

// Request payout (salon only)
router.post('/request-payout', salonAuthMiddleware, (req, res) => {
  try {
    const db = getDb()

    // Check if already has pending payout
    const existingPayout = db.prepare(`
      SELECT id FROM payouts
      WHERE salon_id = ? AND status = 'pending'
    `).get(req.salon.id)

    if (existingPayout) {
      return res.status(400).json({ error: 'A payout request is already pending' })
    }

    // Get available amount
    const available = db.prepare(`
      SELECT SUM(amount) as total
      FROM commissions
      WHERE salon_id = ? AND status = 'pending'
    `).get(req.salon.id)

    if (!available.total || available.total <= 0) {
      return res.status(400).json({ error: 'No commission available for payout' })
    }

    // Create payout request
    const payoutId = 'PAY-' + Date.now().toString(36).toUpperCase()
    db.prepare(`
      INSERT INTO payouts (id, salon_id, amount, status)
      VALUES (?, ?, ?, 'pending')
    `).run(payoutId, req.salon.id, available.total)

    res.json({
      message: 'Payout request submitted',
      payoutId,
      amount: available.total
    })
  } catch (error) {
    console.error('Request payout error:', error)
    res.status(500).json({ error: 'Failed to request payout' })
  }
})

// Process payout (admin only)
router.post('/process-payout/:id', adminAuthMiddleware, (req, res) => {
  try {
    const db = getDb()

    const payout = db.prepare(`
      SELECT p.*, s.name as salon_name, s.iban
      FROM payouts p
      JOIN salons s ON p.salon_id = s.id
      WHERE p.id = ?
    `).get(req.params.id)

    if (!payout) {
      return res.status(404).json({ error: 'Payout not found' })
    }

    if (payout.status !== 'pending') {
      return res.status(400).json({ error: 'Payout already processed' })
    }

    // Mark payout as completed
    db.prepare(`
      UPDATE payouts
      SET status = 'completed', processed_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(req.params.id)

    // Mark related commissions as paid
    db.prepare(`
      UPDATE commissions
      SET status = 'paid', payout_id = ?, paid_at = CURRENT_TIMESTAMP
      WHERE salon_id = ? AND status = 'pending'
    `).run(req.params.id, payout.salon_id)

    res.json({
      message: 'Payout processed',
      amount: payout.amount,
      salon: payout.salon_name
    })
  } catch (error) {
    console.error('Process payout error:', error)
    res.status(500).json({ error: 'Failed to process payout' })
  }
})

module.exports = router
