import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'

// Pages Client
import HomePage from './pages/client/HomePage'
import ProductPage from './pages/client/ProductPage'
import CustomizePage from './pages/client/CustomizePage'
import CartPage from './pages/client/CartPage'
import CheckoutPage from './pages/client/CheckoutPage'
import OrderConfirmation from './pages/client/OrderConfirmation'

// Pages Salon
import SalonLogin from './pages/salon/SalonLogin'
import SalonDashboard from './pages/salon/SalonDashboard'
import SalonOrders from './pages/salon/SalonOrders'
import SalonCommissions from './pages/salon/SalonCommissions'

// Pages Admin
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminSalons from './pages/admin/AdminSalons'
import AdminOrders from './pages/admin/AdminOrders'
import AdminCommissions from './pages/admin/AdminCommissions'
import ProductsPage from './pages/admin/ProductsPage'

// Layout components
import ClientLayout from './components/layouts/ClientLayout'
import SalonLayout from './components/layouts/SalonLayout'
import AdminLayout from './components/layouts/AdminLayout'

// Store
import { useStore } from './store/useStore'

// Initialize Stripe (replace with your public key)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_placeholder')

function App() {
  return (
    <Elements stripe={stripePromise}>
      <Routes>
        {/* Client Routes - with salon parameter */}
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<HomePage />} />
          <Route path="produit/:productId" element={<ProductPage />} />
          <Route path="personnaliser/:productId" element={<CustomizePage />} />
          <Route path="panier" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="confirmation/:orderId" element={<OrderConfirmation />} />
        </Route>

        {/* Salon Routes */}
        <Route path="/salon">
          <Route path="login" element={<SalonLogin />} />
          <Route element={<SalonLayout />}>
            <Route path="dashboard" element={<SalonDashboard />} />
            <Route path="commandes" element={<SalonOrders />} />
            <Route path="commissions" element={<SalonCommissions />} />
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route path="/admin">
          <Route path="login" element={<AdminLogin />} />
          <Route element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="produits" element={<ProductsPage />} />
            <Route path="salons" element={<AdminSalons />} />
            <Route path="commandes" element={<AdminOrders />} />
            <Route path="commissions" element={<AdminCommissions />} />
          </Route>
        </Route>
      </Routes>
    </Elements>
  )
}

export default App
