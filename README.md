# 7TeamPlan

Application web de **planification d'équipes** permettant de gérer employés, équipes et affectations sur un calendrier hebdomadaire. Interface inspirée de Microsoft Teams, entièrement en français, sans backend ni installation.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

---

## Aperçu

7TeamPlan est un outil de gestion de planning conçu pour visualiser rapidement qui travaille, quand et dans quelle équipe. À l'ouverture, le calendrier affiche **la semaine en cours** avec mise en évidence du jour actuel.

### Fonctionnalités principales

| Module | Description |
|--------|-------------|
| **Calendrier** | Vue hebdomadaire (lundi → dimanche), navigation semaine par semaine, affectations colorées par équipe |
| **Employés** | Ajout, modification et suppression d'employés, rattachés à un département |
| **Équipes** | Création d'équipes avec sélection de membres |
| **Paramètres** | Gestion des départements (nom + couleur), mode sombre, plage horaire du calendrier |
| **Affectations** | Création manuelle via modal, drag & drop sur le calendrier, déplacement des blocs existants |
| **Panneau détail** | Consultation, modification, duplication et suppression d'une affectation |

### Fonctionnalités avancées

- **Persistance locale** — toutes les données sont sauvegardées dans le navigateur (`localStorage`)
- **Mode sombre** — activable dans les paramètres, mémorisé entre les sessions
- **Responsive** — navigation latérale sur desktop, barre de navigation en bas sur mobile
- **Scroll optimisé** — listes d'employés et panneaux latéraux scrollables sur tous les écrans

---

## Démarrage rapide

Aucune dépendance à installer. Le projet est constitué de fichiers statiques.

### Option 1 — Ouvrir directement

1. Clonez ou téléchargez le dépôt
2. Ouvrez `index.html` dans votre navigateur (Chrome, Firefox, Edge, Safari)

### Option 2 — Serveur local (recommandé)

Un serveur local évite certaines restrictions des navigateurs sur les fichiers locaux.

```bash
# Avec Python
python -m http.server 8080

# Avec Node.js (npx)
npx serve .

# Avec PHP
php -S localhost:8080
```

Puis rendez-vous sur [http://localhost:8080](http://localhost:8080).

---

## Structure du projet

```
7TEAMPLAN-TECH1/
├── index.html      # Structure HTML et navigation
├── style.css       # Styles, thème, responsive, mode sombre
├── script.js       # Logique métier, calendrier, localStorage
└── README.md       # Documentation
```

---

## Utilisation

### Calendrier

- Les **flèches** permettent de naviguer entre les semaines
- Le libellé affiche la période avec **mois et année** (ex. : *Semaine du 23 au 29 juin 2026*)
- Cliquez sur une affectation pour ouvrir le panneau de détail
- **Glissez-déposez** une affectation pour la déplacer sur un autre créneau
- Bouton **Nouvelle affectation** : choix de l'équipe, des jours, et des heures de début/fin

### Employés

1. Allez dans l'onglet **Employés**
2. Renseignez le nom et le département
3. Cliquez sur **Ajouter**
4. Vous pouvez modifier ou supprimer un employé via les icônes sur chaque carte
5. **Glissez** un employé sur le calendrier pour créer une affectation avec son équipe

### Équipes

1. Allez dans l'onglet **Équipes**
2. Donnez un nom à l'équipe et cochez les membres
3. Cliquez sur **Créer**

### Paramètres

- **Départements** : ajoutez des départements avec une couleur associée (utilisée pour les employés)
- **Mode sombre** : bascule le thème clair/sombre
- **Heures de début/fin** : définissent la plage horaire visible dans le calendrier (par défaut 08:00 – 20:00)

---

## Données et persistance

Les données sont stockées dans le **localStorage** du navigateur sous la clé `teamplan-data-2025`.

Contenu sauvegardé :

- Liste des employés
- Départements et leurs couleurs
- Équipes et leurs membres
- Affectations (équipe, date, heures)
- Préférences (mode sombre, plage horaire)

> Les données restent sur **votre machine**, dans le navigateur utilisé. Elles ne sont pas synchronisées entre appareils.

### Réinitialiser les données

Ouvrez la console du navigateur (F12) et exécutez :

```javascript
localStorage.removeItem('teamplan-data-2025');
location.reload();
```

---

## Technologies utilisées

| Technologie | Rôle |
|-------------|------|
| **HTML5** | Structure sémantique de l'application |
| **CSS3** | Mise en page Flexbox/Grid, variables CSS, media queries, animations |
| **JavaScript (vanilla)** | Logique applicative, DOM, drag & drop, localStorage |
| **Font Awesome 6** | Icônes (CDN) |
| **Google Fonts (Inter)** | Typographie (CDN) |

Aucun framework (React, Vue, etc.) ni bundler n'est requis.

---

## Compatibilité

- Chrome / Edge (recommandé)
- Firefox
- Safari
- Mobile : iOS Safari, Chrome Android

---

## Roadmap / améliorations possibles

- Export / import des données (JSON)
- Vue mensuelle
- Filtre par département ou équipe sur le calendrier
- Authentification et backend pour le travail multi-utilisateur
- Notifications et rappels

---

## Licence

Projet libre d'utilisation. Ajoutez la licence de votre choix (MIT, Apache 2.0, etc.) selon vos besoins.

---

## Auteur

Projet **7TeamPlan** — gestion de planning d'équipes.
