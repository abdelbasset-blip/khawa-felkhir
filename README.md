# 🌟 Khawa Felkhir (خاوة في الخير)
> **Plateforme web caritative moderne et solidaire** — Vitrine publique citoyenne & Espace d'administration sécurisé.

---

## 📋 Table des matières
1. [À propos du projet](#-à-propos-du-projet)
2. [Stack Technique & Architecture](#-stack-technique--architecture)
3. [Fonctionnalités Principales](#-fonctionnalités-principales)
4. [Prérequis](#-prérequis)
5. [Démarrage Rapide (Développement Local)](#-démarrage-rapide-développement-local)
6. [Utilisation avec Docker](#-utilisation-avec-docker)
7. [Variables d'Environnement](#-variables-denvironnement)
8. [Base de Données & Seeding](#-base-de-données--seeding)
9. [Identifiants de Démonstration](#-identifiants-de-démonstration)
10. [Optimisations & Accessibilité (Phase 6)](#-optimisations--accessibilité-phase-6)
11. [Guide de Déploiement en Production](#-guide-de-déploiement-en-production)

---

## 🌍 À propos du projet
**Khawa Felkhir** est une application web humanitaire conçue pour connecter les cœurs généreux, les bénévoles de terrain et les familles dans le besoin à travers toute la Tunisie et la région du Maghreb.

Elle offre :
- **Une vitrine publique inspirante** avec présentation des missions, statistiques d'impact en temps réel, témoignages rotatifs, modal de dons avec simulateur d'impact et inscription instantanée aux actions de terrain.
- **Un espace de gestion administrative complet et sécurisé** permettant la gestion des bénéficiaires, le suivi des aides sociales, le pilotage des campagnes et le suivi des inscriptions bénévoles.

---

## 🛠 Stack Technique & Architecture

### **Frontend**
- **Framework** : React 18 + TypeScript + Vite 5
- **Style & UI** : Tailwind CSS + shadcn/ui + Lucide Icons
- **Visualisations & Graphiques** : Recharts (AreaChart, Donut/PieChart)
- **Animations** : Framer Motion (Transitions de pages, modales, compteurs animés)
- **Carousels** : Embla Carousel (Témoignages interactifs)
- **État & Données** : Zustand (Auth store persistant) + Axios
- **Accessibilité & i18n** : Support bilingue Français / Arabe (تونس) avec bascule automatique RTL (`dir="rtl"`) et audit WCAG AA.

### **Backend**
- **Runtime** : Node.js (v20+) + Express.js + TypeScript
- **ORM** : Prisma ORM 5
- **Base de Données** : PostgreSQL 16
- **Sécurité** : JWT (JsonWebTokens), BcryptJS (hashing de mots de passe), Helmet (headers HTTP sécurisés), CORS sécurisé, Rate Limiting (`express-rate-limit`), Validation stricte des entrées via Zod.

---

## 🚀 Fonctionnalités Principales

### 🏠 **Vitrine Publique (Showcase)**
- **Page d'accueil (`/`)** : Hero avec boutons d'action rapide, statistiques d'impact animées, mise en avant des prochaines actions, carrousel de témoignages et pied de page informatif.
- **Catalogue des Événements (`/evenements`)** : Filtres par statut (*À venir*, *En cours*, *Passés*) et recherche instantanée par titre ou lieu.
- **Fiche Événement Détaillée (`/evenements/:id`)** : Barre de progression des bénévoles, statut de complétude, boutons de partage social (WhatsApp, Facebook, Twitter, LinkedIn, Copie de lien), et formulaire modal d'inscription bénévole.
- **Modal de Don Solidaire** : Simulateur de don interactif montrant l'impact concret (*10 TND = 1 Panier repas*, *30 TND = 1 Cartable garni*, *100 TND = 1 Caravane de santé*), coordonnées bancaires RIB et contact direct.
- **Page de Contact (`/contact`)** : Coordonnées complètes, carte interactive, formulaire de contact relié à l'API et FAQ accordéon.

### 🛡️ **Espace d'Administration (`/admin`)**
- **Authentification Sécurisée (`/login`)** : JWT stocké de façon sécurisée avec expiration et redirection automatique des routes protégées.
- **Layout Ergonomique** : Barre latérale rétractable (collapsible) avec mémorisation de l'état, topbar avec avatar, bascule thème sombre/clair, sélecteur de langue et tiroir mobile.
- **Tableau de Bord (`/admin/dashboard`)** : 4 KPI cards (bénéficiaires, événements, dons simulés, bénévoles), évolution mensuelle des aides (AreaChart), répartition par type d'événement (Donut), liste des actions prioritaires et notifications récentes.
- **Gestion des Bénéficiaires (`/admin/beneficiaires`)** : CRUD complet, recherche multi-critères, filtres par statut et type d'aide, pagination, modal de création/édition validée par Zod et export CSV des listes.
- **Gestion des Événements (`/admin/evenements`)** : CRUD des actions humanitaires, dates de début/fin, objectifs de bénévoles, budget prévisionnel, upload/URL d'illustrations et suivi des inscriptions.
- **Paramètres de l'Association (`/admin/settings`)** :
  - **Coordonnées & Siège** : Identité statutaire (nom officiel, sigle, RNA, matricule fiscal), coordonnées de contact (adresse, ville, gouvernorat, téléphone standard, urgence), RIB bancaire pour les dons et présence réseaux sociaux (Facebook, Instagram, LinkedIn).
  - **Notifications & Alertes** : Paramétrage en temps réel des déclencheurs par email (nouvelles inscriptions bénévoles, nouveaux messages de contact, rappels 48h avant événement, seuils de bénéficiaires prioritaires en attente, digest hebdomadaire).
  - **Permissions & Équipe** : Gestion des collaborateurs (invitation, modification de rôle ADMIN ↔ MODERATOR, activation/suspension, suppression sécurisée) et définition des règles de gouvernance globale accordées aux modérateurs (validation de bénéficiaires, publication d'événements, export CSV).

---

## 📦 Prérequis
- **Node.js** : version `20.x` ou supérieure
- **npm** : version `10.x` ou supérieure
- **Docker & Docker Compose** (recommandé pour la base PostgreSQL locale)

---

## 💻 Démarrage Rapide (Développement Local)

### 1. Cloner et préparer le projet
```bash
git clone https://github.com/votre-compte/khawa-felkhir.git
cd khawa-felkhir
```

### 2. Démarrer la base de données PostgreSQL
À la racine du projet, lancez le conteneur PostgreSQL :
```bash
docker compose up -d postgres
```
*(PostgreSQL sera accessible sur `localhost:5432`)*

### 3. Configurer et lancer le Backend
Dans un terminal dédié :
```bash
cd backend

# 1. Copier le fichier d'environnement
cp .env.example .env

# 2. Installer les dépendances
npm install

# 3. Synchroniser le schéma Prisma et générer le client
npx prisma db push

# 4. Charger les données de démonstration (Admin + Bénéficiaires + Événements + Inscriptions)
npm run prisma:seed

# 5. Démarrer le serveur API en mode développement
npm run dev
```
Le backend s'exécute sur : **`http://localhost:5000`**

### 4. Configurer et lancer le Frontend
Dans un second terminal :
```bash
cd frontend

# 1. Copier le fichier d'environnement
cp .env.example .env

# 2. Installer les dépendances
npm install

# 3. Démarrer le serveur Vite
npm run dev
```
Le frontend s'exécute sur : **`http://localhost:5173`** (ou `5174`)

---

## 🐳 Utilisation avec Docker

Vous pouvez également orchestrer l'intégralité de l'application (PostgreSQL + Backend Node.js + Frontend Nginx) en une seule commande :

```bash
docker compose up -d --build
```

- **Frontend Web** : `http://localhost:3000`
- **Backend API** : `http://localhost:5000`
- **PostgreSQL** : `localhost:5432`

---

## 🔑 Variables d'Environnement

### **Backend (`backend/.env`)**
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/khawa_db?schema=public"
JWT_SECRET="khawa_secret_jwt_super_secure_key_2026_change_in_prod"
JWT_EXPIRES_IN=7d
FRONTEND_URL="http://localhost:5173"
```

### **Frontend (`frontend/.env`)**
```env
VITE_API_BASE_URL="http://localhost:5000/api/v1"
```

---

## 🗄️ Base de Données & Seeding

Le script de seed pré-remplit la base avec un jeu de données réaliste :
- **1 Utilisateur Administrateur**
- **15 Bénéficiaires** avec statuts diversifiés (*validé*, *en attente*, *aide accordée*) et types d'aide (*alimentaire*, *médical*, *scolaire*, *vestimentaire*, *financier*)
- **5 Événements Caritatifs majeurs** (Caravane Médicale Kasserine, Rentrée Solidaire, Caravane Hivernale Aïn Draham, Iftar Solidaire Ramadan, Ateliers Numériques)
- **Inscriptions Bénévoles d'exemple**

Pour réinitialiser ou rafraîchir les données :
```bash
cd backend
npm run prisma:seed
```

---

## 🔐 Identifiants de Démonstration

Pour accéder à l'espace d'administration (`/login`) :
- **Email** : `admin@khawa-felkhir.org`
- **Mot de passe** : `AdminPassword123!`

---

## ⚡ Optimisations & Accessibilité (Phase 6)

1. **Bilinguisme FR 🇫🇷 / AR 🇹🇳 & RTL Automatique** :
   - Commutateur de langue disponible dans la barre de navigation et le topbar d'administration.
   - Bascule instantanée de la direction du document (`dir="rtl"` et `lang="ar"`).
   - Textes et labels adaptés pour une expérience fluide.

2. **Mode Sombre / Clair (Dark & Light Theme)** :
   - Support natif sur l'intégralité des pages publiques et de l'administration.
   - Respect des préférences système avec persistance dans le `localStorage`.

3. **Accessibilité (WCAG AA)** :
   - Attributs `aria-label` descriptifs sur tous les boutons interactifs et icônes.
   - Navigation au clavier avec indicateurs de focus visibles (`focus-visible:ring-2`).
   - Hiérarchie sémantique des balises HTML5 (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, balises `<h1>` à `<h3>`).

4. **Code Splitting & Performance** :
   - Découpage dynamique des routes via `React.lazy()` et `Suspense` avec composant de chargement squelette brandé.
   - Isolation des dépendances lourdes dans `vite.config.ts` via `manualChunks` :
     - `charts-vendor` (~399 kB isolé, non chargé sur la vitrine publique)
     - `motion-vendor`
     - `react-vendor`
     - `carousel-vendor`
     - `icons-vendor`

---

## ☁️ Guide de Déploiement en Production

### 1. Base de Données (Supabase / Neon / Render)
1. Créez un projet sur **[Supabase](https://supabase.com)** ou **[Neon.tech](https://neon.tech)**.
2. Récupérez votre URL de connexion PostgreSQL (format : `postgresql://USER:PASSWORD@HOST:5432/DB?sslmode=require`).
3. Exécutez les migrations Prisma depuis votre machine locale :
   ```bash
   DATABASE_URL="votre_url_supabase" npx prisma db push
   DATABASE_URL="votre_url_supabase" npm run prisma:seed
   ```

### 2. Backend API (Railway / Render / Fly.io)
1. Connectez votre dépôt GitHub à **[Railway](https://railway.app)** ou **[Render](https://render.com)**.
2. Définissez le répertoire racine sur `/backend`.
3. Configurez les variables d'environnement de production :
   - `DATABASE_URL` : Votre chaîne de connexion PostgreSQL distante.
   - `JWT_SECRET` : Clé secrète robuste et aléatoire (ex. `openssl rand -hex 32`).
   - `NODE_ENV` : `production`
   - `FRONTEND_URL` : L'URL publique de votre frontend (ex. `https://khawa-felkhir.vercel.app`).
4. Commande de build : `npm install && npx prisma generate && npm run build`
5. Commande de démarrage : `node dist/server.js`

### 3. Frontend (Vercel / Netlify / Cloudflare Pages)
1. Connectez votre dépôt GitHub à **[Vercel](https://vercel.com)**.
2. Définissez le Root Directory sur `frontend`.
3. Framework Preset : `Vite`.
4. Ajoutez la variable d'environnement :
   - `VITE_API_BASE_URL` : `https://votre-backend-railway.app/api/v1`
5. Déployez ! La réécriture des routes SPA est automatiquement gérée par Vercel.

---

## 📄 Licence
Projet développé sous licence MIT. Fait avec ❤️ pour la solidarité citoyenne.
