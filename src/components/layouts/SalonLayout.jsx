import React, { useEffect } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, ShoppingBag, Wallet, LogOut, Menu, X } from 'lucide-react'
import { useStore } from '../../store/useStore'

// Étoile décorative (basée sur la charte graphique)
function StarIcon({ className = 'w-2.5 h-2.5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="#e8c88b">
      <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
    </svg>
  )
}

export default function SalonLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { salonAuth, logoutSalon } = useStore()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!salonAuth) {
      navigate('/salon/login')
    }
  }, [salonAuth, navigate])

  if (!salonAuth) return null

  const handleLogout = () => {
    logoutSalon()
    navigate('/salon/login')
  }

  const navItems = [
    { path: '/salon/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { path: '/salon/commandes', label: 'Commandes', icon: ShoppingBag },
    { path: '/salon/commissions', label: 'Commissions', icon: Wallet },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen bg-ava-50">
      {/* Top Header */}
      <header className="bg-white border-b border-ava-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/salon/dashboard" className="flex items-center gap-3">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-serif italic text-ava-700 tracking-wide">
                  ava
                </span>
                <StarIcon className="w-2 h-2 -mt-0.5" />
              </div>
              <div>
                <span className="text-xs text-ava-500 uppercase tracking-wider">Espace Salon</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-ava-700 text-white'
                      : 'text-ava-600 hover:bg-ava-100'
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-ava-700">{salonAuth.name}</p>
                <p className="text-xs text-ava-500">{salonAuth.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-ava-500 hover:text-red-500 transition-colors"
                title="Déconnexion"
              >
                <LogOut size={20} />
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-ava-500"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-ava-100 bg-white pb-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 ${
                  isActive(item.path)
                    ? 'bg-ava-700 text-white'
                    : 'text-ava-600'
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
