import React, { useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { ArrowLeft, Lock, CreditCard, Truck, MapPin } from 'lucide-react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useStore } from '../../store/useStore'
import { deliveryOptions } from '../../data/products'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { getSalonParam } = useOutletContext()
  const stripe = useStripe()
  const elements = useElements()

  const { cart, deliveryOption, currentSalon, clearCart } = useStore()

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    postalCode: '',
    city: '',
    relayPoint: '',
  })

  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0)
  const deliveryCost = deliveryOptions.find(d => d.id === deliveryOption)?.price || 0
  const total = subtotal + deliveryCost

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      // In production, you would:
      // 1. Create a payment intent on your server
      // 2. Confirm the payment with Stripe
      // 3. Create the order in your database

      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Create order object
      const order = {
        id: `AVA-${Date.now()}`,
        items: cart,
        customer: formData,
        delivery: {
          option: deliveryOption,
          cost: deliveryCost,
        },
        salon: currentSalon,
        subtotal,
        total,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      }

      // In production, send to API
      console.log('Order created:', order)

      // Clear cart and redirect to confirmation
      clearCart()
      navigate(`/confirmation/${order.id}${getSalonParam()}`, {
        state: { order }
      })

    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.')
      console.error('Payment error:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  const needsAddress = deliveryOption === 'home'
  const needsRelayPoint = deliveryOption === 'relay'

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(`/panier${getSalonParam()}`)}
        className="flex items-center gap-2 text-gray-600 hover:text-ava-gold mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        Retour au panier
      </button>

      <h1 className="text-3xl font-serif font-semibold text-ava-800 mb-8">
        Finaliser ma commande
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact Information */}
            <div className="card p-6">
              <h2 className="font-semibold text-ava-800 text-lg mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-ava-gold text-white flex items-center justify-center text-sm">1</span>
                Vos coordonnées
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Prénom *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label">Nom *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label">Téléphone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            {(needsAddress || needsRelayPoint) && (
              <div className="card p-6">
                <h2 className="font-semibold text-ava-800 text-lg mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-ava-gold text-white flex items-center justify-center text-sm">2</span>
                  <Truck size={20} className="text-ava-gold" />
                  {needsAddress ? 'Adresse de livraison' : 'Point Relais'}
                </h2>

                {needsAddress ? (
                  <div className="space-y-4">
                    <div>
                      <label className="label">Adresse *</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                        placeholder="Numéro et nom de rue"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="label">Code postal *</label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          required
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="label">Ville *</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          className="input-field"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="label">Choisir un point relais *</label>
                    <div className="bg-ava-50 rounded-lg p-4 text-center text-gray-600">
                      <MapPin size={32} className="mx-auto mb-2 text-ava-gold" />
                      <p className="text-sm">
                        En production, intégration de la carte Mondial Relay
                        pour sélectionner votre point de retrait
                      </p>
                      <input
                        type="text"
                        name="relayPoint"
                        value={formData.relayPoint}
                        onChange={handleInputChange}
                        required
                        className="input-field mt-3"
                        placeholder="ID du point relais (simulation)"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Salon Delivery Info */}
            {deliveryOption === 'salon' && currentSalon && (
              <div className="card p-6">
                <h2 className="font-semibold text-ava-800 text-lg mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-ava-gold text-white flex items-center justify-center text-sm">2</span>
                  <MapPin size={20} className="text-ava-gold" />
                  Retrait en salon
                </h2>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <p className="font-medium text-green-800">
                    🏪 {currentSalon.name}
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    Votre bijou sera disponible sous 45 jours ouvrés.
                    Vous recevrez un email dès qu'il sera prêt à être récupéré.
                  </p>
                </div>
              </div>
            )}

            {/* Payment */}
            <div className="card p-6">
              <h2 className="font-semibold text-ava-800 text-lg mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-ava-gold text-white flex items-center justify-center text-sm">
                  {deliveryOption === 'salon' ? '3' : needsAddress || needsRelayPoint ? '3' : '2'}
                </span>
                <CreditCard size={20} className="text-ava-gold" />
                Paiement sécurisé
              </h2>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#424770',
                        '::placeholder': {
                          color: '#aab7c4',
                        },
                      },
                      invalid: {
                        color: '#9e2146',
                      },
                    },
                  }}
                />
              </div>

              <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                <Lock size={14} />
                Paiement sécurisé par Stripe. Vos données sont protégées.
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="font-semibold text-ava-800 text-lg mb-4">
                Votre commande
              </h2>

              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.cartId} className="flex justify-between text-sm">
                    <div>
                      <p className="font-medium text-gray-800">{item.productName}</p>
                      <p className="text-gray-500">"{item.customText}"</p>
                    </div>
                    <span className="font-medium">{item.price.toFixed(2)} €</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total</span>
                  <span>{subtotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Livraison</span>
                  <span className={deliveryCost === 0 ? 'text-green-600 font-medium' : ''}>
                    {deliveryCost === 0 ? 'Gratuit' : `${deliveryCost.toFixed(2)} €`}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-semibold text-ava-800 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-ava-gold">{total.toFixed(2)} €</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing || !stripe}
                className={`w-full btn-primary mt-6 flex items-center justify-center gap-2 ${
                  isProcessing ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Paiement en cours...
                  </>
                ) : (
                  <>
                    <Lock size={18} />
                    Payer {total.toFixed(2)} €
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                En passant commande, vous acceptez nos CGV et notre politique de confidentialité.
                Les bijoux personnalisés ne sont ni repris ni échangés.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
