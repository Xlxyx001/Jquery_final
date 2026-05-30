#  Gestionnaire d'Étudiants — jQuery

 Mini-application jQuery de gestion d'étudiants avec stockage persistant via LocalStorage.  
 Projet réalisé dans le cadre de l'**Examen Final jQuery**.

---

## Auteurs

Projet réalisé en groupe de 3 étudiants dans le cadre de l'Examen Final jQuery.

| Nom | Rôle |
|---|---|
| Gnabri boris + Bolou | HTML + Intégration |
| Tchicaya André | CSS + Design |
|Bolou manassé yvan | jQuery + LocalStorage |

---


---



## 📋 Table des matières

- [Aperçu](#-aperçu)
- [Fonctionnalités](#-fonctionnalités)
- [Structure du projet](#-structure-du-projet)
- [Technologies utilisées](#-technologies-utilisées)
- [Installation & lancement local](#-installation--lancement-local)
- [Déploiement sur GitHub Pages](#-déploiement-sur-github-pages)
- [Instructions de test](#-instructions-de-test)
- [Couleurs conditionnelles](#-couleurs-conditionnelles)

---

##  Aperçu

L'application permet de gérer une liste d'étudiants avec leurs notes. Toutes les données sont sauvegardées automatiquement dans le **LocalStorage** du navigateur, ce qui garantit leur persistance même après fermeture ou rechargement de la page.

---

## Fonctionnalités

| Fonctionnalité | Description |
|---|---|
|  **Ajout d'un étudiant** | Saisie du nom complet et de la note (0–20) via un formulaire |
|  **Validation des champs** | Vérification avant enregistrement : champs vides, note hors plage, valeur non numérique |
|  **Affichage dynamique** | Chaque étudiant apparaît immédiatement dans le tableau après ajout |
|  **Modification de la note** | Bouton "Modifier" par ligne, ouvre une modal de saisie avec validation |
|  **Suppression individuelle** | Bouton "Supprimer" par ligne avec mise à jour du LocalStorage |
|  **Tout effacer** | Vide entièrement la liste et supprime les données du LocalStorage (avec confirmation) |
|  **Vider les champs** | Réinitialise le formulaire sans toucher aux données enregistrées |
|  **Couleurs conditionnelles** | Fond rouge, orange ou vert selon la note de l'étudiant |
|  **Date d'ajout** | Affichage et stockage automatique de la date au format JJ/MM/AAAA |
|  **Stockage persistant** | Tableau d'objets JSON dans le LocalStorage, restauré à chaque chargement |
|  **Statistiques rapides** | Compteurs affichés en temps réel (total, ≥15, 10–14, <10) |
|  **Notifications toast** | Retour visuel pour chaque action (ajout, suppression, modification) |

---

##  Structure du projet

```
Jquery_final/
│
├── index.html      # Structure HTML de l'application
├── style.css       # Feuille de styles (design, couleurs, responsive)
├── app.js          # Logique jQuery (CRUD, LocalStorage, validation)
└── README.md       # Documentation du projet
```

---

## Technologies utilisées

| Technologie | Version | Rôle |
|---|---|---|
| **HTML5** | — | Structure de la page |
| **CSS3** | — | Mise en page, animations, responsive |
| **jQuery** | 3.7.1 (CDN) | Manipulation du DOM, événements, AJAX-ready |
| **LocalStorage** | API Web native | Persistance des données côté client |
| **Google Fonts** | — | Typographies : *Syne* + *DM Sans* |

> jQuery est chargé via CDN :
> ```html
> <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
> ```

---

## Installation & lancement local

Aucune dépendance à installer. Le projet fonctionne en ouvrant simplement le fichier HTML.

### Étape 1 — Cloner le dépôt

```bash
git clone https://github.com/<votre-organisation>/<nom-du-repo>.git
cd <nom-du-repo>
```

### Étape 2 — Ouvrir l'application

```bash
# Option A : ouverture directe dans le navigateur
open index.html        # macOS
start index.html       # Windows
xdg-open index.html    # Linux

# Option B (recommandée) : serveur local avec VS Code
# Installer l'extension "Live Server" puis clic droit > "Open with Live Server"
```

> Le LocalStorage fonctionne mieux via un serveur local (Live Server, http-server…) que via le protocole `file://`.

---

## Déploiement sur GitHub Pages

### Étape 1 — Pousser le code sur GitHub


### Étape 2 — Activer GitHub Pages


### Étape 3 — Accéder à l'application

L'URL de déploiement sera disponible sous la forme :
```
https://<votre-username>.github.io/<nom-du-repo>/
```

> Le déploiement peut prendre 1 à 2 minutes.

---

## Instructions de test

### Test 1 — Ajout d'un étudiant
1. Entrer un nom dans le champ "Nom complet"
2. Entrer une note entre 0 et 20
3. Cliquer sur **Enregistrer**
4. L'étudiant apparaît dans le tableau avec la bonne couleur et la date du jour

### Test 2 — Validation des champs
1. Cliquer sur **Enregistrer** sans rien saisir
2.  Un message d'erreur s'affiche
3. Entrer une note de `25`, cliquer sur **Enregistrer**
4.  Message : "La note doit être comprise entre 0 et 20"

### Test 3 — Persistance après rechargement
1. Ajouter plusieurs étudiants
2. Recharger la page (F5)
3.  Les données sont toujours présentes

### Test 4 — Modification de note
1. Cliquer sur **Modifier** sur une ligne
2. Saisir une nouvelle note valide dans la modal
3. Cliquer sur **Confirmer**
4.  La note et la couleur de la ligne sont mises à jour

### Test 5 — Suppression
1. Cliquer sur **Supprimer** sur une ligne
2.  La ligne disparaît et le LocalStorage est mis à jour

### Test 6 — Tout effacer
1. Cliquer sur **Tout effacer**
2. Confirmer la boîte de dialogue
3.  La liste est vide et le LocalStorage est effacé
4. Recharger la page → La liste reste vide

### Test 7 — Couleurs conditionnelles

| Note saisie | Couleur attendue |
|---|---|
| 8 |  Rouge |
| 12 |  Orange |
| 17 |  Vert |

---

## Couleurs conditionnelles

Les lignes du tableau changent automatiquement de couleur selon la note :

```
Note < 10        →  Fond ROUGE   (#e74c3c)
10 ≤ Note < 15   →  Fond ORANGE  (#f0894a)
Note ≥ 15        →  Fond VERT    (#27ae60)
```

Cette logique est gérée dans `app.js` via la fonction `classeNote(note)` et appliquée au `<tr>` via jQuery `.addClass()`.

---

