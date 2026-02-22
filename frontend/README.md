# Frontend Medi-Tracker (Angular)

Interface utilisateur de Medi-Tracker.

---

## Stack

- Angular 21 (standalone components)
- Angular Router
- Angular HttpClient
- FullCalendar (gestion des RDV)

---

## Démarrage

```bash
npm install
npm start
```

Application disponible sur : `http://localhost:4200`

---

## Scripts

- `npm start` : serveur de développement
- `npm run build` : build de production
- `npm run watch` : build en watch mode
- `npm test` : tests

---

## Intégration API

L'URL API est définie dans :

- `src/environments/environment.ts`

Valeur actuelle (dev) :

```ts
apiUrl: 'http://localhost:8000/api'
```

---

## Authentification côté frontend

### Implémentation

- Service auth : `src/app/core/auth/auth.service.ts`
- Interceptor JWT : `src/app/core/auth/auth.interceptor.ts`
- Guard de routes : `src/app/core/auth/auth.guard.ts`
- Page login/register : `src/app/features/auth/login.ts`

### Fonctionnement

1. L'utilisateur se connecte / s'inscrit via `/api/auth/*`
2. Le token JWT est stocké en localStorage
3. L'interceptor ajoute le header `Authorization: Bearer <token>`
4. Le guard empêche l'accès aux routes protégées sans token

---

## Routes principales

- `/login`
- `/home` (protégée)
- `/patient` (protégée)
- `/doctors` (protégée)
- `/rdv` (protégée)

---

## Structure utile

```text
src/app/
├─ core/
│  ├─ auth/
│  └─ service/
├─ features/
│  ├─ auth/
│  ├─ doctors/
│  ├─ patient/
│  ├─ rdv/
│  └─ home/
└─ models/
```

---

## Notes de développement

- Les appels HTTP utilisent les services dans `core/service`
- Les mocks ont été retirés, l'app utilise les vraies données backend
- Si l'API renvoie `401`, vérifier le token ou refaire un login

---

## Dépannage rapide

### Erreur CORS

Vérifier que le backend autorise `http://localhost:4200` dans `my_api/.env` (`CORS_ALLOW_ORIGINS`).

### API inaccessible

Vérifier que Symfony tourne sur `http://127.0.0.1:8000`.

### Build en erreur après pull

Relancer :

```bash
npm install
npm run build
```
