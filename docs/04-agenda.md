# 4. Agenda — sources de données

L'agenda fusionne trois sources, affichées ensemble semaine par semaine.

## Sources

### 1. Programme culinaire fixe (codé en dur)

Défini dans `index.html`, tableau `CULINAIRE_WEEKLY` :

| Jour | Plat | Emoji |
|------|------|-------|
| Mardi (dow=2) | Burger du moment | 🍔 |
| Vendredi (dow=5) | Aïoli provençal | 🧄 |
| Samedi (dow=6) | Moules-frites | 🦪 |

Ces événements sont de type `weekly` — ils apparaissent chaque semaine à date fixe. Pour les modifier, éditer directement `index.html` (tableau `CULINAIRE_WEEKLY`).

### 2. Événements CSV (`events.csv`)

> ⚠️ Cette source est actuellement déclarée mais non chargée en production (remplacée par Levant.news). Elle reste dans le code pour usage futur ou fallback.

Format du fichier :

```
date,créneau,titre,texte,image
2025-07-14,21h00,Bal du 14 juillet,"Description de l'événement",bal14juillet.jpg
```

| Colonne | Format | Obligatoire |
|---------|--------|-------------|
| `date` | `YYYY-MM-DD` ou `DD/MM/YYYY` | ✅ |
| `créneau` | texte libre (`21h30`, `Soir`…) | — |
| `titre` | texte | ✅ |
| `texte` | texte (guillemets si virgule) | — |
| `image` | nom de fichier dans `images/` | — |

Encodage : **UTF-8 avec BOM** (pour compatibilité Numbers/Excel).

### 3. API Levant.news

Source principale des événements ponctuels. Appel au chargement de la page :

```javascript
fetch('https://levant-news.vercel.app/api/evenements?etablissement=POMME')
```

> ⚠️ L'URL pointe actuellement sur l'environnement de développement Levant.news (`levant-news.vercel.app`). Elle devra être mise à jour vers `levant.news` lors du passage en production de Levant.news.

**Réponse JSON :**

```json
{
  "etablissement": { "id": "...", "code": "POMME", "nom": "La Pomme d'Adam" },
  "evenements": [
    {
      "id": "uuid",
      "titre": "Karaoké Night",
      "complement": "Description (Markdown simple)",
      "date_debut": "2026-05-06",
      "date_fin": null,
      "heure": "22h00",
      "affiche_url": "https://cdn.supabase.../image.jpg",
      "categorie": { "code": "CHANT", "nom": "Chant" },
      "organisateur": { "id": "...", "nom": "La Pomme d'Adam" },
      "lieu": { "id": "...", "nom": "La Pomme d'Adam" }
    }
  ]
}
```

L'API retourne uniquement les événements **publiés** et **à venir** (date ≥ aujourd'hui), où La Pomme d'Adam est organisateur **ou** lieu.

**Catégories et couleurs :**

| Code | Nom | Emoji | Couleur bordure |
|------|-----|-------|-----------------|
| CONCERT | Concert | 🎵 | `#a855f7` |
| SOIREE | Soirée | 🎉 | `#6366f1` |
| SPORT | Sport | 🏃 | `#22c55e` |
| EXPO | Exposition | 🖼️ | `#f59e0b` |
| MARCHE | Marché | 🛍️ | `#f97316` |
| SPECTACLE | Spectacle | 🎭 | `#ec4899` |
| INFO | Info | ℹ️ | `#3b82f6` |
| INFOCRITIQUE | Info critique | ⚠️ | `#ef4444` |
| BAL | Bal | 💃 | `#d946ef` |
| BRUNCH | Brunch | ☕ | `#eab308` |
| ACTIVITE | Activité | 🧘 | `#14b8a6` |
| CHANT | Chant | 🎤 | `#f43f5e` |
| SERVICE_RELIGIEUX | Service religieux | ⛪ | `#78716c` |
| BANQUET | Banquet | 🍽️ | `#84cc16` |
| JEU | Jeu | 🎲 | `#06b6d4` |
| CUISINE | Cuisine | 👨‍🍳 | `#10b981` |

## Navigation semaine par semaine

- Affichage de la semaine courante (lundi→dimanche) par défaut
- Flèches ← → pour naviguer vers les semaines précédentes/suivantes
- Le label affiche "Semaine du [date du lundi]"
- Les événements `weekly` apparaissent chaque semaine ; les événements `once` uniquement à leur date

## Fusion et tri

```javascript
function getEventsDB() {
  return [...CULINAIRE_WEEKLY, ...EVENTS_CSV, ...EVENTS_LEVANT];
}
```

Les événements sont triés par date/heure croissante pour chaque semaine affichée.

## Horaires d'ouverture

Chargés depuis `horaires.json`. Structure :

```json
[
  {
    "label": "Saison 2026",
    "dateDebut": "2026-04-30",
    "dateFin": "2026-09-30",
    "note": "Fermé le jeudi hors juillet-août",
    "jours": [1, 2, 3, 5, 6, 0],
    "services": [
      { "nom": "Buffet petit-déjeuner", "debut": "08:00", "fin": "12:00" },
      { "nom": "Déjeuner", "debut": "12:00", "fin": "14:00" },
      { "nom": "Dîner", "debut": "19:00", "fin": "22:00" }
    ]
  }
]
```

Le site détecte automatiquement la période active selon `today >= dateDebut && today <= dateFin`. Si aucune période n'est active, un message "Fermé actuellement · Réouverture prochainement" s'affiche.

Les jours sont codés comme en JavaScript : `0=Dimanche, 1=Lundi, …, 6=Samedi`.
