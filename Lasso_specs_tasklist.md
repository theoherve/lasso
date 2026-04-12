**LASSO**

Specifications Techniques & Tasklist de Build

_v1.0 - Avril 2026 - Document interne_

# **1\. Vue d'ensemble du projet**

Lasso est une web app responsive (Next.js 15) permettant a des Parisiens de 25-35 ans de s'inscrire a des missions de benevolat ponctuel (1-2h) aupres d'associations parisiennes. L'application est mobile-first avec deux modes selon la surface :

| **Surface**               | **Viewport** | **Public**                  | **Role**                                 |
| ------------------------- | ------------ | --------------------------- | ---------------------------------------- |
| App mobile (vue benevole) | < 768px      | Benevoles 25-35 ans         | Decouvrir, reserver, suivre ses missions |
| Backoffice asso (desktop) | \>= 1024px   | Responsables assos          | Gerer creneaux, inscrits, stats          |
| Console admin             | \>= 1024px   | Equipe Lasso                | Valider assos, moderer, surveiller       |
| Pages publiques (SEO)     | Tout         | Tous / moteurs de recherche | Pages assos indexees Google              |

# **2\. Stack technique**

| **Couche**       | **Technologie**              | **Justification**                            |
| ---------------- | ---------------------------- | -------------------------------------------- |
| Framework        | Next.js 15 (App Router)      | SSR, Server Components, Vercel-natif         |
| Styling          | Tailwind CSS v4 + shadcn/ui  | Design system custom, composants accessibles |
| Authentification | NextAuth v5 (Auth.js)        | Email/password + OAuth Google, open-source   |
| Base de donnees  | Neon (PostgreSQL serverless) | Plan gratuit genereux, branchement DB        |
| ORM              | Prisma                       | DX excellente, TypeScript-first, migrations  |
| Validation       | Zod                          | Schemas partages API + forms                 |
| Package manager  | pnpm                         | Obligatoire dans tout le projet              |
| Deploiement      | Vercel                       | Preview deploys, integre Next.js             |
| Monitoring       | Sentry (V1 post-scaffold)    | Erreurs temps reel                           |
| Analytics        | PostHog (V1 post-scaffold)   | Funnels, feature flags, RGPD-friendly        |

# **3\. Architecture des roles**

