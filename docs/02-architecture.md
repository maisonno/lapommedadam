# 2. Architecture & infrastructure

## Vue d'ensemble

```
┌─────────────────────────────────────────────────────────────┐
│                      Visiteur mobile                         │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Vercel CDN (lapommedadam.fr)                    │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │  index.html  │  │  admin.html  │  │  api/events.js    │  │
│  │  (site pub.) │  │  (admin)     │  │  api/horaires.js  │  │
│  └──────────────┘  └──────────────┘  └─────────┬─────────┘  │
│                                                 │            │
└─────────────────────────────────────────────────┼────────────┘
                                                  │
              ┌───────────────────────────────────┤
              │                                   │
              ▼                                   ▼
┌─────────────────────┐              ┌────────────────────────┐
│    GitHub API       │              │   Levant.news API      │
│  maisonno/          │              │  (levant-news.         │
│  lapommedadam       │              │   vercel.app)          │
│                     │              │                        │
│  events.csv         │              │  /api/evenements?      │
│  horaires.json      │              │  etablissement=POMME   │
└─────────────────────┘              └────────────────────────┘
```

## Infrastructure

| Composant | Technologie | Détail |
|-----------|-------------|--------|
| Hébergement | Vercel (CDN mondial) | Plan Hobby (gratuit) |
| Repository | GitHub — `maisonno/lapommedadam` | Branche `main`, public |
| Domaine | `lapommedadam.fr` enregistré chez OVH | DNS délégué vers Vercel |
| Fonctions serverless | Vercel Functions (Node.js) | `api/events.js`, `api/horaires.js` |
| CI/CD | GitHub → Vercel | Push sur `main` → déploiement ~30 secondes |
| Variable d'env. | `GITHUB_TOKEN` | PAT GitHub, configuré dans Vercel |

## Structure des fichiers

```
lapommedadam/
├── index.html          ← site public (HTML/CSS/JS tout-en-un, ~490 Ko)
├── admin.html          ← interface d'administration mobile
├── events.csv          ← agenda saisi manuellement
├── horaires.json       ← périodes d'ouverture
├── vercel.json         ← configuration Vercel
├── images/             ← photos des événements (jpg, png, webp)
└── api/
    ├── events.js       ← Vercel Function CRUD sur events.csv
    └── horaires.js     ← Vercel Function CRUD sur horaires.json
```

## Configuration Vercel (`vercel.json`)

```json
{
  "rewrites": [
    { "source": "/admin", "destination": "/admin.html" }
  ],
  "cleanUrls": true
}
```

- `cleanUrls: true` supprime les extensions `.html` sur toutes les pages
- Le rewrite permet d'accéder à l'admin via `/admin` plutôt que `/admin.html`

## DNS (OVH → Vercel)

| Type | Nom | Valeur |
|------|-----|--------|
| A | @ | `76.76.21.21` |
| CNAME | www | `cname.vercel-dns.com.` |

## Contraintes de sécurité

- Le `GITHUB_TOKEN` (Personal Access Token avec scope `repo`) est stocké uniquement dans les variables d'environnement Vercel — jamais exposé dans le code côté client
- L'interface admin est accessible publiquement (pas d'authentification) — à sécuriser si nécessaire
- L'API Levant.news est publique, CORS ouvert, sans clé
