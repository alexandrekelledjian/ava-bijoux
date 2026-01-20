const express = require('express')
const bcrypt = require('bcryptjs')
const { getDb } = require('../db/init')
const { generateToken } = require('../middleware/auth')

const router = express.Router()

// Salon login
router.post('/salon/login', (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' })
    }

    const db = getDb()
    const salon = db.prepare('SELECT * FROM salons WHERE email = ?').get(email)

    if (!salon) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const validPassword = bcrypt.compareSync(password, salon.password_hash)
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    if (salon.status !== 'active') {
      return res.status(403).json({ error: 'Account is inactive' })
    }

    const token = generateToken({
      id: salon.id,
      email: salon.email,
      type: 'salon'
    })

    res.json({
      token,
      salon: {
        id: salon.id,
        name: salon.name,
        email: salon.email,
        city: salon.city
      }
    })
  } catch (error) {
    console.error('Salon login error:', error)
    res.status(500).json({ error: 'Login failed' })
  }
})

// Admin login
router.post('/admin/login', (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' })
    }

    const db = getDb()
    const admin = db.prepare('SELECT * FROM admins WHERE email = ?').get(email)

    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const validPassword = bcrypt.compareSync(password, admin.password_hash)
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = generateToken({
      id: admin.id,
      email: admin.email,
      role: admin.role,
      type: 'admin'
    })

    res.json({
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    })
  } catch (error) {
    console.error('Admin login error:', error)
    res.status(500).json({ error: 'Login failed' })
  }
})

module.exports = router
