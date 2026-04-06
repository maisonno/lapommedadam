# 1. Présentation générale

## Contexte

La Pomme d'Adam est un bar-restaurant situé place Durville à Héliopolis, sur l'Île du Levant (83400 Hyères). Établissement naturiste ouvert depuis 1932, il opère en saison d'avril à fin septembre.

Le site `lapommedadam.fr` sert de vitrine mobile-first pour les clients de l'île : visiteurs, résidents, estivants. Il est conçu pour être consulté principalement sur smartphone, depuis la place Durville.

## Objectifs fonctionnels

- **Informer** : présentation de l'établissement, horaires d'ouverture en cours, contact
- **Convertir** : accès direct au click & collect pizza et à la réservation de table (L'Addition)
- **Animer** : agenda hebdomadaire fusionnant le programme culinaire, les événements saisis manuellement et les événements publiés sur Levant.news
- **Privatisation** : présenter l'offre de privatisation pour événements privés (mariage, anniversaire…)
- **Réseaux sociaux** : liens Instagram et Facebook

## Périmètre

Le site est un **site statique** — il ne gère pas de compte utilisateur, pas de paiement, pas de backend métier. Les seules parties dynamiques sont :

- Le chargement des horaires depuis `horaires.json`
- Le chargement de l'agenda depuis `events.csv` et l'API Levant.news
- L'interface d'administration qui écrit sur GitHub via l'API GitHub

## Parties prenantes

| Rôle | Personne | Responsabilité |
|------|----------|----------------|
| Propriétaire | Olivier Maisonneuve | Décisions produit, accès GitHub/Vercel |
| Éditeur contenu | Équipe Pomme d'Adam | Saisie agenda dans Levant.news et `/admin` |
| Hébergement | Vercel | CDN, déploiement automatique |
| Agenda île | Levant.news | Publication des événements de l'île |
