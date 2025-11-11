
---

# Elevana — Démo E‑commerce 🛍️

![logo](/public/logo.png)

Description

Elevana est une application démo de boutique en ligne construite avec Next.js (app router), TypeScript et Tailwind CSS. L'application utilise `json-server` comme backend factice pour exposer des collections de produits, catégories, avis et commandes.

Technologies utilisées

- Next.js (app router) + Turbopack
- React 19 + TypeScript
- Tailwind CSS
- Radix UI primitives
- json-server (mock API)

Prérequis

- Node.js 18+ recommandé
- npm / pnpm / yarn

Installation

Depuis la racine du projet :

```bash
npm install
```

Lancement (développement)

Le script `dev` démarre simultanément le serveur Next.js et le mock API :

```bash
npm run dev
```

Si vous préférez lancer `json-server` séparément :

```bash
npm run json-server
# puis dans un autre terminal
npm run dev --silent
```

Lancement production

```bash
npm run build
npm run start
```

API factice (json-server)

Le fichier de données est `db/db.json`. L'API est disponible par défaut sur : http://localhost:5000

Endpoints principaux

- GET/POST/PATCH/DELETE /products
- GET/POST /categories
- GET/POST /reviews
- GET/POST /orders
- GET/POST /users

Structure du projet

- `app/` — routes et layouts Next.js
- `components/` — composants UI (header, footer, product-card, etc.)
- `lib/` — contextes et helpers (AuthContext, CartContext, ProductsContext, OrderContext)
- `db/` — fichiers de données factices (`db.json`) et `models.ts`
- `public/` — images et assets (logo, hero, etc.)

Fonctionnalités implémentées

- Catalogue de produits avec pages de listing et détail
- Filtrage / recherche simplifiée
- Panier (stocké dans un CartContext)
- Processus de checkout (création de commande, mise à jour du stock)
- Auth basique via cookie (flux dépendant d'un `userId` quand présent)
- Pages utilisateur : profil, historique de commandes

Captures d'écran

Voici quelques captures d'écran extraites du dossier `public/` :

- Logo

![logo](/public/logo.png)

Si vous avez d'autres images/screenshots, placez-les dans `public/` et ajoutez-les ici.

Exemples d'utilisation rapide

Lancer le mock API seulement :

```bash
npm run json-server
```

Lancer le front en dev (dev server + json-server) :

```bash
npm run dev
```

Notes importantes

- Certains flux utilisent le cookie `userId`. Si une action échoue (ex : création de commande), vérifiez la présence du cookie ou utilisez un utilisateur existant dans `db/db.json`.
- Le script `dev` lance deux processus en parallèle. Si vous rencontrez des problèmes, lancez Next.js et `json-server` séparément.

Contribuer

1. Forkez le dépôt.
2. Ouvrez une branche dédiée et une PR avec une description claire.

Vérification finale

- Répertoire `db/` et `package.json` vérifiés : `db/db.json` présent et scripts `dev`, `json-server`, `build`, `start` disponibles.

---


# Capture d'écran

- Page d'accueil

![homepage](/public/Snapshot/HomePage.png)


- Page Produits

![produits](/public/Snapshot/Produits.png)


- Page Produit

![produits](/public/Snapshot/Produit.png)


- Page Promotions

![produits](/public/Snapshot/Promotions.png)

