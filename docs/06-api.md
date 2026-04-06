# 6. API serverless

Les deux Vercel Functions exposent une interface REST simple pour lire et écrire les fichiers de données sur GitHub.

## Authentification GitHub

Les fonctions utilisent un Personal Access Token (PAT) GitHub stocké dans la variable d'environnement `GITHUB_TOKEN` (configurée dans Vercel → Settings → Environment Variables).

Le token doit avoir le scope **`repo`** (lecture et écriture sur le repository privé ou public).

---

## GET /api/events

Lit le contenu de `events.csv` depuis GitHub.

**Réponse :**
```json
{
  "content": "date,créneau,titre,texte,image\n2026-05-06,...",
  "sha": "abc123..."
}
```

Le `sha` est le hash SHA-1 du fichier sur GitHub. Il n'est plus utilisé par le client (le serveur le récupère lui-même au moment de l'écriture).

---

## PUT /api/events

Écrit un nouveau contenu pour `events.csv` sur GitHub (commit automatique).

**Corps de la requête :**
```json
{
  "content": "date,créneau,titre,texte,image\n..."
}
```

**Comportement :**
1. Récupère le SHA actuel du fichier depuis GitHub (source de vérité)
2. Encode le contenu en base64
3. Soumet un commit via l'API GitHub Contents
4. Réessaie jusqu'à 3 fois en cas de conflit SHA (409/422)

**Réponse succès :**
```json
{ "ok": true, "sha": "nouveau_sha..." }
```

**Message de commit :** `📅 Mise à jour agenda`

---

## GET /api/horaires

Lit le contenu de `horaires.json` depuis GitHub.

**Réponse :**
```json
{
  "content": "[{\"label\":\"Saison 2026\",...}]",
  "sha": "abc123..."
}
```

Si le fichier n'existe pas encore (404), retourne `{ "content": "[]", "sha": null }`.

---

## PUT /api/horaires

Écrit un nouveau contenu pour `horaires.json` sur GitHub.

**Corps de la requête :**
```json
{
  "content": "[{\"label\":\"Saison 2026\",...}]"
}
```

Même comportement que PUT /api/events (SHA frais + retry).

**Message de commit :** `🕐 Mise à jour horaires`

---

## Gestion des conflits SHA

GitHub exige le SHA actuel du fichier pour toute écriture (mécanisme anti-collision). Les fonctions récupèrent systématiquement le SHA frais depuis GitHub juste avant d'écrire, sans se fier au SHA transmis par le client. En cas d'échec (409/422), jusqu'à 3 tentatives sont effectuées avec un SHA rafraîchi.

## Constantes (dans les deux fichiers)

```javascript
const REPO_OWNER = 'maisonno';
const REPO_NAME  = 'lapommedadam';
const BRANCH     = 'main';
```

À modifier si le repository est renommé ou transféré.
