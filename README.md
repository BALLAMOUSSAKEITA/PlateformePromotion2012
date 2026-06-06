# Filifing Siguiri – Promotion 2012

Plateforme officielle de l'Association des Anciens Élèves de Siguiri, Promotion 2012.

## Stack technique

- **Frontend** : Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend** : FastAPI, SQLAlchemy, PostgreSQL
- **Carte membre** : Pillow (Python) + QR Code

## Démarrage rapide

### Prérequis

- Python 3.11+
- Node.js 18+
- PostgreSQL

---

### Backend

```bash
cd backend

# Copier et configurer les variables d'environnement
cp .env.example .env
# Éditer .env : mettre vos identifiants PostgreSQL

# Installer les dépendances
pip install -r requirements.txt

# Lancer le serveur
uvicorn main:app --reload --port 8000
```

API disponible sur http://localhost:8000  
Documentation interactive : http://localhost:8000/docs

---

### Frontend

```bash
cd frontend

# Variables d'environnement (déjà configurées pour le dev local)
# NEXT_PUBLIC_API_URL=http://localhost:8000

npm install
npm run dev
```

Application disponible sur http://localhost:3000

---

## Pages de l'application

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/inscription` | Formulaire d'inscription en 2 étapes |
| `/connexion` | Connexion membre |
| `/dashboard` | Espace membre + carte virtuelle |
| `/verifier/[numero]` | Vérification publique d'une carte |

## Endpoints API principaux

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/auth/inscription` | Créer un compte |
| POST | `/auth/connexion` | Se connecter (JWT) |
| GET | `/membres/moi` | Profil du membre connecté |
| GET | `/membres/{numero}/carte` | Télécharger la carte PNG |
| GET | `/membres/{numero}/verifier` | Vérification publique |
| POST | `/membres/moi/photo` | Upload photo de profil |

## Numéro de membre

Les numéros sont générés automatiquement au format : `FILI-2012-XXXX`

Exemple : `FILI-2012-0001`, `FILI-2012-0042`
