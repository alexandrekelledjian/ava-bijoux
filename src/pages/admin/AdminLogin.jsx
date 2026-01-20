import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, LogIn, Shield } from 'lucide-react'
import { useStore } from '../../store/useStore'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { setAdminAuth } = useStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // In production, validate credentials against API
      // For demo, accept admin@ava.fr / admin
      if (email.includes('admin') || email.includes('@ava')) {
        const adminData = {
          id: 'admin_' + Date.now(),
          name: 'Administrateur',
          email: email,
          role: 'admin',
          token: 'admin_token_' + Date.now(),
        }
        setAdminAuth(adminData)
        navigate('/admin/dashboard')
      } else {
        setError('Identifiants incorrects. Veuillez réessayer.')
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ava-700 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3">
            <div className="w-14 h-14 rounded-full gradient-gold flex items-center justify-center">
              <span className="text-white font-serif text-3xl font-bold">A</span>
            </div>
          </div>
          <h1 className="text-2xl font-serif font-semibold text-white mt-4">
            Administration Ava
          </h1>
          <p className="text-ava-300 mt-2">
            Accès réservé aux administrateurs
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex items-center gap-2 mb-6 text-ava-700">
            <Shield size={20} />
            <span className="font-medium">Connexion sécurisée</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label">Adresse email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field"
                placeholder="admin@ava-bijoux.fr"
              />
            </div>

            <div>
              <label className="label">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-field pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full btn-primary flex items-center justify-center gap-2 ${
                isLoading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Connexion...
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  Se connecter
                </>
              )}
            </button>
          </form>
        </div>

        {/* Demo Note */}
        <div className="mt-6 p-4 bg-ava-700 rounded-lg text-sm text-ava-200">
          <p className="font-medium text-white">🔐 Mode démo</p>
          <p className="mt-1">
            Utilisez une adresse contenant "admin" pour vous connecter.
          </p>
        </div>

        {/* Back links */}
        <div className="text-center mt-6 space-x-4 text-sm">
          <Link to="/" className="text-ava-300 hover:text-white">
            Boutique
          </Link>
          <span className="text-ava-600">•</span>
          <Link to="/salon/login" className="text-ava-300 hover:text-white">
            Espace Salon
          </Link>
        </div>
      </div>
    </div>
  )
}
