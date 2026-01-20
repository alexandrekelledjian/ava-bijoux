import React from 'react'
import { Link } from 'react-router-dom'
import {
  TrendingUp,
  ShoppingBag,
  Store,
  Wallet,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Package,
  Gem,
  Plus
} from 'lucide-react'

// Mock data
const mockStats = {
  totalRevenue: 28547.80,
  revenueGrowth: 12.5,
  totalOrders: 342,
  ordersGrowth: 8.2,
  activeSalons: 127,
  salonsGrowth: 15,
  pendingCommissions: 4250.75,
  avgOrderValue: 83.47,
}

const mockRecentOrders = [
  { id: 'AVA-20240115001', salon: 'Salon Marie', product: 'Collier Plaque Or', status: 'production', amount: 39.90 },
  { id: 'AVA-20240115002', salon: 'Coiff & Style', product: 'Médaillon Cœur', status: 'pending', amount: 34.90 },
  { id: 'AVA-20240114003', salon: 'Hair Beauté', product: 'Jonc Or', status: 'shipped', amount: 44.90 },
  { id: 'AVA-20240114004', salon: 'L\'Atelier', product: 'Bracelet Chaîne', status: 'delivered', amount: 36.90 },
]

const mockTopSalons = [
  { name: 'Salon Marie', orders: 47, revenue: 1847.50 },
  { name: 'Coiff & Style', orders: 38, revenue: 1542.20 },
  { name: 'Hair Beauté', orders: 35, revenue: 1398.60 },
  { name: 'L\'Atelier Coiffure', orders: 31, revenue: 1245.90 },
]

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-ava-700">
            Tableau de bord
          </h1>
          <p className="text-gray-600">
            Vue d'ensemble de l'activité Ava Bijoux
          </p>
        </div>
        <Link
          to="/admin/produits"
          className="btn-gold flex items-center gap-2 self-start"
        >
          <Plus size={18} />
          Ajouter un produit
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={TrendingUp}
          label="Chiffre d'affaires"
          value={`${mockStats.totalRevenue.toLocaleString('fr-FR')} €`}
          change={mockStats.revenueGrowth}
          positive
        />
        <StatCard
          icon={ShoppingBag}
          label="Commandes"
          value={mockStats.totalOrders}
          change={mockStats.ordersGrowth}
          positive
        />
        <StatCard
          icon={Store}
          label="Salons actifs"
          value={mockStats.activeSalons}
          change={mockStats.salonsGrowth}
          positive
          suffix="/ 450"
        />
        <StatCard
          icon={Wallet}
          label="Commissions à payer"
          value={`${mockStats.pendingCommissions.toLocaleString('fr-FR')} €`}
          highlight
        />
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <Link
          to="/admin/produits"
          className="bg-white border border-gray-100 rounded-xl p-4 hover:border-ava-gold hover:shadow-md transition-all flex items-center gap-4"
        >
          <div className="p-3 bg-ava-gold/10 rounded-lg">
            <Gem className="w-6 h-6 text-ava-gold" />
          </div>
          <div>
            <p className="font-medium text-ava-700">Gérer les produits</p>
            <p className="text-sm text-gray-500">Ajouter, modifier, supprimer</p>
          </div>
        </Link>
        <Link
          to="/admin/salons"
          className="bg-white border border-gray-100 rounded-xl p-4 hover:border-ava-gold hover:shadow-md transition-all flex items-center gap-4"
        >
          <div className="p-3 bg-blue-100 rounded-lg">
            <Store className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-ava-700">Salons partenaires</p>
            <p className="text-sm text-gray-500">127 salons actifs</p>
          </div>
        </Link>
        <Link
          to="/admin/commissions"
          className="bg-white border border-gray-100 rounded-xl p-4 hover:border-ava-gold hover:shadow-md transition-all flex items-center gap-4"
        >
          <div className="p-3 bg-amber-100 rounded-lg">
            <Wallet className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="font-medium text-ava-700">Commissions</p>
            <p className="text-sm text-gray-500">12 demandes en attente</p>
          </div>
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-ava-700 text-lg">
              Dernières commandes
            </h2>
            <Link
              to="/admin/commandes"
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
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Salon</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Statut</th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">Montant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mockRecentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">{order.id}</p>
                      <p className="text-xs text-gray-500">{order.product}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {order.salon}
                    </td>
                    <td className="px-4 py-3">
                      <OrderStatus status={order.status} />
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {order.amount.toFixed(2)} €
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Salons */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-ava-700 text-lg">
              Top Salons
            </h2>
            <Link
              to="/admin/salons"
              className="text-ava-gold text-sm hover:underline flex items-center gap-1"
            >
              Voir tout <ArrowRight size={14} />
            </Link>
          </div>

          <div className="card divide-y divide-gray-100">
            {mockTopSalons.map((salon, index) => (
              <div key={salon.name} className="p-4 flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  index === 0 ? 'bg-yellow-100 text-yellow-700' :
                  index === 1 ? 'bg-gray-100 text-gray-700' :
                  index === 2 ? 'bg-orange-100 text-orange-700' :
                  'bg-gray-50 text-gray-500'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">{salon.name}</p>
                  <p className="text-xs text-gray-500">{salon.orders} commandes</p>
                </div>
                <p className="font-semibold text-ava-gold">
                  {salon.revenue.toFixed(2)} €
                </p>
              </div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="card p-4 text-center">
              <Package size={24} className="mx-auto text-ava-gold mb-2" />
              <p className="text-2xl font-bold text-gray-800">
                {mockStats.avgOrderValue.toFixed(2)} €
              </p>
              <p className="text-xs text-gray-500">Panier moyen</p>
            </div>
            <div className="card p-4 text-center">
              <Users size={24} className="mx-auto text-ava-gold mb-2" />
              <p className="text-2xl font-bold text-gray-800">
                {(mockStats.totalOrders / mockStats.activeSalons).toFixed(1)}
              </p>
              <p className="text-xs text-gray-500">Cmd/salon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, change, positive, highlight, suffix }) {
  return (
    <div className={`card p-5 ${highlight ? 'ring-2 ring-amber-400' : ''}`}>
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          highlight ? 'bg-amber-100' : 'bg-ava-100'
        }`}>
          <Icon size={20} className={highlight ? 'text-amber-600' : 'text-ava-600'} />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            positive ? 'text-green-600' : 'text-red-600'
          }`}>
            {positive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            {change}%
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-semibold text-gray-800">
          {value}
          {suffix && <span className="text-sm text-gray-400 font-normal ml-1">{suffix}</span>}
        </p>
        <p className="text-sm text-gray-500 mt-1">{label}</p>
      </div>
    </div>
  )
}

function OrderStatus({ status }) {
  const statusConfig = {
    pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-700' },
    production: { label: 'Production', color: 'bg-blue-100 text-blue-700' },
    shipped: { label: 'Expédié', color: 'bg-purple-100 text-purple-700' },
    delivered: { label: 'Livré', color: 'bg-green-100 text-green-700' },
  }

  const config = statusConfig[status] || statusConfig.pending

  return (
    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  )
}
