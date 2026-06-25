# 8. Guide de maintenance

## Opérations courantes

### Ajouter un événement à l'agenda

→ Via `/admin` (onglet Agenda → + Ajouter) : méthode recommandée.

Ou via Levant.news : saisir l'événement dans l'application Levant.news en indiquant La Pomme d'Adam comme organisateur ou lieu. Il apparaîtra automatiquement.

### Modifier les horaires d'ouverture

→ Via `/admin` (onglet Horaires).

Cas typiques :
- **Début de saison** : créer une nouvelle période avec les dates et les jours d'ouverture correspondants
- **Fermeture exceptionnelle d'un jour** : modifier temporairement les jours cochés sur la période active
- **Haute saison** (jours d'ouverture étendus) : ajouter une seconde période avec ses propres dates et jours

### Ajouter une photo à un événement

1. Déposer l'image dans `images/` via GitHub web
2. Dans `/admin`, modifier l'événement et saisir le nom du fichier dans le champ "Image"
3. Sauvegarder

### Mettre à jour le programme culinaire (burger/aïoli/moules)

Le programme culinaire n'est plus codé en dur. Il se gère désormais comme les autres événements, via l'agenda (`/admin` ou Levant.news). Pour ajouter ou modifier un rendez-vous culinaire récurrent, créer l'événement correspondant dans l'agenda.

### Modifier les boutons CTA (click & collect, réservation)

Les URLs sont dans `index.html`, dans la section Hero et la section Commander/Réserver. Chercher `laddition.com` pour les localiser.

---

## Dépannage

### L'agenda n'affiche rien / "Chargement du programme…" reste affiché

**Cause probable :** erreur JavaScript qui bloque l'exécution.

**Diagnostic :** ouvrir les outils développeur du navigateur (F12) → onglet Console → chercher des erreurs en rouge.

**Solutions courantes :**
- `SyntaxError` dans `index.html` → vérifier qu'il n'y a pas d'apostrophe non échappée dans une string JS
- `ReferenceError: loadCSVEvents is not defined` → la fonction a été renommée en `loadLevantEvents`, vérifier l'appel en bas du script
- `Failed to fetch` sur l'API Levant.news → l'URL est peut-être incorrecte ou l'API est indisponible

### Les horaires n'affichent pas la bonne période

**Cause probable :** les dates de validité ne couvrent pas la date actuelle.

**Solution :** via `/admin` → onglet Horaires → vérifier les dates Début/Fin de la période censée être active. La période affiche le badge **⚡ Active** si elle est actuellement valide.

### L'admin affiche "Erreur de chargement"

**Cause probable :** le `GITHUB_TOKEN` est expiré ou invalide.

**Solution :** créer un nouveau PAT GitHub et le mettre à jour dans Vercel → Environment Variables.

### Erreur SHA sur l'admin ("does not match…")

**Cause probable :** conflit de version entre l'état local et GitHub.

**Solution :** recharger la page admin (Cmd+Shift+R) et re-saisir les modifications. L'API intègre un mécanisme de retry automatique (3 tentatives) — si l'erreur persiste, c'est généralement un problème de token.

### Le site affiche l'ancienne version après un déploiement

**Cause probable :** cache navigateur.

**Solution :** Cmd+Shift+R (hard refresh) sur le navigateur. Le cache Vercel est invalidé automatiquement à chaque déploiement.

---

## Évolutions prévues / connues

| Item | Statut | Action requise |
|------|--------|----------------|
| URL API Levant.news (dev → prod) | ⏳ En attente | Mettre à jour dans `index.html` quand Levant.news passe en prod |
| Sécurisation de `/admin` | 🔓 Non sécurisé | Envisager une protection par mot de passe ou IP si nécessaire |
| PWA / icône écran d'accueil | ⏳ Non implémenté | Ajouter `manifest.json` + service worker |
| Upload d'images depuis l'admin | ⏳ Non implémenté | Nécessite une Vercel Function supplémentaire |
| Programme culinaire éditable | ✅ Géré via l'agenda | Migré : burger/aïoli/moules se saisissent comme des événements |
