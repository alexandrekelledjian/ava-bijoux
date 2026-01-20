# Ava - Bijoux Personnalisés

Plateforme e-commerce de bijoux personnalisés pour salons de coiffure partenaires, avec système de commissions et liens de parrainage.

## 🎯 Fonctionnalités

### Boutique Client
- Catalogue de bijoux (colliers, bracelets)
- Personnalisation avec texte gravé
- Prévisualisation 3D interactive
- 3 options de livraison (salon gratuit, point relais, domicile)
- Paiement sécurisé via Stripe

### Espace Salon Partenaire
- Lien boutique personnalisé (`?salon=ID`)
- Tableau de bord avec statistiques
- Suivi des commandes en temps réel
- Gestion des commissions (30% du CA)
- Demande de virements

### Back-Office Admin
- Vue globale de toutes les commandes
- Gestion des 450 salons partenaires
- Suivi et validation des commissions
- Mise à jour des statuts de commande

## 🚀 Installation

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation locale

```bash
# Cloner le projet
git clone <repo-url>
cd ava-bijoux

# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env
# Éditer .env avec vos clés Stripe

# Lancer le serveur de développement (frontend)
npm run dev

# Dans un autre terminal, lancer l'API
npm run server
```

### Configuration Stripe

1. Créer un compte sur [Stripe Dashboard](https://dashboard.stripe.com)
2. Récupérer vos clés API (mode test)
3. Configurer dans `.env`:
   ```
   STRIPE_SECRET_KEY=sk_test_xxx
   VITE_STRIPE_PUBLIC_KEY=pk_test_xxx
   ```

## 📁 Structure du projet

```
ava-bijoux/
├── src/                    # Code React frontend
│   ├── components/         # Composants réutilisables
│   ├── pages/             # Pages de l'application
│   │   ├── client/        # Boutique client
│   │   ├── salon/         # Espace salon
│   │   └── admin/         # Back-office admin
│   ├── store/             # État global (Zustand)
│   ├── data/              # Données statiques (produits, etc.)
│   └── styles/            # Styles Tailwind
├── server/                 # Backend Express
│   ├── db/                # Base de données SQLite
│   ├── routes/            # Routes API
│   └── middleware/        # Authentification JWT
└── public/                # Assets statiques
```

## 🔗 URLs de l'application

| URL | Description |
|-----|-------------|
| `/` | Boutique (avec `?salon=ID` pour lier un salon) |
| `/personnaliser/:id` | Page de personnalisation bijou |
| `/panier` | Panier d'achat |
| `/checkout` | Page de paiement |
| `/salon/login` | Connexion espace salon |
| `/salon/dashboard` | Dashboard salon |
| `/admin/login` | Connexion admin |
| `/admin/dashboard` | Dashboard admin |

## 📝 API Endpoints

### Authentification
- `POST /api/auth/salon/login` - Connexion salon
- `POST /api/auth/admin/login` - Connexion admin

### Produits
- `GET /api/products` - Liste des produits
- `GET /api/products/:id` - Détail produit

### Commandes
- `POST /api/orders` - Créer une commande
- `GET /api/orders` - Liste commandes (admin)
- `GET /api/orders/salon` - Commandes du salon connecté
- `PATCH /api/orders/:id/status` - Mettre à jour statut

### Salons
- `GET /api/salons/public/:id` - Info salon (public)
- `GET /api/salons` - Liste salons (admin)
- `POST /api/salons` - Créer salon (admin)

### Commissions
- `GET /api/commissions` - Liste commissions (admin)
- `GET /api/commissions/me` - Commissions du salon
- `POST /api/commissions/request-payout` - Demander virement
- `POST /api/commissions/process-payout/:id` - Valider virement (admin)

## 🎨 Personnalisation

### Polices de gravure
- Élégant (Cormorant Garamond)
- Script (Dancing Script)
- Moderne (Montserrat)
- Classique (Playfair Display)

### Couleurs de métal
- Or (#d4af37)
- Argent (#c0c0c0)
- Or Rose (#e8c4c4)

## 🚢 Déploiement

### Option 1 : Vercel (Frontend) + Railway/Render (Backend)

```bash
# Build frontend
npm run build

# Le dossier dist/ peut être déployé sur Vercel
```

### Option 2 : VPS / Serveur dédié

```bash
# Build production
npm run build

# Démarrer le serveur (sert le frontend buildé)
NODE_ENV=production npm run server
```

### Variables d'environnement en production

```env
NODE_ENV=production
PORT=3001
JWT_SECRET=<clé-secrète-forte>
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
VITE_STRIPE_PUBLIC_KEY=pk_live_xxx
```

## 📊 Comptes de démonstration

### Salon
- Email: `marie@salonmarie.fr`
- Mot de passe: `salon123`

### Admin
- Email: `admin@ava-bijoux.fr`
- Mot de passe: `admin123`

## 🔒 Sécurité

- Authentification JWT avec expiration
- Hashage bcrypt des mots de passe
- Validation des données côté serveur
- Protection CSRF via Stripe
- Middleware d'autorisation par rôle

## 📞 Support

Pour toute question technique : alexandre.kelledjian@depotsgemmes.com

---

*Développé avec ❤️ pour Dépôts Gemmes*
