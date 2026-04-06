# 7. Déploiement & workflow

## Pipeline CI/CD

```
Modification locale ou via /admin
          │
          ▼
   Commit sur GitHub
   (branche main)
          │
          ▼ (webhook automatique)
   Vercel build
   (~30 secondes)
          │
          ▼
   lapommedadam.fr mis à jour
```

Pas de build step — le site est statique. Vercel sert directement les fichiers.

## Workflow éditorial — via l'admin (recommandé)

1. Ouvrir `https://www.lapommedadam.fr/admin` sur mobile ou desktop
2. Modifier l'agenda ou les horaires
3. Cliquer **💾 Sauvegarder**
4. Attendre ~30 secondes → le site est à jour

## Workflow éditorial — via GitHub (avancé)

Pour les modifications de code ou l'ajout d'images :

```bash
# Cloner le repo (première fois)
git clone https://github.com/maisonno/lapommedadam.git
cd lapommedadam

# Modifier les fichiers...

# Pusher
git add .
git commit -m "Description de la modification"
git push
```

Vercel redéploie automatiquement.

## Upload d'images

Via l'interface GitHub web :
1. `github.com/maisonno/lapommedadam` → dossier `images/`
2. "Add file" → "Upload files"
3. Glisser les images (jpg, png, webp)
4. "Commit changes"

Puis référencer le nom du fichier dans le champ `image` de l'agenda.

## Variables d'environnement Vercel

| Variable | Valeur | Utilisation |
|----------|--------|-------------|
| `GITHUB_TOKEN` | PAT GitHub (scope `repo`) | Écriture dans le repository via les API Functions |

Configuration : Vercel → projet `lapommedadam` → Settings → Environment Variables.

> ⚠️ Ne jamais exposer ce token dans le code côté client ou dans un message.

## Renouvellement du token GitHub

Les PAT GitHub peuvent expirer. En cas d'erreur 401 sur l'admin :
1. Créer un nouveau token sur `github.com/settings/tokens`
2. Scope : `repo`
3. Mettre à jour la variable `GITHUB_TOKEN` dans Vercel
4. Redéployer (ou attendre le prochain déploiement automatique)

## Mise à jour de l'URL API Levant.news

Quand Levant.news passera en production, mettre à jour dans `index.html` :

```javascript
// Avant (dev)
fetch('https://levant-news.vercel.app/api/evenements?etablissement=POMME')

// Après (prod)
fetch('https://levant.news/api/evenements?etablissement=POMME')
```

Puis pusher sur GitHub.