Un compte utilisateur peut avoir plusieurs roles simultanement (ex: benevole ET responsable d'association). Les roles sont stockes en tableau dans la table users.

| **Role**    | **Acces**                                  | **Attribution**                               |
| ----------- | ------------------------------------------ | --------------------------------------------- |
| VOLUNTEER   | Feed, carte, reservations, profil benevole | Par defaut a l'inscription                    |
| ASSOCIATION | Backoffice asso (/association/\*)          | Apres creation + validation d'une association |
| ADMIN       | Console admin (/admin/\*) + tous les acces | Via seed BDD ou promotion manuelle en BDD     |

# **4\. Schema base de donnees**

7 tables principales + tables NextAuth (accounts, sessions, verification_tokens). Source de verite : prisma/schema.prisma.

| **Table**           | **Description**                   | **Relations cles**                                |
| ------------------- | --------------------------------- | ------------------------------------------------- |
| users               | Profils benevoles + auth NextAuth | accounts, sessions, bookings, association_members |
| accounts            | Comptes OAuth (NextAuth)          | users                                             |
| sessions            | Sessions actives (NextAuth)       | users                                             |
| associations        | Profils assos partenaires         | members, missions                                 |
| association_members | Lien users <> assos (role)        | users, associations                               |
| missions            | Missions publiees par les assos   | associations, slots                               |
| slots               | Creneaux d'une mission            | missions, bookings                                |
| bookings            | Reservations benevoles            | users, slots, ratings, no_show_reports            |
| ratings             | Notations post-mission            | bookings, users                                   |
| no_show_reports     | Signalements absence              | bookings                                          |

# **5\. Routes API (Next.js Route Handlers)**

| **Methode** | **Route**                      | **Auth**       | **Description**                                               |
| ----------- | ------------------------------ | -------------- | ------------------------------------------------------------- |
| GET         | /api/missions                  | Public         | Liste missions actives, filtres arrondissement/categorie/date |
| GET         | /api/missions/:id              | Public         | Detail mission + slots disponibles                            |
| GET         | /api/missions/:id/slots        | Public         | Liste creneaux d'une mission                                  |
| POST        | /api/bookings                  | VOLUNTEER      | Reserver un creneau (transaction atomique)                    |
| DELETE      | /api/bookings/:id              | VOLUNTEER      | Annuler une reservation                                       |
| GET         | /api/users/me                  | VOLUNTEER      | Profil du benevole connecte                                   |
| PATCH       | /api/users/me                  | VOLUNTEER      | Mettre a jour son profil                                      |
| GET         | /api/users/me/bookings         | VOLUNTEER      | Historique et missions a venir                                |
| POST        | /api/associations              | VOLUNTEER      | Creer une association (validation RNA auto)                   |
| PATCH       | /api/associations/:id          | ASSOCIATION    | Modifier le profil de l'association                           |
| POST        | /api/associations/:id/missions | ASSOCIATION    | Creer une mission                                             |
| POST        | /api/missions/:id/slots        | ASSOCIATION    | Ajouter un creneau                                            |
| GET         | /api/associations/:id/bookings | ASSOCIATION    | Liste inscrits par creneau                                    |
| POST        | /api/no-shows                  | ASSOCIATION    | Signaler un no-show                                           |
| POST        | /api/ratings                   | VOLUNTEER/ASSO | Noter apres completion                                        |
| GET         | /api/admin/users               | ADMIN          | Gestion utilisateurs                                          |
| GET/PATCH   | /api/admin/associations        | ADMIN          | Validation associations                                       |
| GET         | /api/admin/stats               | ADMIN          | Stats globales                                                |

# **6\. Pages et layouts**

## **6.1 Routes publiques**

| **Route**              | **Description**          | **Notes**                       |
| ---------------------- | ------------------------ | ------------------------------- |
| /                      | Landing page publique    | SEO, presentation du projet     |
| /associations          | Liste assos (SSR)        | Index SEO, filtrable            |
| /associations/\[slug\] | Page publique asso (SSR) | generateMetadata pour SEO       |
| /login                 | Connexion                | Email + Google OAuth            |
| /register              | Inscription benevole     | Email + prenom + arrondissement |

## **6.2 Routes bénévole (mobile-first)**

| **Route**            | **Description**          | **Composants cles**                        |
| -------------------- | ------------------------ | ------------------------------------------ |
| /feed                | Feed missions + filtres  | MissionCard, FilterChips, SearchBar        |
| /map                 | Carte interactive        | MapPlaceholder (Mapbox en V1)              |
| /missions            | Mes missions (dashboard) | StatusBadge, MissionCard, ReliabilityScore |
| /profile             | Mon profil benevole      | ReliabilityScore, historique               |
| /mission/\[id\]      | Fiche mission detail     | SlotPicker, AssociationBadge               |
| /mission/\[id\]/book | Confirmation reservation | Ecran succes post-booking                  |

## **6.3 Routes backoffice association (desktop)**

| **Route**                    | **Description**          | **Composants cles**                              |
| ---------------------------- | ------------------------ | ------------------------------------------------ |
| /association/dashboard       | Vue d'ensemble           | KPI cards, table creneaux, inscriptions recentes |
| /association/missions        | Liste missions           | Table triable, actions                           |
| /association/missions/new    | Creer une mission        | Formulaire + SlotPicker multi                    |
| /association/missions/\[id\] | Detail mission           | Gestion creneaux et inscrits                     |
| /association/volunteers      | Liste benevoles inscrits | VolunteerRow, filtres statut                     |
| /association/stats           | Statistiques             | Graphiques heures/participants                   |

## **6.4 Console admin (/admin)**

| **Route**           | **Description**         | **Actions disponibles**              |
| ------------------- | ----------------------- | ------------------------------------ |
| /admin              | Tableau de bord admin   | Stats globales, alertes              |
| /admin/users        | Gestion utilisateurs    | Voir, promouvoir roles, desactiver   |
| /admin/associations | Validation associations | Valider human_validated, rejeter     |
| /admin/missions     | Moderation missions     | Masquer, annuler missions            |
| /admin/no-shows     | Signalements no-show    | Voir historique, actions correctives |

# **7\. Composants réutilisables**

| **Composant**      | **Props principales**                | **Utilise dans**                     |
| ------------------ | ------------------------------------ | ------------------------------------ |
| MissionCard        | mission, showAssociation?, compact?  | Feed, dashboard benevole, backoffice |
| SlotPicker         | slots, onSelect, selectedId?         | Fiche mission, creation mission      |
| StatusBadge        | status (BookingStatus \| SlotStatus) | Partout                              |
| ReliabilityScore   | score, size ("sm" \| "md")           | Profil, liste benevoles              |
| AssociationBadge   | association, size, showVerified?     | MissionCard, fiche mission           |
| VolunteerRow       | user, booking, onNoShow?             | Liste inscrits backoffice            |
| MapPlaceholder     | height?, label?                      | Page carte, fiche mission            |
| EmptyState         | title, description, icon?, action?   | Partout (feed vide, etc.)            |
| FilterChips        | options, selected, onChange          | Feed missions                        |
| BottomTabNav       | (aucune)                             | Layout benevole mobile uniquement    |
| AssociationSidebar | association                          | Layout backoffice asso desktop       |
| AdminSidebar       | (aucune)                             | Layout console admin desktop         |

# **8\. Design system**

## **8.1 Palette de couleurs**

| **Token CSS** | **Valeur HSL**     | **Hex approx.** | **Usage**                        |
| ------------- | ------------------ | --------------- | -------------------------------- |
| \--primary    | hsl(20, 65%, 47%)  | #C4622D         | Terracotta - CTA, liens, accents |
| \--secondary  | hsl(105, 55%, 20%) | #2D5016         | Vert foret - badge verifie       |
| \--background | hsl(30, 33%, 96%)  | #FAF7F2         | Fond warm off-white              |
| \--foreground | hsl(30, 15%, 9%)   | #1A1612         | Texte principal                  |
| \--card       | hsl(30, 33%, 98%)  | #FDFBF8         | Surface cartes                   |
| \--muted      | hsl(30, 20%, 92%)  | #EEE9E2         | Fond attenue                     |
| \--border     | hsl(30, 15%, 88%)  | #E3DDD5         | Bordures subtiles                |

## **8.2 Typographie**

Police : Plus Jakarta Sans (Google Fonts)

Poids : 400 (body), 500 (medium), 600 (semibold), 700 (bold), 800 (display)

Tailles cles : text-xs (badges), text-sm (body 2), text-base (body), text-2xl (titres cartes), text-4xl (titres pages)

## **8.3 Composants shadcn/ui utilises**

Button, Badge, Card, Input, Select, Tabs, Dialog, Sheet, Avatar, Separator, Skeleton, Toast, Table, Form, Label, Checkbox, RadioGroup, DatePicker, DropdownMenu, Popover

# **9\. Roadmap - 5 phases**

| **Phase**                     | **Duree** | **Livrables**                                                                            | **KPI de sortie**                                                                          |
| ----------------------------- | --------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| **Phase 0 Setup**             | 2 sem.    | Scaffold complet (ce build), auth NextAuth, BDD Neon + Prisma, design system, seed       | pnpm build sans erreur, auth fonctionnel, BDD migree, tous les comptes seedés connectables |
| **Phase 1 Core benevole**     | 6 sem.    | Feed missions fonctionnel, filtres, fiche mission, reservation atomique, profil benevole | Flux reservation complet de bout en bout, benevole peut reserver une mission               |
| **Phase 2 Backoffice asso**   | 4 sem.    | Création asso + RNA, creation mission/slot, dashboard inscrits, stats basiques           | 6 assos peuvent creer et gerer leurs missions independamment                               |
| **Phase 3 Polish & features** | 3 sem.    | Carte Mapbox, push notifs, systeme no-show, score fiabilite, emails Resend               | Experience fluide, taux no-show mesurable, retention active                                |
| **Phase 4 Lancement**         | 1 sem.    | Vercel prod, monitoring Sentry, analytics PostHog, tests E2E basiques                    | App disponible publiquement, monitoring actif                                              |

# **10\. Tasklist complete - Phase 0 (Scaffold)**

_Legende effort : XS < 1h | S = 1-2h | M = 3-5h | L = 1j | XL = 2j+_

## **10.1 Setup initial**

| **#**     | **Tache**                                                    | **Categorie** | **Dependances** | **Effort** | **Priorite** | **Statut** |
| --------- | ------------------------------------------------------------ | ------------- | --------------- | ---------- | ------------ | ---------- |
| **T-001** | Initialiser le projet Next.js 15 avec pnpm (create next-app) | Setup         | \-              | XS         | **P0**       | A faire    |
| **T-002** | Configurer Tailwind CSS v4 + variables CSS design system     | Setup         | T-001           | S          | **P0**       | A faire    |
| **T-003** | Initialiser shadcn/ui avec theme custom Lasso                | Setup         | T-002           | S          | **P0**       | A faire    |
| **T-004** | Installer et configurer Plus Jakarta Sans (Google Fonts)     | Setup         | T-002           | XS         | **P0**       | A faire    |
| **T-005** | Configurer ESLint + Prettier avec regles strictes            | Setup         | T-001           | XS         | **P0**       | A faire    |
| **T-006** | Creer .env.example documente + .env.local gitignore          | Setup         | T-001           | XS         | **P0**       | A faire    |

## **10.2 Base de données**

| **#**     | **Tache**                                                                    | **Categorie** | **Dependances** | **Effort** | **Priorite** | **Statut** |
| --------- | ---------------------------------------------------------------------------- | ------------- | --------------- | ---------- | ------------ | ---------- |
| **T-010** | Creer la base de donnees Neon et recuperer DATABASE_URL                      | BDD           | \-              | XS         | **P0**       | A faire    |
| **T-011** | Installer Prisma et creer prisma/schema.prisma complet                       | BDD           | T-010           | M          | **P0**       | A faire    |
| **T-012** | Executer la premiere migration (prisma migrate dev --name init)              | BDD           | T-011           | XS         | **P0**       | A faire    |
| **T-013** | Creer le singleton client Prisma dans lib/prisma.ts                          | BDD           | T-011           | XS         | **P0**       | A faire    |
| **T-014** | Creer le script de seed (prisma/seed.ts) - 3 assos, 10 missions, 5 benevoles | BDD           | T-012           | L          | **P0**       | A faire    |
| **T-015** | Executer et valider le seed (pnpm prisma db seed)                            | BDD           | T-014           | XS         | **P0**       | A faire    |

## **10.3 Authentification**

| **#**     | **Tache**                                                            | **Categorie** | **Dependances** | **Effort** | **Priorite** | **Statut** |
| --------- | -------------------------------------------------------------------- | ------------- | --------------- | ---------- | ------------ | ---------- |
| **T-020** | Installer NextAuth v5 et creer lib/auth.ts avec Credentials + Google | Auth          | T-013           | M          | **P0**       | A faire    |
| **T-021** | Creer le route handler api/auth/\[...nextauth\]/route.ts             | Auth          | T-020           | XS         | **P0**       | A faire    |
| **T-022** | Etendre les types NextAuth (types/index.ts) avec id + roles          | Auth          | T-020           | XS         | **P0**       | A faire    |
| **T-023** | Creer lib/auth-helpers.ts (getServerSession, requireRole, etc.)      | Auth          | T-020           | S          | **P0**       | A faire    |
| **T-024** | Creer le middleware.ts pour protection des routes par role           | Auth          | T-023           | M          | **P0**       | A faire    |
| **T-025** | Creer les pages /login et /register avec UI Lasso                    | Auth          | T-020           | M          | **P0**       | A faire    |
| **T-026** | Creer le SessionProvider dans components/providers                   | Auth          | T-020           | XS         | **P0**       | A faire    |
| **T-027** | Tester connexion avec les comptes seedés (admin, asso, benevoles)    | Auth          | T-025           | XS         | **P0**       | A faire    |

## **10.4 Layouts**

| **#**     | **Tache**                                                       | **Categorie** | **Dependances** | **Effort** | **Priorite** | **Statut** |
| --------- | --------------------------------------------------------------- | ------------- | --------------- | ---------- | ------------ | ---------- |
| **T-030** | Creer le root layout.tsx avec font, providers, metadata         | Layout        | T-004           | S          | **P0**       | A faire    |
| **T-031** | Creer le layout bénévole avec BottomTabNav mobile               | Layout        | T-030           | M          | **P0**       | A faire    |
| **T-032** | Creer BottomTabNav.tsx (visible < 768px, 4 onglets)             | Layout        | T-002           | M          | **P0**       | A faire    |
| **T-033** | Creer le layout backoffice asso avec AssociationSidebar desktop | Layout        | T-030           | M          | **P0**       | A faire    |
| **T-034** | Creer AssociationSidebar.tsx (visible >= 1024px)                | Layout        | T-002           | M          | **P0**       | A faire    |
| **T-035** | Creer le layout admin avec AdminSidebar                         | Layout        | T-030           | M          | **P0**       | A faire    |
| **T-036** | Creer AdminSidebar.tsx                                          | Layout        | T-002           | S          | **P0**       | A faire    |
| **T-037** | Creer le layout auth centré (login/register)                    | Layout        | T-030           | S          | **P0**       | A faire    |

## **10.5 Composants Lasso**

| **#**     | **Tache**                                                     | **Categorie** | **Dependances** | **Effort** | **Priorite** | **Statut** |
| --------- | ------------------------------------------------------------- | ------------- | --------------- | ---------- | ------------ | ---------- |
| **T-040** | MissionCard.tsx - carte mission avec cover gradient et badges | Composants    | T-002           | M          | **P0**       | A faire    |
| **T-041** | StatusBadge.tsx - badges statut FR avec CVA variants          | Composants    | T-003           | S          | **P0**       | A faire    |
| **T-042** | ReliabilityScore.tsx - pill score fiabilite                   | Composants    | T-003           | XS         | **P0**       | A faire    |
| **T-043** | AssociationBadge.tsx - logo + nom + checkmark verifie         | Composants    | T-003           | S          | **P0**       | A faire    |
| **T-044** | SlotPicker.tsx - liste creneaux selectionnables               | Composants    | T-003           | S          | **P0**       | A faire    |
| **T-045** | VolunteerRow.tsx - ligne tableau benevoles                    | Composants    | T-003           | S          | **P0**       | A faire    |
| **T-046** | MapPlaceholder.tsx - placeholder carte Mapbox                 | Composants    | T-002           | XS         | **P0**       | A faire    |
| **T-047** | EmptyState.tsx - empty states generiques avec copy FR         | Composants    | T-002           | S          | **P0**       | A faire    |
| **T-048** | FilterChips.tsx - chips filtres arrondissement/categorie      | Composants    | T-002           | S          | **P0**       | A faire    |

## **10.6 Pages scaffold (structure + UI vide)**

| **#**     | **Tache**                                                    | **Categorie** | **Dependances** | **Effort** | **Priorite** | **Statut** |
| --------- | ------------------------------------------------------------ | ------------- | --------------- | ---------- | ------------ | ---------- |
| **T-050** | Landing page / avec hero et CTA                              | Pages         | T-030           | M          | **P0**       | A faire    |
| **T-051** | Page /feed - feed missions avec MissionCard et FilterChips   | Pages         | T-040           | M          | **P0**       | A faire    |
| **T-052** | Page /map - placeholder carte Mapbox                         | Pages         | T-046           | S          | **P0**       | A faire    |
| **T-053** | Page /missions - mes missions avec StatusBadge               | Pages         | T-041           | M          | **P0**       | A faire    |
| **T-054** | Page /profile - profil benevole avec ReliabilityScore        | Pages         | T-042           | M          | **P0**       | A faire    |
| **T-055** | Page /mission/\[id\] - fiche mission avec SlotPicker         | Pages         | T-044           | M          | **P0**       | A faire    |
| **T-056** | Page /mission/\[id\]/book - confirmation reservation         | Pages         | T-055           | M          | **P0**       | A faire    |
| **T-057** | Page /association/dashboard - vue ensemble backoffice        | Pages         | T-033           | L          | **P0**       | A faire    |
| **T-058** | Page /association/missions - liste missions backoffice       | Pages         | T-057           | M          | **P0**       | A faire    |
| **T-059** | Page /association/missions/new - formulaire creation mission | Pages         | T-044           | M          | **P0**       | A faire    |
| **T-060** | Page /association/volunteers - liste benevoles inscrits      | Pages         | T-045           | M          | **P0**       | A faire    |
| **T-061** | Page /association/stats - statistiques placeholder           | Pages         | T-057           | S          | **P0**       | A faire    |
| **T-062** | Page /admin - dashboard admin                                | Pages         | T-035           | M          | **P0**       | A faire    |
| **T-063** | Page /admin/users - gestion utilisateurs                     | Pages         | T-062           | M          | **P0**       | A faire    |
| **T-064** | Page /admin/associations - validation assos                  | Pages         | T-062           | M          | **P0**       | A faire    |
| **T-065** | Page /admin/missions - moderation missions                   | Pages         | T-062           | S          | **P0**       | A faire    |
| **T-066** | Page /admin/no-shows - signalements no-show                  | Pages         | T-062           | S          | **P0**       | A faire    |
| **T-067** | Pages publiques /associations + /associations/\[slug\] (SSR) | Pages         | T-030           | M          | **P0**       | A faire    |

## **10.7 Routes API (declarations)**

| **#**     | **Tache**                                                                           | **Categorie** | **Dependances** | **Effort** | **Priorite** | **Statut** |
| --------- | ----------------------------------------------------------------------------------- | ------------- | --------------- | ---------- | ------------ | ---------- |
| **T-070** | Creer lib/validations/ - tous les schemas Zod (mission, booking, user, association) | API           | T-013           | M          | **P0**       | A faire    |
| **T-071** | lib/rna.ts - mock dev + integration reelle prod (api-asso.data.gouv.fr)             | API           | \-              | S          | **P0**       | A faire    |
| **T-072** | Route GET/POST /api/missions - liste + creation                                     | API           | T-070           | M          | **P0**       | A faire    |
| **T-073** | Route GET/PATCH/DELETE /api/missions/:id                                            | API           | T-072           | S          | **P0**       | A faire    |
| **T-074** | Route GET/POST /api/missions/:id/slots                                              | API           | T-073           | S          | **P0**       | A faire    |
| **T-075** | Route POST /api/bookings - transaction atomique (SELECT FOR UPDATE)                 | API           | T-070           | L          | **P0**       | A faire    |
| **T-076** | Route DELETE /api/bookings/:id - annulation                                         | API           | T-075           | S          | **P0**       | A faire    |
| **T-077** | Routes GET/PATCH /api/users/me + me/bookings                                        | API           | T-070           | S          | **P0**       | A faire    |
| **T-078** | Routes POST/PATCH /api/associations + associations/:id                              | API           | T-071           | M          | **P0**       | A faire    |
| **T-079** | Route GET /api/associations/:id/bookings                                            | API           | T-078           | S          | **P0**       | A faire    |
| **T-080** | Route POST /api/no-shows - signalement + mise a jour reliability_score              | API           | T-070           | M          | P1           | A faire    |
| **T-081** | Route POST /api/ratings                                                             | API           | T-070           | S          | P1           | A faire    |
| **T-082** | Routes admin /api/admin/\* - users, associations, stats                             | API           | T-024           | M          | **P0**       | A faire    |

## **10.8 Documentation**

| **#**     | **Tache**                                                                            | **Categorie** | **Dependances** | **Effort** | **Priorite** | **Statut** |
| --------- | ------------------------------------------------------------------------------------ | ------------- | --------------- | ---------- | ------------ | ---------- |
| **T-090** | Creer README.md avec guide setup complet                                             | Docs          | T-015           | M          | **P0**       | A faire    |
| **T-091** | Creer lib/utils.ts avec cn(), formatDate(), formatDuration(), formatArrondissement() | Docs          | T-001           | XS         | **P0**       | A faire    |
| **T-092** | Validation finale : pnpm build sans erreur TypeScript                                | Validation    | Tout            | S          | **P0**       | A faire    |
| **T-093** | Validation routes proteges : redirection vers /login                                 | Validation    | T-024           | XS         | **P0**       | A faire    |
| **T-094** | Validation comptes seedés : tous les roles fonctionnels                              | Validation    | T-027           | S          | **P0**       | A faire    |

# **11\. Tasklist - Phase 1 (Core bénévole)**

_A planifier apres validation du scaffold (Phase 0). Voici les grandes taches anticipées._

| **#**     | **Tache**                                                                    | **Categorie** | **Dependances** | **Effort** | **Priorite** | **Statut** |
| --------- | ---------------------------------------------------------------------------- | ------------- | --------------- | ---------- | ------------ | ---------- |
| **T-100** | Implémenter GET /api/missions avec filtres (arrondissement, categorie, date) | Feature       | T-072           | M          | **P0**       | A faire    |
| **T-101** | Connecter le feed /feed aux vraies données API                               | Feature       | T-100           | M          | **P0**       | A faire    |
| **T-102** | Implementer la logique de filtrage FilterChips (state + URL params)          | Feature       | T-101           | M          | **P0**       | A faire    |
| **T-103** | Implémenter GET /api/missions/:id avec slots                                 | Feature       | T-073           | S          | **P0**       | A faire    |
| **T-104** | Connecter la fiche mission aux vraies données + SlotPicker fonctionnel       | Feature       | T-103           | M          | **P0**       | A faire    |
| **T-105** | Implémenter POST /api/bookings (transaction atomique complete)               | Feature       | T-075           | L          | **P0**       | A faire    |
| **T-106** | Flux de reservation complet : fiche → selection creneau → confirmation       | Feature       | T-105           | L          | **P0**       | A faire    |
| **T-107** | Dashboard /missions : données réelles bookings du user connecte              | Feature       | T-077           | M          | **P0**       | A faire    |
| **T-108** | Profil benevole : editable (prenom, arrondissement, bio)                     | Feature       | T-077           | M          | **P0**       | A faire    |
| **T-109** | Annulation reservation (DELETE /api/bookings/:id)                            | Feature       | T-076           | S          | P1           | A faire    |
| **T-110** | Pages publiques assos /associations/\[slug\] avec SSR et metadata            | Feature       | T-067           | M          | P1           | A faire    |

# **12\. Tasklist - Phase 2 (Backoffice association)**

| **#**     | **Tache**                                                                    | **Categorie** | **Dependances** | **Effort** | **Priorite** | **Statut** |
| --------- | ---------------------------------------------------------------------------- | ------------- | --------------- | ---------- | ------------ | ---------- |
| **T-200** | Flow inscription association : formulaire RNA + statut en attente            | Feature       | T-078           | L          | **P0**       | A faire    |
| **T-201** | Validation RNA reelle en prod (lib/rna.ts)                                   | Feature       | T-071           | M          | **P0**       | A faire    |
| **T-202** | Dashboard asso : KPIs et table creneaux avec données réelles                 | Feature       | T-057           | L          | **P0**       | A faire    |
| **T-203** | Creation de mission + creneaux (formulaire multi-slots)                      | Feature       | T-074           | L          | **P0**       | A faire    |
| **T-204** | Dashboard inscrits par creneau : vue benevoles + statuts                     | Feature       | T-079           | M          | **P0**       | A faire    |
| **T-205** | Systeme no-show : signalement asso → impact reliability_score                | Feature       | T-080           | L          | P1           | A faire    |
| **T-206** | Score fiabilite benevole visible par les assos                               | Feature       | T-205           | S          | P1           | A faire    |
| **T-207** | Statistiques asso : heures completees, participants uniques, taux completion | Feature       | T-061           | M          | P1           | A faire    |

# **13\. Tasklist - Phase 3 (Polish & Features)**

| **#**     | **Tache**                                                                    | **Categorie** | **Dependances** | **Effort** | **Priorite** | **Statut** |
| --------- | ---------------------------------------------------------------------------- | ------------- | --------------- | ---------- | ------------ | ---------- |
| **T-300** | Integration Mapbox GL JS (carte missions interactive)                        | Feature       | \-              | XL         | P1           | A faire    |
| **T-301** | Push notifications Expo (si app native) ou Web Push                          | Feature       | \-              | L          | P1           | A faire    |
| **T-302** | Emails transactionnels : Resend + React Email (confirmation, rappels 24h/2h) | Feature       | \-              | L          | P1           | A faire    |
| **T-303** | Systeme de notation post-mission (prive)                                     | Feature       | T-081           | M          | P2           | A faire    |
| **T-304** | Badges gamification benevole                                                 | Feature       | \-              | M          | P2           | A faire    |
| **T-305** | Integration Sentry (monitoring erreurs)                                      | Infra         | \-              | S          | P1           | A faire    |
| **T-306** | Integration PostHog (analytics, feature flags)                               | Infra         | \-              | S          | P1           | A faire    |

# **14\. KPIs produit cibles**

| **Metrique**                             | **Seuil MVP (M6)** | **Seuil Growth (M12)** |
| ---------------------------------------- | ------------------ | ---------------------- |
| Associations actives (missions publiees) | 6                  | 25+                    |
| Benevoles inscrits                       | 200                | 1500+                  |
| Missions completees / mois               | 50                 | 300+                   |
| Taux de completion (booked -> completed) | \> 65%             | \> 75%                 |
| Taux no-show                             | < 20%              | < 10%                  |
| NPS associations                         | Mesure             | \> 50                  |
| Retention benevole M+1                   | Mesure             | \> 40%                 |

# **15\. Infrastructure & coûts**

| **Service**              | **Plan gratuit**       | **Limite critique**          | **Plan suivant**  |
| ------------------------ | ---------------------- | ---------------------------- | ----------------- |
| Neon (BDD)               | 0.5 GB stockage        | 20 connexions simultanees    | Pro : 19\$/mois   |
| Vercel (deploy)          | 100 GB bande passante  | 100k invocations/jour        | Pro : 20\$/mois   |
| Mapbox (carte)           | 50k tile requests/mois | 50k chargements              | Pay-as-you-go     |
| Resend (emails)          | 3k emails/mois         | 3 000 emails transactionnels | Pro : 20\$/mois   |
| Cloudflare R2 (fichiers) | 10 GB                  | 10 GB stockage               | 0.015\$/GB supp.  |
| Sentry (monitoring)      | 5k errors/mois         | 5 000 erreurs captees        | Team : 26\$/mois  |
| OneSignal (push)         | Illimite (plan free)   | Push illimites               | Growth : 9\$/mois |

**Cout infrastructure MVP : ~0 EUR/mois jusqu'a ~1 000 benevoles actifs et 25 associations.**

# **16\. Conventions de code**

## **16.1 TypeScript**

- strict: true dans tsconfig - aucune exception
- Zod pour la validation de toutes les donnees entrantes (API + forms)
- Types Prisma auto-generes utilises directement
- Pas de any. Pas de as Type sauf cas documentes
- Exports nommes uniquement (pas de default export sauf pages/layouts)

## **16.2 Structure des commits**

- feat: nouvelle fonctionnalite
- fix: correction de bug
- chore: setup, config, deps
- style: changement UI sans logique
- refactor: refactoring sans changement de comportement
- docs: documentation

## **16.3 Regles API**

- Toujours valider les inputs avec Zod avant traitement
- Toujours verifier le role avec getServerSession + requireRole()
- Retourner des erreurs typees (400, 401, 403, 404, 409, 500)
- Transactions Prisma obligatoires pour les operations multi-tables

---

# **17\. Checklist de suivi du build - Phase 0**

_Cocher chaque etape au fur et a mesure de l'avancement._

## Phase A — Setup initial
- [x] T-001 : Initialiser Next.js 15 avec pnpm
- [x] T-002 : Configurer Tailwind CSS v4 + variables CSS design system
- [x] T-003 : Initialiser shadcn/ui avec theme custom Lasso
- [x] T-004 : Installer Plus Jakarta Sans (Google Fonts)
- [x] T-005 : Configurer ESLint + Prettier
- [x] T-006 : Creer .env.example + .env.local

## Phase B — Base de donnees
- [ ] T-010 : Creer la base Neon + DATABASE_URL
- [x] T-011 : Creer prisma/schema.prisma complet (10 models, 4 enums)
- [ ] T-012 : Executer la premiere migration
- [x] T-013 : Creer lib/prisma.ts (singleton + adapter Neon)

## Phase C — Authentification
- [x] T-020 : Configurer NextAuth v5 (lib/auth.ts) — Credentials + Google
- [x] T-021 : Creer api/auth/[...nextauth]/route.ts
- [x] T-022 : Etendre les types NextAuth (types/index.ts)
- [x] T-023 : Creer lib/auth-helpers.ts (getSession, requireAuth, requireRole)
- [x] T-024 : Creer middleware.ts (protection routes par role)
- [x] T-025 : Creer les pages /login et /register
- [x] T-026 : Creer SessionProvider + ThemeProvider

## Phase D — Utils & Validation
- [x] T-070 : Creer lib/validations/ (Zod schemas mission, booking, user, association)
- [x] T-071 : Creer lib/rna.ts (mock dev / reel prod)
- [x] T-091 : Creer lib/utils.ts (cn, formatDate, formatDuration, formatArrondissement)

## Phase E — Composants layout
- [x] T-032 : BottomTabNav.tsx (nav mobile benevole)
- [x] T-034 : AssociationSidebar.tsx (sidebar desktop asso)
- [x] T-036 : AdminSidebar.tsx (sidebar desktop admin)

## Phase F — Composants Lasso
- [x] T-040 : MissionCard.tsx
- [x] T-041 : StatusBadge.tsx (CVA variants)
- [x] T-042 : ReliabilityScore.tsx
- [x] T-043 : AssociationBadge.tsx
- [x] T-044 : SlotPicker.tsx
- [x] T-045 : VolunteerRow.tsx
- [x] T-046 : MapPlaceholder.tsx
- [x] T-047 : EmptyState.tsx
- [x] T-048 : FilterChips.tsx

## Phase G — Layouts App Router
- [x] T-030 : Root layout.tsx (font, providers, metadata)
- [x] T-037 : Layout (auth) — centré, warm bg
- [x] T-031 : Layout (volunteer) — BottomTabNav mobile
- [x] T-033 : Layout (association) — Sidebar desktop
- [x] T-035 : Layout (admin) — Sidebar sombre desktop

## Phase H — Pages (~25 pages)
- [x] T-050 : Landing page /
- [x] T-051 : /feed — feed missions
- [x] T-052 : /map — placeholder carte
- [x] T-053 : /missions — mes missions
- [x] T-054 : /profile — profil benevole
- [x] T-055 : /mission/[id] — fiche mission
- [x] T-056 : /mission/[id]/book — confirmation reservation
- [x] T-057 : /association/dashboard
- [x] T-058 : /association/missions
- [x] T-059 : /association/missions/new
- [x] T-060 : /association/volunteers
- [x] T-061 : /association/stats
- [x] T-062 : /admin (dashboard)
- [x] T-063 : /admin/users
- [x] T-064 : /admin/associations
- [x] T-065 : /admin/missions
- [x] T-066 : /admin/no-shows
- [x] T-067 : Pages publiques /associations + /associations/[slug]

## Phase I — Routes API
- [x] T-072 : GET/POST /api/missions
- [x] T-073 : GET/PATCH/DELETE /api/missions/[id]
- [x] T-074 : GET/POST /api/missions/[id]/slots
- [x] T-075 : POST /api/bookings (transaction atomique)
- [x] T-076 : DELETE /api/bookings/[id]
- [x] T-077 : GET/PATCH /api/users/me + GET /api/users/me/bookings
- [x] T-078 : POST/PATCH /api/associations + /api/associations/[id]
- [x] T-079 : GET /api/associations/[id]/bookings
- [x] T-080 : POST /api/no-shows
- [x] T-081 : POST /api/ratings
- [x] T-082 : Routes admin /api/admin/*

## Phase J — Seed & Documentation
- [x] T-014 : Creer prisma/seed.ts (3 assos, 10 missions, 5 benevoles, admin, asso manager)
- [ ] T-015 : Executer et valider le seed
- [x] T-090 : Creer README.md avec guide setup complet

## Phase K — Validation finale
- [x] T-092 : `pnpm prisma generate` sans erreur
- [x] T-092 : `pnpm build` sans erreur TypeScript
- [ ] T-093 : Routes protegees redirigent vers /login (necessite DATABASE_URL)
- [x] T-094 : Design system visible sur la landing page
- [x] T-094 : Tous les composants compilent avec leurs props typees

