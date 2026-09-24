# Jerry Nations Game (Web)

Projet de jeu web et interface pour Jerry's Nations.  
Conçu pour permettre un développement collaboratif fluide et sans conflits entre développeurs.

---

## 🚀 Guide Rapide de Travail Collaboratif

### 1. Installation initiale (pour ton collaborateur / frère)
Si ton frère n'a pas encore le projet sur son PC :
1. Installer **Git for Windows** (si ce n'est pas déjà fait) : [https://git-scm.com](https://git-scm.com)
2. Ouvrir un terminal (Invite de commande ou PowerShell) dans le dossier de son choix.
3. Cloner le projet avec la commande :
   ```bash
   git clone https://github.com/capitaineprofr/jerry_nations_game.git
   ```
4. Rentrer dans le dossier `jerry_nations_game`. C'est tout !

---

### 2. Routine quotidienne en 2 clics

#### 🟢 Avant de commencer à coder
- Double-cliquez sur **`1_DEBUT_TRAVAIL.bat`**.
- Cela télécharge automatiquement (`git pull`) les dernières modifications publiées par l'autre personne.

#### 🎮 Pour tester le jeu en local
- Double-cliquez sur **`LANCER_JEU_LOCAL.bat`**.
- Le fichier `index.html` s'ouvrira immédiatement dans votre navigateur internet par défaut.

#### 🔴 Dès que vous avez terminé votre session
- Double-cliquez sur **`2_FIN_TRAVAIL.bat`**.
- Le script vous demandera un court message (ex: *Ajout du menu principal* ou *Correction style css*). Si vous appuyez simplement sur Entrée, un message automatique avec date et heure sera créé.
- Le script ajoute (`git add`), enregistre (`git commit`) et envoie tout sur GitHub (`git push`).

---

## 📁 Structure du projet

- `index.html` : Page principale du jeu web.
- `css/` : Feuilles de styles (HUD, lobby, global).
- `js/` : Moteur de jeu, scripts réseau, IA, UI et logique.
- `textures/` : Éléments graphiques, icônes et interfaces Minecraft.
- `1_DEBUT_TRAVAIL.bat` : Synchronisation avant de travailler.
- `2_FIN_TRAVAIL.bat` : Sauvegarde et publication sur GitHub.
- `LANCER_JEU_LOCAL.bat` : Lancement du jeu en local.
