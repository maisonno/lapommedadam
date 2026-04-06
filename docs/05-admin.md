# 5. Interface d'administration

## Accès

**URL :** `https://www.lapommedadam.fr/admin`

Accessible depuis n'importe quel navigateur, y compris mobile. Pas d'authentification actuellement — l'URL suffit.

## Fonctionnement général

L'admin est une Single Page App HTML/CSS/JS (vanilla) qui :

1. **Au chargement** : appelle `/api/events` et `/api/horaires` (Vercel Functions) pour lire les fichiers actuels depuis GitHub
2. **À la modification** : met à jour l'état local en mémoire
3. **À la sauvegarde** : appelle `/api/events` (PUT) et `/api/horaires` (PUT) qui commitent les fichiers sur GitHub
4. Vercel détecte le commit et redéploie le site en ~30 secondes

```
Admin (navigateur) → /api/events (PUT) → GitHub API → commit → Vercel redéploie
```

## Onglet Agenda

### Liste des événements
- Affiche tous les événements du CSV, triés par date
- Icône 🖼 si une image est associée
- Clic sur un événement → ouvre le formulaire de modification

### Ajouter un événement
Bouton **+ Ajouter** → bottom sheet avec le formulaire :

| Champ | Obligatoire | Format |
|-------|-------------|--------|
| Date | ✅ | Sélecteur de date natif |
| Créneau | — | Texte libre (`21h30`, `Soir`…) |
| Titre | ✅ | Texte |
| Description | — | Texte multilignes |
| Image | — | Nom de fichier dans `images/` (ex: `karaoke.jpg`) |

### Supprimer un événement
Bouton 🗑 à droite de chaque ligne. Confirmation demandée.

### Sauvegarde
Le bouton **💾 Sauvegarder** en haut à droite envoie simultanément les deux fichiers à l'API. Un message de statut confirme le succès ou l'échec.

> Un avertissement "voulez-vous quitter ?" s'affiche si vous naviguez hors de la page avec des modifications non sauvegardées.

## Onglet Horaires

### Périodes d'ouverture
Chaque période définit une plage de dates pendant laquelle des horaires s'appliquent. La période dont les dates encadrent aujourd'hui est marquée **⚡ Active**.

### Ajouter une période
Bouton **+ Période**. Champs disponibles :

| Champ | Description |
|-------|-------------|
| Libellé | Ex: `Saison 2026`, `Haute saison 2026` |
| Note | Affiché sous les horaires (ex: `Fermé le lundi`) |
| Début validité | Date de début de la période |
| Fin validité | Date de fin de la période |
| Jours d'ouverture | Sélecteur cliquable Lun/Mar/Mer/Jeu/Ven/Sam/Dim |
| Services | Liste des services avec horaires début→fin |

### Services
Chaque service = une ligne d'horaire affichée sur le site. Exemples : `Buffet petit-déjeuner`, `Déjeuner`, `Dîner`.

Bouton **+ Service** pour ajouter, bouton ✕ pour supprimer.

### Périodes multiples
Il est possible de définir plusieurs périodes (ex: début de saison + haute saison avec jours d'ouverture différents). Le site affiche automatiquement la période active selon la date du jour.

## Gestion des images

Les images référencées dans l'agenda (champ `image`) doivent être placées dans le dossier `images/` du repository GitHub. L'admin ne permet pas l'upload d'images directement — il faut les déposer manuellement sur GitHub.

**Procédure :**
1. Sur `github.com/maisonno/lapommedadam`
2. Naviguer dans `images/`
3. "Add file" → "Upload files"
4. Glisser les images → Commit
