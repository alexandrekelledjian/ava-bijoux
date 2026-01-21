import React, { useState, useRef } from 'react'
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Image,
  Upload,
  X,
  Save,
  Eye,
  EyeOff,
  GripVertical,
  Gem,
  Star
} from 'lucide-react'
import { useStore } from '../../store/useStore'

// Mock initial products data
const initialProducts = [
  {
    id: 1,
    name: 'Collier Étoile',
    category: 'collier',
    basePrice: 35,
    description: 'Un magnifique collier avec pendentif étoile personnalisable',
    images: ['/images/products/collier-etoile-1.jpg'],
    materials: ['Acier inoxydable', 'Plaqué or'],
    customizable: true,
    maxChars: 15,
    active: true,
    stock: 100,
    createdAt: '2025-01-10'
  },
  {
    id: 2,
    name: 'Bracelet Infini',
    category: 'bracelet',
    basePrice: 28,
    description: 'Bracelet élégant avec symbole infini et gravure personnalisée',
    images: ['/images/products/bracelet-infini-1.jpg'],
    materials: ['Acier inoxydable', 'Or rose'],
    customizable: true,
    maxChars: 10,
    active: true,
    stock: 75,
    createdAt: '2025-01-12'
  },
  {
    id: 3,
    name: 'Pendentif Cœur',
    category: 'collier',
    basePrice: 42,
    description: 'Pendentif en forme de cœur avec gravure laser',
    images: ['/images/products/pendentif-coeur-1.jpg'],
    materials: ['Acier inoxydable', 'Plaqué or'],
    customizable: true,
    maxChars: 12,
    active: false,
    stock: 0,
    createdAt: '2025-01-15'
  }
]

const categories = [
  { value: 'collier', label: 'Collier' },
  { value: 'bracelet', label: 'Bracelet' },
  { value: 'pendentif', label: 'Pendentif' },
  { value: 'bague', label: 'Bague' }
]

const materials = [
  'Acier inoxydable',
  'Plaqué or',
  'Or rose',
  'Argent',
  'Plaqué argent'
]

