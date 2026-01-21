import React, { useState } from 'react'
import { Wallet, ArrowDownCircle, Clock, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react'

// Mock data
const mockCommissionData = {
  available: 554.25,
  pending: 143.70, // Still in production
  totalPaid: 892.75,
  history: [
    { id: 'PAY-001', date: '05/01/2024', amount: 312.50, status: 'completed', method: 'Virement' },
    { id: 'PAY-002', date: '15/12/2023', amount: 245.80, status: 'completed', method: 'Virement' },
    { id: 'PAY-003', date: '01/12/2023', amount: 334.45, status: 'completed', method: 'Virement' },
  ],
  pendingOrders: [
    { id: 'AVA-20240115001', product: 'Collier Plaque Or', commission: 11.97, status: 'production' },
    { id: 'AVA-20240114002', product: 'Médaillon Cœur', commission: 10.47, status: 'shipped' },
  ],
}

export default function SalonCommissions() {
  const [showPayoutModal, setShowPayoutModal] = useState(false)
  const [payoutRequested, setPayoutRequested] = useState(false)

  const handleRequestPayout = () => {
    setPayoutRequested(true)
    setTimeout(() => {
      setShowPayoutModal(false)
      setPayoutRequested(false)
    }, 2000)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-semibold text-ava-800">
          Mes commissions
        </h1>
        <p className="text-gray-600">
          Suivez vos gains et demandez vos virements
        </p>
      </div>

      {/* Commission Summary Cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="card p-6 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center">
              <Wallet size={20} className="text-green-700" />
            </div>
            <span className="text-sm font-medium text-green-800">Disponible</span>
          </div>
          <p className="text-3xl font-bold text-green-700">
            {mockCommissionData.available.toFixed(2)} €
          </p>
          <button
            onClick={() => setShowPayoutModal(true)}
            className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <ArrowDownCircle size={18} />
            Demander un virement
          </button>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <Clock size={20} className="text-amber-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">En attente</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">
            {mockCommissionData.pending.toFixed(2)} €
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Commandes en cours de production
          </p>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-ava-100 flex items-center justify-center">
              <TrendingUp size={20} className="text-ava-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">Total reçu</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">
            {mockCommissionData.totalPaid.toFixed(2)} €
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Depuis le début du partenariat
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Pending Commissions */}
        <div>
          <h2 className="font-semibold text-ava-800 text-lg mb-4">
            Commissions en attente de validation
          </h2>
          <div className="card overflow-hidden">
            {mockCommissionData.pendingOrders.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {mockCommissionData.pendingOrders.map((order) => (
                  <div key={order.id} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">{order.id}</p>
                      <p className="text-sm text-gray-500">{order.product}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-amber-600">
                        +{order.commission.toFixed(2)} €
                      </p>
                      <p className="text-xs text-gray-400">
                        {order.status === 'production' ? 'En production' : 'Expédié'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Clock size={32} className="mx-auto mb-2 text-gray-300" />
                <p>Aucune commission en attente</p>
              </div>
            )}
          </div>

          <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200 text-sm text-amber-800">
            <p className="flex items-center gap-2">
              <AlertCircle size={16} />
              <span className="font-medium">Comment ça fonctionne ?</span>
            </p>
            <p className="mt-2 text-amber-700">
              Les commissions deviennent disponibles une fois la commande livrée au client.
              Les commandes en "livraison salon" sont validées quand le client récupère son bijou.
            </p>
          </div>
        </div>

        {/* Payment History */}
        <div>
          <h2 className="font-semibold text-ava-800 text-lg mb-4">
            Historique des virements
          </h2>
          <div className="card overflow-hidden">
            {mockCommissionData.history.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {mockCommissionData.history.map((payment) => (
                  <div key={payment.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle size={18} className="text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{payment.id}</p>
                        <p className="text-sm text-gray-500">{payment.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">
                        {payment.amount.toFixed(2)} €
                      </p>
                      <p className="text-xs text-gray-400">{payment.method}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Wallet size={32} className="mx-auto mb-2 text-gray-300" />
                <p>Aucun virement effectué</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payout Request Modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-ava-800">
                Demander un virement
              </h2>
            </div>

            <div className="p-6">
              {payoutRequested ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle size={32} className="text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Demande envoyée !
                  </h3>
                  <p className="text-gray-600">
                    Votre virement sera effectué sous 5 jours ouvrés.
                  </p>
                </div>
              ) : (
                <>
                  <div className="bg-green-50 rounded-xl p-4 mb-6 text-center">
                    <p className="text-sm text-green-700 mb-1">Montant du virement</p>
                    <p className="text-3xl font-bold text-green-700">
                      {mockCommissionData.available.toFixed(2)} €
                    </p>
                  </div>

                  <div className="mb-6">
                    <label className="label">Coordonnées bancaires</label>
                    <div className="p-4 bg-gray-50 rounded-lg text-sm">
                      <p className="text-gray-800 font-medium">FR76 1234 5678 9012 3456 7890 123</p>
                      <p className="text-gray-500 mt-1">BIC: BNPAFRPP</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Pour modifier vos coordonnées bancaires, contactez-nous.
                    </p>
                  </div>

                  <div className="p-4 bg-amber-50 rounded-lg text-sm text-amber-800 mb-6">
                    <p className="flex items-center gap-2">
                      <Clock size={16} />
                      <span>Délai de traitement : 5 jours ouvrés</span>
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="p-6 border-t bg-gray-50 flex gap-3">
              {!payoutRequested && (
                <>
                  <button
                    onClick={() => setShowPayoutModal(false)}
                    className="flex-1 btn-secondary"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleRequestPayout}
                    className="flex-1 btn-primary"
                  >
                    Confirmer la demande
                  </button>
                </>
              )}
              {payoutRequested && (
                <button
                  onClick={() => setShowPayoutModal(false)}
                  className="w-full btn-primary"
                >
                  Fermer
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
