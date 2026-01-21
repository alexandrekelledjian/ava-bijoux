import React, { useEffect } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, ShoppingBag, Wallet, LogOut, Menu, X } from 'lucide-react'
import { useStore } from '../../store/useStore'

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
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/salon/dashboard" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center">
                <span className="text-white font-serif text-xl font-bold">A</span>
              </div>
              <div>
                <span className="text-xl font-serif font-semibold text-ava-800">Ava</span>
                <span className="text-xs text-gray-500 block -mt-1">Espace Salon</span>
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
                      ? 'bg-ava-gold/10 text-ava-gold'
                      : 'text-gray-600 hover:bg-gray-100'
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
                <p className="text-sm font-medium text-gray-800">{salonAuth.name}</p>
                <p className="text-xs text-gray-500">{salonAuth.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                title="Déconnexion"
              >
                <LogOut size={20} />
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-500"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-gray-200 bg-white pb-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 ${
                  isActive(item.path)
                    ? 'bg-ava-gold/10 text-ava-gold'
                    : 'text-gray-600'
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
