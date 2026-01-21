import React, { useEffect } from 'react'
import { Outlet, Link, useSearchParams, useLocation } from 'react-router-dom'
import { ShoppingBag, User } from 'lucide-react'
import { useStore } from '../../store/useStore'

export default function ClientLayout() {
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const { cart, currentSalon, setCurrentSalon } = useStore()

  // Extract salon ID from URL parameter
  useEffect(() => {
    const salonId = searchParams.get('salon') || searchParams.get('id_salon')
    if (salonId && salonId !== currentSalon?.id) {
      // In production, fetch salon details from API
      setCurrentSalon({
        id: salonId,
        name: 'Salon Partenaire', // Would be fetched from API
      })
    }
  }, [searchParams, currentSalon, setCurrentSalon])

  // Preserve salon parameter in navigation
  const getSalonParam = () => {
    const salonId = currentSalon?.id || searchParams.get('salon') || searchParams.get('id_salon')
    return salonId ? `?salon=${salonId}` : ''
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to={`/${getSalonParam()}`} className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center">
                <span className="text-white font-serif text-xl font-bold">A</span>
              </div>
              <span className="text-2xl font-serif font-semibold text-ava-800">Ava</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link
                to={`/${getSalonParam()}`}
                className="text-gray-600 hover:text-ava-gold transition-colors"
              >
                Accueil
              </Link>
              <Link
                to={`/${getSalonParam()}#colliers`}
                className="text-gray-600 hover:text-ava-gold transition-colors"
              >
                Colliers
              </Link>
              <Link
                to={`/${getSalonParam()}#bracelets`}
                className="text-gray-600 hover:text-ava-gold transition-colors"
              >
                Bracelets
              </Link>
            </nav>

            {/* Cart */}
            <div className="flex items-center gap-4">
              {currentSalon && (
                <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
                  <User size={16} />
                  <span>{currentSalon.name}</span>
                </div>
              )}
              <Link
                to={`/panier${getSalonParam()}`}
                className="relative p-2 text-gray-600 hover:text-ava-gold transition-colors"
              >
                <ShoppingBag size={24} />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-ava-gold text-white text-xs rounded-full flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Salon banner */}
        {currentSalon && (
          <div className="bg-ava-gold/10 border-t border-ava-gold/20">
            <div className="max-w-7xl mx-auto px-4 py-2 text-center text-sm text-ava-800">
              <span className="font-medium">✨ Boutique exclusive pour {currentSalon.name}</span>
              <span className="text-gray-600"> — Livraison gratuite en salon disponible</span>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet context={{ getSalonParam }} />
      </main>

      {/* Footer */}
      <footer className="bg-ava-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-ava-gold flex items-center justify-center">
                  <span className="text-white font-serif text-xl font-bold">A</span>
                </div>
                <span className="text-2xl font-serif font-semibold">Ava</span>
              </div>
              <p className="text-gray-300 max-w-md">
                Des bijoux personnalisés qui racontent votre histoire.
                Créez un cadeau unique et intemporel.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold mb-4">Informations</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-ava-gold transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-ava-gold transition-colors">Livraison</a></li>
                <li><a href="#" className="hover:text-ava-gold transition-colors">Retours</a></li>
                <li><a href="#" className="hover:text-ava-gold transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-ava-gold transition-colors">CGV</a></li>
                <li><a href="#" className="hover:text-ava-gold transition-colors">Mentions légales</a></li>
                <li><a href="#" className="hover:text-ava-gold transition-colors">Confidentialité</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>© 2024 Ava Bijoux Personnalisés. Tous droits réservés.</p>
            <p className="mt-1">Une marque Dépôts Gemmes</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
