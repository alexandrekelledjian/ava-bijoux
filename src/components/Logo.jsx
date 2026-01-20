import React from 'react'

// Logo Ava basé sur la charte graphique
// Couleurs : Gris anthracite #4a4a4a, Or #e8c88b
export function Logo({ className = '', showTagline = false, variant = 'default' }) {
  const textColor = variant === 'light' ? '#ffffff' : '#4a4a4a'
  const starColor = '#e8c88b'

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg
        viewBox="0 0 200 80"
        className="h-full w-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Lettre 'a' gauche */}
        <path
          d="M10 65C10 65 15 20 40 20C55 20 55 35 55 35C55 35 55 20 40 20C25 20 20 40 20 50C20 60 25 65 35 65C45 65 50 55 50 55L55 65H65L55 35C55 25 50 15 35 15C15 15 5 35 5 50C5 65 15 75 35 75C50 75 60 65 60 65"
          stroke={textColor}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />

        {/* Lettre 'V' centrale */}
        <path
          d="M70 15L100 70L130 15"
          stroke={textColor}
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Lettre 'a' droite (miroir) */}
        <path
          d="M190 65C190 65 185 20 160 20C145 20 145 35 145 35C145 35 145 20 160 20C175 20 180 40 180 50C180 60 175 65 165 65C155 65 150 55 150 55L145 65H135L145 35C145 25 150 15 165 15C185 15 195 35 195 50C195 65 185 75 165 75C150 75 140 65 140 65"
          stroke={textColor}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      </svg>

      {/* Étoile décorative */}
      <svg
        viewBox="0 0 24 24"
        className="w-4 h-4 mt-1"
        fill={starColor}
      >
        <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
      </svg>

      {showTagline && (
        <span
          className="mt-2 text-sm tracking-[0.2em] uppercase"
          style={{ color: textColor }}
        >
          Bijoux Acier Inoxydable
        </span>
      )}
    </div>
  )
}

// Logo simplifié pour le header (texte uniquement)
export function LogoText({ className = '', variant = 'default' }) {
  const textColor = variant === 'light' ? '#ffffff' : '#4a4a4a'
  const starColor = '#e8c88b'

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Logo "ava" stylisé en texte */}
      <span
        className="text-3xl font-serif tracking-wide"
        style={{
          color: textColor,
          fontStyle: 'italic',
          fontWeight: '400'
        }}
      >
        ava
      </span>
      {/* Petite étoile */}
      <svg
        viewBox="0 0 24 24"
        className="w-3 h-3"
        fill={starColor}
      >
        <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
      </svg>
    </div>
  )
}

// Logo complet avec image (si disponible)
export function LogoFull({ className = '', showTagline = true, size = 'md' }) {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16',
    xl: 'h-24'
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className={`flex items-center gap-1 ${sizeClasses[size]}`}>
        {/* Texte "ava" avec style similaire au logo */}
        <span
          className="font-serif italic tracking-wide"
          style={{
            color: '#4a4a4a',
            fontSize: size === 'sm' ? '1.5rem' : size === 'md' ? '2rem' : size === 'lg' ? '2.5rem' : '3.5rem',
            fontWeight: '400',
            letterSpacing: '0.05em'
          }}
        >
          ava
        </span>
      </div>

      {/* Étoile */}
      <svg
        viewBox="0 0 24 24"
        className={`${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'} mt-0.5`}
        fill="#e8c88b"
      >
        <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
      </svg>

      {showTagline && (
        <span
          className={`mt-1 tracking-[0.15em] uppercase text-ava-500 ${
            size === 'sm' ? 'text-[8px]' : size === 'md' ? 'text-[10px]' : 'text-xs'
          }`}
        >
          Bijoux Acier Inoxydable
        </span>
      )}
    </div>
  )
}

export default Logo
