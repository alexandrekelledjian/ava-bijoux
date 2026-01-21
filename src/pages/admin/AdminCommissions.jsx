import React, { useState } from 'react'
import { Search, Filter, CheckCircle, Clock, AlertCircle, Download, Send } from 'lucide-react'

// Mock data
const mockCommissions = [
  {
    salonId: 'rec8aa6Ye7f4h2Zjl',
    salonName: 'Salon Marie Coiffure',
    email: 'marie@salonmarie.fr',
    iban: 'FR76 1234 5678 9012 3456 7890 123',
    pending: 245.80,
    orders: 8,
    lastPayout: '05/01/2024',
    requestedPayout: null,
  },
  {
    salonId: 'rec9bb7Zf8g5i3Akm',
    salonName: 'Coiff & Style',
    email: 'contact@coiffstyle.fr',
    iban: 'FR76 9876 5432 1098 7654 3210 987',
    pending: 189.50,
    orders: 6,
    lastPayout: '20/12/2023',
    requestedPayout: '14/01/2024', // Has requested payout
  },
  {
    salonId: 'rec0cc8Ah9h6j4Bln',
    salonName: 'Hair Beauté',
    email: 'hello@hairbeaute.fr',
    iban: 'FR76 5555 4444 3333 2222 1111 000',
    pending: 156.30,
    orders: 5,
    lastPayout: '01/12/2023',
    requestedPayout: null,
  },
  {
    salonId: 'rec1dd9Bi0i7k5Cmo',
    salonName: "L'Atelier Coiffure",
    email: 'atelier@coiffure.fr',
    iban: 'FR76 1111 2222 3333 4444 5555 666',
    pending: 134.70,
    orders: 4,
    lastPayout: null,
    requestedPayout: null,
  },
]

const mockPayoutHistory = [
  { id: 'PAY-2024-001', salon: 'Salon Marie Coiffure', amount: 312.50, date: '05/01/2024', status: 'completed' },
  { id: 'PAY-2024-002', salon: 'Coiff & Style', amount: 245.80, date: '20/12/2023', status: 'completed' },
  { id: 'PAY-2024-003', salon: 'Hair Beauté', amount: 198.30, date: '01/12/2023', status: 'completed' },
]

