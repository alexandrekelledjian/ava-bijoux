require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')

// Import routes
const authRoutes = require('./routes/auth')
const salonRoutes = require('./routes/salons')
const productRoutes = require('./routes/products')
const orderRoutes = require('./routes/orders')
const commissionRoutes = require('./routes/commissions')
const paymentRoutes = require('./routes/payments')

// Initialize database
const { initDatabase } = require('./db/init')

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Initialize database on startup
initDatabase()

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/salons', salonRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/commissions', commissionRoutes)
app.use('/api/payments', paymentRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')))
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'))
  })
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📦 API available at http://localhost:${PORT}/api`)
})
