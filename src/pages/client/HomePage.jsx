import React from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { ArrowRight, Sparkles, Heart, Gift, Truck } from 'lucide-react'
import { products, categories } from '../../data/products'

// Étoile décorative (basée sur la charte graphique)
function StarIcon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="#e8c88b">
      <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
    </svg>
  )
}

export default function HomePage() {
  const { getSalonParam } = useOutletContext()

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-ava-cream via-white to-ava-50 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-ava-gold rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-ava-300 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl">
            {/* Logo grand format dans le hero */}
            <div className="flex items-center gap-2 mb-8">
              <span className="text-5xl md:text-6xl font-serif italic text-ava-700 tracking-wide">
                ava
              </span>
              <StarIcon className="w-5 h-5" />
            </div>

            <h1 className="text-3xl md:text-5xl font-serif font-medium text-ava-700 leading-tight mb-6">
              Créez un bijou
              <span className="block text-ava-gold">unique et personnel</span>
            </h1>
            <p className="text-lg md:text-xl text-ava-500 mb-8 max-w-xl">
              Gravez votre message, un prénom ou une date sur nos bijoux en acier inoxydable.
              Un cadeau qui restera gravé dans les mémoires.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={`/#catalogue${getSalonParam()}`} className="btn-primary inline-flex items-center justify-center gap-2">
                Découvrir la collection
                <ArrowRight size={20} />
              </Link>
              <a href="#how-it-works" className="btn-secondary inline-flex items-center justify-center gap-2">
                Comment ça marche ?
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Sparkles, title: 'Personnalisé', desc: 'Gravure sur mesure' },
              { icon: Heart, title: 'Acier Inoxydable', desc: 'Qualité durable' },
              { icon: Gift, title: 'Coffret cadeau', desc: 'Écrin élégant inclus' },
              { icon: Truck, title: 'Livraison offerte', desc: 'En salon partenaire' },
            ].map((feature, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-ava-gold/20 flex items-center justify-center">
                  <feature.icon className="text-ava-gold" size={28} />
                </div>
                <h3 className="font-semibold text-ava-700 mb-1">{feature.title}</h3>
                <p className="text-sm text-ava-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 bg-ava-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <h2 className="section-title text-center">Comment ça marche ?</h2>
            <StarIcon className="w-4 h-4" />
          </div>
          <p className="text-ava-500 text-center mb-12 max-w-2xl mx-auto">
            Créez votre bijou personnalisé en quelques clics
          </p>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Choisissez', desc: 'Sélectionnez votre bijou parmi notre collection' },
              { step: '2', title: 'Personnalisez', desc: 'Ajoutez votre texte et choisissez votre typographie' },
              { step: '3', title: 'Prévisualisez', desc: 'Visualisez votre bijou en 3D avant de commander' },
              { step: '4', title: 'Recevez', desc: 'Livraison gratuite dans votre salon ou à domicile' },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="bg-white rounded-2xl p-6 shadow-lg relative z-10">
                  <div className="w-12 h-12 rounded-full bg-ava-700 text-white font-bold text-xl flex items-center justify-center mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-ava-700 text-lg mb-2">{item.title}</h3>
                  <p className="text-ava-500 text-sm">{item.desc}</p>
                </div>
                {i < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-ava-gold/50 z-0"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Catalogue */}
      <section id="catalogue" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <h2 className="section-title text-center">Notre Collection</h2>
            <StarIcon className="w-4 h-4" />
          </div>
          <p className="text-ava-500 text-center mb-12">
            Des bijoux en acier inoxydable prêts à être personnalisés
          </p>

          {categories.map((category) => (
            <div key={category.id} id={category.id} className="mb-16">
              <h3 className="text-2xl font-serif font-medium text-ava-700 mb-8 flex items-center gap-3">
                <span>{category.icon}</span>
                {category.name}
              </h3>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products
                  .filter((p) => p.category === category.id)
                  .map((product) => (
                    <ProductCard key={product.id} product={product} getSalonParam={getSalonParam} />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-ava-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <StarIcon className="w-6 h-6" />
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-medium text-white mb-4">
            Prêt à créer votre bijou unique ?
          </h2>
          <p className="text-ava-200 mb-8 max-w-xl mx-auto">
            Offrez un cadeau qui restera gravé dans les mémoires.
            Livraison gratuite dans votre salon partenaire.
          </p>
          <Link to={`/#catalogue${getSalonParam()}`} className="btn-gold inline-flex items-center gap-2">
            Commencer maintenant
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  )
}

function ProductCard({ product, getSalonParam }) {
  return (
    <div className="card group">
      {/* Product Image Placeholder */}
      <div className="aspect-square bg-gradient-to-br from-ava-50 to-ava-100 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-32 h-32 rounded-full opacity-80"
            style={{ backgroundColor: product.modelColor }}
          ></div>
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
          <Link
            to={`/personnaliser/${product.id}${getSalonParam()}`}
            className="btn-primary opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0"
          >
            Personnaliser
          </Link>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5">
        <h4 className="font-semibold text-ava-700 text-lg mb-1">{product.name}</h4>
        <p className="text-ava-500 text-sm mb-3 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-semibold text-ava-gold">
            {product.price.toFixed(2)} €
          </span>
          <span className="text-xs text-ava-400">
            Max {product.maxChars} caractères
          </span>
        </div>
      </div>
    </div>
  )
}