export default function AdminCommissions() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [selectedSalon, setSelectedSalon] = useState(null)

  const totalPending = mockCommissions.reduce((sum, c) => sum + c.pending, 0)
  const requestedPayouts = mockCommissions.filter(c => c.requestedPayout)

  const filteredCommissions = mockCommissions.filter((commission) => {
    const matchesSearch = commission.salonName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterType === 'all' ||
      (filterType === 'requested' && commission.requestedPayout) ||
      (filterType === 'pending' && !commission.requestedPayout && commission.pending > 0)
    return matchesSearch && matchesFilter
  })

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-ava-800">
            Gestion des commissions
          </h1>
          <p className="text-gray-600">
            {totalPending.toFixed(2)} € de commissions à verser
          </p>
        </div>
        <button className="btn-secondary flex items-center gap-2">
          <Download size={18} />
          Exporter CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="card p-5 bg-amber-50 border border-amber-200">
          <div className="flex items-center gap-3 mb-2">
            <Clock size={20} className="text-amber-600" />
            <span className="font-medium text-amber-800">À verser</span>
          </div>
          <p className="text-2xl font-bold text-amber-700">
            {totalPending.toFixed(2)} €
          </p>
          <p className="text-sm text-amber-600 mt-1">
            {mockCommissions.length} salons concernés
          </p>
        </div>

        <div className="card p-5 bg-red-50 border border-red-200">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle size={20} className="text-red-600" />
            <span className="font-medium text-red-800">Demandes en attente</span>
          </div>
          <p className="text-2xl font-bold text-red-700">
            {requestedPayouts.length}
          </p>
          <p className="text-sm text-red-600 mt-1">
            {requestedPayouts.reduce((sum, c) => sum + c.pending, 0).toFixed(2)} € demandés
          </p>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle size={20} className="text-green-600" />
            <span className="font-medium text-gray-800">Versé ce mois</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {mockPayoutHistory.filter(p => p.date.includes('/01/2024')).reduce((sum, p) => sum + p.amount, 0).toFixed(2)} €
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {mockPayoutHistory.filter(p => p.date.includes('/01/2024')).length} virements
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher un salon..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'requested', 'pending'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterType === type
                  ? 'bg-ava-gold text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {type === 'all' ? 'Tous' : type === 'requested' ? 'Demandés' : 'En attente'}
            </button>
          ))}
        </div>
      </div>

      {/* Commissions Table */}
      <div className="card overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Salon</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 hidden md:table-cell">IBAN</th>
                <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">Commandes</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">À verser</th>
                <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">Statut</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCommissions.map((commission) => (
                <tr key={commission.salonId} className={`hover:bg-gray-50 ${commission.requestedPayout ? 'bg-red-50/50' : ''}`}>
                  <td className="px-4 py-4">
                    <p className="font-medium text-gray-800">{commission.salonName}</p>
                    <p className="text-sm text-gray-500">{commission.email}</p>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <code className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      {commission.iban.slice(0, 14)}...
                    </code>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700 font-medium">
                      {commission.orders}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <p className="font-semibold text-amber-600">
                      {commission.pending.toFixed(2)} €
                    </p>
                  </td>
                  <td className="px-4 py-4 text-center">
                    {commission.requestedPayout ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        <AlertCircle size={12} />
                        Demandé le {commission.requestedPayout}
                      </span>
                    ) : commission.pending > 0 ? (
                      <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                        En attente
                      </span>
                    ) : (
                      <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        À jour
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => setSelectedSalon(commission)}
                      className="btn-primary text-sm py-2"
                      disabled={commission.pending === 0}
                    >
                      <Send size={14} className="mr-1 inline" />
                      Payer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payout History */}
      <div>
        <h2 className="font-semibold text-ava-800 text-lg mb-4">
          Historique des virements
        </h2>
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Référence</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Salon</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Date</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">Montant</th>
                <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockPayoutHistory.map((payout) => (
                <tr key={payout.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{payout.id}</td>
                  <td className="px-4 py-3 text-gray-600">{payout.salon}</td>
                  <td className="px-4 py-3 text-gray-600">{payout.date}</td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-800">
                    {payout.amount.toFixed(2)} €
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      <CheckCircle size={12} />
                      Effectué
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payout Modal */}
      {selectedSalon && (
        <PayoutModal
          salon={selectedSalon}
          onClose={() => setSelectedSalon(null)}
        />
      )}
    </div>
  )
}

function PayoutModal({ salon, onClose }) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [success, setSuccess] = useState(false)

  const handlePayout = async () => {
    setIsProcessing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsProcessing(false)
    setSuccess(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-ava-800">
            Effectuer le virement
          </h2>
        </div>

        <div className="p-6">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Virement initié !
              </h3>
              <p className="text-gray-600">
                Le virement de {salon.pending.toFixed(2)} € vers {salon.salonName} a été initié.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">Bénéficiaire</p>
                <p className="font-semibold text-gray-800">{salon.salonName}</p>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">IBAN</p>
                <code className="block p-3 bg-gray-100 rounded-lg text-sm">
                  {salon.iban}
                </code>
              </div>

              <div className="bg-ava-50 rounded-xl p-4 mb-6 text-center">
                <p className="text-sm text-ava-600 mb-1">Montant du virement</p>
                <p className="text-3xl font-bold text-ava-gold">
                  {salon.pending.toFixed(2)} €
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Commission sur {salon.orders} commandes
                </p>
              </div>
            </>
          )}
        </div>

        <div className="p-6 border-t bg-gray-50 flex gap-3">
          {success ? (
            <button onClick={onClose} className="w-full btn-primary">
              Fermer
            </button>
          ) : (
            <>
              <button onClick={onClose} className="flex-1 btn-secondary">
                Annuler
              </button>
              <button
                onClick={handlePayout}
                disabled={isProcessing}
                className={`flex-1 btn-primary flex items-center justify-center gap-2 ${
                  isProcessing ? 'opacity-75' : ''
                }`}
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Traitement...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Confirmer le virement
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
