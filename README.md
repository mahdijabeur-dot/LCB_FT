# 🔒 Contrôle Permanent LCB-FT

> Système de gestion des contrôles permanents de Lutte Contre le Blanchiment de Capitaux et le Financement du Terrorisme (LCB-FT) à usage bancaire interne.

---

## 📌 Présentation

Cette application web permet aux contrôleurs permanents de réaliser, documenter, sauvegarder et analyser des fiches de contrôle LCB-FT selon les périmètres définis par la réglementation.

Elle fonctionne **entièrement côté navigateur**, sans backend ni base de données : les données sont persistées dans le `localStorage` du navigateur.

---

## 🗂️ Structure du projet

```
controle-lcb-ft/
│
├── index.html                 → Page principale de l'application
│
├── assets/
│   ├── css/
│   │   └── style.css          → Styles de l'interface
│   │
│   ├── js/
│   │   ├── data.js            → Référentiel des points de contrôle par périmètre
│   │   └── app.js             → Logique applicative (formulaire, graphiques, localStorage)
│   │
│   └── img/
│       └── favicon.ico        → Icône de l'onglet navigateur (optionnel)
│
├── .gitignore
└── README.md
```

---

## ✅ Fonctionnalités

| Fonctionnalité | Description |
|---|---|
| 📋 Saisie de la fiche de contrôle | Référence, date, contrôleur, entité, période |
| 🗂️ Sélection multi-périmètres | Affichage dynamique des points de contrôle selon le(s) périmètre(s) |
| ✅ Cotation par point | Conforme / Écart Mineur / Écart Majeur / Écart Critique / N/A |
| 📊 Tableau de bord | Statistiques en temps réel (conformes, écarts, total) |
| 📈 Graphiques | Doughnut et Bar Chart dynamiques (Chart.js) |
| 💾 Sauvegarde locale | Persistance via `localStorage` (sans serveur) |
| 📝 Modification | Rechargement et édition d'un contrôle sauvegardé |
| 🗑️ Suppression | Suppression sécurisée avec confirmation |
| 🔍 Filtrage & Recherche | Par référence et par niveau de conformité |
| 🔄 Réinitialisation | Remise à zéro complète du formulaire |
| 📄 Export PDF | Impression via `window.print()` |

---

## 🗂️ Périmètres de contrôle couverts

| Code | Périmètre | Points |
|------|-----------|--------|
| EER | Entrée en Relation | 51 |
| MAJ KYC | Mise à Jour KYC | 50 |
| CBE | Correspondant Bancaire Étranger | 29 |
| DS | Déclaration de Soupçon | 16 |
| VER | Versement | 14 |
| OPD | Ordre de Paiement Dématérialisé | 13 |
| CHM | Change Manuel | 12 |
| RET | Retrait | 12 |
| OPA | Ordre de Paiement | 9 |
| LS | Filtrage Sanctions | 3 |
| PPE | Filtrage PPE | 1 |
| **Total** | | **210** |

---

## 🚀 Déploiement sur GitHub Pages

### Étape 1 — Créer le dépôt

```bash
git init
git add .
git commit -m "Initial commit – Contrôle Permanent LCB-FT"
git remote add origin https://github.com/VOTRE_NOM/controle-lcb-ft.git
git push -u origin main
```

### Étape 2 — Activer GitHub Pages

1. Aller dans l'onglet **Settings** du dépôt GitHub
2. Rubrique **Pages** dans le menu latéral
3. Source : **Deploy from a branch**
4. Branch : `main` → dossier `/ (root)`
5. Cliquer sur **Save**

L'application sera accessible à l'adresse :
```
https://VOTRE_NOM.github.io/controle-lcb-ft/
```

---

## 💻 Usage en local

Aucune installation requise. Ouvrir directement `index.html` dans un navigateur :

```bash
# Ou via un serveur local simple (recommandé pour éviter les restrictions CORS)
python3 -m http.server 8080
# puis ouvrir http://localhost:8080
```

---

## ⚠️ Avertissement

> Ce document est **confidentiel** et à **usage interne uniquement**.
> Les données saisies sont stockées localement dans le navigateur (`localStorage`).
> Elles ne sont **pas transmises** à un serveur externe.

---

## 🛠️ Technologies utilisées

| Technologie | Usage |
|---|---|
| HTML5 / CSS3 | Structure et style |
| JavaScript ES6 | Logique applicative |
| [Chart.js](https://www.chartjs.org/) | Graphiques dynamiques |
| [jsPDF](https://github.com/parallax/jsPDF) | Génération PDF |
| [html2canvas](https://html2canvas.hertzen.com/) | Capture d'écran |
| `localStorage` | Persistance des données côté client |

---

## 📄 Licence

Usage interne bancaire. Tous droits réservés.
