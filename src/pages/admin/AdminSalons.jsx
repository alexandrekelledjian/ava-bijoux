import React, { useState } from 'react'
import { Search, Plus, MoreVertical, ExternalLink, Mail, Phone, TrendingUp } from 'lucide-react'

// Mock data for 450 salons (showing subset)
const mockSalons = [
  {
    id: 'rec8aa6Ye7f4h2Zjl',
    name: 'Salon Marie Coiffure',
    email: 'marie@salonmarie.fr',
    phone: '01 23 45 67 89',
    city: 'Paris 15ème',
    status: 'active',
    orders: 47,
    revenue: 1847.50,
    pendingCommission: 245.80,
    joinedAt: '01/03/2023',
  },
  {
    id: 'rec9bb7Zf8g5i3Akm',
    name: 'Coiff & Style',
    email: 'contact@coiffstyle.fr',
    phone: '01 98 76 54 32',
    city: 'Lyon 6ème',
    status: 'active',
    orders: 38,
    revenue: 1542.20,
    pendingCommission: 189.50,
    joinedAt: '15/04/2023',
  },
  {
    id: 'rec0cc8Ah9h6j4Bln',
    name: 'Hair Beauté',
    email: 'hello@hairbeaute.fr',
    phone: '04 56 78 90 12',
    city: 'Marseille',
    status: 'active',
    orders: 35,
    revenue: 1398.60,
    pendingCommission: 156.30,
    joinedAt: '22/05/2023',
  },
  {
    id: 'rec1dd9Bi0i7k5Cmo',
    name: "L'Atelier Coiffure",
    email: 'atelier@coiffure.fr',
    phone: '05 67 89 01 23',
    city: 'Bordeaux',
    status: 'active',
    orders: 31,
    revenue: 1245.90,
    pendingCommission: 134.70,
    joinedAt: '10/06/2023',
  },
  {
    id: 'rec2ee0Cj1j8l6Dnp',
    name: 'Studio Hair',
    email: 'studio@hair.fr',
    phone: '06 78 90 12 34',
    city: 'Toulouse',
    status: 'inactive',
    orders: 5,
    revenue: 198.50,
    pendingCommission: 0,
    joinedAt: '01/09/2023',
  },
]

export default function AdminSalons() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSalon, setSelectedSalon] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)

  const filteredSalons = mockSalons.filter((salon) =>
    salon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    salon.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    salon.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalSalons = 450
  const activeSalons = mockSalons.filter(s => s.status === 'active').length

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-ava-700">
            Salons partenaires
          </h1>
          <p className="text-gray-600">
            {activeSalons} actifs sur {totalSalons} salons
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Ajouter un salon
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Rechercher par nom, ville ou email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {/* Salons Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Salon</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 hidden md:table-cell">Contact</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Statut</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">Performance</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">Commission due</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSalons.map((salon) => (
                <tr key={salon.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <p className="font-medium text-gray-800">{salon.name}</p>
                    <p className="text-sm text-gray-500">{salon.city}</p>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <a href={`mailto:${salon.email}`} className="flex items-center gap-1 hover:text-ava-gold">
                        <Mail size={14} />
                        {salon.email}
                      </a>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      salon.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {salon.status === 'active' ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <p className="font-semibold text-gray-800">
                      {salon.revenue.toFixed(2)} €
                    </p>
                    <p className="text-xs text-gray-500">
                      {salon.orders} commandes
                    </p>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <p className={`font-semibold ${
                      salon.pendingCommission > 0 ? 'text-amber-600' : 'text-gray-400'
                    }`}>
                      {salon.pendingCommission > 0
                        ? `${salon.pendingCommission.toFixed(2)} €`
                        : '—'}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => setSelectedSalon(salon)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Salon Detail Modal */}
      {selectedSalon && (
        <SalonDetailModal
          salon={selectedSalon}
          onClose={() => setSelectedSalon(null)}
        />
      )}

      {/* Add Salon Modal */}
      {showAddModal && (
        <AddSalonModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  )
}

function SalonDetailModal({ salon, onClose }) {
  const salonLink = `${window.location.origin}/?salon=${salon.id}`

  const copyLink = () => {
    navigator.clipboard.writeText(salonLink)
    alert('Lien copié !')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-ava-700">
              {salon.name}
            </h2>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">Partenaire depuis {salon.joinedAt}</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Salon Link */}
          <div className="bg-ava-50 rounded-lg p-4">
            <p className="text-sm font-medium text-ava-700 mb-2">Lien boutique personnalisé</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={salonLink}
                readOnly
                className="input-field text-sm flex-1"
              />
              <button onClick={copyLink} className="btn-primary text-sm py-2">
                Copier
              </button>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Contact</h3>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2 text-gray-600">
                <Mail size={16} className="text-gray-400" />
                {salon.email}
              </p>
              <p className="flex items-center gap-2 text-gray-600">
                <Phone size={16} className="text-gray-400" />
                {salon.phone}
              </p>
            </div>
          </div>

          {/* Performance */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Performance</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xl font-bold text-gray-800">{salon.orders}</p>
                <p className="text-xs text-gray-500">Commandes</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xl font-bold text-gray-800">{salon.revenue.toFixed(0)} €</p>
                <p className="text-xs text-gray-500">CA généré</p>
              </div>
              <div className="text-center p-3 bg-amber-50 rounded-lg">
                <p className="text-xl font-bold text-amber-600">{salon.pendingCommission.toFixed(0)} €</p>
                <p className="text-xs text-gray-500">À payer</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button className="flex-1 btn-secondary text-sm">
              Envoyer un email
            </button>
            <button className="flex-1 btn-primary text-sm">
              Payer la commission
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function AddSalonModal({ onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    iban: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // In production, send to API
    console.log('New salon:', formData)
    alert('Salon ajouté (simulation)')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-ava-700">
              Ajouter un salon partenaire
            </h2>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="label">Nom du salon *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="input-field"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Téléphone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="label">Ville *</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              required
              className="input-field"
            />
          </div>

          <div>
            <label className="label">IBAN (pour les commissions)</label>
            <input
              type="text"
              value={formData.iban}
              onChange={(e) => setFormData({ ...formData, iban: e.target.value })}
              className="input-field"
              placeholder="FR76 XXXX XXXX XXXX XXXX XXXX XXX"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 btn-secondary">
              Annuler
            </button>
            <button type="submit" className="flex-1 btn-primary">
              Ajouter le salon
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
