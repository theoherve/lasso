# Lasso Mobile — Documentation

Document vivant décrivant l'application mobile Lasso (iOS + Android) construite à partir de la PWA Next.js via **Capacitor**.

> État : **squelette initial** (2026-04-20). Sera complété phase par phase. Si une section est vide ou marquée `TBD`, la phase correspondante n'a pas encore été exécutée.

---

## 1. Stratégie & décisions structurantes

| Sujet | Choix | Raison |
|-------|-------|--------|
| Approche | Capacitor (wrapper PWA) | PWA déjà en place, évite 3-4 mois de réécriture React Native |
| Plateformes | iOS + Android | Publication simultanée sur App Store + Google Play |
| Scope v1 | Volunteer + asso light | Admin reste web-only (usage mobile faible) |
| Web | Conservé en parallèle | Monorepo Turborepo, backend/DB/auth partagés |
| Gestionnaire | **pnpm** | Aligné sur le repo actuel |

Détails stratégiques et charge estimée : voir plan de travail interne.

---

## 2. 💰 Coûts externes

| Poste | Coût | Fréquence |
|-------|------|-----------|
| Apple Developer Program | **99 €** | /an |
| Google Play Console | **25 $** (~23 €) | one-time |
| Device Android de test (Pixel 6a d'occasion ou équiv.) | ~50-120 € | one-time |
| Device iOS de test | 0 € (iPhone perso + Xcode Simulator) | — |
| Domaine apex (si absent) | ~10 €/an | /an |
| Sign in with Apple | 0 € (inclus Apple Dev) | — |
| FCM (push Android) | 0 € | — |
| APNs (push iOS) | 0 € (inclus Apple Dev) | — |
| Sentry Capacitor | 0 € (plan existant) | — |
| CI/CD GitHub Actions + Fastlane | 0 € (runners macOS Free) ou 4 €/mois/user Pro | — |
| Appflow Capacitor (optionnel) | ~500 €/an | — — à éviter |

**Total v1 minimal** : ~180 € première année.
**Récurrent** : ~110 €/an (Apple + GitHub Pro si builds iOS CI).

⚠️ **Achat in-app** : si Lasso ajoute un jour dons/paiements passant par l'app, Apple et Google prélèvent **15-30 %**. Tant que paiements = service externe hors app, 0 %.

---

## 3. Architecture

**Choix pragmatique** : on ne restructure PAS en Turborepo `apps/web/` + `apps/mobile/`. Le wrapper Capacitor charge l'URL web via `server.url` — il n'y a aucun code partagé à extraire. Le Next.js reste à la racine, `mobile/` est un simple workspace pnpm sibling.

```
lasso/
├── app/                  Next.js 16 (inchangé, à la racine)
├── components/           (inchangé)
├── lib/                  (inchangé — contient lib/platform.ts)
├── prisma/               (inchangé)
├── public/               (inchangé)
├── mobile/               Capacitor wrapper
│   ├── capacitor.config.ts
│   ├── package.json       (workspace pnpm)
│   ├── www/               placeholder (ignoré si server.url défini)
│   ├── ios/               Xcode project — généré via `cap add ios` (TBD)
│   └── android/           Gradle project — généré via `cap add android` (TBD)
├── pnpm-workspace.yaml   packages: - "mobile"
└── MOBILE.md             (ce fichier)
```

Capacitor charge l'URL web de prod dans la WebView via `server.url`. Pas d'export statique Next.js. Déploiements web = déploiements mobile instantanés (sauf permissions natives qui exigent un rebuild store).

**Bundle ID** : `fr.lasso.app` *(à confirmer — immuable une fois publié)*.

---

## 4. Build & lancement local

### Prérequis
- macOS (iOS obligatoire)
- Xcode 15+ et Xcode Command Line Tools
- CocoaPods : `brew install cocoapods`
- Android Studio + JDK 17
- pnpm installé globalement
- **Node.js ≥ 20** (actuellement figé à **Capacitor v7** pour compat Node 20. Capacitor v8 requiert Node ≥ 22 — à upgrader quand possible via `nvm install 22` puis bump `mobile/package.json` à `^8.0.0`)

### Premier setup (one-time)

Les dossiers `mobile/ios/` et `mobile/android/` ne sont **pas encore générés**. À lancer depuis la racine après `pnpm install` :

```bash
# Depuis mobile/
cd mobile
CAP_SERVER_URL="http://$(ipconfig getifaddr en0):3000" pnpm add:ios
CAP_SERVER_URL="http://$(ipconfig getifaddr en0):3000" pnpm add:android
pnpm sync
```

Note iOS : nécessite **Xcode + CocoaPods** installés (`brew install cocoapods`).
Note Android : nécessite **Android Studio + JDK 17**.

### Commandes récurrentes

```bash
# Depuis mobile/
pnpm sync                 # resynchronise www/ + plugins → projets natifs
pnpm ios:open             # ouvre Xcode
pnpm ios:run              # lance sur simulateur / device
pnpm android:open         # ouvre Android Studio
pnpm android:run
```

`capacitor.config.ts` lit `server.url` depuis la variable d'env `CAP_SERVER_URL` :
- **Dev** : `http://<ip-locale>:3000` (Next.js dev server sur LAN, device et Mac sur le même réseau Wi-Fi)
- **Staging** : URL preview Vercel
- **Prod** : URL canonique (ex. `https://lasso.app`)

Pour changer, relancer `pnpm sync` (l'URL est figée dans le build natif).

---

## 5. Variables d'environnement spécifiques mobile

À configurer dans les envs Vercel (web) et dans les builds iOS/Android :

| Variable | Usage | Où |
|----------|-------|----|
| `AUTH_APPLE_ID` | Services ID Apple | Vercel env |
| `AUTH_APPLE_SECRET` | JWT client secret (rotation 6 mois) | Vercel env |
| `AUTH_APPLE_TEAM_ID` | Apple Team ID | Vercel env |
| `AUTH_APPLE_KEY_ID` | Apple Key ID | Vercel env |
| `FCM_SERVER_KEY` | Firebase push Android | Vercel env (backend) |
| `APNS_KEY_ID` / `APNS_TEAM_ID` / `APNS_PRIVATE_KEY` | Push iOS via APNs | Vercel env (backend) |
| `NEXT_PUBLIC_APP_ENV` | `web` / `ios` / `android` (pour analytics) | injecté au build Capacitor |

Détails providers : voir §7.

---

## 6. Plugins Capacitor utilisés

| Plugin | Rôle | État |
|--------|------|------|
| `@capacitor/core` | Runtime + détection plateforme | ✅ installé |
| `@capacitor/app` | Deep links + back-button Android | ✅ wired dans `NativeBootstrap` |
| `@capacitor/browser` | OAuth via browser système | ✅ helper `openBrowser()` |
| `@capacitor/haptics` | Feedback tactile booking | ✅ helpers `haptics.impact/notification/selection` |
| `@capacitor/preferences` | Storage natif (remplace localStorage) | ✅ helpers `storage.get/set/remove` |
| `@capacitor/share` | Partage mission | ✅ helper `share()` |
| `@capacitor/splash-screen` | Splash natif | ✅ `SplashScreen.hide()` au mount |
| `@capacitor/status-bar` | Style barre d'état | ✅ `NativeBootstrap` set style + couleur |
| `@capacitor/push-notifications` | Rappels missions | ⏳ Phase 2b (backend requis) |
| `@capacitor/geolocation` | Remplace `navigator.geolocation` | ⏳ Phase 4 (feed + carte) |
| `@capacitor/camera` | Photo profil, justif no-show | ⏳ Phase 2c |
| `@sentry/capacitor` | Crash reporting natif | ⏳ Phase 9 |

**Abstraction** : [`lib/platform.ts`](lib/platform.ts) expose :
- `isNative()`, `getPlatform()`, `isNativeIOS()`, `isNativeAndroid()`
- `storage.get/set/remove` (Preferences natif ↔ localStorage web)
- `haptics.impact/notification/selection` (no-op web)
- `share(options)` (native → Web Share API → no-op)
- `openBrowser(url)` (ASWebAuthSession/Custom Tabs natif ↔ `window.open` web)

**Bootstrap natif** : [`components/pwa/NativeBootstrap.tsx`](components/pwa/NativeBootstrap.tsx) monté dans `app/layout.tsx` gère au boot :
1. Status bar style + couleur (Android)
2. Splash screen hide (200 ms fade)
3. Listener `appUrlOpen` → `router.push(pathname+search+hash)` (deep links)
4. Listener `backButton` Android → `history.back()` ou `App.exitApp()` si racine

**Règle imports** : les packages `@capacitor/*` sont déclarés dans le `package.json` **racine** (pour import Next.js) ET dans `mobile/package.json` (pour que `cap sync` propage les natifs). pnpm dédupe via symlinks.

---

## 7. Authentification

### Providers supportés
- **Google** (OAuth)
- **Apple** (Sign in with Apple — **obligatoire iOS**, App Store Guideline 4.8)
- **Credentials** (email + password)

### État actuel du wiring
- [`lib/auth.ts`](lib/auth.ts) : provider Apple ajouté **conditionnellement** (activé si `AUTH_APPLE_ID` + `AUTH_APPLE_SECRET` présents). `scope: "name email"`, `response_mode: "form_post"`.
- [`lib/native-auth.ts`](lib/native-auth.ts) : helper `nativeSignIn(providerId, { callbackUrl })` — web → `signIn()` classique, natif → ouvre l'URL NextAuth dans le browser système via `@capacitor/browser`.
- [`app/(auth)/login/page.tsx`](app/(auth)/login/page.tsx) : bouton Apple affiché si `NEXT_PUBLIC_APPLE_AUTH_ENABLED=true`.
- [`app/.well-known/apple-app-site-association/route.ts`](app/.well-known/apple-app-site-association/route.ts) : AASA dynamique, `APPLE_TEAM_ID` env var → détail Universal Links.
- [`app/.well-known/assetlinks.json/route.ts`](app/.well-known/assetlinks.json/route.ts) : Android App Links, `ANDROID_SHA256_FINGERPRINTS` env var (liste CSV).

### 🔴 TODO critique — pont de session WebView ↔ browser système
NextAuth pose le cookie de session dans le **cookie jar du browser système** (SFSafariViewController / Chrome Custom Tabs). La WKWebView (iOS) et la WebView Android ne partagent **pas** ce jar.

Flow complet à implémenter (prochaine itération Phase 3) :
1. Après callback OAuth, NextAuth doit rediriger vers `https://lasso.app/auth/mobile-return?state=XXX`
2. Route `auth/mobile-return` génère un **token d'échange** court (5 min max, JWT signé HS256)
3. Redirect vers Universal Link `https://lasso.app/auth/mobile-bridge?token=YYY` qui est capté par `NativeBootstrap.appUrlOpen` listener
4. WebView appelle `POST /api/auth/mobile-exchange` avec le token → le serveur pose le cookie `next-auth.session-token` **sur la WebView**
5. `router.push("/feed")`

Fichiers à créer : `app/auth/mobile-return/route.ts`, `app/api/auth/mobile-exchange/route.ts`. Logique d'exchange à ajouter dans `NativeBootstrap`.

### Variables d'environnement requises
| Var | Scope | Source |
|-----|-------|--------|
| `AUTH_APPLE_ID` | server | Apple Services ID (ex. `fr.lasso.app.web`) |
| `AUTH_APPLE_SECRET` | server | JWT client secret (regénérer tous les 6 mois) |
| `AUTH_APPLE_TEAM_ID` | server | Apple Team ID (10 chars) |
| `AUTH_APPLE_KEY_ID` | server | Apple Key ID (10 chars) |
| `NEXT_PUBLIC_APPLE_AUTH_ENABLED` | client | `"true"` pour afficher bouton |
| `APPLE_TEAM_ID` | server | Même valeur que ci-dessus, utilisé par AASA |
| `ANDROID_SHA256_FINGERPRINTS` | server | CSV fingerprints SHA-256 du keystore (debug + release) |

### Rotation client secret Apple
Le JWT Apple expire **tous les 6 mois maximum**. Procédure (TBD — script automatisé à écrire) :
1. Générer nouveau JWT via Apple Key ID + Team ID + private key `.p8`
2. Mettre à jour `AUTH_APPLE_SECRET` dans Vercel env
3. Redéployer
4. Enregistrer date d'expiration dans un calendrier / reminder

---

## 8. Signature & secrets

### iOS
- Certificats Apple + provisioning profiles gérés via **Fastlane match** (repo privé chiffré recommandé)
- Dev : auto-signing Xcode OK
- Prod : manuel via App Store Connect

### Android
- **Keystore** généré une fois, sauvegardé dans **3 endroits séparés** (gestionnaire de mots de passe + backup chiffré cloud + physique)
- **Perte = app morte** (plus aucune mise à jour possible sur le même app ID)
- Mot de passe keystore + alias key stockés dans GitHub Secrets pour CI

`gradle.properties` en local contient placeholders — jamais commit du vrai keystore.

---

## 9. Procédure de release

TBD — sera complétée quand CI Fastlane en place. Grandes étapes prévues :

1. Bump version dans `apps/mobile/package.json` (et `versionCode` Android auto-incrémenté)
2. `pnpm exec cap sync`
3. Build iOS : Fastlane `lane :beta` → TestFlight
4. Build Android : Fastlane `lane :internal` → Play Console Internal Testing
5. Validation sur devices réels (voir §11)
6. Promotion TestFlight → External testing → App Store review
7. Promotion Play Internal → Closed → Open → Production
8. Monitor Sentry + PostHog 48 h après rollout

---

## 10. Comptes & consoles

| Service | URL | Rôle |
|---------|-----|------|
| App Store Connect | https://appstoreconnect.apple.com | Fiche iOS, TestFlight, reviews |
| Apple Developer | https://developer.apple.com | Certs, Services IDs, keys |
| Google Play Console | https://play.google.com/console | Fiche Android, internal testing, reviews |
| Firebase Console | https://console.firebase.google.com | FCM push Android |
| Sentry | (projet existant) | Crash reporting + JS errors |
| PostHog | (projet existant) | Analytics comportement |

Comptes et accès : TBD.

---

## 11. Playbook rejets Apple fréquents

### Guideline 4.2 — « Minimum Functionality »
Apple rejette les apps qui ne sont qu'un wrapper web. **Réponse** :
- Lister features natives : push notifications, géoloc native, caméra, partage système, haptique, deep links, offline persistant
- Inclure captures et vidéo de ces features
- Expliquer pourquoi l'app apporte de la valeur au-delà du site

### Guideline 4.8 — « Sign in with Apple »
Toute app avec login social tiers (Google, Facebook, …) DOIT proposer Sign in with Apple. **Réponse** : pointer vers bouton Apple sur écran login (doit être visible, taille ≥ Google).

### Guideline 5.1.1 — « Data Collection »
Tout accès à géoloc / camera / contacts doit avoir usage description claire dans `Info.plist`. **Réponse** : vérifier `NSLocationWhenInUseUsageDescription`, `NSCameraUsageDescription`, etc. sont bien renseignés avec texte utilisateur explicite.

---

## 12. Checklist end-to-end avant soumission

- [ ] `pnpm exec cap run ios` + `pnpm exec cap run android` lancent l'app, feed s'affiche
- [ ] Login Google via browser externe + retour deep link OK
- [ ] Login **Apple** OK iOS + Android
- [ ] Login email/password OK en natif
- [ ] Push notification test reçue (device bloqué + déverrouillé)
- [ ] Mode avion : pages cachées chargent, fallback offline sur le reste
- [ ] Géoloc demande permission native, feed réagit
- [ ] Upload photo profil via caméra OK iOS + Android
- [ ] Deep link `https://lasso.xxx/missions/:id` ouvre l'app (pas le navigateur)
- [ ] Back-button Android remonte l'historique (pas quit)
- [ ] Safe-area OK iPhone notch + Android gesture bar
- [ ] Lighthouse PWA ≥ 90, bundle first load < 500 kB
- [ ] Sentry Capacitor capture un crash natif forcé
- [ ] TestFlight build accepté, ≥ 5 testeurs externes OK
- [ ] Play Internal Testing installé sur ≥ 3 devices Android différents

---

## 13. Changelog

| Date | Phase | Commit | Notes |
|------|-------|--------|-------|
| 2026-04-20 | Init doc | — | Squelette initial du document |
