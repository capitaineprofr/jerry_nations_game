/**
 * Jerry's Nations: Frontline Realms - Main Entry Point & Game Orchestrator
 * Initialisation des modules, gestion du Lobby & Création de Nation, boucle requestAnimationFrame.
 * RÈGLE STRICTE : ZÉRO EMOJI.
 */

import { CONFIG } from "./config.js";
import { WorldMap } from "./map.js";
import { GameEngine } from "./engine.js";
import { MapRenderer } from "./renderer.js";
import { AIController } from "./ai.js";
import { NetworkManager } from "./network.js";
import { UIManager } from "./ui.js";
import { SOUND } from "./audio.js";

class GameApp {
  constructor() {
    this.map = null;
    this.engine = null;
    this.renderer = null;
    this.ai = null;
    this.network = null;
    this.ui = null;

    this.isPlaying = false;
    this.lastTime = 0;

    // Paramètres de partie par défaut
    this.settings = {
      playerName: "Jerry",
      nationName: "Empire d'Émeraude",
      bannerPreset: "emerald",
      bannerColor: "#1b7a63",
      bannerBorder: "#22c55e",
      textCode: "§a",
      gameMode: "standard",
      botCount: 3,
      aiDifficulty: "normal",
      enableMarauders: true
    };

    this.initLobbyEvents();
  }

  initLobbyEvents() {
    const inputPlayer = document.getElementById("setup-player-name");
    const inputNation = document.getElementById("setup-nation-name");
    const btnStart = document.getElementById("btn-start-game");

    const btnHost = document.getElementById("btn-create-room");
    const btnJoin = document.getElementById("btn-join-room");
    const inputRoom = document.getElementById("input-room-code");
    const p2pStatus = document.getElementById("p2p-status-msg");

    // 1. Choix des bannières
    document.querySelectorAll(".banner-swatch").forEach((swatch) => {
      swatch.addEventListener("click", () => {
        document.querySelectorAll(".banner-swatch").forEach((s) => s.classList.remove("active"));
        swatch.classList.add("active");
        const bId = swatch.dataset.banner;
        const preset = CONFIG.BANNER_PRESETS.find((p) => p.id === bId) || CONFIG.BANNER_PRESETS[0];
        this.settings.bannerPreset = preset.id;
        this.settings.bannerColor = preset.color;
        this.settings.bannerBorder = preset.border;
        this.settings.textCode = preset.textCode;
        SOUND.playClick();
      });
    });

    // 2. Boutons Bascules (Toggles de paramètres)
    document.querySelectorAll(".setup-btn-toggle").forEach((btn) => {
      btn.addEventListener("click", () => {
        const settingKey = btn.dataset.setting;
        const valStr = btn.dataset.value;

        // Désélectionner les autres boutons de la même ligne
        btn.parentElement.querySelectorAll(".setup-btn-toggle").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        if (settingKey === "botCount") {
          this.settings.botCount = parseInt(valStr, 10);
        } else if (settingKey === "marauders") {
          this.settings.enableMarauders = valStr === "true";
        } else if (settingKey === "gameMode") {
          this.settings.gameMode = valStr;
          const help = document.getElementById("mode-help-text");
          if (help) {
            help.textContent = valStr === "sandbox"
              ? "Ressources infinies (99 999), constructions libres, aucune famine."
              : "11 Stades, Banquet au crépuscule et gestion alimentaire.";
          }
        } else if (settingKey === "aiDifficulty") {
          this.settings.aiDifficulty = valStr;
        }

        SOUND.playClick();
      });
    });

    // 3. Lancement de la partie
    if (btnStart) {
      btnStart.addEventListener("click", () => {
        if (inputPlayer && inputPlayer.value.trim()) {
          this.settings.playerName = inputPlayer.value.trim();
        }
        if (inputNation && inputNation.value.trim()) {
          this.settings.nationName = inputNation.value.trim();
        }

        SOUND.playClick();
        this.startGameSession(false);
      });
    }

    // 4. Multijoueur P2P WebRTC
    if (btnHost) {
      btnHost.addEventListener("click", () => {
        SOUND.playClick();
        if (p2pStatus) p2pStatus.textContent = "Création du salon P2P...";
        this.network.createRoom(
          (roomId) => {
            if (p2pStatus) {
              p2pStatus.innerHTML = `Salon hébergé ! Code : <strong style="color:#55FF55">${roomId}</strong> (partagez ce code)`;
            }
            setTimeout(() => this.startGameSession(true), 1200);
          },
          (err) => {
            if (p2pStatus) p2pStatus.textContent = `Erreur : ${err}`;
          }
        );
      });
    }

    if (btnJoin) {
      btnJoin.addEventListener("click", () => {
        SOUND.playClick();
        const code = inputRoom ? inputRoom.value.trim() : "";
        if (!code) {
          if (p2pStatus) p2pStatus.textContent = "Veuillez entrer un code de salon valide.";
          return;
        }

        if (p2pStatus) p2pStatus.textContent = "Connexion au salon...";
        this.network.joinRoom(
          code,
          (roomId) => {
            if (p2pStatus) p2pStatus.textContent = "Connecté avec succès !";
            setTimeout(() => this.startGameSession(true), 1000);
          },
          (err) => {
            if (p2pStatus) p2pStatus.textContent = `Échec de connexion : ${err}`;
          }
        );
      });
    }

    // Instanciation réseau précoce
    this.network = new NetworkManager({ factions: new Map(), addLog: () => {} });
  }

