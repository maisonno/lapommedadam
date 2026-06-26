# 4. Agenda — sources de données

L'agenda fusionne deux sources, affichées ensemble semaine par semaine.

> ℹ️ Le programme culinaire (burger/aïoli/moules), autrefois codé en dur dans `index.html` (tableau `CULINAIRE_WEEKLY`), a été retiré. Ces rendez-vous se gèrent désormais comme n'importe quel événement, via l'agenda (`/admin` ou Levant.news).

## Sources

### 1. Événements CSV (`events.csv`)

Saisis via `/admin` et chargés sur le site public (`fetch('events.csv')`, fonction `loadCSVEvents`). Cette source gère les événements **ponctuels** comme **hebdomadaires** (récurrents).

Format du fichier :

```
date,créneau,titre,texte,image,hebdo,dateFin
2026-07-14,21h00,Bal du 14 juillet,"Description de l'événement",bal14juillet.jpg,,
2026-04-30,Soir,Burger du moment,"Notre burger maison",,1,2026-08-31
```

| Colonne | Format | Obligatoire |
|---------|--------|-------------|
| `date` | `YYYY-MM-DD` (pour un événement hebdo, c'est la **date de début**) | ✅ |
| `créneau` | texte libre (`21h30`, `Soir`…) | — |
| `titre` | texte | ✅ |
| `texte` | texte (guillemets si virgule) | — |
| `image` | nom de fichier dans `images/` | — |
| `hebdo` | `1` = se répète chaque semaine ; vide = événement ponctuel | — |
| `dateFin` | `YYYY-MM-DD` : fin de la récurrence (uniquement si `hebdo`) ; vide = sans fin | — |

**Récurrence :** un événement avec `hebdo=1` apparaît chaque semaine le **même jour de la semaine que sa `date` de début**, de `date` jusqu'à `dateFin` incluse (ou indéfiniment si `dateFin` est vide). Exemple : pour un burger tous les mardis, choisir un mardi comme `date`.

Encodage : **UTF-8 avec BOM** (pour compatibilité Numbers/Excel).

### 2. API Levant.news

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
  return [...EVENTS_CSV, ...EVENTS_LEVANT];
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