export default function ProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct, toggleProductStatus } = useStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const fileInputRef = useRef(null)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: 'collier',
    basePrice: '',
    description: '',
    images: [],
    materials: ['Acier inoxydable'],
    customizable: true,
    maxChars: 15,
    active: true,
    stock: 0
  })
  const [previewImages, setPreviewImages] = useState([])

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory
    return matchesSearch && matchesCategory
  })

  // Open modal for new product
  const handleAddProduct = () => {
    setEditingProduct(null)
    setFormData({
      name: '',
      category: 'collier',
      basePrice: '',
      description: '',
      images: [],
      materials: ['Acier inoxydable'],
      customizable: true,
      maxChars: 15,
      active: true,
      stock: 0
    })
    setPreviewImages([])
    setShowModal(true)
  }

  // Open modal for editing
  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      category: product.category,
      basePrice: product.basePrice.toString(),
      description: product.description,
      images: product.images,
      materials: product.materials,
      customizable: product.customizable,
      maxChars: product.maxChars,
      active: product.active,
      stock: product.stock
    })
    setPreviewImages(product.images)
    setShowModal(true)
  }

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)

    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImages(prev => [...prev, reader.result])
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, reader.result]
        }))
      }
      reader.readAsDataURL(file)
    })
  }

  // Remove image
  const handleRemoveImage = (index) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index))
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  // Handle material toggle
  const handleMaterialToggle = (material) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.includes(material)
        ? prev.materials.filter(m => m !== material)
        : [...prev.materials, material]
    }))
  }

  // Save product
  const handleSaveProduct = () => {
    if (!formData.name || !formData.basePrice) {
      alert('Veuillez remplir tous les champs obligatoires')
      return
    }

    const productData = {
      ...formData,
      basePrice: parseFloat(formData.basePrice),
      stock: parseInt(formData.stock) || 0
    }

    if (editingProduct) {
      // Update existing product
      setProducts(prev => prev.map(p =>
        p.id === editingProduct.id ? { ...p, ...productData } : p
      ))
    } else {
      // Add new product
      const newProduct = {
        ...productData,
        id: Date.now(),
        createdAt: new Date().toISOString().split('T')[0]
      }
      setProducts(prev => [...prev, newProduct])
    }

    setShowModal(false)
  }

  // Delete product
  const handleDeleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id))
    setDeleteConfirm(null)
  }


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif text-ava-700">Gestion des produits</h1>
          <p className="text-gray-500 mt-1">Gérez votre catalogue de bijoux personnalisables</p>
        </div>
        <button
          onClick={handleAddProduct}
          className="btn-gold flex items-center gap-2"
        >
          <Plus size={20} />
          Ajouter un produit
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-ava-gold/10 rounded-lg">
              <Gem className="w-5 h-5 text-ava-gold" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-ava-700">{products.length}</p>
              <p className="text-sm text-gray-500">Produits total</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Eye className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-ava-700">
                {products.filter(p => p.active).length}
              </p>
              <p className="text-sm text-gray-500">Produits actifs</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <EyeOff className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-ava-700">
                {products.filter(p => !p.active).length}
              </p>
              <p className="text-sm text-gray-500">Produits masqués</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Star className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-ava-700">
                {products.filter(p => p.customizable).length}
              </p>
              <p className="text-sm text-gray-500">Personnalisables</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-ava-gold/20 focus:border-ava-gold"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-ava-gold/20 focus:border-ava-gold"
          >
            <option value="all">Toutes les catégories</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <div
            key={product.id}
            className={`bg-white rounded-xl border overflow-hidden transition-all hover:shadow-lg ${
              product.active ? 'border-gray-100' : 'border-orange-200 bg-orange-50/30'
            }`}
          >
            {/* Product Image */}
            <div className="relative aspect-square bg-gray-100">
              {product.images.length > 0 ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
              ) : null}
              <div
                className={`absolute inset-0 flex items-center justify-center ${product.images.length > 0 ? 'hidden' : ''}`}
              >
                <Gem className="w-16 h-16 text-gray-300" />
              </div>

              {/* Status badge */}
              <div className="absolute top-3 left-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  product.active
                    ? 'bg-green-100 text-green-700'
                    : 'bg-orange-100 text-orange-700'
                }`}>
                  {product.active ? 'Actif' : 'Masqué'}
                </span>
              </div>

              {/* Category badge */}
              <div className="absolute top-3 right-3">
                <span className="px-2 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-medium text-ava-700 capitalize">
                  {product.category}
                </span>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-ava-700">{product.name}</h3>
                <span className="text-lg font-bold text-ava-gold">{product.basePrice}€</span>
              </div>

              <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                {product.description}
              </p>

              <div className="flex flex-wrap gap-1 mb-3">
                {product.materials.map(mat => (
                  <span
                    key={mat}
                    className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600"
                  >
                    {mat}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>Stock: {product.stock}</span>
                {product.customizable && (
                  <span className="flex items-center gap-1">
                    <Edit2 size={14} />
                    Max {product.maxChars} car.
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => toggleProductStatus(product.id)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    product.active
                      ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {product.active ? 'Masquer' : 'Activer'}
                </button>
                <button
                  onClick={() => handleEditProduct(product)}
                  className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => setDeleteConfirm(product.id)}
                  className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <Gem className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Aucun produit trouvé</p>
          <button
            onClick={handleAddProduct}
            className="mt-4 text-ava-gold hover:underline"
          >
            Ajouter votre premier produit
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-serif text-ava-700">
                {editingProduct ? 'Modifier le produit' : 'Nouveau produit'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Images Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photos du produit
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {previewImages.map((img, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:border-ava-gold hover:bg-ava-gold/5 transition-colors"
                  >
                    <Upload className="w-6 h-6 text-gray-400 mb-1" />
                    <span className="text-xs text-gray-500">Ajouter</span>
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom du produit *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-ava-gold/20 focus:border-ava-gold"
                    placeholder="Ex: Collier Étoile"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Catégorie *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-ava-gold/20 focus:border-ava-gold"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price & Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prix de base (€) *
                  </label>
                  <input
                    type="number"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-ava-gold/20 focus:border-ava-gold"
                    placeholder="35"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock disponible
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-ava-gold/20 focus:border-ava-gold"
                    placeholder="100"
                    min="0"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-ava-gold/20 focus:border-ava-gold"
                  rows={3}
                  placeholder="Description du produit..."
                />
              </div>

              {/* Materials */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Matériaux disponibles
                </label>
                <div className="flex flex-wrap gap-2">
                  {materials.map(material => (
                    <button
                      key={material}
                      type="button"
                      onClick={() => handleMaterialToggle(material)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        formData.materials.includes(material)
                          ? 'bg-ava-gold text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {material}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customization */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-700">Personnalisation</p>
                    <p className="text-sm text-gray-500">Permettre la gravure de texte</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, customizable: !formData.customizable })}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      formData.customizable ? 'bg-ava-gold' : 'bg-gray-300'
                    }`}
                  >
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      formData.customizable ? 'right-1' : 'left-1'
                    }`} />
                  </button>
                </div>

                {formData.customizable && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre max. de caractères
                    </label>
                    <input
                      type="number"
                      value={formData.maxChars}
                      onChange={(e) => setFormData({ ...formData, maxChars: parseInt(e.target.value) || 15 })}
                      className="w-32 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-ava-gold/20 focus:border-ava-gold"
                      min="1"
                      max="50"
                    />
                  </div>
                )}
              </div>

              {/* Active Status */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-700">Statut du produit</p>
                  <p className="text-sm text-gray-500">
                    {formData.active ? 'Visible sur la boutique' : 'Masqué de la boutique'}
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
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveProduct}
                className="btn-gold flex items-center gap-2"
              >
                <Save size={18} />
                {editingProduct ? 'Enregistrer' : 'Créer le produit'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Supprimer ce produit ?
              </h3>
              <p className="text-gray-500 mb-6">
                Cette action est irréversible. Le produit sera définitivement supprimé du catalogue.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleDeleteProduct(deleteConfirm)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