  startGameSession(isMultiplayer = false) {
    const lobbyOverlay = document.getElementById("lobby-overlay");
    const gameContainer = document.getElementById("game-container");

    if (lobbyOverlay) lobbyOverlay.classList.add("hidden");
    if (gameContainer) gameContainer.classList.remove("in-lobby");

    // 1. Définir la liste des factions actives selon les réglages
    const activeFactions = [];
    const playerBanner = CONFIG.BANNER_PRESETS.find((b) => b.id === this.settings.bannerPreset) || CONFIG.BANNER_PRESETS[0];

    activeFactions.push({
      id: 1,
      name: this.settings.nationName,
      color: playerBanner.color,
      border: playerBanner.border,
      textCode: playerBanner.textCode,
      isPlayer: true
    });

    const botCount = this.settings.botCount;
    const botCandidates = [];
    if (this.settings.enableMarauders) {
      botCandidates.push(CONFIG.FACTIONS[1]); // Maraudeurs
    }
    botCandidates.push(CONFIG.FACTIONS[2]);
    botCandidates.push(CONFIG.FACTIONS[3]);
    botCandidates.push(CONFIG.FACTIONS[4]);

    for (let i = 0; i < botCount && i < botCandidates.length; i++) {
      activeFactions.push(botCandidates[i]);
    }

    // 2. Génération de la carte de monde avec les factions actives
    this.map = new WorldMap();
    this.map.generate(Date.now(), activeFactions);

    // 3. Moteur de simulation
    this.engine = new GameEngine(this.map, this.settings);
    this.network.engine = this.engine;

    // 4. Rendu Canvas
    const canvas = document.getElementById("world-canvas");
    this.renderer = new MapRenderer(canvas, this.map, this.engine);

    // 5. Intelligence Artificielle
    this.ai = new AIController(this.engine, this.map);

    // 6. Interface Utilisateur
    this.ui = new UIManager(this.engine, this.renderer, this.network);
    this.ui.onQuitToLobby = () => this.returnToLobby();

    this.isPlaying = true;
    const modeName = this.settings.gameMode === "sandbox" ? "Bac à Sable" : "Conquête";
    this.engine.addLog(`§a[${modeName}] Gloire à ${this.settings.playerName}, souverain de l'${this.settings.nationName} !`);

    // Lancer la boucle de jeu
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  returnToLobby() {
    this.isPlaying = false;
    const lobbyOverlay = document.getElementById("lobby-overlay");
    const gameContainer = document.getElementById("game-container");
    const pauseModal = document.getElementById("pause-modal");

    if (pauseModal) pauseModal.classList.add("hidden");
    if (lobbyOverlay) lobbyOverlay.classList.remove("hidden");
    if (gameContainer) gameContainer.classList.add("in-lobby");
  }

  gameLoop(currentTime) {
    if (!this.isPlaying) return;

    // Simulation (20 Hz géré en interne via le tick rate)
    this.engine.update();
    this.ai.update();

    // Rendu visuel 60 FPS
    this.renderer.render();

    // Mise à jour de l'affichage DOM
    this.ui.updateHUD();

    requestAnimationFrame((t) => this.gameLoop(t));
  }
}

// Démarrer l'application au chargement du DOM
window.addEventListener("DOMContentLoaded", () => {
  window.app = new GameApp();
});
