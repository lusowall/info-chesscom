# Infos Adversaire Chess.com

Userscript Tampermonkey/Violentmonkey qui affiche **uniquement les statistiques publiques de ton adversaire** sur Chess.com, via l'API publique officielle (`api.chess.com/pub`). Aucune analyse de coup, aucun engine, aucune triche — **100% fair play**.

![version](https://img.shields.io/badge/version-1.0-brightgreen)
![license](https://img.shields.io/badge/license-MIT-blue)

## Aperçu

Un petit widget flottant (déplaçable) apparaît à côté du joueur du haut. Il montre d'un coup d'œil l'Elo max et le winrate, et déploie un panneau détaillé au clic.

> 💡 Ajoute un screenshot ici une fois le dépôt en place :
> `![aperçu](docs/screenshot.png)`

## Fonctionnalités

- 🏆 **Headline auto** : Elo max global + winrate, sans clic
- 📊 **Panneau détaillé** : rapide, blitz, bullet, daily, tactiques, puzzle rush
- 📈 Bilan V/D/N, nombre de parties, winrate combiné
- 🌍 Pays (drapeau), ancienneté du compte, followers, league
- 🔴 Détection streamer, badge de titre (GM, IM, FM…)
- ⛔ Bannière "compte fermé (fair play)" si l'adversaire a été banni
- 🟢 Dernière connexion (en ligne / il y a X min / h / j)
- 🖱️ Widget déplaçable et position sauvegardée (localStorage)

Le tout repose **exclusivement** sur des données publiques exposées par l'API Chess.com. Rien n'est extrait du plateau ni des coups joués.

## Installation

1. Installe une extension userscript :
   - [Tampermonkey](https://www.tampermonkey.net/) (Chrome, Firefox, Edge, Safari)
   - ou [Violentmonkey](https://violentmonkey.github.io/) (open source)
2. Clique sur le lien d'installation directe :

   👉 [`chesscom-lichess-analyze.user.js`](https://raw.githubusercontent.com/lusowall/info-chesscom/main/chesscom-lichess-analyze.user.js)

3. L'extension détecte le script et propose l'installation. Valide.
4. Lance une partie sur Chess.com, le widget apparaît en haut à gauche.

> Les mises à jour sont gérées automatiquement par Tampermonkey via `@updateURL`.

## Utilisation

- Le bandeau 🏆 se remplit tout seul quand un adversaire est détecté.
- **Clic sur 📊 ou sur le bandeau** → ouvre/ferme le panneau détaillé.
- **Clic sur 📌** → débloque le widget pour le déplacer, reclique pour le fixer (📌 ↔ ✋).
- La position est mémorisée entre les sessions.

## Compatibilité

| Page                          | Supporté |
|-------------------------------|----------|
| `chess.com/game/*`            | ✅        |
| `chess.com/play/*`            | ✅        |

## Confidentialité & fair play

Ce script **ne fournit aucune assistance au jeu**. Il ne lit pas la position, ne suggère pas de coups et n'utilise aucun moteur d'échecs. Il se contente d'agréger les statistiques publiques du profil adverse, exactement comme si tu allais voir son profil à la main. C'est conforme à la philosophie fair play de Chess.com.

## Développement

Le script est un fichier unique sans build :

```
chesscom-lichess-analyze.user.js   # tout le code
README.md
LICENSE
```

Pour contribuer : fork → branche → PR. Les retours bugs vont dans les [issues](https://github.com/lusowall/info-chesscom/issues).

## Licence

[MIT](LICENSE) © LusoWall
