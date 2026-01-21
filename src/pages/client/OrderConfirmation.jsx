import React from 'react'
import { Link, useParams, useLocation, useOutletContext } from 'react-router-dom'
import { CheckCircle, Mail, Package, Home } from 'lucide-react'

export default function OrderConfirmation() {
  const { orderId } = useParams()
  const location = useLocation()
  const { getSalonParam } = useOutletContext()

  const order = location.state?.order || {
    id: orderId,
    total: 0,
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      {/* Success Icon */}
      <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
        <CheckCircle size={48} className="text-green-600" />
      </div>

      <h1 className="text-3xl font-serif font-semibold text-ava-800 mb-4">
        Merci pour votre commande !
      </h1>

      <p className="text-gray-600 mb-2">
        Votre commande <span className="font-semibold text-ava-gold">{order.id}</span> a été confirmée.
      </p>

      {order.total > 0 && (
        <p className="text-lg font-semibold text-ava-800 mb-8">
          Total payé : {order.total.toFixed(2)} €
        </p>
      )}

      {/* Order Status Steps */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 text-left">
        <h2 className="font-semibold text-ava-800 mb-6 text-center">
          Prochaines étapes
        </h2>

        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <Mail size={20} className="text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Confirmation par email</h3>
              <p className="text-sm text-gray-600">
                Vous recevrez un email de confirmation avec le récapitulatif de votre commande.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-ava-100 flex items-center justify-center flex-shrink-0">
              <Package size={20} className="text-ava-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Fabrication artisanale</h3>
              <p className="text-sm text-gray-600">
                Votre bijou sera gravé avec soin par nos artisans.
                Délai de fabrication : environ 10 à 15 jours ouvrés.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-ava-100 flex items-center justify-center flex-shrink-0">
              <Home size={20} className="text-ava-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Livraison</h3>
              <p className="text-sm text-gray-600">
                {order.delivery?.option === 'salon' ? (
                  <>
                    Votre bijou sera livré dans votre salon partenaire.
                    Vous serez notifié par email dès qu'il sera disponible.
                  </>
                ) : order.delivery?.option === 'relay' ? (
                  <>
                    Livraison en point relais Mondial Relay sous 48-72h après expédition.
                    Vous recevrez un email avec le numéro de suivi.
                  </>
                ) : (
                  <>
                    Livraison à domicile par Mondial Relay sous 24-48h après expédition.
                    Vous recevrez un email avec le numéro de suivi.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Commission Note */}
      {order.salon && (
        <div className="bg-ava-50 rounded-xl p-4 mb-8 text-sm text-ava-800">
          <p>
            ✨ Cette commande a été effectuée via <strong>{order.salon.name}</strong>.
            <br />
            30% du montant sera reversé à votre salon partenaire.
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to={`/${getSalonParam()}`} className="btn-primary">
          Continuer mes achats
        </Link>
        <a
          href={`mailto:contact@ava-bijoux.fr?subject=Question commande ${order.id}`}
          className="btn-secondary"
        >
          Une question ?
        </a>
      </div>

      {/* Contact Info */}
      <p className="text-sm text-gray-500 mt-8">
        Pour toute question, contactez-nous à{' '}
        <a href="mailto:contact@ava-bijoux.fr" className="text-ava-gold hover:underline">
          contact@ava-bijoux.fr
        </a>
      </p>
    </div>
  )
}
