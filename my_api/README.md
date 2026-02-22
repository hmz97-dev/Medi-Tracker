# Backend API Medi-Tracker (Symfony)

API REST de Medi-Tracker, sécurisée par JWT et connectée à PostgreSQL.

---

## Stack technique

- Symfony 8
- Doctrine ORM + Migrations
- PostgreSQL 16 (Docker)
- JWT (`firebase/php-jwt`)

---

## Prérequis

- PHP >= 8.4
- Composer
- Symfony CLI
- Docker Desktop
- Extensions PHP: `pdo`, `pdo_pgsql`, `pgsql`

Vérification:

```powershell
php -m | Select-String -Pattern "pdo_pgsql|pgsql"
```

---

## Installation

```powershell
composer install
docker compose up -d database
php bin/console doctrine:migrations:migrate --no-interaction
symfony server:start -d
```

API disponible sur `http://127.0.0.1:8000`

---

## Configuration `.env`

Variables importantes:

```env
APP_ENV=dev
DATABASE_URL="postgresql://app:123@127.0.0.1:5432/app?serverVersion=16&charset=utf8"
CORS_ALLOW_ORIGINS=http://localhost:4200,http://127.0.0.1:4200
JWT_SECRET=meditracker-jwt-secret-key-2026-ultra-long-please-change-in-env-local
```

---

## Authentification JWT

### Endpoints publics

- `POST /api/auth/register`
- `POST /api/auth/login`

### Endpoint protégé

- `GET /api/auth/me`

### Exemple login

```bash
curl -X POST http://127.0.0.1:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Password123"}'
```

### Exemple accès protégé

```bash
curl http://127.0.0.1:8000/api/patients \
  -H "Authorization: Bearer <TOKEN>"
```

---

## API métier (routes protégées)

### Doctors

- `GET /api/doctors`
- `GET /api/doctors/{id}`
- `POST /api/doctors`
- `PUT /api/doctors/{id}`
- `DELETE /api/doctors/{id}`
- `GET /api/doctors/{id}/rdvs`

### Patients

- `GET /api/patients`
- `GET /api/patients/{id}`
- `POST /api/patients`
- `PUT /api/patients/{id}`
- `DELETE /api/patients/{id}`
- `GET /api/patients/{id}/rdvs`

### RDVs

- `GET /api/rdvs`
- `GET /api/rdvs/{id}`
- `POST /api/rdvs`
- `PUT /api/rdvs/{id}`
- `DELETE /api/rdvs/{id}`

---

## Schéma de données (principal)

- `doctor`
- `patient`
- `rdv`
- `user` (auth)
- `doctrine_migration_versions`

---

## Commandes utiles

```powershell
php bin/console about
php bin/console debug:router
php bin/console doctrine:migrations:status
php bin/console doctrine:migrations:migrate
php bin/console cache:clear
```

---

## Sécurité

- Firewall stateless
- Authenticator custom: `App\Security\ApiJwtAuthenticator`
- Toutes les routes `/api/**` protégées sauf `login/register`
- CORS géré par `App\EventSubscriber\CorsSubscriber`

---

## Dépannage

### `could not find driver`

Activer `pdo_pgsql` et `pgsql` dans le `php.ini` actif.

### `connection refused 127.0.0.1:5432`

Démarrer PostgreSQL:

```powershell
docker compose up -d database
```

### `Provided key is too short`

Utiliser une clé `JWT_SECRET` plus longue puis:

```powershell
php bin/console cache:clear
```

### 401 sur routes API

- Vérifier le header `Authorization: Bearer <token>`
- Vérifier que le token n'est pas expiré
- Vérifier que l'utilisateur existe en base
