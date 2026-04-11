# Lasso — Benevolat ponctuel a Paris

Web app responsive (Next.js 15) permettant a des Parisiens de 25-35 ans de s'inscrire a des missions de benevolat ponctuel (1-2h) aupres d'associations parisiennes.

## Prerequis

- **Node.js** 20+
- **pnpm** (obligatoire)
- **Compte Neon** pour PostgreSQL serverless (ou PostgreSQL local)
- **Compte Google Cloud** pour OAuth (optionnel en dev)

## Installation

```bash
# Cloner le projet
git clone <repo-url> lasso
cd lasso

# Installer les dependances
pnpm install

# Configurer les variables d'environnement
cp .env.example .env.local
# Remplir DATABASE_URL et AUTH_SECRET dans .env.local

# Generer le client Prisma
pnpm prisma generate

# Lancer la migration initiale
pnpm prisma migrate dev --name init

# Peupler la base de donnees
pnpm prisma db seed

# Lancer le serveur de developpement
pnpm dev
```

L'app est disponible sur [http://localhost:3000](http://localhost:3000).

## Comptes de test

| Email | Mot de passe | Role(s) | Acces |
|-------|-------------|---------|-------|
| admin@lasso.fr | Admin1234! | ADMIN, VOLUNTEER | Console admin + feed |
| marie@restos-coeur.fr | Asso1234! | ASSOCIATION, VOLUNTEER | Backoffice asso + feed |
| sophie@example.com | Benevole1! | VOLUNTEER | Feed benevole |
| lucas@example.com | Benevole1! | VOLUNTEER | Feed benevole |
| amina@example.com | Benevole1! | VOLUNTEER | Feed benevole |
| thomas@example.com | Benevole1! | VOLUNTEER | Feed benevole |
| lea@example.com | Benevole1! | VOLUNTEER | Feed benevole |

## Structure du projet

```
lasso/
  app/                    # Pages et layouts (App Router)
    (auth)/               # Layout auth (login, register)
    (volunteer)/          # Layout benevole mobile (feed, missions, profil)
    (association)/        # Layout backoffice asso desktop
    (admin)/              # Layout console admin
    associations/         # Pages publiques SEO
    api/                  # Route handlers API
  components/
    ui/                   # Composants shadcn/ui
    lasso/                # Composants metier (MissionCard, StatusBadge, etc.)
    layouts/              # Navigation (BottomTabNav, Sidebars)
    providers/            # Providers (Session, Theme)
  lib/
    auth.ts               # Config NextAuth v5
    auth-helpers.ts       # Helpers getSession, requireRole
    prisma.ts             # Client Prisma singleton
    utils.ts              # Utilitaires (cn, formatDate, etc.)
    rna.ts                # Verification RNA
    validations/          # Schemas Zod
    generated/prisma/     # Client Prisma genere
  types/                  # Types TypeScript globaux
  prisma/
    schema.prisma         # Schema base de donnees
    seed.ts               # Script de seed
  middleware.ts           # Protection des routes par role
```

## Architecture des roles

| Role | Acces | Attribution |
|------|-------|-------------|
| VOLUNTEER | Feed, carte, reservations, profil | Par defaut a l'inscription |
| ASSOCIATION | Backoffice asso (/dashboard/*) | Apres creation et validation d'une association |
| ADMIN | Console admin (/admin/*) + tous les acces | Via seed ou promotion manuelle |

Un utilisateur peut avoir plusieurs roles simultanement.

## Commandes utiles

```bash
pnpm dev                    # Serveur de developpement
pnpm build                  # Build production
pnpm start                  # Serveur production
pnpm lint                   # Linter ESLint
pnpm prisma studio          # Interface graphique BDD
pnpm prisma migrate dev     # Nouvelle migration
pnpm prisma db seed         # Peupler la BDD
pnpm prisma generate        # Regenerer le client Prisma
```

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Auth | NextAuth v5 (Auth.js) |
| BDD | Neon (PostgreSQL serverless) |
| ORM | Prisma |
| Validation | Zod |
| Package manager | pnpm |
