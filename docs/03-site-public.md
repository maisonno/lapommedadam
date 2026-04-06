# 3. Site public — index.html

## Caractéristiques techniques

- **Fichier unique** : tout le HTML, CSS, JS, la police Bilderberg et les images de fond sont embarqués en base64 dans un seul fichier (~490 Ko)
- **Aucune dépendance externe JS** : vanilla JS uniquement
- **Polices** : Bilderberg (titres, embarquée en base64) + Lato + Playfair Display (Google Fonts)
- **Charte graphique** : bleu nuit `#0d1b3e`, bleu roi `#1a4fa0`, or `#f0c040`, fond noir `#000`

## Sections

### Hero
Photo de fond pleine page (`Image_de_fond.png`, embarquée en base64) avec dégradé vers le noir. Contient le logo (intégré dans la photo), le tagline et trois boutons CTA :
- **Commander une pizza** → click & collect L'Addition
- **Réserver une table** → module réservation L'Addition
- **WhatsApp** → `wa.me/33483994626`

### Notre histoire
Texte de présentation de l'établissement et liste des points forts (texte simple, non interactif).

### Horaires
Chargé dynamiquement depuis `horaires.json` via `fetch('horaires.json')`. Affiche la période active selon la date du jour. Voir [section Horaires](./04-agenda.md#horaires).

### Agenda
Agenda hebdomadaire navigable (← semaine →), chargé depuis trois sources fusionnées. Voir [section Agenda](./04-agenda.md).

### Commander · Réserver
Deux cartes avec boutons CTA directs vers les modules L'Addition.

### Privatisation
Texte de présentation + bouton WhatsApp avec message pré-rempli.

### Contact
- Bouton WhatsApp
- Bouton téléphone (`tel:`)
- Logos Instagram et Facebook (SVG inline)

## Navigation

Pas de menu fixe. La page se scroll verticalement. Les ancres correspondent aux `id` des sections : `#home`, `#about`, `#horaires`, `#agenda`, `#commande`, `#privatisation`, `#contact`.

## Modal événement

Au clic sur une carte d'agenda, une bottom sheet remonte du bas avec :
- Image de l'affiche (si disponible) ou emoji catégorie
- Badge catégorie coloré (couleurs Levant.news)
- Titre (police Bilderberg)
- Date · heure
- Lieu / organisateur (si différent de La Pomme d'Adam)
- Description complète

Fermeture : bouton ✕ ou clic sur le fond.

## Chargement au démarrage

```javascript
loadHoraires();      // fetch horaires.json
loadLevantEvents();  // fetch API Levant.news + renderEvents()
```

`renderEvents()` est appelé après le chargement Levant.news et affiche la semaine courante, fusionnant les trois sources.
