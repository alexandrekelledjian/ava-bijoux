import React, { useState } from 'react'
import { Search, Filter, ChevronDown, Eye, Package, Truck, CheckCircle } from 'lucide-react'

// Mock data
const mockOrders = [
  {
    id: 'AVA-20240115001',
    date: '15/01/2024 14:32',
    customer: { name: 'Marie Dupont', email: 'marie.d@email.com', phone: '06 12 34 56 78' },
    salon: { id: 'rec8aa6Ye7f4h2Zjl', name: 'Salon Marie Coiffure' },
    items: [{ product: 'Collier Plaque Or', text: 'Marie', font: 'Élégant', color: 'Or', price: 39.90 }],
    delivery: { type: 'salon', address: null, status: 'pending' },
    subtotal: 39.90,
    deliveryCost: 0,
    total: 39.90,
    commission: 11.97,
    commissionPaid: false,
    status: 'production',
    paymentStatus: 'paid',
  },
  {
    id: 'AVA-20240114002',
    date: '14/01/2024 09:15',
    customer: { name: 'Sophie Laurent', email: 'sophie.l@email.com', phone: '06 23 45 67 89' },
    salon: { id: 'rec9bb7Zf8g5i3Akm', name: 'Coiff & Style' },
    items: [{ product: 'Médaillon Cœur', text: 'Léa ♥', font: 'Script', color: 'Or Rose', price: 34.90 }],
    delivery: { type: 'relay', address: 'Relais Carrefour Lyon', status: 'in_transit' },
    subtotal: 34.90,
    deliveryCost: 4.99,
    total: 39.89,
    commission: 10.47,
    commissionPaid: false,
    status: 'shipped',
    paymentStatus: 'paid',
  },
  {
    id: 'AVA-20240112003',
    date: '12/01/2024 16:45',
    customer: { name: 'Julie Martin', email: 'julie.m@email.com', phone: '06 34 56 78 90' },
    salon: { id: 'rec0cc8Ah9h6j4Bln', name: 'Hair Beauté' },
    items: [{ product: 'Jonc Personnalisé Or', text: '15.06.2024', font: 'Moderne', color: 'Or', price: 44.90 }],
    delivery: { type: 'home', address: '15 rue des Lilas, 13001 Marseille', status: 'delivered' },
    subtotal: 44.90,
    deliveryCost: 7.99,
    total: 52.89,
    commission: 13.47,
    commissionPaid: true,
    status: 'delivered',
    paymentStatus: 'paid',
  },
  {
    id: 'AVA-20240110004',
    date: '10/01/2024 11:20',
    customer: { name: 'Emma Bernard', email: 'emma.b@email.com', phone: '06 45 67 89 01' },
    salon: { id: 'rec1dd9Bi0i7k5Cmo', name: "L'Atelier Coiffure" },
    items: [
      { product: 'Collier Barre Argent', text: 'Maman', font: 'Classique', color: 'Argent', price: 32.90 },
      { product: 'Bracelet Chaîne Plaque', text: 'Emma', font: 'Script', color: 'Or', price: 36.90 },
    ],
    delivery: { type: 'salon', address: null, status: 'ready' },
    subtotal: 69.80,
    deliveryCost: 0,
    total: 69.80,
    commission: 20.94,
    commissionPaid: false,
    status: 'ready',
    paymentStatus: 'paid',
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

export default function AdminOrders() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.salon.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-ava-700">
            Gestion des commandes
          </h1>
          <p className="text-gray-600">
            {mockOrders.length} commandes au total
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher par n°, client ou salon..."
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
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 hidden lg:table-cell">Salon</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Livraison</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Statut</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">Total</th>
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
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <p className="text-sm text-gray-800">{order.salon.name}</p>
                  </td>
                  <td className="px-4 py-4">
                    <DeliveryBadge type={order.delivery.type} />
                  </td>
                  <td className="px-4 py-4">
                    <OrderStatus status={order.status} />
                  </td>
                  <td className="px-4 py-4 text-right">
                    <p className="font-semibold text-gray-800">
                      {order.total.toFixed(2)} €
                    </p>
                    <p className={`text-xs ${order.commissionPaid ? 'text-green-600' : 'text-amber-600'}`}>
                      {order.commissionPaid ? '✓ Commission payée' : `${order.commission.toFixed(2)} € à payer`}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 text-gray-400 hover:text-ava-gold transition-colors"
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
    production: { label: 'Production', color: 'bg-blue-100 text-blue-700' },
    shipped: { label: 'Expédié', color: 'bg-purple-100 text-purple-700' },
    ready: { label: 'Prêt salon', color: 'bg-ava-100 text-ava-700' },
    delivered: { label: 'Livré', color: 'bg-green-100 text-green-700' },
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
  const [newStatus, setNewStatus] = useState(order.status)

  const handleStatusUpdate = () => {
    // In production, send to API
    console.log('Update status:', order.id, newStatus)
    alert(`Statut mis à jour vers : ${newStatus}`)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-ava-700">
                Commande {order.id}
              </h2>
              <p className="text-sm text-gray-500 mt-1">Passée le {order.date}</p>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Status & Actions */}
          <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="flex-1">
              <label className="label mb-2">Mettre à jour le statut</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="input-field"
              >
                {statusOptions.slice(1).map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleStatusUpdate}
              disabled={newStatus === order.status}
              className={`btn-primary sm:self-end ${newStatus === order.status ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Mettre à jour
            </button>
          </div>

          {/* Customer & Salon */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Client</h3>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-800">{order.customer.name}</p>
                <p className="text-sm text-gray-600">{order.customer.email}</p>
                <p className="text-sm text-gray-600">{order.customer.phone}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Salon partenaire</h3>
              <div className="p-4 bg-ava-50 rounded-lg">
                <p className="font-medium text-ava-700">{order.salon.name}</p>
                <p className="text-sm text-gray-600">ID: {order.salon.id}</p>
              </div>
            </div>
          </div>

          {/* Delivery */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Livraison</h3>
            <div className="p-4 bg-gray-50 rounded-lg flex items-center gap-3">
              <DeliveryBadge type={order.delivery.type} />
              {order.delivery.address && (
                <span className="text-sm text-gray-600">— {order.delivery.address}</span>
              )}
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Articles</h3>
            <div className="space-y-2">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{item.product}</p>
                    <p className="text-sm text-gray-500">
                      Gravure : "{item.text}" • {item.font} • {item.color}
                    </p>
                  </div>
                  <p className="font-medium">{item.price.toFixed(2)} €</p>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="border-t pt-4">
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Sous-total</span>
                <span>{order.subtotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Livraison</span>
                <span>{order.deliveryCost === 0 ? 'Gratuit' : `${order.deliveryCost.toFixed(2)} €`}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg text-gray-800 pt-2 border-t">
                <span>Total</span>
                <span>{order.total.toFixed(2)} €</span>
              </div>
            </div>

            {/* Commission */}
            <div className={`mt-4 p-3 rounded-lg ${order.commissionPaid ? 'bg-green-50' : 'bg-amber-50'}`}>
              <div className="flex items-center justify-between">
                <span className={`font-medium ${order.commissionPaid ? 'text-green-800' : 'text-amber-800'}`}>
                  Commission salon (30%)
                </span>
                <span className={`font-semibold ${order.commissionPaid ? 'text-green-700' : 'text-amber-700'}`}>
                  {order.commission.toFixed(2)} €
                </span>
              </div>
              <p className={`text-sm mt-1 ${order.commissionPaid ? 'text-green-600' : 'text-amber-600'}`}>
                {order.commissionPaid ? '✓ Commission déjà versée' : 'En attente de versement'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
