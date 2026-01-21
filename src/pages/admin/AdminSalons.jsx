import React, { useState, useRef, useEffect } from 'react'
import {
  Search,
  Plus,
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  Upload,
  Download,
  Trash2,
  Edit2,
  X,
  Save,
  Copy,
  ExternalLink,
  Loader2,
  AlertCircle,
  RefreshCw,
  CheckCircle,
  FileSpreadsheet,
  Store
} from 'lucide-react'
import { useStore } from '../../store/useStore'

export default function AdminSalons() {
  const {
    salons,
    salonsLoading,
    salonsError,
    fetchSalons,
    addSalon,
    updateSalon,
    deleteSalon,
    importSalons,
    exportSalons
  } = useStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSalon, setSelectedSalon] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [editingSalon, setEditingSalon] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [copySuccess, setCopySuccess] = useState(null)

  // Fetch salons on mount
  useEffect(() => {
    fetchSalons().catch(err => {
      console.error('Failed to fetch salons:', err)
    })
  }, [fetchSalons])

  const filteredSalons = salons.filter((salon) =>
    salon.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    salon.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    salon.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    salon.slug?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const activeSalons = salons.filter(s => s.active).length
  const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin

  // Handle delete
  const handleDelete = async (id) => {
    setDeleting(true)
    try {
      await deleteSalon(id)
      setDeleteConfirm(null)
    } catch (err) {
      console.error('Error deleting salon:', err)
      alert('Erreur lors de la suppression: ' + err.message)
    } finally {
      setDeleting(false)
    }
  }

  // Copy salon URL
  const copyUrl = (slug) => {
    const url = `${baseUrl}/salon/${slug}`
    navigator.clipboard.writeText(url)
    setCopySuccess(slug)
    setTimeout(() => setCopySuccess(null), 2000)
  }

  // Export to CSV
  const handleExport = async () => {
    try {
      const data = await exportSalons(baseUrl)

      // Convert to CSV
      const headers = ['Nom', 'Slug', 'Email', 'Téléphone', 'Ville', 'Code Postal', 'Commission %', 'Actif', 'URL']
      const rows = data.map(s => [
        s.name,
        s.slug,
        s.email || '',
        s.phone || '',
        s.city || '',
        s.postal_code || '',
        s.commission_rate,
        s.active ? 'Oui' : 'Non',
        s.url
      ])

      const csvContent = [
        headers.join(';'),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(';'))
      ].join('\n')

      // Download
      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `salons_ava_${new Date().toISOString().split('T')[0]}.csv`
      link.click()
    } catch (err) {
      console.error('Error exporting salons:', err)
      alert('Erreur lors de l\'export: ' + err.message)
    }
  }

  // Loading state
  if (salonsLoading && salons.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-ava-gold animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Chargement des salons...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (salonsError && salons.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-700 font-medium mb-2">Erreur de chargement</p>
          <p className="text-gray-500 mb-4">{salonsError}</p>
          <button
            onClick={() => fetchSalons()}
            className="btn-gold flex items-center gap-2 mx-auto"
          >
            <RefreshCw size={18} />
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif text-ava-700">Salons partenaires</h1>
          <p className="text-gray-500 mt-1">
            {activeSalons} actifs sur {salons.length} salons
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Upload size={18} />
            Importer CSV
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download size={18} />
            Exporter CSV
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-gold flex items-center gap-2"
          >
            <Plus size={18} />
            Ajouter un salon
          </button>
        </div>
      </div>

      {/* Search & Refresh */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher par nom, ville, email ou slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-ava-gold/20 focus:border-ava-gold"
          />
        </div>
        <button
          onClick={() => fetchSalons()}
          className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          title="Rafraîchir"
        >
          <RefreshCw size={20} className={salonsLoading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Salons Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Salon</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">URL</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 hidden md:table-cell">Contact</th>
                <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">Commission</th>
                <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">Statut</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSalons.map((salon) => (
                <tr key={salon.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-ava-gold/20 flex items-center justify-center">
                        <Store className="w-5 h-5 text-ava-gold" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{salon.name}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <MapPin size={12} />
                          {salon.city || 'Ville non renseignée'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        /salon/{salon.slug}
                      </code>
                      <button
                        onClick={() => copyUrl(salon.slug)}
                        className="p-1 text-gray-400 hover:text-ava-gold transition-colors"
                        title="Copier l'URL"
                      >
                        {copySuccess === salon.slug ? (
                          <CheckCircle size={16} className="text-green-500" />
                        ) : (
                          <Copy size={16} />
                        )}
                      </button>
                      <a
                        href={`${baseUrl}/salon/${salon.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-gray-400 hover:text-ava-gold transition-colors"
                        title="Ouvrir la boutique"
                      >
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <div className="space-y-1 text-sm text-gray-600">
                      {salon.email && (
                        <a href={`mailto:${salon.email}`} className="flex items-center gap-1 hover:text-ava-gold">
                          <Mail size={14} />
                          {salon.email}
                        </a>
                      )}
                      {salon.phone && (
                        <p className="flex items-center gap-1">
                          <Phone size={14} />
                          {salon.phone}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="font-semibold text-ava-gold">
                      {salon.commission_rate}%
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      salon.active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {salon.active ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setSelectedSalon(salon)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Détails"
                      >
                        <MoreVertical size={18} />
                      </button>
                      <button
                        onClick={() => setEditingSalon(salon)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(salon.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSalons.length === 0 && (
          <div className="text-center py-12">
            <Store className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucun salon trouvé</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 text-ava-gold hover:underline"
            >
              Ajouter votre premier salon partenaire
            </button>
          </div>
        )}
      </div>

      {/* Salon Detail Modal */}
      {selectedSalon && (
        <SalonDetailModal
          salon={selectedSalon}
          baseUrl={baseUrl}
          onClose={() => setSelectedSalon(null)}
        />
      )}

      {/* Add/Edit Salon Modal */}
      {(showAddModal || editingSalon) && (
        <SalonFormModal
          salon={editingSalon}
          onClose={() => {
            setShowAddModal(false)
            setEditingSalon(null)
          }}
          onSave={async (data) => {
            if (editingSalon) {
              await updateSalon(editingSalon.id, data)
            } else {
              await addSalon(data)
            }
          }}
        />
      )}

      {/* Import Modal */}
      {showImportModal && (
        <ImportModal
          onClose={() => setShowImportModal(false)}
          onImport={importSalons}
        />
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Supprimer ce salon ?
              </h3>
              <p className="text-gray-500 mb-6">
                Cette action supprimera le salon et son URL dédiée. Les commandes existantes seront conservées.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Suppression...
                    </>
                  ) : (
                    'Supprimer'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Salon Detail Modal
function SalonDetailModal({ salon, baseUrl, onClose }) {
  const salonUrl = `${baseUrl}/salon/${salon.slug}`
  const [copied, setCopied] = useState(false)

  const copyLink = () => {
    navigator.clipboard.writeText(salonUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif text-ava-700">{salon.name}</h2>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Salon URL */}
          <div className="bg-ava-50 rounded-xl p-4">
            <p className="text-sm font-medium text-ava-700 mb-2">URL de la boutique dédiée</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={salonUrl}
                readOnly
                className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
              />
              <button
                onClick={copyLink}
                className="px-4 py-2 bg-ava-gold text-white rounded-lg hover:bg-ava-gold/90 transition-colors flex items-center gap-2"
              >
                {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                {copied ? 'Copié !' : 'Copier'}
              </button>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Informations de contact</h3>
            <div className="space-y-2 text-sm">
              {salon.email && (
                <p className="flex items-center gap-2 text-gray-600">
                  <Mail size={16} className="text-gray-400" />
                  <a href={`mailto:${salon.email}`} className="hover:text-ava-gold">{salon.email}</a>
                </p>
              )}
              {salon.phone && (
                <p className="flex items-center gap-2 text-gray-600">
                  <Phone size={16} className="text-gray-400" />
                  {salon.phone}
                </p>
              )}
              {(salon.address || salon.city) && (
                <p className="flex items-center gap-2 text-gray-600">
                  <MapPin size={16} className="text-gray-400" />
                  {[salon.address, salon.postal_code, salon.city].filter(Boolean).join(', ')}
                </p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Paramètres</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-ava-gold">{salon.commission_rate}%</p>
                <p className="text-xs text-gray-500">Commission</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className={`text-2xl font-bold ${salon.active ? 'text-green-600' : 'text-gray-400'}`}>
                  {salon.active ? 'Actif' : 'Inactif'}
                </p>
                <p className="text-xs text-gray-500">Statut</p>
              </div>
            </div>
          </div>

          {/* Open boutique button */}
          <a
            href={salonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full btn-gold flex items-center justify-center gap-2"
          >
            <ExternalLink size={18} />
            Ouvrir la boutique
          </a>
        </div>
      </div>
    </div>
  )
}

// Salon Form Modal (Add/Edit)
function SalonFormModal({ salon, onClose, onSave }) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    name: salon?.name || '',
    slug: salon?.slug || '',
    email: salon?.email || '',
    phone: salon?.phone || '',
    address: salon?.address || '',
    city: salon?.city || '',
    postal_code: salon?.postal_code || '',
    commission_rate: salon?.commission_rate || 10,
    active: salon?.active !== false
  })

  // Generate slug from name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-') // Replace spaces with dashes
      .replace(/-+/g, '-') // Remove multiple dashes
      .trim()
  }

  const handleNameChange = (e) => {
    const name = e.target.value
    setFormData(prev => ({
      ...prev,
      name,
      slug: prev.slug || generateSlug(name)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.slug) {
      setError('Le nom et le slug sont obligatoires')
      return
    }

    setSaving(true)
    setError(null)

    try {
      await onSave(formData)
      onClose()
    } catch (err) {
      console.error('Error saving salon:', err)
      setError(err.message || 'Une erreur est survenue')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-serif text-ava-700">
            {salon ? 'Modifier le salon' : 'Ajouter un salon'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom du salon *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={handleNameChange}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-ava-gold/20 focus:border-ava-gold"
              placeholder="Salon Marie Coiffure"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug URL *
            </label>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">/salon/</span>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: generateSlug(e.target.value) })}
                required
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-ava-gold/20 focus:border-ava-gold"
                placeholder="salon-marie-coiffure"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Utilisé dans l'URL: {window.location.origin}/salon/{formData.slug || 'votre-slug'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-ava-gold/20 focus:border-ava-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-ava-gold/20 focus:border-ava-gold"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-ava-gold/20 focus:border-ava-gold"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Code postal</label>
              <input
                type="text"
                value={formData.postal_code}
                onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-ava-gold/20 focus:border-ava-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-ava-gold/20 focus:border-ava-gold"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Taux de commission (%)
            </label>
            <input
              type="number"
              value={formData.commission_rate}
              onChange={(e) => setFormData({ ...formData, commission_rate: parseFloat(e.target.value) || 10 })}
              min="0"
              max="100"
              step="0.5"
              className="w-32 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-ava-gold/20 focus:border-ava-gold"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="font-medium text-gray-700">Statut du salon</p>
              <p className="text-sm text-gray-500">
                {formData.active ? 'Boutique accessible' : 'Boutique désactivée'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, active: !formData.active })}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                formData.active ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                formData.active ? 'right-1' : 'left-1'
              }`} />
            </button>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 btn-gold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save size={18} />
                  {salon ? 'Enregistrer' : 'Créer le salon'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Import CSV Modal
function ImportModal({ onClose, onImport }) {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState([])
  const [importing, setImporting] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setError(null)
    setResult(null)

    // Parse CSV preview
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const text = event.target.result
        const lines = text.split('\n').filter(line => line.trim())
        const headers = lines[0].split(/[;,]/).map(h => h.replace(/"/g, '').trim().toLowerCase())

        const data = lines.slice(1, 6).map(line => {
          const values = line.split(/[;,]/).map(v => v.replace(/"/g, '').trim())
          const obj = {}
          headers.forEach((h, i) => {
            obj[h] = values[i] || ''
          })
          return obj
        })

        setPreview(data)
      } catch (err) {
        setError('Erreur lors de la lecture du fichier CSV')
      }
    }
    reader.readAsText(selectedFile)
  }

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleImport = async () => {
    if (!file) return

    setImporting(true)
    setError(null)

    try {
      const reader = new FileReader()
      reader.onload = async (event) => {
        try {
          const text = event.target.result
          const lines = text.split('\n').filter(line => line.trim())
          const headers = lines[0].split(/[;,]/).map(h => h.replace(/"/g, '').trim().toLowerCase())

          // Map headers to expected fields
          const headerMap = {
            'nom': 'name',
            'name': 'name',
            'slug': 'slug',
            'email': 'email',
            'telephone': 'phone',
            'téléphone': 'phone',
            'phone': 'phone',
            'adresse': 'address',
            'address': 'address',
            'ville': 'city',
            'city': 'city',
            'code postal': 'postal_code',
            'code_postal': 'postal_code',
            'postal_code': 'postal_code',
            'cp': 'postal_code',
            'commission': 'commission_rate',
            'commission_rate': 'commission_rate',
            'taux': 'commission_rate'
          }

          const salons = lines.slice(1).map(line => {
            const values = line.split(/[;,]/).map(v => v.replace(/"/g, '').trim())
            const salon = {
              active: true,
              commission_rate: 10
            }

            headers.forEach((h, i) => {
              const field = headerMap[h.toLowerCase()]
              if (field && values[i]) {
                if (field === 'commission_rate') {
                  salon[field] = parseFloat(values[i]) || 10
                } else {
                  salon[field] = values[i]
                }
              }
            })

            // Generate slug if not provided
            if (!salon.slug && salon.name) {
              salon.slug = generateSlug(salon.name)
            }

            return salon
          }).filter(s => s.name && s.slug) // Only keep valid entries

          if (salons.length === 0) {
            setError('Aucun salon valide trouvé dans le fichier')
            setImporting(false)
            return
          }

          const imported = await onImport(salons)
          setResult({
            success: true,
            count: imported.length
          })
        } catch (err) {
          console.error('Import error:', err)
          setError(err.message || 'Erreur lors de l\'import')
        } finally {
          setImporting(false)
        }
      }
      reader.readAsText(file)
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'import')
      setImporting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-serif text-ava-700">Importer des salons (CSV)</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="font-medium text-blue-800 mb-2">Format du fichier CSV</h3>
            <p className="text-sm text-blue-700 mb-2">
              Le fichier doit contenir les colonnes suivantes (séparateur: virgule ou point-virgule) :
            </p>
            <code className="text-xs bg-blue-100 px-2 py-1 rounded block">
              Nom;Email;Telephone;Adresse;Ville;Code Postal;Commission
            </code>
            <p className="text-xs text-blue-600 mt-2">
              Le slug sera généré automatiquement à partir du nom si non fourni.
            </p>
          </div>

          {/* File Upload */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-ava-gold hover:bg-ava-gold/5 transition-colors"
          >
            <FileSpreadsheet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="font-medium text-gray-700">
              {file ? file.name : 'Cliquez pour sélectionner un fichier CSV'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              ou glissez-déposez votre fichier ici
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Preview */}
          {preview.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Aperçu (5 premières lignes)</h3>
              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {Object.keys(preview[0]).map(key => (
                        <th key={key} className="px-3 py-2 text-left text-gray-600">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {preview.map((row, i) => (
                      <tr key={i}>
                        {Object.values(row).map((val, j) => (
                          <td key={j} className="px-3 py-2 text-gray-700">{val}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Success */}
          {result?.success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
              <CheckCircle size={18} />
              <span>{result.count} salons importés avec succès !</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {result?.success ? 'Fermer' : 'Annuler'}
            </button>
            {!result?.success && (
              <button
                onClick={handleImport}
                disabled={!file || importing}
                className="flex-1 btn-gold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {importing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Import en cours...
                  </>
                ) : (
                  <>
                    <Upload size={18} />
                    Importer les salons
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
