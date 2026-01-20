import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import { useStore } from '../../store/useStore'

export default function SalonLogin() {
  const navigate = useNavigate()
  const { setSalonAuth } = useStore()

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
      // For demo, accept any login with email containing "salon"
      if (email.includes('salon') || email.includes('@')) {
        const salonData = {
          id: 'salon_' + Date.now(),
          name: 'Salon ' + email.split('@')[0].replace('.', ' '),
          email: email,
          token: 'demo_token_' + Date.now(),
        }
        setSalonAuth(salonData)
        navigate('/salon/dashboard')
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
    <div className="min-h-screen bg-gradient-to-br from-ava-cream via-white to-ava-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-14 h-14 rounded-full gradient-gold flex items-center justify-center">
              <span className="text-white font-serif text-3xl font-bold">A</span>
            </div>
          </Link>
          <h1 className="text-2xl font-serif font-semibold text-ava-700 mt-4">
            Espace Salon Partenaire
          </h1>
          <p className="text-gray-600 mt-2">
            Connectez-vous pour accéder à votre tableau de bord
          </p>
        </div>

        {/* Login Form */}
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label">Adresse email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field"
                placeholder="votre.salon@email.com"
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

          <div className="mt-6 text-center">
            <a href="#" className="text-sm text-ava-gold hover:underline">
              Mot de passe oublié ?
            </a>
          </div>
        </div>

        {/* Demo Note */}
        <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200 text-sm text-amber-800">
          <p className="font-medium">🔐 Mode démo</p>
          <p className="mt-1">
            Utilisez n'importe quelle adresse email pour vous connecter.
          </p>
        </div>

        {/* Back to shop */}
        <p className="text-center mt-6 text-gray-600 text-sm">
          <Link to="/" className="text-ava-gold hover:underline">
            ← Retour à la boutique
          </Link>
        </p>
      </div>
    </div>
  )
}
