const express = require('express')
const { getDb } = require('../db/init')
const { adminAuthMiddleware } = require('../middleware/auth')

const router = express.Router()

// Get all products (public)
router.get('/', (req, res) => {
  try {
    const db = getDb()
    const products = db.prepare(`
      SELECT * FROM products
      WHERE in_stock = 1
      ORDER BY category, price
    `).all()

    res.json({ products })
  } catch (error) {
    console.error('Get products error:', error)
    res.status(500).json({ error: 'Failed to get products' })
  }
})

// Get single product (public)
router.get('/:id', (req, res) => {
  try {
    const db = getDb()
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id)

    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    res.json({ product })
  } catch (error) {
    console.error('Get product error:', error)
    res.status(500).json({ error: 'Failed to get product' })
  }
})

// Create product (admin only)
router.post('/', adminAuthMiddleware, (req, res) => {
  try {
    const { id, name, category, price, description, max_chars, model_color } = req.body

    if (!id || !name || !category || !price) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const db = getDb()

    db.prepare(`
      INSERT INTO products (id, name, category, price, description, max_chars, model_color)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, name, category, price, description, max_chars || 15, model_color)

    res.status(201).json({ message: 'Product created', id })
  } catch (error) {
    console.error('Create product error:', error)
    res.status(500).json({ error: 'Failed to create product' })
  }
})

// Update product (admin only)
router.put('/:id', adminAuthMiddleware, (req, res) => {
  try {
    const { name, category, price, description, max_chars, model_color, in_stock } = req.body
    const db = getDb()

    db.prepare(`
      UPDATE products
      SET name = COALESCE(?, name),
          category = COALESCE(?, category),
          price = COALESCE(?, price),
          description = COALESCE(?, description),
          max_chars = COALESCE(?, max_chars),
          model_color = COALESCE(?, model_color),
          in_stock = COALESCE(?, in_stock)
      WHERE id = ?
    `).run(name, category, price, description, max_chars, model_color, in_stock, req.params.id)

    res.json({ message: 'Product updated' })
  } catch (error) {
    console.error('Update product error:', error)
    res.status(500).json({ error: 'Failed to update product' })
  }
})

module.exports = router
