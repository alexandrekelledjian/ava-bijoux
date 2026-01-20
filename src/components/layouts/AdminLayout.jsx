import React, { useEffect, useState } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Store,
  ShoppingBag,
  Wallet,
  LogOut,
  Menu,
  X,
  Settings,
  Package,
  Gem,
  ImagePlus
} from 'lucide-react'
import { useStore } from '../../store/useStore'

// Star icon matching brand guidelines
function StarIcon({ className = 'w-3 h-3', color = '#e8c88b' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill={color}>
      <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
    </svg>
  )
}

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { adminAuth, logoutAdmin } = useStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!adminAuth) {
      navigate('/admin/login')
    }
  }, [adminAuth, navigate])

  if (!adminAuth) return null

  const handleLogout = () => {
    logoutAdmin()
    navigate('/admin/login')
  }

  const navItems = [
    { path: '/admin/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { path: '/admin/produits', label: 'Produits', icon: Gem },
    { path: '/admin/commandes', label: 'Commandes', icon: ShoppingBag },
    { path: '/admin/salons', label: 'Salons partenaires', icon: Store },
    { path: '/admin/commissions', label: 'Commissions', icon: Wallet },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-ava-700 text-white transform transition-transform lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-ava-600/30">
            <Link to="/admin/dashboard" className="flex items-center gap-3">
              <StarIcon className="w-8 h-8" />
              <div>
                <span className="text-2xl font-serif tracking-wide">ava</span>
                <span className="text-xs text-ava-gold block tracking-widest uppercase">Administration</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-ava-gold text-white'
                    : 'text-ava-200 hover:bg-ava-700 hover:text-white'
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-ava-600/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-ava-gold/20 border border-ava-gold/40 flex items-center justify-center">
                <span className="font-semibold text-ava-gold">
                  {adminAuth.name?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{adminAuth.name}</p>
                <p className="text-xs text-gray-400 truncate">{adminAuth.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-ava-600/50 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              Déconnexion
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
            >
              <Menu size={24} />
            </button>

            <div className="flex items-center gap-4 ml-auto">
              <a
                href="/"
                target="_blank"
                className="text-sm text-gray-600 hover:text-ava-gold flex items-center gap-1"
              >
                <Package size={16} />
                Voir la boutique
              </a>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
