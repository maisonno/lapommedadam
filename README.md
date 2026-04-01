# La Pomme d'Adam — Site web

## Structure
```
lapommedadam/
├── index.html      → le site
├── events.csv      → agenda à éditer dans Numbers ou Google Sheets
├── images/         → photos des événements (jpg, png, webp)
└── README.md
```

## Éditer l'agenda

Ouvrir `events.csv` avec **Numbers** (Mac) ou **Google Sheets**.
Colonnes :
- `date` — format YYYY-MM-DD ou DD/MM/YYYY
- `créneau` — ex: "21h30" ou "Soir"
- `titre` — nom de l'événement
- `texte` — description
- `image` — nom du fichier dans le dossier images/ (ex: karaoke.jpg)

Après modification → sauvegarder en CSV UTF-8 → `git push` → le site se met à jour sur Vercel.

## Déployer

```bash
git add .
git commit -m "Mise à jour agenda"
git push
```
