import React, { useEffect } from 'react'
import { Outlet, Link, useSearchParams, useLocation } from 'react-router-dom'
import { ShoppingBag, User } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { LogoFull } from '../Logo'

// Composant étoile décorative (basé sur la charte graphique)
function StarIcon({ className = 'w-3 h-3', color = '#e8c88b' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill={color}>
      <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
    </svg>
  )
}

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
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to={`/${getSalonParam()}`} className="flex items-center">
              <div className="flex flex-col items-center">
                <span className="text-3xl font-serif italic text-ava-700 tracking-wide">
                  ava
                </span>
                <StarIcon className="w-2.5 h-2.5 -mt-0.5" />
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link
                to={`/${getSalonParam()}`}
                className="text-ava-600 hover:text-ava-700 transition-colors text-sm uppercase tracking-wider"
              >
                Accueil
              </Link>
              <Link
                to={`/${getSalonParam()}#colliers`}
                className="text-ava-600 hover:text-ava-700 transition-colors text-sm uppercase tracking-wider"
              >
                Colliers
              </Link>
              <Link
                to={`/${getSalonParam()}#bracelets`}
                className="text-ava-600 hover:text-ava-700 transition-colors text-sm uppercase tracking-wider"
              >
                Bracelets
              </Link>
            </nav>

            {/* Cart */}
            <div className="flex items-center gap-4">
              {currentSalon && (
                <div className="hidden sm:flex items-center gap-2 text-sm text-ava-500">
                  <User size={16} />
                  <span>{currentSalon.name}</span>
                </div>
              )}
              <Link
                to={`/panier${getSalonParam()}`}
                className="relative p-2 text-ava-600 hover:text-ava-700 transition-colors"
              >
                <ShoppingBag size={24} />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-ava-gold text-ava-700 text-xs font-medium rounded-full flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Salon banner */}
        {currentSalon && (
          <div className="bg-ava-gold/10 border-t border-ava-gold/30">
            <div className="max-w-7xl mx-auto px-4 py-2 text-center text-sm text-ava-700">
              <StarIcon className="w-2 h-2 inline-block mr-2" />
              <span className="font-medium">Boutique exclusive pour {currentSalon.name}</span>
              <span className="text-ava-500"> — Livraison gratuite en salon disponible</span>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet context={{ getSalonParam }} />
      </main>

      {/* Footer */}
      <footer className="bg-ava-700 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex flex-col items-start mb-4">
                <span className="text-3xl font-serif italic text-white tracking-wide">
                  ava
                </span>
                <StarIcon className="w-2.5 h-2.5 mt-1" />
                <span className="text-[10px] tracking-[0.2em] uppercase text-ava-300 mt-1">
                  Bijoux Acier Inoxydable
                </span>
              </div>
              <p className="text-ava-200 max-w-md mt-4">
                Des bijoux personnalisés en acier inoxydable qui racontent votre histoire.
                Créez un cadeau unique et intemporel.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold mb-4 text-ava-gold">Informations</h4>
              <ul className="space-y-2 text-ava-200">
                <li><a href="#" className="hover:text-ava-gold transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-ava-gold transition-colors">Livraison</a></li>
                <li><a href="#" className="hover:text-ava-gold transition-colors">Retours</a></li>
                <li><a href="#" className="hover:text-ava-gold transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-4 text-ava-gold">Légal</h4>
              <ul className="space-y-2 text-ava-200">
                <li><a href="#" className="hover:text-ava-gold transition-colors">CGV</a></li>
                <li><a href="#" className="hover:text-ava-gold transition-colors">Mentions légales</a></li>
                <li><a href="#" className="hover:text-ava-gold transition-colors">Confidentialité</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-ava-600 mt-8 pt-8 text-center text-ava-300 text-sm">
            <p>© 2024 Ava - Bijoux Acier Inoxydable. Tous droits réservés.</p>
            <p className="mt-1">Une marque Dépôts Gemmes</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
