/**
 * Jerry's Nations: Frontline Realms - Main Entry Point & Game Orchestrator
 * Initialisation des modules, gestion du Lobby Solo & Multijoueur P2P et boucle requestAnimationFrame.
 */

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

    this.initLobbyEvents();
  }

  initLobbyEvents() {
    const btnSolo = document.getElementById("btn-start-solo");
    const btnHost = document.getElementById("btn-create-room");
    const btnJoin = document.getElementById("btn-join-room");
    const inputRoom = document.getElementById("input-room-code");
    const p2pStatus = document.getElementById("p2p-status-msg");

    if (btnSolo) {
      btnSolo.addEventListener("click", () => {
        SOUND.playClick();
        this.startGameSession(false);
      });
    }

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

    if (lobbyOverlay) lobbyOverlay.style.display = "none";
    if (gameContainer) gameContainer.style.display = "flex";

    // 1. Génération de la carte de monde
    this.map = new WorldMap();
    this.map.generate(Date.now());

    // 2. Moteur de simulation
    this.engine = new GameEngine(this.map);
    this.network.engine = this.engine;

    // 3. Rendu Canvas
    const canvas = document.getElementById("world-canvas");
    this.renderer = new MapRenderer(canvas, this.map, this.engine);

    // 4. Intelligence Artificielle
    this.ai = new AIController(this.engine, this.map);

    // 5. Interface Utilisateur
    this.ui = new UIManager(this.engine, this.renderer, this.network);

    this.isPlaying = true;
    this.engine.addLog("§aPartie lancée ! Conquérez les terres sauvages et repoussez les Maraudeurs !");

    // Lancer la boucle de jeu
    requestAnimationFrame((t) => this.gameLoop(t));
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
