import React, { useState } from 'react'
import { Search, Filter, ChevronDown, Eye, Package } from 'lucide-react'

// Mock data
const mockOrders = [
  {
    id: 'AVA-20240115001',
    date: '15/01/2024',
    customer: { name: 'Marie Dupont', email: 'marie.d@email.com' },
    items: [{ product: 'Collier Plaque Or', text: 'Marie', price: 39.90 }],
    delivery: { type: 'salon', status: 'production' },
    total: 39.90,
    commission: 11.97,
    status: 'production',
  },
  {
    id: 'AVA-20240114002',
    date: '14/01/2024',
    customer: { name: 'Sophie Laurent', email: 'sophie.l@email.com' },
    items: [{ product: 'Médaillon Cœur', text: 'Léa ♥', price: 34.90 }],
    delivery: { type: 'relay', status: 'shipped' },
    total: 39.89,
    commission: 10.47,
    status: 'shipped',
  },
  {
    id: 'AVA-20240112003',
    date: '12/01/2024',
    customer: { name: 'Julie Martin', email: 'julie.m@email.com' },
    items: [{ product: 'Jonc Personnalisé Or', text: '15.06.2024', price: 44.90 }],
    delivery: { type: 'home', status: 'delivered' },
    total: 52.89,
    commission: 13.47,
    status: 'delivered',
  },
  {
    id: 'AVA-20240110004',
    date: '10/01/2024',
    customer: { name: 'Emma Bernard', email: 'emma.b@email.com' },
    items: [
      { product: 'Collier Barre Argent', text: 'Maman', price: 32.90 },
      { product: 'Bracelet Chaîne Plaque', text: 'Emma', price: 36.90 },
    ],
    delivery: { type: 'salon', status: 'ready' },
    total: 69.80,
    commission: 20.94,
    status: 'ready',
  },
]

const statusOptions = [
  { value: 'all', label: 'Tous les statuts' },
  { value: 'pending', label: 'En attente' },
  { value: 'production', label: 'En production' },
  { value: 'shipped', label: 'Expédié' },
  { value: 'ready', label: 'Prêt en salon' },
  { value: 'delivered', label: 'Livré' },
]

export default function SalonOrders() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-ava-700">
            Commandes
          </h1>
          <p className="text-gray-600">
            Suivez les commandes passées via votre lien
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher par n° ou client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field pl-10 pr-8 appearance-none cursor-pointer"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
        </div>
      </div>

      {/* Orders Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Commande</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Client</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 hidden md:table-cell">Produits</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Livraison</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Statut</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">Commission</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <p className="font-medium text-gray-800">{order.id}</p>
                    <p className="text-xs text-gray-500">{order.date}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm text-gray-800">{order.customer.name}</p>
                    <p className="text-xs text-gray-500">{order.customer.email}</p>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <p className="text-sm text-gray-800">
                      {order.items.map((item) => item.product).join(', ')}
                    </p>
                    <p className="text-xs text-gray-500">
                      {order.items.length} article{order.items.length > 1 ? 's' : ''}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <DeliveryBadge type={order.delivery.type} />
                  </td>
                  <td className="px-4 py-4">
                    <OrderStatus status={order.status} />
                  </td>
                  <td className="px-4 py-4 text-right">
                    <p className="font-semibold text-green-600">
                      +{order.commission.toFixed(2)} €
                    </p>
                    <p className="text-xs text-gray-500">
                      sur {order.total.toFixed(2)} €
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 text-gray-400 hover:text-ava-gold transition-colors"
                      title="Voir le détail"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            <Package size={48} className="mx-auto mb-4 text-gray-300" />
            <p>Aucune commande trouvée</p>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
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

function DeliveryBadge({ type }) {
  const types = {
    salon: { icon: '🏪', label: 'Salon' },
    relay: { icon: '📦', label: 'Relais' },
    home: { icon: '🏠', label: 'Domicile' },
  }

  const config = types[type] || types.salon

  return (
    <span className="inline-flex items-center gap-1 text-sm text-gray-600">
      {config.icon} {config.label}
    </span>
  )
}

function OrderDetailModal({ order, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-ava-700">
              Commande {order.id}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">Passée le {order.date}</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Status */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Statut</h3>
            <OrderStatus status={order.status} />
          </div>

          {/* Customer */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Client</h3>
            <p className="text-gray-800">{order.customer.name}</p>
            <p className="text-sm text-gray-500">{order.customer.email}</p>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Articles</h3>
            <div className="space-y-2">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{item.product}</p>
                    <p className="text-sm text-gray-500">Gravure : "{item.text}"</p>
                  </div>
                  <p className="font-medium">{item.price.toFixed(2)} €</p>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="border-t pt-4">
            <div className="flex justify-between text-gray-600 mb-2">
              <span>Total commande</span>
              <span>{order.total.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between font-semibold text-green-600">
              <span>Votre commission (30%)</span>
              <span>+{order.commission.toFixed(2)} €</span>
            </div>
          </div>
        </div>

        <div className="p-6 border-t bg-gray-50">
          <button onClick={onClose} className="w-full btn-primary">
            Fermer
          </button>
        </div>
      </div>
    </div>
  )
}
