import React from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, ShoppingBag, Wallet, Users, ArrowRight, ExternalLink } from 'lucide-react'
import { useStore } from '../../store/useStore'

// Mock data - in production, fetch from API
const mockStats = {
  totalOrders: 47,
  pendingOrders: 3,
  totalRevenue: 1847.50,
  pendingCommission: 554.25,
  paidCommission: 892.75,
  thisMonthOrders: 12,
  thisMonthRevenue: 478.80,
}

const mockRecentOrders = [
  { id: 'AVA-20240115001', customer: 'Marie D.', product: 'Collier Plaque Or', status: 'production', date: '15/01/2024', amount: 39.90 },
  { id: 'AVA-20240114002', customer: 'Sophie L.', product: 'Médaillon Cœur', status: 'shipped', date: '14/01/2024', amount: 34.90 },
  { id: 'AVA-20240112003', customer: 'Julie M.', product: 'Jonc Personnalisé Or', status: 'delivered', date: '12/01/2024', amount: 44.90 },
]

export default function SalonDashboard() {
  const { salonAuth } = useStore()

  const salonLink = `${window.location.origin}/?salon=${salonAuth?.id}`

  const copyLink = () => {
    navigator.clipboard.writeText(salonLink)
    alert('Lien copié !')
  }

  return (
    <div>
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-semibold text-ava-700">
          Bonjour, {salonAuth?.name} 👋
        </h1>
        <p className="text-gray-600 mt-1">
          Voici un aperçu de votre activité Ava Bijoux
        </p>
      </div>

      {/* Salon Link */}
      <div className="card p-4 mb-8 bg-gradient-to-r from-ava-gold/10 to-ava-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-medium text-ava-700">🔗 Votre lien boutique personnalisé</p>
            <p className="text-sm text-gray-600 mt-1">
              Partagez ce lien avec vos clients pour recevoir 30% de commission
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={copyLink}
              className="btn-primary text-sm py-2"
            >
              Copier le lien
            </button>
            <a
              href={salonLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline text-sm py-2 flex items-center gap-1"
            >
              Ouvrir <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={ShoppingBag}
          label="Commandes totales"
          value={mockStats.totalOrders}
          subtext={`${mockStats.pendingOrders} en cours`}
          trend="+12%"
        />
        <StatCard
          icon={TrendingUp}
          label="Chiffre d'affaires"
          value={`${mockStats.totalRevenue.toFixed(2)} €`}
          subtext={`${mockStats.thisMonthRevenue.toFixed(2)} € ce mois`}
          trend="+8%"
        />
        <StatCard
          icon={Wallet}
          label="Commissions à recevoir"
          value={`${mockStats.pendingCommission.toFixed(2)} €`}
          subtext="30% de vos ventes"
          highlight
        />
        <StatCard
          icon={Users}
          label="Commissions versées"
          value={`${mockStats.paidCommission.toFixed(2)} €`}
          subtext="Total reçu"
        />
      </div>

      {/* Quick Actions & Recent Orders */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-ava-700 text-lg">
              Commandes récentes
            </h2>
            <Link
              to="/salon/commandes"
              className="text-ava-gold text-sm hover:underline flex items-center gap-1"
            >
              Voir tout <ArrowRight size={14} />
            </Link>
          </div>

          <div className="card overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Commande</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 hidden sm:table-cell">Client</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Statut</th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">Montant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mockRecentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800 text-sm">{order.id}</p>
                      <p className="text-xs text-gray-500">{order.product}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 hidden sm:table-cell">
                      {order.customer}
                    </td>
                    <td className="px-4 py-3">
                      <OrderStatus status={order.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <p className="font-medium text-gray-800">{order.amount.toFixed(2)} €</p>
                      <p className="text-xs text-green-600">+{(order.amount * 0.3).toFixed(2)} €</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="font-semibold text-ava-700 text-lg mb-4">
            Actions rapides
          </h2>

          <div className="space-y-3">
            <Link
              to="/salon/commissions"
              className="card p-4 flex items-center gap-4 hover:shadow-md transition-shadow group"
            >
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Wallet className="text-green-600" size={24} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800 group-hover:text-ava-gold transition-colors">
                  Demander un virement
                </p>
                <p className="text-sm text-gray-500">
                  {mockStats.pendingCommission.toFixed(2)} € disponibles
                </p>
              </div>
              <ArrowRight size={20} className="text-gray-400 group-hover:text-ava-gold transition-colors" />
            </Link>

            <Link
              to="/salon/commandes"
              className="card p-4 flex items-center gap-4 hover:shadow-md transition-shadow group"
            >
              <div className="w-12 h-12 rounded-full bg-ava-100 flex items-center justify-center">
                <ShoppingBag className="text-ava-600" size={24} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800 group-hover:text-ava-gold transition-colors">
                  Voir les commandes en cours
                </p>
                <p className="text-sm text-gray-500">
                  {mockStats.pendingOrders} commandes en production
                </p>
              </div>
              <ArrowRight size={20} className="text-gray-400 group-hover:text-ava-gold transition-colors" />
            </Link>
          </div>

          {/* Commission Info */}
          <div className="mt-6 p-4 bg-ava-50 rounded-xl">
            <h3 className="font-medium text-ava-700 mb-2">💰 Comment ça marche ?</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Partagez votre lien avec vos clients</li>
              <li>• Recevez 30% sur chaque vente</li>
              <li>• Demandez un virement quand vous voulez</li>
              <li>• Virement sous 5 jours ouvrés</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, subtext, trend, highlight }) {
  return (
    <div className={`card p-5 ${highlight ? 'ring-2 ring-ava-gold ring-offset-2' : ''}`}>
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          highlight ? 'bg-ava-gold/20' : 'bg-gray-100'
        }`}>
          <Icon size={20} className={highlight ? 'text-ava-gold' : 'text-gray-600'} />
        </div>
        {trend && (
          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
            {trend}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className={`text-2xl font-semibold ${highlight ? 'text-ava-gold' : 'text-gray-800'}`}>
          {value}
        </p>
        <p className="text-sm text-gray-500 mt-1">{label}</p>
        {subtext && (
          <p className="text-xs text-gray-400 mt-1">{subtext}</p>
        )}
      </div>
    </div>
  )
}

function OrderStatus({ status }) {
  const statusConfig = {
    pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-700' },
    production: { label: 'En production', color: 'bg-blue-100 text-blue-700' },
    shipped: { label: 'Expédié', color: 'bg-purple-100 text-purple-700' },
    delivered: { label: 'Livré', color: 'bg-green-100 text-green-700' },
    ready: { label: 'Prêt salon', color: 'bg-ava-100 text-ava-700' },
  }

  const config = statusConfig[status] || statusConfig.pending

  return (
    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  )
}
