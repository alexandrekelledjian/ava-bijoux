import React, { useState, useEffect, Suspense } from 'react'
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'
import { ArrowLeft, ShoppingBag, Check, AlertCircle } from 'lucide-react'
import { getProductById, fonts } from '../../data/products'
import { useStore } from '../../store/useStore'
import JewelryPreview3D from '../../components/JewelryPreview3D'

export default function CustomizePage() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { getSalonParam } = useOutletContext()
  const { addToCart, currentSalon } = useStore()

  const product = getProductById(productId)

  const [customText, setCustomText] = useState('')
  const [selectedFont, setSelectedFont] = useState('elegant')
  const [selectedColor, setSelectedColor] = useState('gold')
  const [isAdding, setIsAdding] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Redirect if product not found
  useEffect(() => {
    if (!product) {
      navigate(`/${getSalonParam()}`)
    }
  }, [product, navigate, getSalonParam])

  if (!product) return null

  const colors = [
    { id: 'gold', name: 'Or', hex: '#d4af37' },
    { id: 'silver', name: 'Argent', hex: '#c0c0c0' },
    { id: 'rose', name: 'Or Rose', hex: '#e8c4c4' },
  ]

  const handleAddToCart = () => {
    if (!customText.trim()) {
      return
    }

    setIsAdding(true)

    const cartItem = {
      productId: product.id,
      productName: product.name,
      price: product.price,
      customText: customText.trim(),
      font: selectedFont,
      fontName: fonts.find(f => f.id === selectedFont)?.name,
      color: selectedColor,
      colorName: colors.find(c => c.id === selectedColor)?.name,
      salonId: currentSalon?.id,
      salonName: currentSalon?.name,
    }

    addToCart(cartItem)

    setTimeout(() => {
      setIsAdding(false)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)
    }, 500)
  }

  const goToCart = () => {
    navigate(`/panier${getSalonParam()}`)
  }

  const isTextValid = customText.trim().length > 0 && customText.length <= product.maxChars

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back button */}
      <button
        onClick={() => navigate(`/${getSalonParam()}`)}
        className="flex items-center gap-2 text-gray-600 hover:text-ava-gold mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        Retour à la collection
      </button>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* 3D Preview */}
        <div className="relative">
          <Suspense fallback={
            <div className="w-full h-[400px] md:h-[500px] bg-gray-100 rounded-2xl flex items-center justify-center">
              <div className="text-gray-500">Chargement de la prévisualisation...</div>
            </div>
          }>
            <JewelryPreview3D
              productType={product.id}
              text={customText || 'Votre texte'}
              font={selectedFont}
              color={selectedColor}
            />
          </Suspense>

          {/* Preview badge */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium text-ava-700 shadow-sm">
            ✨ Prévisualisation 3D
          </div>
        </div>

        {/* Customization Panel */}
        <div>
          <div className="mb-6">
            <h1 className="text-3xl font-serif font-semibold text-ava-700 mb-2">
              {product.name}
            </h1>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <div className="text-2xl font-semibold text-ava-gold">
              {product.price.toFixed(2)} €
            </div>
          </div>

          {/* Text Input */}
          <div className="mb-8">
            <label className="label">
              Votre texte personnalisé
              <span className="text-gray-400 font-normal ml-2">
                ({customText.length}/{product.maxChars} caractères)
              </span>
            </label>
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value.slice(0, product.maxChars))}
              placeholder="Ex: Marie, 15.06.2024..."
              className={`input-field text-lg ${
                customText.length > product.maxChars ? 'border-red-500 focus:border-red-500' : ''
              }`}
              maxLength={product.maxChars}
            />
            {customText.length === product.maxChars && (
              <p className="text-amber-600 text-sm mt-1 flex items-center gap-1">
                <AlertCircle size={14} />
                Nombre maximum de caractères atteint
              </p>
            )}
          </div>

          {/* Font Selection */}
          <div className="mb-8">
            <label className="label mb-3">Choisissez votre typographie</label>
            <div className="grid grid-cols-2 gap-3">
              {fonts.map((font) => (
                <button
                  key={font.id}
                  onClick={() => setSelectedFont(font.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    selectedFont === font.id
                      ? 'border-ava-gold bg-ava-gold/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div
                    className="text-2xl mb-1"
                    style={{ fontFamily: font.fontFamily }}
                  >
                    {customText || font.preview}
                  </div>
                  <div className="text-sm text-gray-500">{font.name}</div>
                  {selectedFont === font.id && (
                    <div className="absolute top-2 right-2">
                      <Check size={16} className="text-ava-gold" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div className="mb-8">
            <label className="label mb-3">Couleur du métal</label>
            <div className="flex gap-4">
              {colors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setSelectedColor(color.id)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                    selectedColor === color.id
                      ? 'border-ava-gold bg-ava-gold/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-sm text-gray-700">{color.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-ava-50 rounded-xl p-5 mb-6">
            <h3 className="font-semibold text-ava-700 mb-3">Récapitulatif</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Bijou</span>
                <span className="font-medium">{product.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Gravure</span>
                <span className="font-medium" style={{ fontFamily: fonts.find(f => f.id === selectedFont)?.fontFamily }}>
                  {customText || '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Typographie</span>
                <span className="font-medium">
                  {fonts.find(f => f.id === selectedFont)?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Métal</span>
                <span className="font-medium">
                  {colors.find(c => c.id === selectedColor)?.name}
                </span>
              </div>
              <div className="border-t border-ava-200 pt-2 mt-2 flex justify-between">
                <span className="font-semibold text-ava-700">Total</span>
                <span className="font-semibold text-ava-gold text-lg">
                  {product.price.toFixed(2)} €
                </span>
              </div>
            </div>
          </div>

          {/* Add to Cart Button */}
          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              disabled={!isTextValid || isAdding}
              className={`flex-1 btn-primary flex items-center justify-center gap-2 ${
                !isTextValid || isAdding ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isAdding ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Ajout en cours...
                </>
              ) : showSuccess ? (
                <>
                  <Check size={20} />
                  Ajouté au panier !
                </>
              ) : (
                <>
                  <ShoppingBag size={20} />
                  Ajouter au panier
                </>
              )}
            </button>

            {showSuccess && (
              <button onClick={goToCart} className="btn-secondary">
                Voir le panier
              </button>
            )}
          </div>

          {!customText.trim() && (
            <p className="text-gray-500 text-sm mt-3 text-center">
              Entrez votre texte pour ajouter ce bijou au panier
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
