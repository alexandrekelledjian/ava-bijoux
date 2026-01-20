import React from 'react'
import { Link, useNavigate, useOutletContext } from 'react-router-dom'
import { ArrowLeft, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { fonts, deliveryOptions, getProductById } from '../../data/products'

export default function CartPage() {
  const navigate = useNavigate()
  const { getSalonParam } = useOutletContext()
  const { cart, removeFromCart, deliveryOption, setDeliveryOption, currentSalon } = useStore()

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0)
  const deliveryCost = deliveryOption ? deliveryOptions.find(d => d.id === deliveryOption)?.price || 0 : 0
  const total = subtotal + deliveryCost

  const handleCheckout = () => {
    if (cart.length > 0 && deliveryOption) {
      navigate(`/checkout${getSalonParam()}`)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-24 h-24 mx-auto mb-6 bg-ava-100 rounded-full flex items-center justify-center">
          <ShoppingBag size={40} className="text-ava-400" />
        </div>
        <h1 className="text-2xl font-serif font-semibold text-ava-700 mb-4">
          Votre panier est vide
        </h1>
        <p className="text-gray-600 mb-8">
          Découvrez notre collection et créez votre bijou personnalisé
        </p>
        <Link to={`/${getSalonParam()}`} className="btn-primary inline-flex items-center gap-2">
          <ArrowLeft size={20} />
          Voir la collection
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(`/${getSalonParam()}`)}
        className="flex items-center gap-2 text-gray-600 hover:text-ava-gold mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        Continuer mes achats
      </button>

      <h1 className="text-3xl font-serif font-semibold text-ava-700 mb-8">
        Mon panier ({cart.length} article{cart.length > 1 ? 's' : ''})
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <CartItem
              key={item.cartId}
              item={item}
              onRemove={() => removeFromCart(item.cartId)}
            />
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="font-semibold text-ava-700 text-lg mb-6">
              Récapitulatif
            </h2>

            {/* Delivery Options */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Mode de livraison
              </h3>
              <div className="space-y-2">
                {deliveryOptions.map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      deliveryOption === option.id
                        ? 'border-ava-gold bg-ava-gold/5'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${
                      option.id === 'salon' && !currentSalon ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="delivery"
                      value={option.id}
                      checked={deliveryOption === option.id}
                      onChange={() => setDeliveryOption(option.id)}
                      disabled={option.id === 'salon' && !currentSalon}
                      className="mt-1 accent-ava-gold"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-800">
                          {option.icon} {option.name}
                        </span>
                        <span className={`font-semibold ${option.price === 0 ? 'text-green-600' : 'text-gray-800'}`}>
                          {option.price === 0 ? 'Gratuit' : `${option.price.toFixed(2)} €`}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {option.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {option.delay}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
              {!currentSalon && (
                <p className="text-xs text-amber-600 mt-2">
                  ⚠️ Livraison en salon non disponible sans lien salon partenaire
                </p>
              )}
            </div>

            {/* Price Summary */}
            <div className="border-t border-gray-200 pt-4 space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Sous-total</span>
                <span>{subtotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Livraison</span>
                <span>
                  {!deliveryOption
                    ? '—'
                    : deliveryCost === 0
                    ? 'Gratuit'
                    : `${deliveryCost.toFixed(2)} €`}
                </span>
              </div>
              <div className="flex justify-between text-lg font-semibold text-ava-700 pt-3 border-t border-gray-200">
                <span>Total</span>
                <span className="text-ava-gold">{total.toFixed(2)} €</span>
              </div>
            </div>

            {/* Commission note */}
            {currentSalon && (
              <div className="mt-4 p-3 bg-ava-50 rounded-lg text-sm text-gray-600">
                <span className="font-medium text-ava-700">✨ Commande via {currentSalon.name}</span>
                <p className="text-xs mt-1">30% de cette commande sera reversé à votre salon</p>
              </div>
            )}

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={!deliveryOption}
              className={`w-full btn-primary mt-6 flex items-center justify-center gap-2 ${
                !deliveryOption ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Passer commande
              <ArrowRight size={20} />
            </button>

            {!deliveryOption && (
              <p className="text-sm text-gray-500 text-center mt-2">
                Choisissez un mode de livraison
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function CartItem({ item, onRemove }) {
  const product = getProductById(item.productId)

  return (
    <div className="card p-4 flex gap-4">
      {/* Product image placeholder */}
      <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-ava-100 to-ava-200 flex-shrink-0 flex items-center justify-center">
        <div
          className="w-12 h-12 rounded-full"
          style={{ backgroundColor: product?.modelColor || '#d4af37' }}
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold text-ava-700">{item.productName}</h3>
            <div className="text-sm text-gray-500 mt-1 space-y-0.5">
              <p>
                Gravure:{' '}
                <span
                  className="font-medium text-gray-800"
                  style={{ fontFamily: fonts.find(f => f.id === item.font)?.fontFamily }}
                >
                  "{item.customText}"
                </span>
              </p>
              <p>Typo: {item.fontName} • Métal: {item.colorName}</p>
            </div>
          </div>
          <span className="font-semibold text-ava-gold whitespace-nowrap">
            {item.price.toFixed(2)} €
          </span>
        </div>

        <div className="flex items-center justify-between mt-3">
          <button
            onClick={onRemove}
            className="text-red-500 hover:text-red-600 text-sm flex items-center gap-1 transition-colors"
          >
            <Trash2 size={16} />
            Supprimer
          </button>
        </div>
      </div>
    </div>
  )
}
