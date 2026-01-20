const jwt = require('jsonwebtoken')
const { getDb } = require('../db/init')

const JWT_SECRET = process.env.JWT_SECRET || 'ava-bijoux-secret-key-change-in-production'

function generateToken(payload, expiresIn = '7d') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn })
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    return null
  }
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header missing' })
  }

  const token = authHeader.split(' ')[1]
  const decoded = verifyToken(token)

  if (!decoded) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }

  req.user = decoded
  next()
}

function salonAuthMiddleware(req, res, next) {
  authMiddleware(req, res, () => {
    if (req.user.type !== 'salon') {
      return res.status(403).json({ error: 'Salon access required' })
    }

    const db = getDb()
    const salon = db.prepare('SELECT * FROM salons WHERE id = ?').get(req.user.id)

    if (!salon) {
      return res.status(404).json({ error: 'Salon not found' })
    }

    req.salon = salon
    next()
  })
}

function adminAuthMiddleware(req, res, next) {
  authMiddleware(req, res, () => {
    if (req.user.type !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' })
    }

    const db = getDb()
    const admin = db.prepare('SELECT * FROM admins WHERE id = ?').get(req.user.id)

    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' })
    }

    req.admin = admin
    next()
  })
}

module.exports = {
  generateToken,
  verifyToken,
  authMiddleware,
  salonAuthMiddleware,
  adminAuthMiddleware
}
